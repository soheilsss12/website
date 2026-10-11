import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createServer as createNetServer } from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { after, test } from 'node:test';
import { validateRuntimeEnvironment } from '../config.js';
import { hashPassword, verifyPassword } from '../security.js';
import { validateApplication, validateContact } from '../validation.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const processes = new Set();
const temporaryDirectories = new Set();

after(async () => {
  for (const child of processes) {
    if (child.exitCode === null && !child.killed) child.kill('SIGTERM');
  }
  await Promise.all([...processes].map((child) => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once('exit', resolve);
    setTimeout(() => { if (child.exitCode === null) child.kill('SIGKILL'); }, 1500).unref();
  })));
  await Promise.all([...temporaryDirectories].map((directory) => rm(directory, { recursive: true, force: true })));
});

test('password hashing and form validation reject malformed input', () => {
  const password = randomBytes(24).toString('base64url');
  const hash = hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword('not-the-password', hash), false);

  assert.throws(() => validateContact({ name: 'Test', contact: 'bad', topic: 'همکاری', message: 'Hello' }));
  assert.throws(() => validateApplication({ fullName: 'Test', agreed: false }));
});

test('production configuration requires durable, same-origin admin settings and complete optional email settings', () => {
  const production = {
    NODE_ENV: 'production',
    DATA_DIR: '/data',
    PUBLIC_ORIGIN: 'https://site.example',
    ADMIN_USERNAME: 'pars-admin',
    ADMIN_PASSWORD: 'x'.repeat(32),
  };

  assert.doesNotThrow(() => validateRuntimeEnvironment(production));
  assert.throws(() => validateRuntimeEnvironment({ ...production, DATA_DIR: 'relative-data' }), /absolute path/);
  assert.throws(() => validateRuntimeEnvironment({ ...production, PUBLIC_ORIGIN: 'http://site.example' }), /HTTPS origin/);
  assert.throws(() => validateRuntimeEnvironment({ ...production, ADMIN_NOTIFICATION_EMAIL: 'admin@example.com' }), /Set all email environment variables/);
  assert.doesNotThrow(() => validateRuntimeEnvironment({ ...production, ADMIN_NOTIFICATION_EMAIL: 'admin@example.com', EMAIL_FROM: 'PARS <noreply@example.com>', RESEND_API_KEY: 'test-key' }));
  assert.doesNotThrow(() => validateRuntimeEnvironment({ NODE_ENV: 'development' }));
});

test('production server refuses to start before database initialization without required settings', () => {
  const result = spawnSync(process.execPath, ['server/index.js'], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DATA_DIR: path.join(os.tmpdir(), 'pars-production-missing-config'),
      PUBLIC_ORIGIN: '',
      ADMIN_USERNAME: '',
      ADMIN_PASSWORD: '',
      PORT: '0',
    },
    encoding: 'utf8',
    timeout: 5000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Production startup requires these environment variables/);
});

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createNetServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function launchServer({ dataDir, port, username, password }) {
  const child = spawn(process.execPath, ['server/index.js'], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      HOST: '127.0.0.1',
      PORT: String(port),
      DATA_DIR: dataDir,
      ADMIN_USERNAME: username,
      ADMIN_PASSWORD: password,
      ADMIN_NOTIFICATION_EMAIL: '',
      EMAIL_FROM: '',
      RESEND_API_KEY: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', (chunk) => { logs += chunk.toString(); });
  child.stderr.on('data', (chunk) => { logs += chunk.toString(); });
  child.testLogs = () => logs;
  processes.add(child);
  return child;
}

async function waitForApi(child, baseUrl) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`API server exited early:\n${child.testLogs()}`);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The listener may still be starting.
    }
    await delay(75);
  }
  throw new Error(`API server did not start:\n${child.testLogs()}`);
}

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  let data = null;
  try { data = await response.json(); } catch { /* report status on non-JSON responses */ }
  return { response, data };
}

test('API does not create an administrator when credentials are absent', async (t) => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'pars-no-admin-test-'));
  temporaryDirectories.add(dataDir);
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = launchServer({ dataDir, port, username: '', password: '' });
  t.after(() => { if (child.exitCode === null && !child.killed) child.kill('SIGTERM'); });
  await waitForApi(child, baseUrl);

  const login = await jsonRequest(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'anything', password: 'not-a-real-password' }),
  });
  assert.equal(login.response.status, 503);
  assert.equal(login.data.code, 'admin_not_configured');
});

