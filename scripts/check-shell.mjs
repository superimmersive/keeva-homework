import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const js = ['app.js', 'tts.js', 'native.js', 'lifeskills.js', 'maths.js', 'data.js', 'config.js', 'sw.js'];
for (const file of js) {
  const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error('syntax check failed: ' + file);
  }
}

const manifest = read('android/app/src/main/AndroidManifest.xml');
for (const needle of ['android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS', 'android.hardware.microphone']) {
  if (!manifest.includes(needle)) throw new Error('AndroidManifest missing ' + needle);
}

const plist = read('ios/App/App/Info.plist');
for (const needle of ['NSMicrophoneUsageDescription', 'NSSpeechRecognitionUsageDescription', 'ITSAppUsesNonExemptEncryption']) {
  if (!plist.includes(needle)) throw new Error('Info.plist missing ' + needle);
}

const config = JSON.parse(read('capacitor.config.json'));
if (config.appId !== 'za.co.superimmersive.keevahomework') throw new Error('unexpected appId');
if (config.appName !== 'Keeva Homework') throw new Error('unexpected appName');
if (config.webDir !== 'www') throw new Error('unexpected webDir');

const index = read('index.html');
if (!index.includes('KeevaNative.isShell()')) throw new Error('service worker is not gated on the native shell');
if (!index.includes('viewport-fit=cover')) throw new Error('viewport-fit=cover missing');

for (const copy of ['android/app/src/main/assets/public/index.html', 'ios/App/App/public/index.html', 'android/app/src/main/assets/public/native.js', 'ios/App/App/public/app.js']) {
  read(copy);
}

const nativeSrc = read('native.js');
function shellFlags(page) {
  page.window = page;
  const context = createContext(page);
  runInContext(nativeSrc, context);
  return page.KeevaNative.isShell();
}
const base = () => ({ navigator: {}, document: { documentElement: { classList: { add() {} } }, readyState: 'complete', addEventListener() {} }, addEventListener() {} });
if (shellFlags({ ...base(), Capacitor: { isNativePlatform: () => false }, location: { protocol: 'https:' } })) {
  throw new Error('browser page was treated as a native shell');
}
if (!shellFlags({ ...base(), Capacitor: { isNativePlatform: () => true, getPlatform: () => 'ios' }, location: { protocol: 'capacitor:' } })) {
  throw new Error('Capacitor iOS was not detected');
}
if (!shellFlags({ ...base(), androidBridge: {}, location: { protocol: 'https:' } })) {
  throw new Error('Capacitor Android bridge was not detected');
}
if (!shellFlags({ ...base(), location: { protocol: 'capacitor:' } })) {
  throw new Error('capacitor: URL was not detected');
}

console.log('shell checks ok');
