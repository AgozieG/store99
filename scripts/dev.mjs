import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const api = spawn(process.execPath, [path.join(root, 'local-api.mjs')], {
  stdio: 'inherit',
  env: process.env,
});
const vite = spawn(process.execPath, [path.join(root, '..', 'node_modules', 'vite', 'bin', 'vite.js')], {
  stdio: 'inherit',
  env: process.env,
});

function stop() {
  if (!api.killed) api.kill();
  if (!vite.killed) vite.kill();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
api.on('exit', code => {
  if (code && code !== 0) {
    console.error(`Local API stopped with code ${code}; stopping Vite too.`);
    stop();
    process.exit(code);
  }
  if (!vite.killed) console.log('Using the existing local API process.');
});
vite.on('exit', code => {
  stop();
  process.exit(code || 0);
});
