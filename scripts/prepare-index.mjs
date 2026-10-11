import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await copyFile(
  path.join(projectRoot, 'src', 'index.template.html'),
  path.join(projectRoot, 'index.html'),
);
