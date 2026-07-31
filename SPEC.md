# THE STORY OF HER — Master Build Spec (FINAL)
### A surprise birthday website. One page, one scroll, her whole story.

**Deadline: deployed & QA-passed by Aug 4, 2026. Self-unlocks at 12:00 AM IST, Aug 6, 2026.**
**This file supersedes all previous versions. It lives in the repo root as `SPEC.md`.**

---

## 0. Working Agreement with Codex (read first — anti-wandering rules)

1. **One prompt at a time.** Build only what the current prompt (§12) asks. Run, verify acceptance criteria, commit as `P<n>: <name>`, then stop.
2. **Never refactor, restyle, or "improve" previously accepted scenes** unless the current prompt explicitly says so.
3. **On any ambiguity, SPEC.md wins.** If the spec is silent, choose the simplest option and leave a one-line code comment `// SPEC-silent: chose X`.
4. **No dependencies beyond §2.** If something seems to need a new package, solve it with what's installed.
5. **Never edit values inside `src/content.ts`** — only its owner edits content. Codex may only create the file with the placeholders given in §4.
6. **Each scene is self-contained** in its own file under `src/scenes/`. Shared logic goes in `src/lib/` or `src/components/` only.
7. Mobile-first always: build at 375px, then adapt up at `md:` (768px). Use `100dvh`, never `100vh`.

---

## 1. Project Summary & Non-Negotiables

A single-page, scroll-driven birthday website — an interactive love letter with a scrapbook-come-alive aesthetic. She will almost certainly open it on her phone at midnight. Everything on it is from one person to one person — **no third-party content anywhere** (locked decision).

**Emotional arc (do not reorder):** playful (gift → story → polaroids → reasons) → tender (open-when) → celebratory peak (cake + wish) → intimate climax (the letter) → soft landing (finale).

