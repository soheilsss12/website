import { chmodSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { hashPassword } from './security.js';

const SCHEMA = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = FULL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'needs_info', 'accepted', 'declined', 'archived')),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    project_name TEXT NOT NULL,
    website TEXT NOT NULL DEFAULT '',
    stage TEXT NOT NULL,
    industry TEXT NOT NULL,
    one_liner TEXT NOT NULL,
    description TEXT NOT NULL,
    funding_reason TEXT NOT NULL,
    amount_toman INTEGER NOT NULL,
    use_of_funds TEXT NOT NULL,
    traction TEXT NOT NULL DEFAULT '',
    team_size INTEGER NOT NULL,
    previous_investors TEXT NOT NULL DEFAULT '',
    links TEXT NOT NULL DEFAULT '',
    deck_name TEXT NOT NULL DEFAULT '',
    deck_path TEXT NOT NULL DEFAULT '',
    consent_at INTEGER NOT NULL,
    admin_note TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed', 'archived')),
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    topic TEXT NOT NULL,
    message TEXT NOT NULL,
    admin_note TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    username TEXT NOT NULL REFERENCES admin_users(username) ON DELETE CASCADE,
    csrf_token TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS email_outbox (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('application', 'contact')),
    submission_id TEXT NOT NULL,
    to_address TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL,
    text_body TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'blocked')),
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at INTEGER NOT NULL,
    last_error TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    sent_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS admin_audit (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_kind TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details_json TEXT NOT NULL DEFAULT '{}',
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_applications_status_created_at ON applications(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_contacts_status_created_at ON contacts(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON admin_sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_outbox_due ON email_outbox(status, next_attempt_at);
  CREATE INDEX IF NOT EXISTS idx_outbox_submission ON email_outbox(submission_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_audit_entity ON admin_audit(entity_kind, entity_id, created_at DESC);
`;

export function openDatabase(filename = process.env.DB_PATH || path.join(process.env.DATA_DIR || 'server/data', 'pars.sqlite')) {
  const resolved = path.resolve(filename);
  mkdirSync(path.dirname(resolved), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(resolved);
  db.exec(SCHEMA);
  try {
    chmodSync(resolved, 0o600);
  } catch {
    // File permissions are best-effort on platforms that do not expose POSIX modes.
  }
  return db;
}

export function configureEnvironmentAdmin(db, { username, password } = {}) {
  if (!username && !password) return false;
  if (!username || !password) {
    throw new Error('Set both ADMIN_USERNAME and ADMIN_PASSWORD, or leave both unset.');
  }
  if (!/^[a-zA-Z0-9._@-]{3,64}$/.test(username)) {
    throw new Error('ADMIN_USERNAME must be 3–64 characters using letters, digits, dot, underscore, @, or hyphen.');
  }
  if (password.length < 16 || password.length > 256) {
    throw new Error('ADMIN_PASSWORD must be 16–256 characters. No default administrator is created.');
  }

  const now = Date.now();
  const passwordHash = hashPassword(password);
  db.prepare('DELETE FROM admin_sessions WHERE username = ?').run(username);
  db.prepare('DELETE FROM admin_users WHERE username <> ?').run(username);
  db.prepare(`
    INSERT INTO admin_users (username, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, updated_at = excluded.updated_at
  `).run(username, passwordHash, now, now);
  return true;
}
