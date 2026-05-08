import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const assetsDir = resolve(root, 'assets');

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7ZcxoAAAAASUVORK5CYII=';
const pngBuffer = Buffer.from(pngBase64, 'base64');

const files = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png',
  'notification-icon.png',
];

if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

for (const file of files) {
  const destination = resolve(assetsDir, file);
  if (!existsSync(destination)) {
    writeFileSync(destination, pngBuffer);
  }
}

console.log('Asset placeholders ensured in ./assets');
