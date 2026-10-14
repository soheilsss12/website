// Plesk's Passenger loader uses require() for its startup file. This CommonJS
// shim dynamically imports the ESM app.js so the Node app can start correctly.
(async () => {
  try {
    await import('./app.js');
  } catch (error) {
    console.error('Plesk application startup failed:', error);
    process.exitCode = 1;
  }
})();
