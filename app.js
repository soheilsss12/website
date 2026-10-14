'use strict';

// Passenger loads its startup file with require(), so keep this entrypoint
// CommonJS-compatible while the backend modules remain ESM in server/.
const path = require('node:path');
const applicationRoot = __dirname;

if (process.env.NODE_ENV === 'production') {
  process.env.DATA_DIR ||= path.join(path.dirname(applicationRoot), 'private', 'pars-data');
  process.env.PUBLIC_ORIGIN ||= 'https://pars-ventures.com';
  process.env.TRUST_PROXY ||= 'true';
}

// Import the ESM server asynchronously after setting Plesk production defaults.
void import('./server/index.js').catch((error) => {
  console.error('Plesk application startup failed:', error);
  process.exitCode = 1;
});
