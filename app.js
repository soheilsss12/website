'use strict';

// Passenger loads its startup file with require(), so keep this entrypoint
// CommonJS-compatible while the backend modules remain ESM in server/.
const path = require('node:path');
const applicationRoot = __dirname;

function startupFailureStatus(error) {
  const message = String(error?.message || '');
  const requiredMatch = message.match(/Production startup requires these environment variables:\s*([^.]+)\./);
  if (requiredMatch) {
    return {
      ok: false,
      code: 'missing_environment_variables',
      missing: requiredMatch[1].split(',').map((name) => name.trim()).filter(Boolean),
    };
  }
  const emailMatch = message.match(/Set all email environment variables or leave all three empty\. Missing:\s*([A-Z0-9_, ]+)\./);
  if (emailMatch) {
    return {
      ok: false,
      code: 'incomplete_email_configuration',
      missing: emailMatch[1].split(',').map((name) => name.trim()).filter(Boolean),
    };
  }
  if (message.includes('Set both ADMIN_USERNAME and ADMIN_PASSWORD')) {
    return { ok: false, code: 'incomplete_admin_configuration', missing: ['ADMIN_USERNAME', 'ADMIN_PASSWORD'] };
  }
  if (error?.code === 'EACCES' || error?.code === 'EPERM') {
    return { ok: false, code: 'filesystem_permission_denied' };
  }
  if (message.includes('DATA_DIR must') || message.includes('PUBLIC_ORIGIN must')) {
    return { ok: false, code: 'invalid_runtime_configuration' };
  }
  const invalidAdminSettings = [
    ['ADMIN_USERNAME', 'ADMIN_USERNAME must'],
    ['ADMIN_PASSWORD', 'ADMIN_PASSWORD must'],
    ['ADMIN_SESSION_TTL_HOURS', 'ADMIN_SESSION_TTL_HOURS must'],
    ['ADMIN_COOKIE_SAMESITE', 'ADMIN_COOKIE_SAMESITE must'],
  ];
  const invalidAdminSetting = invalidAdminSettings.find(([, messagePrefix]) => message.includes(messagePrefix));
  if (invalidAdminSetting) {
    return { ok: false, code: 'invalid_environment_variable', variable: invalidAdminSetting[0] };
  }
  if (message.includes('node:sqlite') || error?.code === 'ERR_UNKNOWN_BUILTIN_MODULE') {
    return { ok: false, code: 'unsupported_node_runtime' };
  }
  return { ok: false, code: 'startup_failed' };
}

function startStartupFailureResponder(error) {
  const { createServer } = require('node:http');
  const diagnostic = startupFailureStatus(error);
  const responder = createServer((req, res) => {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/api/health') {
      res.writeHead(503, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(JSON.stringify(diagnostic));
      return;
    }
    res.writeHead(503, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end('Application startup failed');
  });
  responder.on('error', (listenError) => {
    console.error('Plesk startup diagnostic listener failed:', listenError);
    process.exitCode = 1;
  });

  const endpoint = String(process.env.PORT || '8787').trim();
  if (/^\d+$/.test(endpoint)) {
    const port = Number(endpoint);
    if (process.env.HOST) responder.listen(port, process.env.HOST);
    else responder.listen(port);
  } else {
    responder.listen(endpoint);
  }
}

if (process.env.NODE_ENV === 'production') {
  process.env.DATA_DIR ||= path.join(path.dirname(applicationRoot), 'private', 'pars-data');
  process.env.PUBLIC_ORIGIN ||= 'https://pars-ventures.com';
  process.env.TRUST_PROXY ||= 'true';
}

// Import the ESM server asynchronously after setting Plesk production defaults.
void import('./server/index.js').catch((error) => {
  console.error('Plesk application startup failed:', error);
  startStartupFailureResponder(error);
});
