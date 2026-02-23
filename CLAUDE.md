# Tambola Number Calling Game — Product Requirements Document

**The family game night Tambola experience needs a modern, unified app.** Today's market offers dozens of fragmented Tambola/Housie apps, but not a single one combines a clean caller interface, reliable voice announcements, integrated ticket sharing, rich winning patterns, and seamless multiplayer — all without requiring an app download. This PRD defines a Progressive Web App that fills that gap: a zero-friction, voice-powered Tambola caller and game platform built for families gathering around a table or connecting across cities. The core insight from competitive research is clear — **the ability to say "scan this QR code and let's play" is the killer feature** that native apps cannot match.

---

## Product overview and strategic goals

### Vision
Build the most polished, family-friendly Tambola number calling game on the web — one that works instantly on any device, announces numbers with a clear voice, generates and shares tickets digitally, and brings the authentic Housie-hall excitement into living rooms.

### Core goals

- **Zero friction to play**: No downloads, no sign-ups. Open a link or scan a QR code and join a game in under 10 seconds.
- **Voice-first calling**: Every number announced loudly and clearly via text-to-speech, with optional Tambola lingo nicknames ("Two Little Ducks, twenty-two").
- **Works everywhere**: Responsive PWA running on phones, tablets, laptops, and smart TVs with offline solo mode.
- **Family delight**: Celebration animations, festive themes, and winning pattern variety that make every game memorable.

### Target audience

The primary audience is **Indian families and friend groups aged 8–70** playing Tambola during festivals (Diwali, Christmas, New Year), kitty parties, weekend game nights, and family gatherings. Secondary audiences include corporate event organizers running Housie games and teachers using number-calling games in classrooms. The app must accommodate tech-savvy teenagers and grandparents alike, demanding large text, simple interactions, and loud audio.

---

## What the competitive landscape reveals

Research across **9 major apps** (Octro Tambola, Tambola Fun, Tambola Generator, Online Tambola, Bingo Caller by MeepleCorp, Tambola Board, Bingo Caller at Home, Tambola_Housie, and 4 web-based platforms) reveals a **highly fragmented market with no clear winner** across all use cases. Octro Tambola leads in online multiplayer with **5M+ downloads** but doesn't serve the offline caller use case. Tambola Generator offers **46 winning patterns** and QR ticket sharing but is iOS-only. Online Tambola supports **80+ Housie variations** but has a cluttered UI. Bingo Caller supports Chromecast but targets Western Bingo, not Indian Tambola.

The top user complaints across all apps are **intrusive ads** (the number-one pain point), **poor voice quality on external speakers**, **limited winning patterns** (most offer only 6–7), **no integrated ticket generation** within the caller app, and **missing TV/projector casting** in Tambola-specific apps. The highest-rated apps share three traits: clean minimal UI, reliable multi-language voice calling, and no mid-game advertisements.

The strategic opportunity is a **unified modern Tambola app** combining: clean UI + configurable voice calling + 20+ winning patterns + integrated ticket generation and sharing + TV/projector display mode + hybrid offline/online play — with a non-intrusive monetization model.

---

## Core features — the MVP must-haves

### 1. Auto-call number engine (1–90)

The caller draws random numbers from the pool of 1–90 (extendable to 1–100 via settings). **Auto-call mode refreshes every 3 seconds by default**, with a configurable interval from 1 to 30 seconds adjustable via a slider or preset buttons (Slow/Medium/Fast/Custom). Manual mode lets the host tap to draw each number. The host can pause, resume, or reset the game at any time. A visual countdown bar between calls shows players when the next number arrives.

Key behaviors: numbers are drawn without replacement from a shuffled pool; game state persists across page reloads (localStorage); the host sees a "Numbers Remaining" counter; reset requires a confirmation dialog.

### 2. Voice announcements via Web Speech API

Every called number is announced using the **SpeechSynthesis API** (94.52% global browser support). The default speech rate is **0.85** (slightly slower than normal for clarity in group settings), pitch at **1.0**, and volume at maximum. Users can select from available device voices and toggle between English, Hindi, and other available languages.

