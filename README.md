# Tambola Now

A zero-friction, voice-powered Tambola/Housie number calling game for families — no downloads, no sign-ups. Scan a QR code and play in under 10 seconds.

## Features

- Auto-call engine (1–90) with configurable interval
- Voice announcements via Web Speech API with Tambola lingo nicknames
- 10×10 visual number board with real-time highlighting
- Digital ticket generation and sharing via QR code
- Multiplayer game rooms with real-time sync
- 15–20 winning patterns with auto-verification
- Fully offline-capable PWA

## Tech Stack

- React 19 + Vite + TypeScript
- Zustand · Tailwind CSS
- Firebase Realtime Database + Anonymous Auth
- Web SpeechSynthesis API + pre-recorded MP3 fallback
- vite-plugin-pwa + Workbox

## Getting Started

```bash
npm install
npm run dev
```

## iOS Testing

Open the Capacitor workspace (not the folder):
```
tambola-now-mobile/ios/App/App.xcworkspace
```

Run via Xcode: select a simulator → Cmd+R

Run via CLI:
```bash
cd tambola-now-mobile
npx cap run ios
```

If you see `xcodebuild requires Xcode` error:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

Or via Xcode UI: Settings → Locations → set Command Line Tools to Xcode 16.x

**Vercel deployment protection**: Preview URLs require auth by default. Fix via Vercel dashboard → project settings → Deployment Protection → off.

## App Store Publishing

1. Apple Developer Account ($99/year) — developer.apple.com (24–48hr approval)
2. App Store Connect — create listing, metadata, screenshots
3. Code signing — distribution certificate + provisioning profile
4. Build & submit via Codemagic (`ios-release` workflow already configured, needs Apple Dev credentials)

## License

MIT