**Non-negotiable scenes:** S2 Gift Box · S4 Polaroid Wall · S5 Reasons Deck · S6 Open When · S7 Cake · S8 Letter · S9 Finale.
**Cuttable, in order, if behind schedule:** gift clue → trim Open When to 4 → parallax → easter eggs (keep TabTitle — it's ~5 lines).
**The one signature moment (all boldness spent here):** the candle blow-out. Everything else stays quiet and disciplined so it lands.
**Facts that must never be violated:** her age = `turningAge` (drives deck size + candle count); the couple is engaged but has **no wedding date** — no countdowns to marriage, no "last birthday before…" claims anywhere.

---

## 2. Tech Stack (fixed)

- Vite + React 18 + TypeScript
- Tailwind CSS v3 (tokens extended from CSS variables)
- `framer-motion` (all animation) · `howler` (audio) · `canvas-confetti`
- No router, no state library, no backend, no storage APIs. One page.
- Deploy: Vercel (static).

```bash
npm create vite@latest her-birthday -- --template react-ts
cd her-birthday
npm i framer-motion howler canvas-confetti
npm i -D tailwindcss postcss autoprefixer @types/howler @types/canvas-confetti
npx tailwindcss init -p
```

---

## 3. Repo Structure

```
index.html                ← head per §10.4
src/
  content.ts              ← ALL personal data (owner-edited only)
  App.tsx                 ← scene order + AppCtx provider
  styles/tokens.css       ← CSS variables, grain keyframes, font metrics
  lib/
    motion.ts             ← animation constants (§5.5)
    audio.ts              ← singleton music controller (§6.1)
    confetti.ts           ← micro / pop / mega presets (§6.4)
    useMicBlow.ts         ← §7.S7 reference implementation
    useTypewriter.ts      ← §7.S8 reference implementation
    useCountUp.ts         ← §7.S9 reference implementation
    seededRandom.ts       ← §5.3 reference implementation
  components/
    Section.tsx           ← wrapper with settle-in entrance (§5.4)
    Polaroid.tsx          ← framed photo, tape, seeded rotation, optional flip
    MiniEnvelope.tsx      ← small sealed envelope (Open When)
    MusicToggle.tsx       ← fixed cassette mute button (visible after gift opens)
    AudioNote.tsx         ← minimal audio player; ducks music while playing
  scenes/
    S0_Loading.tsx  S1_MidnightLock.tsx  S2_GiftBox.tsx  S3_StoryOfHer.tsx
    S4_PolaroidWall.tsx  S5_ReasonsDeck.tsx  S6_OpenWhen.tsx
    S7_Cake.tsx  S8_Letter.tsx  S9_Finale.tsx
  effects/
    Grain.tsx  HeartCursor.tsx  TabTitle.tsx  EasterEggs.tsx  HeartRain.tsx
public/
  photos/                 ← .webp only, ≤1600px long edge
  audio/                  ← our-song.mp3, letter.mp3 (optional)
```

**Global app state (`AppCtx`, plain React context):** `{ giftOpened: boolean, setGiftOpened }`. `MusicToggle` and easter eggs activate only when `giftOpened === true`.

---

## 4. `src/content.ts` — Full Schema (implement exactly; placeholders shown)

```ts
export interface Chapter {
  id: string;
  title: string;              // "The Day We Met"
  dateLabel: string;          // "14 Feb 2022" | "circa 2003"
  photo: string;              // "/photos/ch2.webp"
  lines: string[];            // 1–3 short handwritten-style lines
  artifact?: {
    kind: "image" | "note";
    src?: string;             // kind:"image" → taped-on screenshot
    text?: string;            // kind:"note"  → torn-paper note text
    label?: string;           // caption, e.g. "our actual first text"
  };
}

export interface PolaroidItem {
  src: string;                // "/photos/p01.webp"
  caption: string;            // front, under the photo
  backNote: string;           // handwritten note revealed on flip
}

export interface OpenWhenLetter {
  label: string;              // "open when you miss me"
  note: string;               // 2–6 lines, specific — inside joke / memory / promise
  emoji?: string;             // tiny icon on the envelope
}

export const content = {
  her: {
    name: "HerName",
    nickname: "nickname",                       // typing this triggers heart-rain
    turningAge: 26,                             // deck size + candle count
    birthdayISO: "2026-08-06T00:00:00+05:30",   // midnight IST — lock opens here
  },
  you: { name: "YourName", signOff: "Forever yours," },
  us: {
    startedISO: "2022-01-01T00:00:00+05:30",    // when "us" began — finale counts UP from this
    counterLabel: "loving you for",
    cantWaitFor: ["the first dance", "every ordinary Tuesday", "that trip we keep talking about"],
  },
  music: { heroSong: { src: "/audio/our-song.mp3", title: "Song — Artist" } },

  chapters: [
    // REPLACE ALL — 5–7 items, childhood → today, incl. the "and then, luckily for me…" chapter
    {
      id: "ch-1", title: "Before Everything", dateLabel: "circa 2003",
      photo: "/photos/ch1.webp",
      lines: ["exhibit A: the cutest kid in the world.", "some things never change."],
    },
    {
      id: "ch-2", title: "The Day We Met", dateLabel: "14 Feb 2022",
      photo: "/photos/ch2.webp",
      lines: ["you laughed at my worst joke.", "i was done for."],
      artifact: { kind: "image", src: "/photos/first-text.webp", label: "our actual first text" },
    },
  ] as Chapter[],

  polaroids: [
    // REPLACE ALL — 10–16 items
    { src: "/photos/p01.webp", caption: "that day.", backNote: "you have no idea how hard i was trying to be cool here." },
  ] as PolaroidItem[],

  reasons: [
    // REPLACE ALL — length MUST equal her.turningAge; LAST item is the special one
    "the way you narrate the dog's thoughts.",
    "Reason #26: you said yes.",
  ] as string[],

  openWhen: [
    // REPLACE ALL — 5–8 items; see label ideas in Appendix B
    { label: "open when you miss me", emoji: "🥺", note: "close your eyes. remember [our place]. i'm right there. now call me — yes, even at 3am. especially at 3am." },
    { label: "open when you're mad at me", emoji: "😬", note: "i'm sorry. i'm probably wrong. [inside joke]. come find me — i'll have your favorite snack ready." },
  ] as OpenWhenLetter[],

  letter: {
    paragraphs: [
      // REPLACE — written by the owner, in his own words. Not generated.
      "placeholder paragraph one…",
      "placeholder paragraph two…",
    ] as string[],
    voiceSrc: undefined as string | undefined,   // "/audio/letter.mp3" when recorded
  },

  giftClue: undefined as { riddle: string } | undefined,  // optional physical-gift riddle

  finale: {
    line1: "Happy birthday, nickname.",
    line2: "I love you. Today, tomorrow, always.",
  },

  easterEggs: { secretPhoto: "/photos/secret.webp", teddyTapCount: 7 },
};
```

Build-time sanity check in `App.tsx` (warn only, never crash):
`if (content.reasons.length !== content.her.turningAge) console.warn("reasons.length ≠ turningAge");`

---

## 5. Design System

### 5.1 Palette (CSS vars in `tokens.css`, mirrored into Tailwind `theme.extend.colors`)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF3E7` | page background |
| `--paper-deep` | `#F1E4CE` | cards, envelopes |
| `--cherry` | `#8C1D2F` | headlines, seals, gift wrap |
| `--cherry-bright` | `#C0334D` | interactive states, accents |
| `--blush` | `#F3C5CC` | soft fills, hearts, balloons |
| `--ink` | `#2B1B12` | body text |
| `--gold` | `#C9A227` | age numeral, ribbon, fine details |
| `--night` | `#171016` | cake scene background |

Palette matches her known aesthetic (cream scrapbook + cherry). Distinctiveness comes from **real artifacts** — her photos, a real chat screenshot, gingham/tape textures, imperfect rotations. No stock imagery, no icon packs beyond simple inline SVG.

### 5.2 Typography (Google Fonts, `display=swap`)

| Role | Face | Where |
|---|---|---|
| Display | Playfair Display 700 Italic | headlines, age numeral |
| Handwriting | Caveat 400/600 | annotations, captions, envelope labels, notes |
| Letter | Courier Prime 400 | S8 only |
| Body/UI | Inter 400/500 | everything else |

Fluid sizes via `clamp()` — display: `clamp(2.2rem, 7vw, 5rem)`; age numeral: `clamp(6rem, 26vw, 14rem)`; Caveat minimum 18px for contrast.

### 5.3 Texture & Imperfection

- **Grain:** fixed full-viewport SVG `feTurbulence` noise, `opacity .06`, `mix-blend-mode: multiply`, `pointer-events: none` (`effects/Grain.tsx`).
- **Seeded rotation:** every decorative element rotated −3°…+3°, stable across renders. Reference implementation (`lib/seededRandom.ts`):

```ts
export function seeded(id: string): number {          // FNV-1a → [0,1)
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}
export const seededRotation = (id: string, max = 3) => (seeded(id) * 2 - 1) * max;
```

- **Polaroid:** white frame (border 10px, bottom 34px), shadow `0 8px 24px rgb(43 27 18 / .18)`, 1–2 translucent tape strips (45%-opacity gradient rectangles at ±40°).
- **Envelope language** (shared by `MiniEnvelope` and S8): `--paper-deep` body, visible flap crease, cherry wax seal = SVG circle with irregular blob edge; **only the S8 seal is embossed with her initial** — mini seals are plain dots.

### 5.4 Motion Rules

- Default entrance = **settle-in** via `Section.tsx`: `initial {opacity 0, y 24, rotate base+2}` → spring `SPRING.settle`, children staggered 0.08s. Trigger: `whileInView`, `viewport={{ once: true, margin: "-15%" }}`.
- **`prefers-reduced-motion`:** all transforms collapse to opacity fades; typewriter renders instantly; cursor, particles, heart-rain, balloons disabled. Implement once in `motion.ts` (export a `reducedMotion` boolean from the media query) and respect it everywhere. Non-negotiable.
- One orchestrated set-piece per scene maximum. No ambient floaters outside S2/S9.

### 5.5 `lib/motion.ts` — Animation Constants (single source of truth)

```ts
export const SPRING = {
  settle: { type: "spring", stiffness: 120, damping: 16 },   // section entrances
  card:   { type: "spring", stiffness: 260, damping: 22 },   // deck draw, envelope expand
  gentle: { type: "spring", stiffness: 80,  damping: 20 },   // lid lift, sheet rise
} as const;

export const DUR = {   // seconds
  ribbonUntie: 0.4, lidLift: 0.45, boxFade: 0.35,
  sealCrack: 0.3, flapOpen: 0.5, sheetRise: 0.6,
  flip: 0.5, expand: 0.35,
  flameStagger: 0.06,          // per candle, extinguish wave
  wishHold: 2.5,               // black-screen beat
  lockFlash: 0.25,
} as const;

export const EASE = { out: [0.16, 1, 0.3, 1], inOut: [0.65, 0, 0.35, 1] } as const;
export const STAGGER = { children: 0.08 } as const;
```

All scenes must import timings from here — no magic numbers in components.

---

## 6. Global Systems

### 6.1 Music (`lib/audio.ts`)
Singleton `Howl` (`loop: true, html5: true, volume: 0`). API: `start()` (fade 0→0.55 over 2s — called ONLY by the gift-box tap; autoplay is blocked everywhere, the ribbon is the play button), `duck()` (→0.12), `restore()` (→0.55), `toggleMute()`. `MusicToggle`: fixed top-right cassette icon, 44px target, appears when `giftOpened`.

### 6.2 Midnight Lock (§7.S1)
If `Date.now() < Date.parse(her.birthdayISO)` → render S1 only; at zero, auto-transition into S2. **Bypass: `?preview=1`** (`new URLSearchParams(location.search)`). Timezone handled by the ISO offset — no libraries.

### 6.3 Easter Eggs (`effects/`) — all gated on `giftOpened`
- **TabTitle:** `visibilitychange` hidden → `document.title = "come back, i miss you 🥺"`; restore on focus.
- **Nickname heart-rain:** keydown buffer (last 20 chars, lowercased, desktop only); contains `her.nickname` → `<HeartRain/>` 4s (≤40 absolutely-positioned hearts, random x/delay/size, falling translateY 3–4s, removed on `animationend`).
- **Teddy ×7:** small teddy sticker at the end of S3; `teddyTapCount` taps → modal with `secretPhoto` + one Caveat line.
- **HeartCursor:** fine-pointer devices only; heart cursor + throttled canvas sparkle trail (≤30 particles). Off for touch and reduced-motion.
- **Mobile tap-hearts:** touchstart in S2/S9 only → one floating heart at tap point.

### 6.4 Confetti (`lib/confetti.ts`)
- `micro(origin?)`: 40 particles, spread 60 — gift box, lock unlock.
- `pop()`: 80 particles, spread 70 — final reason card.
- `mega()`: 3 bursts staggered 250ms (160 particles, spread 100, scalar 1.1) — after the wish; also used lightly in the finale takeover.

---

## 7. Scene Specifications
Format per scene: purpose → layout (375px / ≥768px) → interaction & animation timeline → content bindings → fallbacks → acceptance.

### S0 — Loading
Cover asset/font load with charm. Paper bg; heart outline filling bottom→top (CSS keyframes, 1.2s loop); "wrapping your gift…" (Caveat). Show until `document.fonts.ready` + hero image loaded, **minimum 800ms**, fade out 0.3s. Reduced-motion: static filled heart. **Accept:** no flash of unstyled text; never shorter than 800ms.

### S1 — Midnight Lock
Full-viewport paper. "patience, {nickname}… 🥱" (Caveat, ~24px) above `DD : HH : MM : SS` (Playfair, tabular numerals), 4s opacity pulse 1→0.75→1. Interval 250ms for accuracy. At zero: white flash (`DUR.lockFlash`) + `micro()` → unmount → S2. Bindings: `her.birthdayISO`, `her.nickname`. **Accept:** setting `birthdayISO` 1 min ahead shows live countdown then auto-unlocks into the gift; `?preview=1` skips entirely.

### S2 — The Gift Box (Hero) ★
- **Layout:** gift centered in `100dvh`; box ~80vw mobile / ~360px desktop; cherry wrap with faint CSS gingham (two crossed repeating-linear-gradients at 8% white), wide gold ribbon + bow, soft ground shadow, seeded rotation ~1.5°. Tag (Caveat): "for {her.name} — tap the bow 🎀".
- **Timeline on bow tap:** t0 `audio.start()` · t0–0.4s ribbon halves slide outward ±60px + fade (`DUR.ribbonUntie`, `EASE.out`) · t0.4–0.85s lid lifts (y −60, rotate 8°, fade; `SPRING.gentle`) · t0.5s `micro()` from box origin + 3–4 blush balloons (DOM divs) drift up-offscreen over 3s (skip if reduced-motion) · t0.85–1.2s box scales 0.9 + fades · t1.2s hero reveal: "Happy Birthday" (Playfair It., cherry) staggers in, **age numeral in gold outline** (`-webkit-text-stroke: 2px var(--gold); color: transparent`) springs `SPRING.card`, Caveat subline; scroll-hint arrow (gentle 1.6s bounce) after 2s.
- **Bindings:** `her.name`, `her.turningAge`, `music.heroSong`. Sets `giftOpened = true`.
- **Accept:** full sequence ≈1.8s; music fades in; replay-safe (opening once — box never re-renders); perfect at 375px.

### S3 — The Story of Her
Chapters from `content.chapters`. Each: `Polaroid` photo + date chip (cherry pill, Inter 12px uppercase) + title (Playfair) + lines (Caveat). Artifacts: `kind:"image"` = smaller taped-on screenshot with Caveat label; `kind:"note"` = torn-paper card (irregular clip-path). **Desktop:** alternating left/right around a 1px `--cherry` 20%-opacity thread line; photos parallax ±20px via `useScroll`+`useTransform`. **Mobile:** single column, no parallax. Teddy sticker (~48px, seeded rotation) after the last chapter. Entrances: `Section` settle-in. **Accept:** 5 placeholder chapters look right at 375px and 1440px; artifacts render both kinds.

### S4 — The Polaroid Wall ★
- **Desktop (≥768px):** ~90vh bounded board, red gingham CSS bg (12% opacity). Polaroids absolutely positioned via `seeded(id)` x/y within safe insets, rotation ±3°. `drag` + `dragConstraints={boardRef}`, `whileDrag {scale 1.04, zIndex: top, shadow+}`, `dragMomentum={false}`.
- **Tap vs drag:** record pointer-down position; movement <8px on pointer-up = tap → flip: inner wrapper `rotateY` 0→180 (`DUR.flip`, `EASE.inOut`), both faces `backface-visibility: hidden`; back = paper texture + `backNote` (Caveat) + tiny "— {you.name[0]}".
- **Mobile:** swipeable centered stack — active card ~78vw, neighbors peeking ±16px at scale .94; horizontal drag with snap (`dragConstraints` + `onDragEnd` threshold 60px → advance); tap flips. Same component, layout switch at `md`.
- Header annotation (Caveat): "go on, move them around →" (desktop) / "swipe · tap to flip" (mobile).
- **Accept:** desktop drag never triggers flip; mobile swipe advances and tap flips; z-order rises on touch.

### S5 — The Reasons Deck ★
Header: "**{turningAge} reasons you're my favorite person** — one for every year of you." Deck = top card + 2 offset shadow cards (y 6/12px, rotate ∓2°). Tap deck → top card springs (`SPRING.card`) to a resting spot beside (desktop: right; mobile: below, previous card fades under) showing badge "Reason #N" (Inter, cherry pill) + text (Caveat 22px). Counter "N / {turningAge}" (Inter 12px). **Final card:** `--cherry` bg, `--gold` 2px border, cream text, slow 3s shimmer sweep, +8% size → on reveal `pop()`. "start over" text link after last card. Binding: `content.reasons` (assume length == turningAge; warn handled in App). **Accept:** all draws smooth on mobile at 60fps-ish; final card unmistakably special; counter exact.

### S6 — Open When… (couples-only; replaces any group-message concept)
Header "**open when…**" (Playfair) + Caveat subline: "little letters for later. these don't expire — come back whenever you need one." Grid of `MiniEnvelope`s: 2-col mobile / 3–4-col desktop, gap 20px, each seeded-rotated with plain wax dot + Caveat label + optional emoji. Tap → wax dot breaks (scale 1→1.2→0, 200ms) → card expands via `layoutId` (`SPRING.card`) into a paper note: `note` text (Caveat 20px) + "— {you.name[0]}". Close: ✕ (44px) or tap scrim. **One open at a time**; opened ones show a subtle broken-seal state for the session (no persistence — envelopes re-seal on reload by design; they're reusable). Do NOT use the initial-embossed seal here — reserved for S8. **Accept:** open/close clean on mobile; layout holds with 4 and with 8 items.

### S7 — The Cake ★ signature moment
- **Setup:** bg snaps to `--night` + radial vignette; `audio.duck()`. Two-tier CSS/SVG cake; candles = `turningAge`, rows of ≤9; flame = 8×12px gradient teardrop, `flicker 0.6s infinite alternate` with random delay. CTA (Inter): "**blow out your candles** — yes, really. use your breath 🎂".
- **`useMicBlow` reference (`lib/useMicBlow.ts`):**

```ts
// returns { start, status } — status: 'idle'|'listening'|'denied'|'unsupported'|'done'
// start():
//   if (!navigator.mediaDevices?.getUserMedia) → 'unsupported'
//   getUserMedia({audio:true}) → AudioContext → createMediaStreamSource → AnalyserNode(fftSize 512)
//   rAF loop: analyser.getByteTimeDomainData(buf)
//     rms = Math.sqrt(mean(((v-128)/128)**2))
//     rms > 0.09 ? (since ??= now, now-since >= 400 && trigger()) : since = null
//   trigger(): cancel rAF, stop all tracks, close context, status='done', onBlow()
```

- **Fallbacks (must all work):** `denied` / `unsupported` / desktop (no touch + fine pointer) / 6s listening without trigger → show button "tap-tap-tap to blow 💨" (3 taps = blow). The moment can never dead-end.
- **Extinguish timeline:** flames out left→right (`DUR.flameStagger` each) with 300ms smoke wisps → bg dips near-black 0.4s → "**make a wish, my love.**" (Playfair, cream) alone for `DUR.wishHold` → `mega()` + `audio.restore()` with brief volume swell to 0.7 then settle 0.55.
- **Accept:** real-phone blow works; denying mic shows tap fallback within 1s; desktop shows tap fallback immediately; wish beat feels unhurried.

### S8 — The Letter ★ — THE envelope of the site
- **Transition in:** back to paper; Caveat line: "one more thing. this one's sealed."
- **Envelope:** centered, ~86vw mobile / 480px desktop, seeded rotation, addressed "For {her.name}" (Caveat), **big cherry wax seal embossed with her initial** (Playfair letter inside the blob SVG). Prompt: "tap to break the seal".
- **Timeline on tap:** t0–0.3s seal cracks: scale 1→1.15→0.9 + rotate 12° + split-fade (`DUR.sealCrack`) · t0.3–0.8s flap `rotateX` 0→−170° (`DUR.flapOpen`, origin top) · t0.8–1.4s letter sheet rises out (y −40%) and expands to full-viewport paper (deeper cream, faint ruled lines at 28px) (`DUR.sheetRise`, `SPRING.gentle`) while envelope fades · t1.8s typewriter starts.
- **`useTypewriter` reference (`lib/useTypewriter.ts`):**

```ts
// (paragraphs: string[]) → { rendered: string[], done: boolean, skip: () => void }
// setTimeout chain per char: delay = 22 + Math.random()*10 (ms)
// after . , — ; : add 260ms pause; between paragraphs add 500ms
// skip(): clear pending timer, rendered = full text, done = true
// if reducedMotion → immediately done with full text
```

- Blinking block cursor (2px×1.1em, 1s steps). "skip →" quiet button top-right. If `letter.voiceSrc`: pill above letter "▶ press play to hear me read it" → `AudioNote` (ducks music; restores on end/pause; one instance). Sign-off: `you.signOff` + `you.name` in Caveat, rotated −2°, extra top margin — like a real signature. Music continues underneath (no restart — playing since S2).
- **Accept:** seal→sheet sequence smooth on mobile; typewriter cadence natural; skip instant; reduced-motion renders complete letter immediately.

### S9 — Finale ★
Calm paper. **Count-up** via `useCountUp(us.startedISO)`:

```ts
// (iso, tickMs=1000) → { days, hours, minutes, seconds }
// diff = Date.now() - Date.parse(iso)
// days = floor(diff/86_400_000); hours = floor(diff/3_600_000)%24
// minutes = floor(diff/60_000)%60; seconds = floor(diff/1000)%60
// setInterval(tickMs), cleanup on unmount
```

Render: `us.counterLabel` (Caveat) above "**{days} days, {hours} hours, {minutes} minutes**" (Playfair, tabular; seconds shown ≥768px only), subline "…and counting. forever to go." Then "someday soon:" (Caveat) + `us.cantWaitFor` as handwritten list with small empty checkbox squares (unchecked on purpose — they're ahead of you). If `giftClue`: small sealed tag "one more thing… 🎁" → flip (`rotateY`) reveals the riddle. **Final button "one last thing"** (cherry, 48px tall) → full-screen takeover: `finale.line1` + `finale.line2` (Playfair) stagger in, slow heart-rain + light `mega()`. Footer (Inter 12px): "made with too much love and a questionable amount of code — {you.name}, Aug 2026". **Accept:** counter correct vs manual math and ticking; takeover reachable and dismiss-free (it's the end); no wedding-date references anywhere.

---

## 8. Performance, Privacy, Accessibility — Hard Requirements

- Photos: **WebP only, ≤1600px, target ≤200KB each**; `loading="lazy"` below S2; hero assets preloaded; explicit aspect-ratio boxes (zero CLS).
- Audio: MP3 ~128kbps (song), mono ~96kbps (voice); `preload="metadata"`.
- `<meta name="robots" content="noindex, nofollow">`; stealth link preview (§10.4) — a WhatsApp preview must not spoil the surprise.
- Lighthouse mobile ≥ 85 performance. `font-display: swap`. No console errors.
- Reduced-motion per §5.4; tap targets ≥44px; contrast ≥4.5:1 (verify Caveat ≥18px on cream).

---

## 9. Ops — Deployment & Go-Live

1. Push → Vercel import → deploy (zero config). Project name unguessable (e.g. `paper-hearts-0806`). Optional: attach `{hername}.love`.
2. Verify `?preview=1` on the production URL.
3. **Aug 4:** run §11 QA on a real phone matching hers. No new features after this.
4. **Aug 5, ~11:55 PM IST:** send her the clean URL — "open this when the clock hits 12."
5. **Aug 6, 12:00 AM:** it unlocks itself.

### 10.4 `index.html` head (exact)

```html
<title>for you 🤍</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<meta property="og:title" content="something for you 🤍" />
<meta property="og:description" content="open me" />
<meta name="theme-color" content="#FAF3E7" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Caveat:wght@400;600&family=Courier+Prime&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```

---

## 11. QA Checklist (Aug 4)

- [ ] Real phone matching hers (iOS Safari and/or Android Chrome)
- [ ] Ribbon tap starts music; toggle mutes; music survives full scroll
- [ ] Lock: `birthdayISO` set 2 min ahead → live countdown → auto-unlock into gift → restore real date
- [ ] `?preview=1` works on production
- [ ] Polaroids: desktop drag (no accidental flips) · mobile swipe + flip
- [ ] Deck: exactly `turningAge` cards, counter exact, final card special + pop
- [ ] Open When: one at a time, open/close clean, broken-seal state
- [ ] Cake: mic path on phone · deny mic → tap fallback · desktop → tap fallback · wish beat timing
- [ ] Letter: seal sequence, typewriter, skip, voice ducking, reduced-motion instant
- [ ] Finale: count-up correct & ticking; takeover; footer
- [ ] Reduced-motion sweep: everything readable, nothing broken
- [ ] Slow 3G throttle: loader covers, no broken images, no CLS
- [ ] WhatsApp preview shows stealth og, no spoiler
- [ ] TabTitle, nickname heart-rain, teddy ×7 fire (after gift opened only)
- [ ] `100dvh` everywhere — no iOS toolbar jump

---

## 12. Sequenced Codex Prompts (run in order; commit after each)

**P1 — Scaffold + theme.**
"Read SPEC.md fully, especially §0. Scaffold per §2–§3. Implement `src/content.ts` exactly per §4 including the placeholder examples. Implement `styles/tokens.css` (§5.1, grain per §5.3), `index.html` head exactly per §10.4, Tailwind config extending colors/fonts from tokens, `lib/motion.ts` exactly per §5.5, `lib/seededRandom.ts` per §5.3, `effects/Grain.tsx`, and `components/Section.tsx` per §5.4 with the reduced-motion collapse. Render a themed page with grain + one demo Section. **Accept:** cream page, fonts loaded, demo section settles in; no console errors."

**P2 — Audio + confetti + S2 Gift Box.**
"Implement `lib/audio.ts` (§6.1), `lib/confetti.ts` (§6.4), `MusicToggle`, `AppCtx` with `giftOpened`. Build S2 exactly per §7.S2 with the full timeline and constants from `motion.ts`. **Accept:** ~1.8s sequence, music fades in on the tap, toggle appears after opening, flawless at 375px."

**P3 — S0 Loading + S1 Midnight Lock.**
"Build S0 and S1 per §7 and §6.2 including `?preview=1`. Wire App.tsx: S0 → (S1 if locked) → S2 + stubs S3–S9, plus the reasons-length console warning (§4). **Accept:** birthdayISO 1 min ahead → countdown → auto-unlock into gift; preview param skips."

**P4 — S3 Story of Her.**
"Build `components/Polaroid.tsx` (frame/tape/rotation per §5.3, flip optional-off here) and S3 per §7.S3 incl. both artifact kinds, desktop thread + parallax, mobile single column, teddy sticker placeholder. **Accept:** 5 placeholder chapters at 375px and 1440px."

**P5 — S4 Polaroid Wall.**
"Extend `Polaroid` with flip. Build S4 per §7.S4: desktop scatter board with drag + 8px tap-threshold flip; mobile snap stack + flip; gingham bg. **Accept:** no flip on drags; mobile swipe advances; z-order correct."

**P6 — S5 Reasons Deck.**
"Build S5 per §7.S5 with `SPRING.card`, counter, special final card + `pop()`, start-over. **Accept:** smooth draws on mobile; final card special; counter exact."

**P7 — S6 Open When.**
"Build `components/MiniEnvelope.tsx` (§5.3 envelope language, plain wax dot) and S6 per §7.S6 with `layoutId` expansion, one-at-a-time, session broken-seal state. **Accept:** clean open/close on mobile; grid holds at 4 and 8 items."

**P8 — S7 Cake.**
"Implement `lib/useMicBlow.ts` exactly per the §7.S7 reference. Build the cake scene with candle count = turningAge, all four fallback paths, extinguish wave, wish beat, `mega()`, duck/restore/swell. **Accept:** blow triggers with mic granted; denial → tap fallback ≤1s; desktop → tap fallback immediately."

**P9 — S8 Letter + S9 Finale.**
"Implement `lib/useTypewriter.ts` and `lib/useCountUp.ts` per the §7 references and `components/AudioNote.tsx` (ducking per §6.1). Build S8 per §7.S8 (initial-embossed seal, full timeline, skip, optional voice pill, signature) and S9 per §7.S9 (count-up, cantWaitFor checklist, optional gift tag, final takeover, footer). **Accept:** seal→typewriter smooth on mobile; voice ducks/restores; counter ticks correctly; zero wedding-date references."

**P10 — Easter eggs + hardening.**
"Implement §6.3 (TabTitle, nickname buffer + HeartRain, teddy ×7 modal, HeartCursor fine-pointer only, mobile tap-hearts in S2/S9), all gated on `giftOpened`. Then a full §8 pass: lazy/aspect images, preloads, head verification, reduced-motion audit, kill console errors. **Accept:** Lighthouse mobile ≥85; every §11 item passes in dev."

---

## Appendix A — Photo Prep (owner's machine, one-time)

```bash
npm i -D sharp && node scripts/compress.mjs
```

```js
// scripts/compress.mjs
import sharp from "sharp"; import { readdirSync, mkdirSync } from "fs";
mkdirSync("public/photos", { recursive: true });
for (const f of readdirSync("raw")) {
  await sharp(`raw/${f}`).rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`public/photos/${f.replace(/\.[^.]+$/, "")}.webp`);
  console.log("done:", f);
}
```

## Appendix B — "Open When…" Starter Labels (pick 5–8; write notes yourself, specific to her)

open when you miss me · open when you're sad · open when you can't sleep · open when you're mad at me 😬 · open when you need a laugh · open when you're doubting yourself · open when you've had a long day · open on your next birthday (a promise this site gets a sequel)

## Appendix C — Cut Lines (if Aug 3 evening looks bad)

Cut in order: gift clue → Open When to 4 envelopes → parallax → HeartCursor/heart-rain (keep TabTitle). **Never cut:** Gift Box, Polaroid Wall, Deck, Open When entirely, Cake, Letter, Finale.

---

*Ship it. Make her cry — the good kind.*