A **pre-call attention chime** (a short bell or ding sound, 0.5 seconds) plays before each announcement — research confirms this is a critical UX pattern borrowed from bingo halls that signals "pay attention, a number is coming." The number is optionally announced with its **Tambola lingo nickname** ("Legs Eleven," "Two Fat Ladies," "Doctor's Orders"), toggleable in settings. A prominent "Repeat" button re-announces the last called number for loud rooms.

**Technical audio strategy**: The "Start Game" button tap unlocks both the AudioContext and SpeechSynthesis, satisfying all browser autoplay policies. Pre-recorded MP3 fallback files (~2–3 MB for all 90 numbers) are cached via the service worker for offline play or when TTS is unavailable. iOS Safari restrictions are handled by initializing audio within the touch event handler call stack.

### 3. Visual number board (10×10 grid)

A **10-column CSS Grid** displays numbers 1–90 (or 1–100), arranged sequentially left to right, top to bottom. Called numbers transition to a **green background with a pulse animation** (scale to 1.1x over 0.3 seconds, then settle). Uncalled numbers appear in a neutral muted tone. The most recently called number gets an additional glow effect (`box-shadow`) that fades over 2 seconds.

The design uses a **multi-signal approach** so color-blind users can distinguish states: background color change + a small checkmark overlay on called numbers. The grid is responsive — full 10-column layout on tablets and desktops, with compact cell sizing and `clamp()`-based font sizing on mobile phones (minimum 12px, never below). `prefers-reduced-motion` is respected by disabling animations for users who need it.

### 4. Recent numbers display strip

The **last 5 called numbers** are shown in a horizontal strip above the grid, with the current number displayed **3–5× larger** than grid numbers (48–72px font) in a prominent circle or ball element. Previous numbers appear progressively smaller and slightly faded. The count of recent numbers displayed is **configurable** from 1 to 15 in settings.

This strip is **sticky-positioned** so it remains visible when the grid scrolls on smaller screens. The visual hierarchy is: current number (biggest, brightest) → last few called (medium, visible) → all called numbers (highlighted in grid) → uncalled numbers (muted in grid).

### 5. Ticket generation and sharing

The app generates valid **3×9 Tambola tickets** (15 numbers per ticket, 5 per row, column ranges enforced, ascending order within columns) using a two-phase algorithm: generate a valid boolean grid pattern, then fill with appropriately ranged numbers. Players receive **1–3 tickets each**.

