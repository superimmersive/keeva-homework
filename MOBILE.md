# Keeva Homework — Android and iOS

The website is still the static files at the repo root (`index.html`, `app.js`, and the rest). GitHub Pages keeps deploying that site from `main`. Capacitor only copies those files into the native projects; it does not replace the site.

App name: **Keeva Homework**  
Application id: `za.co.superimmersive.keevahomework`

## What lives where

| Path | Role |
| --- | --- |
| Repo root | The website. Edit the app here. |
| `www/` | Generated copy used by Capacitor. Not committed. |
| `android/` | Android Studio project. |
| `ios/` | Xcode project (Swift Package Manager, no CocoaPods). |
| `assets/` | Source icon and splash art. Regenerate with `npm run icons`. |

`npm run sync` also writes the files Capacitor gitignores: the web bundle (`android/app/src/main/assets/public`, `ios/App/App/public`), `capacitor.config.json` inside each native app, and `android/capacitor-cordova-android-plugins`. Run sync once after cloning, before opening Android Studio or Xcode.

After any change to the website files, refresh the native copies:

```bash
npm install
npm run sync
```

`npm run sync:android` and `npm run sync:ios` update one platform. Node.js 22 or newer is required.

## Service worker

On GitHub Pages the site still registers `sw.js`, so installed PWAs keep working offline.

Inside the Android and iOS shells the same files are already packaged with the app, so `native.js` does **not** register the service worker (and unregisters one if it is ever there). That avoids an update shipping a new app binary whose WebView keeps serving an old cached `app.js`.

Azure speech audio is a separate Cache API bucket (`keeva-tts-audio-v2` in `tts.js`). That cache does not need the service worker and still works in the shell. Progress stays in `localStorage` on that install. The native app does not share storage with the GitHub Pages site, because they are different origins.

## Audio and the microphone

- Android WebView is allowed to play audio without a fresh tap (`setMediaPlaybackRequiresUserGesture(false)` in Capacitor). iOS WKWebView is set the same way.
- `tts.js` still unlocks one reused `<audio>` element on the first tap, and retries if autoplay is blocked after an `await` (the spelling test speaks a moment after the tap). iOS uses the `playback` audio session so the mute switch does not silence the words.
- Show-and-tell recording uses `MediaRecorder` and prefers a type the device supports (`audio/webm` on Android, `audio/mp4` on iOS).
- Sigwoorde uses the microphone plus Azure speech recognition. English speed-read uses the Web Speech API when the WebView provides it, and the on-screen Yes/No buttons still work when it does not.
- iOS usage strings: `NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`.
- Android permissions: `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS`. The WebView asks for the microphone the first time recording or sigwoorde starts.

The header and page padding use `env(safe-area-inset-*)`, with Capacitor's `--safe-area-inset-*` values as a fallback, so the pink bar clears the status bar and the home indicator.

## Android

Needs Android Studio Otter (2025.2.1) or newer, and a JDK 21 install. Capacitor 8 targets Android SDK 36.

```bash
npm install
npm run sync:android
npm run open:android
```

Or a debug APK from the command line (set `ANDROID_HOME` to your SDK):

```bash
npm run apk
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. It is signed with the debug keystore. Install it with Android Studio's Run button, or:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Nothing has been uploaded to the Play Store. A Play release needs a real upload keystore and a release build (`./gradlew bundleRelease`), which this repo does not set up.

## iOS (Devon, on a Mac)

This project cannot be compiled on Linux. The Xcode project is ready to open. It uses Swift Package Manager (`ios/App/CapApp-SPM`), not CocoaPods.

1. Install Xcode 26 or newer and open it once so the command-line tools are in place.
2. Clone the repo and, in the project folder, run `npm install` then `npm run sync:ios`.
3. Open the project:

   ```bash
   npm run open:ios
   ```

   That opens `ios/App/App.xcodeproj`. The first open needs network so Xcode can fetch the Capacitor Swift package (`https://github.com/ionic-team/capacitor-swift-pm.git`).
4. Select the **App** target, then **Signing & Capabilities**. Choose your Apple Developer team and leave **Automatically manage signing** on. The bundle id is `za.co.superimmersive.keevahomework`.
5. Pick your iPhone and press Run. Accept the microphone prompt when you try show-and-tell or sigwoorde.

### TestFlight

You need a paid Apple Developer Program membership. Do this from the Mac. This repo has not been submitted to App Store Connect.

1. In [App Store Connect](https://appstoreconnect.apple.com), create an app named **Keeva Homework** with bundle id `za.co.superimmersive.keevahomework` and the SKU you prefer.
2. In Xcode, set the run destination to **Any iOS Device (arm64)**.
3. **Product → Archive**. When the Organizer opens, choose **Distribute App → App Store Connect → Upload**.
4. Wait until the build finishes processing under the app's **TestFlight** tab.
5. Export compliance is already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption` is false): the app only uses HTTPS, not extra encryption.
6. Internal testers (App Store Connect users) can install immediately. External testers need a short TestFlight beta review, then an email or public link. They install Apple's TestFlight app and accept the invite.

Bump `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in Xcode (or the Android `versionName` / `versionCode`) before each upload. App Store Connect rejects a repeated build number.

## Icons

`scripts/generate-icons.py` draws the pink tile and gold star from `icon.svg` (the star is a shape, so it does not depend on an emoji font). `npm run icons` refreshes `assets/` and the Android and iOS icon and splash images. Run `npm run sync` afterwards if the web files also changed.
