import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const files = [
  'index.html',
  'app.js',
  'maths.js',
  'lifeskills.js',
  'data.js',
  'style.css',
  'manifest.json',
  'icon.svg',
  'config.js',
  'tts.js',
  'native.js',
  'sw.js'
];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const file of files) cpSync(join(root, file), join(out, file));
console.log('Copied ' + files.length + ' files into www/');
