// Plesk's Node.js extension (Passenger) starts this file from the application root.
// Default persistent settings use the subscription's private/ directory, outside httpdocs.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const applicationRoot = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'production') {
  process.env.DATA_DIR ||= path.join(path.dirname(applicationRoot), 'private', 'pars-data');
  process.env.PUBLIC_ORIGIN ||= 'https://pars-ventures.com';
  process.env.TRUST_PROXY ||= 'true';
}

// Import only after the Plesk defaults above have been set.
await import('./server/index.js');
