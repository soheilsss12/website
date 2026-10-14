'use strict';

// Compatibility alias for Plesk installations that already use this filename.
void import('./app.js').catch((error) => {
  console.error('Plesk compatibility startup failed:', error);
  process.exitCode = 1;
});
