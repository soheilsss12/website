import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { configureEnvironmentAdmin, openDatabase } from './db.js';
import { validateRuntimeEnvironment } from './config.js';
import { enqueueAdminNotification, mailConfiguration, startEmailOutboxWorker } from './mailer.js';
import { newOpaqueToken, parseCookies, sha256, verifyPassword } from './security.js';
import { InputError, validateApplication, validateContact, validateStatus } from './validation.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(ROOT, 'dist');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'server/data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'private-decks');
// Plesk/Passenger may provide PORT as either a numeric port or a socket path.
// Keep the Passenger-provided value intact instead of coercing it with Number().
const configuredPort = String(process.env.PORT || '').trim();
const PORT = configuredPort
  ? (/^\d+$/.test(configuredPort) ? Number(configuredPort) : configuredPort)
  : 8787;
const HOST = process.env.HOST || '0.0.0.0';
const MAX_BODY_BYTES = 29 * 1024 * 1024;
const MAX_DECK_BYTES = 20 * 1024 * 1024;
const SESSION_COOKIE = 'pars_admin';
const DEFAULT_SESSION_TTL_HOURS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const rateBuckets = new Map();
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

validateRuntimeEnvironment();
mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o700 });
const db = openDatabase(path.join(DATA_DIR, 'pars.sqlite'));
configureEnvironmentAdmin(db, {
  username: process.env.ADMIN_USERNAME || '',
  password: process.env.ADMIN_PASSWORD || '',
});
const sessionTtlHours = Number(process.env.ADMIN_SESSION_TTL_HOURS || DEFAULT_SESSION_TTL_HOURS);
if (!Number.isFinite(sessionTtlHours) || sessionTtlHours < 1 || sessionTtlHours > 168) {
  throw new Error('ADMIN_SESSION_TTL_HOURS must be a number from 1 to 168.');
}
const sessionTtlMs = sessionTtlHours * 60 * 60 * 1000;
const cookieSameSite = (process.env.ADMIN_COOKIE_SAMESITE || 'Lax').trim();
if (!['Lax', 'Strict', 'None'].includes(cookieSameSite)) {
  throw new Error('ADMIN_COOKIE_SAMESITE must be Lax, Strict, or None.');
}
if (cookieSameSite === 'None' && process.env.NODE_ENV !== 'production') {
  console.warn('ADMIN_COOKIE_SAMESITE=None is intended only for HTTPS production deployments.');
}

function json(res, statusCode, value, extraHeaders = {}) {
  const body = JSON.stringify(value);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(body);
}

function text(res, statusCode, value, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(value);
}

function cookieHeader(token, maxAgeSeconds) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${cookieSameSite}; Max-Age=${maxAgeSeconds}${secure}`;
}

function clearCookieHeader() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=${cookieSameSite}; Max-Age=0${secure}`;
}

function publicOriginFromRequest(req) {
  if (process.env.PUBLIC_ORIGIN) {
    try { return new URL(process.env.PUBLIC_ORIGIN).origin; } catch { return ''; }
  }
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwardedProto || (req.socket.encrypted ? 'https' : 'http');
  const host = req.headers.host;
  return host ? `${protocol}://${host}` : '';
}

function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin || process.env.NODE_ENV !== 'production') return true;
  const expected = publicOriginFromRequest(req);
  if (!expected) return process.env.NODE_ENV !== 'production';
  try { return new URL(origin).origin === expected; } catch { return false; }
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return;
  const expected = publicOriginFromRequest(req);
  if (expected && allowedOrigin(req)) {
    res.setHeader('Access-Control-Allow-Origin', new URL(origin).origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
    res.setHeader('Vary', 'Origin');
  }
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      reject(new InputError('درخواست باید با قالب JSON ارسال شود.', 'unsupported_media_type', 415));
      return;
    }
    const declaredLength = Number(req.headers['content-length'] || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      reject(new InputError('حجم درخواست از حد مجاز بیشتر است.', 'payload_too_large', 413));
      req.resume();
      return;
    }
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new InputError('حجم درخواست از حد مجاز بیشتر است.', 'payload_too_large', 413));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (size > MAX_BODY_BYTES) return;
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON must be an object');
        resolve(parsed);
      } catch {
        reject(new InputError('قالب داده‌ی فرم معتبر نیست.', 'invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function clientAddress(req) {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (forwarded && forwarded.length <= 64) return forwarded;
  }
  return req.socket.remoteAddress || 'unknown';
}

function rateLimit(req, bucket, { max, windowMs }) {
  const key = `${bucket}:${clientAddress(req)}`;
  const now = Date.now();
  const record = rateBuckets.get(key);
  if (!record || record.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= max) return false;
  record.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateBuckets) if (record.resetAt <= now) rateBuckets.delete(key);
  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(now);
}, 10 * 60 * 1000).unref?.();

