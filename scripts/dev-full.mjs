import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
let stopping = false;

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill('SIGTERM');
  }
  const timer = setTimeout(() => process.exit(exitCode), 2_500);
  timer.unref();
  if (children.every((child) => child.exitCode !== null || child.killed)) process.exit(exitCode);
}

function launch(args, label) {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`${label} could not start:`, error.message);
    stopAll(1);
  });
  child.on('exit', (code, signal) => {
    if (stopping) return;
    if (code !== 0) {
      console.error(`${label} exited with ${signal || code}.`);
      stopAll(code || 1);
    }
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

launch(['run', 'server:dev'], 'API server');
launch(['run', 'dev'], 'Vite development server');