Tickets are shared via **QR code** (displayed on the host's screen) or a **shareable link** (for WhatsApp/messaging distribution). Players scan or tap to view their ticket on their own device and tap numbers to mark them digitally. A **print-friendly PDF export** generates tickets for offline physical play. No sign-up is required — players enter only a display name.

### 6. Winning pattern detection and claims

The MVP supports **15–20 winning patterns**: Early Five (Jaldi 5), Top Line, Middle Line, Bottom Line, Full House, Four Corners, Early Seven, Star, Breakfast/Lunch/Dinner (thematic aliases for early/lines/full house), Railway Track (top + bottom rows), and several letter patterns. Each pattern has a **visual preview** showing which positions must be marked.

When a player believes they've won, they tap "Claim" on the relevant pattern. The system **automatically verifies** the claim against called numbers. Invalid claims trigger a "Bogey" (ticket disqualification), with a host-restore option for accidental claims. All players see a real-time notification of accepted or rejected claims.

### 7. Multiplayer game rooms

The host creates a game room and receives a **6-character alphanumeric join code** plus a QR code and shareable link. Players join via any method without creating an account (Firebase Anonymous Auth). Real-time sync via **Firebase Realtime Database** pushes each called number to all connected players within **100–500ms** — more than sufficient for a game where numbers are drawn every 3–15 seconds. The host controls game flow (start, pause, call, reset) and can remove players.

### 8. Offline solo mode (PWA)

The app is a **fully installable PWA** with a service worker that caches the entire app shell, game logic, and pre-recorded audio files. The offline solo mode provides a complete number caller with voice, grid, and ticket generation — requiring no network connection at all. This is critical for locations with poor connectivity or when a simple caller board is all that's needed for a physical gathering.

---

## Enhanced features — the V2 roadmap

### High-impact additions

**Smart game insights** represent the single biggest differentiator identified in research. Auto-generated messages like "Player X is one number away from Full House!" or "3 players competing for Top Line" create authentic tension that mimics the excitement of a physical Tambola hall. Only one competitor (Online Tambola) offers this feature, and users rate it extremely positively.

**TV/Projector flashboard mode** optimizes the display for large screens — giant numbers, high contrast, minimal UI chrome — making the game feel like a real event in the living room. Research shows this is the **most requested missing feature** in Indian Tambola apps, while Western bingo apps (Bingo Caller, Bingo Caller at Home) already support Chromecast and AirPlay.

**Expanded winning patterns library** (40–46 patterns) including Pyramid, Cross/Plus, Circle, King's Corner, Queen's Corner, CID, Temperature, and letter patterns (C, D, H, I, L, N, T). A **custom pattern creator** lets hosts define their own winning shapes by tapping cells on a ticket grid.

**Festive themes** for Diwali, Christmas, Holi, New Year, and other celebrations — with themed ticket designs, board colors, and celebration animations. Research shows this has very high perceived value for the family game night audience and is a strong retention driver.

### Medium-impact additions

- **Multi-language calling**: Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, and Gujarati voice packs
- **In-game chat** with emoji reactions and smart auto-responder suggestions
- **Game history and statistics**: Past games, win rates, player performance over time
- **Math Bingo variant**: Numbers replaced with math expressions — educational twist for children
- **Background music**: Ambient tracks at 10–20% of voice volume, auto-pausing during announcements
- **Player profiles**: Persistent accounts with game stats, badges, and win streaks
- **Tournament/bracket mode**: Multi-round competitions for larger gatherings

### Lower-priority additions

- Capacitor wrapper for app store distribution (iOS/Android)
- Push notifications for game invites
- Video call integration sidebar (Zoom/Meet/Teams)
- Story/Quiz Tambola variants
- 3D spinning cage ball-draw animation
- Augmented reality features

---

## UX flow — screen by screen

### Screen 1: Home / Landing

A clean landing screen with two primary actions: **"Host a Game"** (large, primary button) and **"Join a Game"** (secondary button). Below these, a "Play Solo" option for offline practice. The app name and a brief tagline ("Family Tambola, made simple") set the tone. A gear icon accesses global settings (voice, theme, language). First-time users see a brief 3-slide onboarding overlay explaining the game flow.

### Screen 2: Game setup (Host)

After tapping "Host a Game," the host configures: number range (1–90 default, extendable to 1–100), call interval (slider: 1–30 seconds, default 3), voice on/off and voice selection, number nicknames toggle, active winning patterns (checklist with visual previews), and number of tickets per player (1–3). A "Generate Room" button creates the game and advances to the lobby.

### Screen 3: Game lobby

Displays the **room code prominently** (large font, tap to copy), a **QR code** for scanning, and a **"Share via WhatsApp"** button generating a pre-formatted invite message with the join link. A live player list shows who has joined. The host sees a **"Start Game"** button that activates once at least one player has joined. Players can preview their tickets in this screen. The host can regenerate tickets or remove players.

### Screen 4: Join flow (Player)

Tapping "Join a Game" on the home screen presents a **6-digit code input field** (large, auto-focused, with numpad keyboard on mobile) and a **"Scan QR Code"** button. After entering a valid code, the player types a display name and is placed in the lobby with their assigned ticket(s) visible. The entire join flow takes under 10 seconds.

### Screen 5: Active game (Host view)

The host's primary screen during gameplay. **Top section**: Current called number (large, animated) + recent numbers strip (last 5). **Middle section**: 10×10 number grid with real-time green highlighting. **Bottom section**: Game controls — Play/Pause toggle, "Next Number" button (for manual mode), speed adjustment, volume control, and "End Game" button. A side panel (drawer on mobile, persistent on desktop) shows the player list and claim notifications. When a player claims a prize, a modal appears for the host to see the auto-verification result and confirm or dispute.

### Screen 6: Active game (Player view)

The player's screen during gameplay. **Top section**: Current called number (large, with voice announcement) + recent numbers strip. **Middle section**: The player's ticket(s) — tappable cells that toggle a mark when the number has been called. **Bottom section**: Claim buttons for active winning patterns (greyed out until potentially achievable, highlighted when the player's ticket qualifies). A **mini number board** is accessible via a toggle/drawer for reference. When a claim is verified, a **confetti animation** celebrates the win.

### Screen 7: Game over / Results

Triggered when Full House is claimed or the host ends the game. Displays a **winner board** showing which player won each pattern (Early Five, Top Line, etc.) with celebration animations. A **"Share Results"** button generates a screenshot-style summary image. Options to "Play Again" (same room, new tickets), "New Game" (new setup), or "Exit."

### Screen 8: Settings

Accessible from any screen via gear icon. Sections: **Audio** (voice selection, speech rate, pitch, volume, nicknames on/off, pre-call chime on/off), **Display** (theme selection, dark/light mode, recent numbers count, grid size), **Game defaults** (default interval, default number range, default patterns), and **About/Help** (rules reference, pattern glossary, feedback link).

---

## Technical architecture recommendation

### Platform: Progressive Web App

The PWA approach is the clear winner for this use case. It delivers **zero-friction onboarding** (open a link and play), **offline capability** (service worker caching), **installability** on Android and iOS, and **94.52% global browser support** for the critical SpeechSynthesis API. Development cost is **50–70% lower** than React Native, and time-to-MVP is **3–4 weeks** versus 6–10 weeks for native. The upgrade path is straightforward: wrap the PWA with Capacitor in V2 for app store distribution if validated.

### Recommended tech stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **React 19 + Vite** | Largest ecosystem, excellent PWA tooling, path to React Native if needed |
| Language | **TypeScript** | Type safety for game logic, better IDE support, fewer runtime bugs |
| State management | **Zustand** | ~1KB bundle, minimal boilerplate, perfect for game state, easy localStorage persistence |
| Styling | **Tailwind CSS** | Rapid responsive development, built-in dark mode, tiny production bundles |
| TTS | **Web SpeechSynthesis API** + pre-recorded MP3 fallback | 94.52% coverage, zero storage for primary path, offline fallback cached |
| Real-time sync | **Firebase Realtime Database** | Zero server management, built-in offline persistence, 100 free simultaneous connections |
| Authentication | **Firebase Anonymous Auth** | Zero-friction game joining, no sign-up required |
| PWA tooling | **vite-plugin-pwa + Workbox** | Zero-config service worker generation, precaching, runtime caching strategies |
| QR generation | **qrcode npm package** | Lightweight, well-maintained, canvas and SVG output |
| Hosting | **Vercel or Firebase Hosting** | Free tier sufficient, automatic HTTPS (required for service workers), global CDN |
| Ticket algorithm | **Two-phase grid-first generation** | Validated pattern → fill with numbers; no backtracking, guaranteed valid tickets |

### Key technical decisions

**Service worker strategy**: App Shell architecture with Workbox. Precache all static assets (HTML, CSS, JS, icons, pre-recorded audio). Cache-First for static resources, Network-First for Firebase API calls. The entire solo game experience works offline after first load.

**Grid performance**: 90 DOM elements with CSS `transform` animations render in under 1ms. Use `React.memo` to prevent unnecessary re-renders. Animate only with `transform` and `opacity` (GPU-composited properties). The `canvas-confetti` library (~10KB gzipped) handles celebration animations with particle count capped at 50 on mobile for 60fps performance.

**Audio autoplay handling**: The "Start Game" button tap unlocks both AudioContext and SpeechSynthesis. Subsequent auto-calls work without further user interaction. On iOS Safari, the initial speak() call must be within the touch event handler call stack. A known Chrome bug (speechSynthesis freeze) is mitigated by calling `speechSynthesis.cancel()` before each `speak()`.

**Firebase data model**: `/games/{gameId}/` stores host ID, game status, called numbers array, current number, settings, and a `/players/` subcollection with each player's name, tickets, and claims. Firestore (not Realtime DB) stores historical game data for analytics and statistics in V2.

---

## Feature prioritization matrix

### MVP (V1) — Launch in 3–4 weeks

| Priority | Feature | Complexity |
|---|---|---|
| P0 | Auto-call engine with configurable 1–30s interval | Low |
| P0 | Voice announcements (Web Speech API + pre-recorded fallback) | Medium |
| P0 | 10×10 number grid with green highlighting and pulse animation | Low |
| P0 | Configurable recent numbers display (last N called) | Low |
| P0 | Manual + auto calling modes with pause/resume/reset | Low |
| P0 | Ticket generation (valid 3×9 grid, 1–3 per player) | Low |
| P0 | QR code + link sharing for tickets and game room | Low |
| P0 | Digital ticket marking on player devices | Medium |
| P1 | Multiplayer game rooms with real-time sync (Firebase) | Medium |
| P1 | 15–20 winning patterns with auto-verification | Medium |
| P1 | Claim system with bogey enforcement | Medium |
| P1 | PWA install + offline solo mode | Medium |
| P1 | Dark mode / light mode + 3 color themes | Low |
| P1 | Pre-call attention chime | Low |
| P1 | Number nicknames (English Tambola lingo) | Low |
| P1 | Confetti celebration on wins | Low |
| P2 | Print-friendly PDF ticket export | Low |
| P2 | Speed presets (Slow/Medium/Fast/Custom) | Low |
| P2 | Screen always-on during active game | Low |
| P2 | Responsive design optimized for phone, tablet, desktop | Medium |

### V2 — Weeks 5–10

| Feature | Impact | Complexity |
|---|---|---|
| Smart game insights ("Player X needs 1 more for Full House!") | Very High | Medium |
| TV/Projector flashboard display mode | Very High | Medium |
| Expanded pattern library (40+ patterns) + custom pattern creator | High | Medium |
| Festive themes (Diwali, Christmas, Holi) | High | Medium |
| Hindi + regional language voice packs | High | Medium |
| In-game chat with emoji reactions | Medium | Medium |
| Game history, statistics, and player profiles | Medium | Medium |
| Background music with auto-pause during calls | Medium | Low |
| Capacitor wrapper for iOS/Android app store distribution | Medium | Low |

### V3 — Future roadmap

Math Bingo variant for kids, Story/Quiz Tambola, tournament/bracket mode, push notifications for game invites, video call integration sidebar, 3D cage animation, and social media result sharing.

---

## Conclusion — what makes this product win

Three design decisions separate this app from the 50+ Tambola callers already in the market. First, **zero-friction multiplayer via the web** — no downloads, no accounts, just a QR scan and you're playing. Research shows the join experience is where most competitors lose casual family players. Second, **voice-first design with Tambola lingo** — the pre-call chime, the nickname tradition ("Two Fat Ladies, eighty-eight"), and the configurable speech rate transform a silent phone screen into the centerpiece of a game night. Third, **hybrid offline/online architecture** — the same app works as a simple offline caller at a physical gathering and as a full multiplayer platform for distributed family members. No competitor offers both modes in a single, cohesive product.

The PWA approach gives this product a structural distribution advantage. While native app competitors require convince-download-install-open (a funnel that loses 60–80% of potential players at family gatherings), this app requires only scan-tap-play. That 10-second onboarding experience, combined with reliable voice calling and a clean visual board, is the foundation everything else builds on.