function requireOrigin(req, res) {
  if (allowedOrigin(req)) return true;
  json(res, 403, { error: 'درخواست از مبدأ مجاز ارسال نشده است.', code: 'origin_not_allowed' });
  return false;
}

function decodeDeck(rawDeck) {
  if (rawDeck === undefined || rawDeck === null) return null;
  if (!rawDeck || typeof rawDeck !== 'object' || Array.isArray(rawDeck)) throw new InputError('فایل پیوست معتبر نیست.');
  const fileName = String(rawDeck.name || '').normalize('NFC').replace(/[\u0000-\u001f\u007f/\\]/g, '').trim();
  const dataBase64 = rawDeck.dataBase64;
  if (!fileName || Array.from(fileName).length > 150 || !/\.pdf$/i.test(fileName)) throw new InputError('فقط فایل PDF با نام معتبر پذیرفته می‌شود.');
  if (typeof dataBase64 !== 'string' || dataBase64.length > Math.ceil(MAX_DECK_BYTES * 4 / 3) + 8 || dataBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(dataBase64)) {
    throw new InputError('داده‌ی فایل پیوست معتبر نیست.');
  }
  const content = Buffer.from(dataBase64, 'base64');
  if (!content.length || content.length > MAX_DECK_BYTES) throw new InputError('حجم فایل PDF باید حداکثر ۲۰ مگابایت باشد.');
  if (content.subarray(0, 5).toString('ascii') !== '%PDF-') throw new InputError('محتوای فایل با قالب PDF سازگار نیست.');
  return { name: fileName, content };
}

function formatApplicationMail(id) {
  return [
    'درخواست جدید سرمایه‌گذاری پارس در سامانه ثبت شد.',
    '',
    `شناسه‌ی ثبت: ${id}`,
    'برای مشاهده‌ی جزئیات، از پنل مدیریت وارد شوید.',
  ].join('\n');
}

function formatContactMail(id, fields) {
  return [
    'پیام تازه از فرم تماس پارس در سامانه ثبت شد.',
    '',
    `شناسه‌ی ثبت: ${id}`,
    `دسته‌ی پیام: ${fields.topic}`,
    'برای مشاهده‌ی جزئیات و راه تماس، از پنل مدیریت وارد شوید.',
  ].join('\n');
}

function sendOutboxStatus(db, kind, submissionId, subject, textBody) {
  const outbox = enqueueAdminNotification(db, { kind, submissionId, subject, textBody });
  return outbox.status;
}

function startTransaction() { db.exec('BEGIN IMMEDIATE'); }
function commitTransaction() { db.exec('COMMIT'); }
function rollbackTransaction() { try { db.exec('ROLLBACK'); } catch { /* No active transaction. */ } }

