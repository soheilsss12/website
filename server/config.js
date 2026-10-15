import path from 'node:path';

const MAIL_ENVIRONMENT_KEYS = ['ADMIN_NOTIFICATION_EMAIL', 'EMAIL_FROM', 'RESEND_API_KEY'];

/**
 * Refuse to start a production server with configuration that would make the
 * public admin/API origin or persistent storage ambiguous. Local/test runs are
 * intentionally allowed to omit these values.
 */
export function validateRuntimeEnvironment(env = process.env) {
  if (env.NODE_ENV !== 'production') return;

  const required = ['DATA_DIR', 'PUBLIC_ORIGIN', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
  const missing = required.filter((key) => !String(env[key] || '').trim());
  if (missing.length) {
    throw new Error(`Production startup requires these environment variables: ${missing.join(', ')}.`);
  }

  if (!path.isAbsolute(String(env.DATA_DIR).trim())) {
    throw new Error('DATA_DIR must be an absolute path to persistent storage in production.');
  }

  let publicOrigin;
  try {
    publicOrigin = new URL(String(env.PUBLIC_ORIGIN).trim());
  } catch {
    throw new Error('PUBLIC_ORIGIN must be the HTTPS origin of the public website.');
  }
  if (
    publicOrigin.protocol !== 'https:'
    || publicOrigin.username
    || publicOrigin.password
    || publicOrigin.pathname !== '/'
    || publicOrigin.search
    || publicOrigin.hash
  ) {
    throw new Error('PUBLIC_ORIGIN must be an HTTPS origin only, for example https://site.example (no path).');
  }

  const configuredMailKeys = MAIL_ENVIRONMENT_KEYS.filter((key) => String(env[key] || '').trim());
  if (configuredMailKeys.length > 0 && configuredMailKeys.length < MAIL_ENVIRONMENT_KEYS.length) {
    const missingMailKeys = MAIL_ENVIRONMENT_KEYS.filter((key) => !String(env[key] || '').trim());
    throw new Error(`Set all email environment variables or leave all three empty. Missing: ${missingMailKeys.join(', ')}.`);
  }
}