test('API stores submissions, protects admin data, and persists records across restart', async (t) => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'pars-api-test-'));
  temporaryDirectories.add(dataDir);
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const username = `admin-${randomBytes(4).toString('hex')}`;
  const password = `${randomBytes(24).toString('base64url')}Aa1!`;

  let child = launchServer({ dataDir, port, username, password });
  t.after(() => {
    if (child.exitCode === null && !child.killed) child.kill('SIGTERM');
  });
  await waitForApi(child, baseUrl);

  const unauthenticated = await jsonRequest(`${baseUrl}/api/admin/submissions?kind=contacts`);
  assert.equal(unauthenticated.response.status, 401);

  const contact = await jsonRequest(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'آزمون تماس',
      contact: 'test@example.org',
      topic: 'پرسش عمومی',
      message: 'پیام آزمایشی برای بررسی پایگاه داده',
      companyWebsite: '',
    }),
  });
  assert.equal(contact.response.status, 201);
  assert.equal(contact.data.stored, true);
  assert.equal(contact.data.notification, 'blocked');

  const deckBytes = Buffer.from('%PDF-1.4\n% Arena test file\n', 'utf8');
  const application = await jsonRequest(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'آزمون بنیان‌گذار',
      role: 'هم‌بنیان‌گذار',
      mobile: '۰۹۱۲۱۲۳۴۵۶۷',
      email: 'founder@example.org',
      city: 'تهران',
      projectName: 'محصول آزمایشی',
      website: '',
      stage: 'نمونه‌ی اولیه',
      industry: 'فناوری',
      oneLiner: 'یک معرفی کوتاه',
      description: 'شرح قابل‌قبول برای آزمون یکپارچه',
      fundingReason: 'بررسی API و ذخیره‌سازی پایدار',
      amount: '۳۰۰۰۰۰۰۰',
      useOfFunds: 'برنامه‌ی مصرف سرمایه برای آزمون',
      traction: '',
      teamSize: '۳',
      previousInvestors: '',
      links: '',
      agreed: true,
      companyWebsite: '',
      deck: {
        name: 'pitch-test.pdf',
        mimeType: 'application/pdf',
        dataBase64: deckBytes.toString('base64'),
      },
    }),
  });
  assert.equal(application.response.status, 201);
  assert.equal(application.data.stored, true);
  assert.match(application.data.reference, /^PA-[A-F0-9]{8}$/);
  assert.equal(application.data.notification, 'blocked');

  const loginFailure = await jsonRequest(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: `${password}x` }),
  });
  assert.equal(loginFailure.response.status, 401);

  const login = await jsonRequest(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(login.response.status, 200);
  const csrfToken = login.data.csrfToken;
  const cookie = login.response.headers.get('set-cookie').split(';', 1)[0];

  const contactList = await jsonRequest(`${baseUrl}/api/admin/submissions?kind=contacts`, { headers: { Cookie: cookie } });
  assert.equal(contactList.response.status, 200);
  assert.equal(contactList.data.total, 1);
  assert.equal(contactList.data.items[0].name, 'آزمون تماس');

  const contactDetail = await jsonRequest(`${baseUrl}/api/admin/submissions/contacts/${contact.data.id}`, { headers: { Cookie: cookie } });
  assert.equal(contactDetail.response.status, 200);
  assert.equal(contactDetail.data.record.message, 'پیام آزمایشی برای بررسی پایگاه داده');
  assert.equal(contactDetail.data.record.notification.status, 'blocked');

  const retriedNotification = await jsonRequest(`${baseUrl}/api/admin/submissions/contacts/${contact.data.id}/notification/retry`, {
    method: 'POST',
    headers: { Cookie: cookie, 'X-CSRF-Token': csrfToken },
  });
  assert.equal(retriedNotification.response.status, 202);
  assert.equal(retriedNotification.data.configured, false);
  assert.equal(retriedNotification.data.queued, 1);

  const changed = await jsonRequest(`${baseUrl}/api/admin/submissions/contacts/${contact.data.id}`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
    body: JSON.stringify({ status: 'in_progress', adminNote: 'پیگیری آزمایشی' }),
  });
  assert.equal(changed.response.status, 200);
  assert.equal(changed.data.record.status, 'in_progress');

  const deck = await fetch(`${baseUrl}/api/admin/submissions/applications/${application.data.id}/deck`, { headers: { Cookie: cookie } });
  assert.equal(deck.status, 200);
  assert.equal(deck.headers.get('content-type'), 'application/pdf');
  assert.deepEqual(Buffer.from(await deck.arrayBuffer()), deckBytes);

  const noCsrfDelete = await jsonRequest(`${baseUrl}/api/admin/submissions/contacts/${contact.data.id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  });
  assert.equal(noCsrfDelete.response.status, 403);

  const deleted = await jsonRequest(`${baseUrl}/api/admin/submissions/contacts/${contact.data.id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie, 'X-CSRF-Token': csrfToken },
  });
  assert.equal(deleted.response.status, 200);
  assert.equal(deleted.data.ok, true);
  const emptyContactList = await jsonRequest(`${baseUrl}/api/admin/submissions?kind=contacts`, { headers: { Cookie: cookie } });
  assert.equal(emptyContactList.data.total, 0);

  const applicationList = await jsonRequest(`${baseUrl}/api/admin/submissions?kind=applications`, { headers: { Cookie: cookie } });
  assert.equal(applicationList.response.status, 200);
  assert.equal(applicationList.data.total, 1);
  assert.equal(applicationList.data.items[0].subtitle, 'محصول آزمایشی');

  child.kill('SIGTERM');
  await new Promise((resolve) => child.once('exit', resolve));
  processes.delete(child);

  child = launchServer({ dataDir, port, username, password });
  await waitForApi(child, baseUrl);
  const loginAfterRestart = await jsonRequest(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(loginAfterRestart.response.status, 200);
  const persistedCookie = loginAfterRestart.response.headers.get('set-cookie').split(';', 1)[0];
  const persisted = await jsonRequest(`${baseUrl}/api/admin/submissions?kind=applications`, { headers: { Cookie: persistedCookie } });
  assert.equal(persisted.response.status, 200);
  assert.equal(persisted.data.total, 1);
  assert.equal(persisted.data.items[0].id, application.data.id);
});