function submitApplication(req, res) {
  if (!requireOrigin(req, res)) return;
  if (!rateLimit(req, 'application', { max: 4, windowMs: 60 * 60 * 1000 })) {
    json(res, 429, { error: 'تعداد درخواست‌ها از حد مجاز بیشتر شده است. کمی بعد دوباره تلاش کنید.', code: 'rate_limited' });
    return;
  }
  void (async () => {
    const body = await readJson(req);
    if (body.companyWebsite) throw new InputError('درخواست معتبر نیست.');
    const fields = validateApplication(body);
    const deck = decodeDeck(body.deck);
    const id = randomUUID();
    const now = Date.now();
    const deckPath = deck ? path.join(UPLOAD_DIR, `${id}.pdf`) : '';

    try {
      if (deck) writeFileSync(deckPath, deck.content, { flag: 'wx', mode: 0o600 });
      startTransaction();
      db.prepare(`
        INSERT INTO applications (
          id, status, full_name, role, mobile, email, city, project_name, website,
          stage, industry, one_liner, description, funding_reason, amount_toman,
          use_of_funds, traction, team_size, previous_investors, links, deck_name,
          deck_path, consent_at, created_at, updated_at
        ) VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        fields.fullName,
        fields.role,
        fields.mobile,
        fields.email,
        fields.city,
        fields.projectName,
        fields.website,
        fields.stage,
        fields.industry,
        fields.oneLiner,
        fields.description,
        fields.fundingReason,
        fields.amount,
        fields.useOfFunds,
        fields.traction,
        fields.teamSize,
        fields.previousInvestors,
        fields.links,
        deck?.name || '',
        deckPath,
        now,
        now,
        now,
      );
      const mailStatus = sendOutboxStatus(
        db,
        'application',
        id,
        'درخواست جدید سرمایه‌گذاری پارس',
        formatApplicationMail(id),
      );
      commitTransaction();
      json(res, 201, {
        id,
        reference: `PA-${id.slice(0, 8).toUpperCase()}`,
        status: 'new',
        stored: true,
        notification: mailStatus,
      });
    } catch (error) {
      rollbackTransaction();
      if (deckPath && existsSync(deckPath)) unlinkSync(deckPath);
      throw error;
    }
  })().catch((error) => handleError(res, error));
}

function submitContact(req, res) {
  if (!requireOrigin(req, res)) return;
  if (!rateLimit(req, 'contact', { max: 10, windowMs: 15 * 60 * 1000 })) {
    json(res, 429, { error: 'تعداد پیام‌ها از حد مجاز بیشتر شده است. کمی بعد دوباره تلاش کنید.', code: 'rate_limited' });
    return;
  }
  void (async () => {
    const body = await readJson(req);
    if (body.companyWebsite) throw new InputError('درخواست معتبر نیست.');
    const fields = validateContact(body);
    const id = randomUUID();
    const now = Date.now();
    try {
      startTransaction();
      db.prepare(`
        INSERT INTO contacts (id, status, name, contact, topic, message, created_at, updated_at)
        VALUES (?, 'new', ?, ?, ?, ?, ?, ?)
      `).run(id, fields.name, fields.contact, fields.topic, fields.message, now, now);
      const mailStatus = sendOutboxStatus(
        db,
        'contact',
        id,
        `پیام جدید از فرم تماس — ${fields.topic}`,
        formatContactMail(id, fields),
      );
      commitTransaction();
      json(res, 201, { id, status: 'new', stored: true, notification: mailStatus });
    } catch (error) {
      rollbackTransaction();
      throw error;
    }
  })().catch((error) => handleError(res, error));
}

function getSession(req) {
  const token = parseCookies(req.headers.cookie).get(SESSION_COOKIE);
  if (!token || token.length > 256) return null;
  const row = db.prepare(`
    SELECT s.token_hash, s.username, s.csrf_token, s.expires_at
    FROM admin_sessions s
    JOIN admin_users u ON u.username = s.username
    WHERE s.token_hash = ? AND s.expires_at > ?
  `).get(sha256(token), Date.now());
  return row || null;
}

function requireSession(req, res) {
  const session = getSession(req);
  if (!session) {
    json(res, 401, { error: 'برای ادامه وارد پنل مدیریت شوید.', code: 'authentication_required' }, { 'Set-Cookie': clearCookieHeader() });
    return null;
  }
  return session;
}

function csrfMatches(req, expected) {
  const received = req.headers['x-csrf-token'];
  if (typeof received !== 'string' || received.length > 256) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function requireCsrf(req, res, session) {
  if (csrfMatches(req, session.csrf_token)) return true;
  json(res, 403, { error: 'درخواست امنیتی معتبر نیست. صفحه را تازه‌سازی کنید.', code: 'csrf_failed' });
  return false;
}

function login(req, res) {
  if (!requireOrigin(req, res)) return;
  if (!db.prepare('SELECT 1 FROM admin_users LIMIT 1').get()) {
    json(res, 503, { error: 'حساب مدیریتی پیکربندی نشده است؛ ورود پیش‌فرض یا نمایشی وجود ندارد.', code: 'admin_not_configured' });
    return;
  }
  if (!rateLimit(req, 'admin-login', { max: MAX_LOGIN_ATTEMPTS, windowMs: LOGIN_WINDOW_MS })) {
    json(res, 429, { error: 'تلاش‌های ورود بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.', code: 'rate_limited' });
    return;
  }
  void (async () => {
    const body = await readJson(req);
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 64 || password.length > 256) {
      json(res, 401, { error: 'نام کاربری یا گذرواژه درست نیست.', code: 'invalid_credentials' });
      return;
    }
    const admin = db.prepare('SELECT username, password_hash FROM admin_users WHERE username = ?').get(username);
    if (!admin) {
      json(res, 401, { error: 'نام کاربری یا گذرواژه درست نیست.', code: 'invalid_credentials' });
      return;
    }
    if (!verifyPassword(password, admin.password_hash)) {
      json(res, 401, { error: 'نام کاربری یا گذرواژه درست نیست.', code: 'invalid_credentials' });
      return;
    }
    const token = newOpaqueToken(32);
    const csrfToken = newOpaqueToken(24);
    const now = Date.now();
    const expiresAt = now + sessionTtlMs;
    db.prepare('DELETE FROM admin_sessions WHERE username = ?').run(admin.username);
    db.prepare(`
      INSERT INTO admin_sessions (token_hash, username, csrf_token, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(sha256(token), admin.username, csrfToken, now, expiresAt);
    json(res, 200, { username: admin.username, csrfToken, expiresAt }, { 'Set-Cookie': cookieHeader(token, Math.floor(sessionTtlMs / 1000)) });
  })().catch((error) => handleError(res, error));
}

function audit(session, action, kind, id, details = {}) {
  db.prepare(`
    INSERT INTO admin_audit (id, username, action, entity_kind, entity_id, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(randomUUID(), session.username, action, kind, id, JSON.stringify(details), Date.now());
}

function listSubmissions(req, res, searchParams, session) {
  const kind = searchParams.get('kind') || 'applications';
  if (!['applications', 'contacts'].includes(kind)) throw new InputError('نوع فرم معتبر نیست.');
  const status = searchParams.get('status') || '';
  if (status) validateStatus(kind, status);
  const search = (searchParams.get('q') || '').trim().slice(0, 100);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 50)));
  const offset = Math.max(0, Number(searchParams.get('offset') || 0));
  if (!Number.isInteger(limit) || !Number.isInteger(offset)) throw new InputError('شماره‌ی صفحه معتبر نیست.');
  const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;
  const where = [];
  const values = [];
  if (status) { where.push('status = ?'); values.push(status); }

  let items;
  let total;
  if (kind === 'applications') {
    if (search) {
      where.push('(full_name LIKE ? OR project_name LIKE ? OR email LIKE ? OR mobile LIKE ? OR city LIKE ?)');
      values.push(pattern, pattern, pattern, pattern, pattern);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    total = db.prepare(`SELECT COUNT(*) AS total FROM applications ${whereSql}`).get(...values).total;
    items = db.prepare(`
      SELECT id, status, full_name AS name, project_name AS subtitle, email, mobile, city, stage,
        amount_toman AS amount, created_at,
        COALESCE((SELECT status FROM email_outbox e WHERE e.submission_id = applications.id ORDER BY e.created_at DESC LIMIT 1), 'none') AS notification_status
      FROM applications ${whereSql}
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(...values, limit, offset);
  } else {
    if (search) {
      where.push('(name LIKE ? OR contact LIKE ? OR topic LIKE ? OR message LIKE ?)');
      values.push(pattern, pattern, pattern, pattern);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    total = db.prepare(`SELECT COUNT(*) AS total FROM contacts ${whereSql}`).get(...values).total;
    items = db.prepare(`
      SELECT id, status, name, topic AS subtitle, contact, created_at,
        COALESCE((SELECT status FROM email_outbox e WHERE e.submission_id = contacts.id ORDER BY e.created_at DESC LIMIT 1), 'none') AS notification_status
      FROM contacts ${whereSql}
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(...values, limit, offset);
  }
  json(res, 200, { kind, total, limit, offset, items, username: session.username });
}

function submissionDetails(kind, id) {
  if (kind === 'applications') {
    const record = db.prepare(`
      SELECT id, status, full_name AS fullName, role, mobile, email, city, project_name AS projectName,
        website, stage, industry, one_liner AS oneLiner, description, funding_reason AS fundingReason,
        amount_toman AS amount, use_of_funds AS useOfFunds, traction, team_size AS teamSize,
        previous_investors AS previousInvestors, links, deck_name AS deckName,
        CASE WHEN deck_path = '' THEN 0 ELSE 1 END AS hasDeck,
        admin_note AS adminNote, consent_at AS consentAt, created_at AS createdAt, updated_at AS updatedAt
      FROM applications WHERE id = ?
    `).get(id);
    if (!record) return null;
    record.notification = db.prepare(`
      SELECT status, attempts, last_error AS lastError, sent_at AS sentAt
      FROM email_outbox WHERE submission_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(id) || { status: 'none', attempts: 0, lastError: '', sentAt: null };
    return record;
  }
  if (kind === 'contacts') {
    const record = db.prepare(`
      SELECT id, status, name, contact, topic, message, admin_note AS adminNote,
        created_at AS createdAt, updated_at AS updatedAt
      FROM contacts WHERE id = ?
    `).get(id);
    if (!record) return null;
    record.notification = db.prepare(`
      SELECT status, attempts, last_error AS lastError, sent_at AS sentAt
      FROM email_outbox WHERE submission_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(id) || { status: 'none', attempts: 0, lastError: '', sentAt: null };
    return record;
  }
  return null;
}

function updateSubmission(req, res, kind, id, session) {
  if (!requireCsrf(req, res, session)) return;
  void (async () => {
    const body = await readJson(req);
    const status = validateStatus(kind, body.status);
    if (typeof body.adminNote !== 'string' || Array.from(body.adminNote).length > 5000) {
      throw new InputError('یادداشت داخلی معتبر نیست.');
    }
    const adminNote = body.adminNote.normalize('NFC').replaceAll('\u0000', '').trim();
    const table = kind === 'applications' ? 'applications' : kind === 'contacts' ? 'contacts' : '';
    if (!table) throw new InputError('نوع فرم معتبر نیست.');
    const current = db.prepare(`SELECT id, status FROM ${table} WHERE id = ?`).get(id);
    if (!current) {
      json(res, 404, { error: 'درخواست پیدا نشد.', code: 'not_found' });
      return;
    }
    const now = Date.now();
    db.prepare(`UPDATE ${table} SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?`).run(status, adminNote, now, id);
    audit(session, 'submission_updated', kind, id, { from: current.status, to: status });
    json(res, 200, { ok: true, record: submissionDetails(kind, id) });
  })().catch((error) => handleError(res, error));
}

function deleteSubmission(req, res, kind, id, session) {
  if (!requireCsrf(req, res, session)) return;
  if (!['applications', 'contacts'].includes(kind)) throw new InputError('نوع فرم معتبر نیست.');
  const table = kind === 'applications' ? 'applications' : 'contacts';
  const record = db.prepare(`SELECT id${kind === 'applications' ? ', deck_path' : ''} FROM ${table} WHERE id = ?`).get(id);
  if (!record) {
    json(res, 404, { error: 'درخواست پیدا نشد.', code: 'not_found' });
    return;
  }
  startTransaction();
  try {
    db.prepare('DELETE FROM email_outbox WHERE submission_id = ?').run(id);
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    audit(session, 'submission_deleted', kind, id);
    commitTransaction();
  } catch (error) {
    rollbackTransaction();
    throw error;
  }
  if (record.deck_path) {
    const deckPath = path.resolve(record.deck_path);
    const uploadRoot = path.resolve(UPLOAD_DIR) + path.sep;
    if (deckPath.startsWith(uploadRoot) && existsSync(deckPath)) {
      try { unlinkSync(deckPath); } catch (error) { console.error('Could not remove deleted application file:', error?.message || 'unknown error'); }
    }
  }
  json(res, 200, { ok: true });
}

function retryNotification(req, res, kind, id, session) {
  if (!requireCsrf(req, res, session)) return;
  if (!['applications', 'contacts'].includes(kind)) throw new InputError('نوع فرم معتبر نیست.');
  const recordExists = db.prepare(`SELECT id FROM ${kind} WHERE id = ?`).get(id);
  if (!recordExists) {
    json(res, 404, { error: 'درخواست پیدا نشد.', code: 'not_found' });
    return;
  }
  const result = db.prepare(`
    UPDATE email_outbox
    SET status = 'pending', attempts = 0, next_attempt_at = ?, last_error = ''
    WHERE submission_id = ? AND status IN ('failed', 'blocked')
  `).run(Date.now(), id);
  if (!result.changes) {
    json(res, 409, { error: 'اعلان ناموفق یا متوقفی برای ارسال دوباره وجود ندارد.', code: 'nothing_to_retry' });
    return;
  }
  audit(session, 'notification_retry_requested', kind, id, { count: result.changes });
  json(res, 202, { ok: true, queued: result.changes, configured: mailConfiguration().configured });
}

function downloadDeck(res, id, session) {
  const record = db.prepare('SELECT deck_name, deck_path FROM applications WHERE id = ?').get(id);
  if (!record || !record.deck_path) {
    json(res, 404, { error: 'فایل پیوستی برای این درخواست وجود ندارد.', code: 'not_found' });
    return;
  }
  const fullPath = path.resolve(record.deck_path);
  const uploadRoot = path.resolve(UPLOAD_DIR) + path.sep;
  if (!fullPath.startsWith(uploadRoot) || !existsSync(fullPath) || !statSync(fullPath).isFile()) {
    json(res, 404, { error: 'فایل پیوست پیدا نشد.', code: 'not_found' });
    return;
  }
  audit(session, 'deck_downloaded', 'applications', id);
  const safeName = record.deck_name.replace(/[\r\n"\\]/g, '_').slice(0, 150) || 'pitch-deck.pdf';
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': statSync(fullPath).size,
    'Content-Disposition': `attachment; filename="pitch-deck.pdf"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
    'Cache-Control': 'private, no-store',
  });
  createReadStream(fullPath).pipe(res);
}

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    text(res, 405, 'Method not allowed');
    return;
  }
  if (!existsSync(path.join(DIST_DIR, 'index.html'))) {
    text(res, 404, 'Frontend build not found. Run npm run build first.');
    return;
  }
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { text(res, 400, 'Bad request'); return; }
  const relative = decoded.replace(/^\/+/, '');
  const candidate = path.resolve(DIST_DIR, relative || 'index.html');
  if (candidate !== DIST_DIR && !candidate.startsWith(`${DIST_DIR}${path.sep}`)) {
    text(res, 400, 'Bad request');
    return;
  }
  const filePath = existsSync(candidate) && statSync(candidate).isFile()
    ? candidate
    : path.join(DIST_DIR, 'index.html');
  const extension = path.extname(filePath).toLowerCase();
  const immutable = relative.startsWith('assets/') && /\.[a-f0-9]{8,}\./i.test(relative);
  res.writeHead(200, {
    'Content-Type': contentTypes.get(extension) || 'application/octet-stream',
    'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
  });
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(filePath).pipe(res);
}

function handleError(res, error) {
  if (res.headersSent || res.destroyed) return;
  if (error instanceof InputError) {
    json(res, error.statusCode, { error: error.message, code: error.code });
    return;
  }
  console.error('Request failed:', error?.message || 'unknown error');
  json(res, 500, { error: 'پردازش درخواست با خطا روبه‌رو شد. اطلاعاتی با موفقیت ثبت نشده است.', code: 'internal_error' });
}

async function route(req, res) {
  setSecurityHeaders(res);
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    if (!allowedOrigin(req)) { json(res, 403, { error: 'مبدأ مجاز نیست.' }); return; }
    res.writeHead(204, { 'Cache-Control': 'no-store' });
    res.end();
    return;
  }
  const url = new URL(req.url || '/', 'http://server.invalid');
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/health' && req.method === 'GET') {
      json(res, 200, { ok: true, storage: 'sqlite', notificationsConfigured: mailConfiguration().configured });
      return;
    }
    if (pathname === '/api/applications' && req.method === 'POST') { submitApplication(req, res); return; }
    if (pathname === '/api/contact' && req.method === 'POST') { submitContact(req, res); return; }
    if (pathname === '/api/admin/login' && req.method === 'POST') { login(req, res); return; }

    if (pathname === '/api/admin/session' && req.method === 'GET') {
      const session = getSession(req);
      if (!session) { json(res, 401, { error: 'وارد نشده‌اید.', code: 'authentication_required' }, { 'Set-Cookie': clearCookieHeader() }); return; }
      json(res, 200, { username: session.username, csrfToken: session.csrf_token, expiresAt: session.expires_at });
      return;
    }
    if (pathname === '/api/admin/logout' && req.method === 'POST') {
      if (!requireOrigin(req, res)) return;
      const session = requireSession(req, res);
      if (!session || !requireCsrf(req, res, session)) return;
      db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(session.token_hash);
      json(res, 200, { ok: true }, { 'Set-Cookie': clearCookieHeader() });
      return;
    }

    const session = requireSession(req, res);
    if (!session) return;
    if (!requireOrigin(req, res)) return;

    if (pathname === '/api/admin/submissions' && req.method === 'GET') {
      listSubmissions(req, res, url.searchParams, session);
      return;
    }
    const deckMatch = pathname.match(/^\/api\/admin\/submissions\/applications\/([a-f0-9-]{36})\/deck$/i);
    if (deckMatch && req.method === 'GET') { downloadDeck(res, deckMatch[1], session); return; }
    const retryMatch = pathname.match(/^\/api\/admin\/submissions\/(applications|contacts)\/([a-f0-9-]{36})\/notification\/retry$/i);
    if (retryMatch && req.method === 'POST') { retryNotification(req, res, retryMatch[1], retryMatch[2], session); return; }
    const detailMatch = pathname.match(/^\/api\/admin\/submissions\/(applications|contacts)\/([a-f0-9-]{36})$/i);
    if (detailMatch && req.method === 'GET') {
      const record = submissionDetails(detailMatch[1], detailMatch[2]);
      if (!record) { json(res, 404, { error: 'درخواست پیدا نشد.', code: 'not_found' }); return; }
      json(res, 200, { kind: detailMatch[1], record });
      return;
    }
    if (detailMatch && req.method === 'PATCH') { updateSubmission(req, res, detailMatch[1], detailMatch[2], session); return; }
    if (detailMatch && req.method === 'DELETE') { deleteSubmission(req, res, detailMatch[1], detailMatch[2], session); return; }
    json(res, 404, { error: 'مسیر API پیدا نشد.', code: 'not_found' });
    return;
  }

  serveStatic(req, res, pathname);
}

