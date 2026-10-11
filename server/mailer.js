import { randomUUID } from 'node:crypto';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const MAX_RETRIES = 8;
const REQUEST_TIMEOUT_MS = 12_000;

export function mailConfiguration(env = process.env) {
  const configured = Boolean(env.RESEND_API_KEY && env.EMAIL_FROM && env.ADMIN_NOTIFICATION_EMAIL);
  return {
    configured,
    apiKey: env.RESEND_API_KEY || '',
    from: env.EMAIL_FROM || '',
    to: env.ADMIN_NOTIFICATION_EMAIL || '',
  };
}

export function enqueueAdminNotification(db, { kind, submissionId, subject, textBody }) {
  const mail = mailConfiguration();
  const id = randomUUID();
  const now = Date.now();
  db.prepare(`
    INSERT INTO email_outbox
      (id, kind, submission_id, to_address, subject, text_body, status, attempts, next_attempt_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    id,
    kind,
    submissionId,
    mail.configured ? mail.to : '',
    subject,
    textBody,
    mail.configured ? 'pending' : 'blocked',
    now,
    now,
  );
  return { id, status: mail.configured ? 'pending' : 'blocked' };
}

function retryDelay(attempts) {
  return Math.min(24 * 60 * 60 * 1000, 30_000 * (2 ** Math.max(0, attempts - 1)));
}

export async function flushEmailOutbox(db, env = process.env) {
  const mail = mailConfiguration(env);
  if (!mail.configured) {
    db.prepare("UPDATE email_outbox SET status = 'blocked', last_error = 'Mail provider configuration is incomplete' WHERE status IN ('pending', 'failed')").run();
    return;
  }

  db.prepare("UPDATE email_outbox SET status = 'pending', last_error = '' WHERE status = 'blocked'").run();
  const now = Date.now();
  const rows = db.prepare(`
    SELECT id, to_address, subject, text_body, attempts
    FROM email_outbox
    WHERE status IN ('pending', 'failed') AND attempts < ? AND next_attempt_at <= ?
    ORDER BY created_at ASC
    LIMIT 5
  `).all(MAX_RETRIES, now);

  for (const row of rows) {
    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mail.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: mail.from,
          to: [row.to_address || mail.to],
          subject: row.subject,
          text: row.text_body,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        const attempt = Number(row.attempts) + 1;
        const nextAttempt = Date.now() + retryDelay(attempt);
        db.prepare(`
          UPDATE email_outbox
          SET status = 'failed', attempts = ?, next_attempt_at = ?, last_error = ?
          WHERE id = ?
        `).run(attempt, nextAttempt, `Resend returned HTTP ${response.status}`, row.id);
        continue;
      }
      db.prepare(`
        UPDATE email_outbox
        SET status = 'sent', attempts = attempts + 1, sent_at = ?, last_error = ''
        WHERE id = ?
      `).run(Date.now(), row.id);
    } catch (error) {
      const attempt = Number(row.attempts) + 1;
      const nextAttempt = Date.now() + retryDelay(attempt);
      const reason = error?.name === 'TimeoutError' || error?.name === 'AbortError'
        ? 'Email provider request timed out'
        : 'Email provider request failed';
      db.prepare(`
        UPDATE email_outbox
        SET status = 'failed', attempts = ?, next_attempt_at = ?, last_error = ?
        WHERE id = ?
      `).run(attempt, nextAttempt, reason, row.id);
    }
  }

  db.prepare("UPDATE email_outbox SET status = 'failed', last_error = 'Retry limit reached' WHERE status IN ('pending', 'failed') AND attempts >= ?").run(MAX_RETRIES);
}

export function startEmailOutboxWorker(db, { intervalMs = 15_000 } = {}) {
  let working = false;
  const run = async () => {
    if (working) return;
    working = true;
    try {
      await flushEmailOutbox(db);
    } catch (error) {
      console.error('Email outbox worker failed:', error?.message || 'unknown error');
    } finally {
      working = false;
    }
  };
  const timer = setInterval(run, intervalMs);
  timer.unref?.();
  void run();
  return () => clearInterval(timer);
}