const server = createServer((req, res) => {
  void route(req, res).catch((error) => handleError(res, error));
});
server.requestTimeout = 45_000;
server.headersTimeout = 50_000;
server.keepAliveTimeout = 5_000;

const stopEmailWorker = startEmailOutboxWorker(db);
const onListening = () => {
  const address = server.address();
  const endpoint = typeof address === 'string'
    ? address
    : `http://${address?.address || HOST}:${address?.port ?? PORT}`;
  console.log(`Pars web/API listening on ${endpoint}`);
  if (!existsSync(path.join(DIST_DIR, 'index.html'))) console.log('Static frontend is not built yet; API routes are available.');
  if (!db.prepare('SELECT 1 FROM admin_users LIMIT 1').get()) console.warn('No admin account configured; set ADMIN_USERNAME and ADMIN_PASSWORD (16+ characters) before use.');
  if (!mailConfiguration().configured) console.warn('Email notifications are not configured; submissions will still be stored and visible in the admin panel.');
};

if (typeof PORT === 'string') {
  // Passenger can pass a Unix/named-pipe socket instead of a TCP port.
  server.listen(PORT, onListening);
} else if (configuredPort && !process.env.HOST) {
  // Follow Passenger's dynamically assigned listener without forcing a host.
  server.listen(PORT, onListening);
} else {
  server.listen(PORT, HOST, onListening);
}

function shutdown() {
  stopEmailWorker();
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5_000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
