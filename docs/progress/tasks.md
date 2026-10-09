# Szülinapi küldetés – Work backlog

Driven by `/work`. Tasks run top to bottom. One task = one implementer run = one commit (`Refs: Txx`). Slices are big on purpose (deadline: final build deployed Sat 10 Oct 08:00).

Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (see `log.md`)
Fields: **Type** (infra | state | content | ui | validate | docs) · **UI** = run `ui-validator` after gates pass.

Spec: `implementation-plan.md` (phase numbers below refer to its "Build phases" table). Visual contract: plan "Design theme" + `docs/design/tokens.md` (no mockups).

Tiers: **M1 = tier 1** (complete app, Milestone A), **M2 = tier 2**, **M3 = tier 3**. Ship whole tiers only.

---

## M1 · Tier 1: the day works (Milestone A)

- [x] **T01** · infra · Scaffold, theme, fonts, PWA (phase 1)
  - Vite + React 19 + TS strict (+ `noUncheckedIndexedAccess`), Tailwind v4 (`@tailwindcss/vite`), ESLint flat + Prettier, Vitest + Testing Library + jsdom + fake-indexeddb. Scripts: `dev`, `build` (`tsc --noEmit && vite build`), `preview`, `test`, `test:watch`, `typecheck`, `lint`, `format`. Port 5173 strict. Copy config style from `../pilates-workout` (vite.config.ts, tsconfig.json, eslint.config.js) — no router, no dexie.
  - `src/index.css`: `@theme` exactly from plan/tokens.md, base styles (`100dvh`, `overscroll-behavior: none`, `touch-action: manipulation` on buttons, paper grain via inline SVG noise ~4%). Self-host Cormorant Garamond 600 (+italic), Nunito Sans 400/700, Caveat 500 (latin + latin-ext) via `@fontsource`. Folder skeleton from plan.
  - `vite-plugin-pwa` (`generateSW`, `registerType: 'autoUpdate'`), manifest name/short_name "Küldetés", `display: standalone`, `orientation: portrait`, theme/background `#fbf5ec`, icons from a wax-seal SVG in `public/` (192, 512, maskable, 180 apple-touch-icon via `@vite-pwa/assets-generator`; no place/food/activity in the icon). Precache fonts. `index.html`: `lang="hu"`, `viewport-fit=cover`, `apple-mobile-web-app-capable`, title "Küldetés", `<meta name="robots" content="noindex">`, no description/OG tags.
  - Placeholder themed screen showing all three fonts with ő ű Ő Ű. `docs/deploy.md`: Cloudflare Pages (build `npm run build`, output `dist`), iPhone install, note: ship final build before installing.
  - Done when: gates pass; `npm run build` emits manifest + sw; validator on `npm run preview` confirms manifest, SW, fonts render ő/ű, palette.
  - Commit: `build(infra): scaffold vite react ts tailwind pwa project`

- [x] **T02** · state · Content, store, clock, unlock logic (phase 2)
  - `src/content/stages.ts`: typed; all seven stages (id, title, `unlockAt` ISO `+02:00`, `message` placeholder `TODO: Dávid`, reveal), prep questions + reveals + packing list + teaser, drive hint offsets and texts, drive tile lists, siófok photo tasks + trivia, lunch wheel segments / chopstick prompt, kart prompts, finale closing line, admin PIN placeholder (`0000`, flag HUMAN REVIEW). Copy Hungarian strings from the plan exactly.
  - `src/state/store.ts`: zustand + `persist` key `kuldetes-v1`, `AppState` exactly as in plan (`v: 1`) plus actions (view navigation in the store, open/stamp/skip stage, forced unlock, shift, simulatedNow, reset). `src/hooks/useNow.ts`: 15 s tick + `visibilitychange`, returns simulated time when set.
  - `src/state/unlock.ts` pure + Vitest: effective time with shift (only for not-yet-open stages), forced unlock, open check, next-locked stage, hint offsets (`drive1` +20/+45/+70, `drive2` 0/+15/+30) moving with shift, simulated clock, countdown label ("2 óra 14 perc múlva nyílik"), welcome state before `prep`.
  - Done when: gates pass; tests cover time unlock, shift, forced unlock, simulated clock, hint offsets, countdown label.
  - Commit: `feat(state): add stage content, store, clock and unlock logic`

- [x] **T03** · ui · UI kit and shell (phases 3 + 4) · UI
  - `src/components/ui/`: `EnvelopeCard` (locked/open), `WaxSeal`, `Stamp` (perforated mask, per-stage line icon, rotation), `Button` (primary/secondary), `Countdown`, `Polaroid` (static look; photo wiring later), `StageScreen` frame (back chevron, message block in `font-hand` on `paper-deep` with gold left rule, "Kész" earns the stamp, "Kihagyom" leaves without one). Layout wrapper `max-w-md mx-auto px-5 min-h-dvh` + safe-area.
  - Screens: `Welcome` (one countdown, nothing else, before `prep` opens), `InstallGate` (only install instructions when not standalone; off in DEV), `Timeline` (seven envelopes, locked = seal + "?" only, next card shows countdown, open = title + stamp slot), `StageScreen` routing by store view. `src/stages/*` stubs: every stage opens to its reveal, Dávid's message and a "Kész"/"Kihagyom" pair.
  - Locked cards render no stage title anywhere (also not `aria-label`).
  - Done when: gates pass; seven envelopes render; each stage can be stamped; state survives reload; validator checks spoiler hygiene at several simulated times.
  - Commit: `feat(ui): add ui kit, welcome, install gate and timeline`

- [x] **T04** · ui · Admin panel and preview mode (phase 5) · UI
  - Wax seal in the header: 5 taps within 3 s → PIN pad (4 digits, from `content/stages.ts`); DEV opens without PIN. Actions: Következő megnyitása (adds next locked stage to `forcedUnlocked`, exactly one), −15 / +15 perc (shows current shift and resulting times), Előnézet (date-time picker → `simulatedNow`, fixed "ELŐNÉZET" banner on every screen while active), Valós idő, Minden törlése (confirmation; clears store and photos via idb-keyval).
  - Done when: gates pass; simulating any time opens the right stages; banner shows; +15 moves countdowns together.
  - Commit: `feat(admin): add pin-protected admin panel and preview mode`

- [x] **T05** · ui · Prep quiz and packing list (phase 6) · UI
  - `prep` stage: six single-choice questions, one per screen, any answer advances and shows its reveal line, nothing scored; end screen "Csomaglista" + teaser; list stays readable from the timeline afterwards. Selected tile `bg-blush` + wine border + heart. Answers persisted in `prep`.
  - Done when: gates pass; six questions, reveals, list, stamp; state survives restart.
  - Commit: `feat(prep): add prep quiz and packing list`

## M2 · Tier 2: the challenges

- [x] **T06** · ui · Drive hints, trivia, kart (phases 7 + 8) · UI
  - `HintGuess` shared component for `drive1` ("Hová megyünk?", six tiles) and `drive2` ("Mi lesz az utolsó állomás?", six tiles): hints open at offsets from the stage's effective time (move with shift), one guess per hint, wrong → "Nem talált. Várd meg a következő nyomot.", correct → reveal + `solvedAtHint`. If never solved, answer shows when the next stage (`siofok` / `kart`) opens. City not named in `drive2` until `kart` opens.
  - `Trivia` for `siofok` (two questions; wrong answer shows the right one; stored in `trivia`). Photo cards render as plain placeholders until M3.
  - `kart`: Tippek (lap seconds, winner Én/Dávid; "Rajt" locks both), Eredmény (both best laps, podium with winner, predicted vs real lap, petal confetti may be stubbed until M3). Pure helpers for result/podium in `src/lib/` with tests.
  - Done when: gates pass; hints open on offsets; one guess per hint; reveal on success; wrong trivia shows right answer; predictions lock on "Rajt".
  - Commit: `feat(drive): add hint guess, trivia and kart predictions`

- [x] **T07** · ui · Lunch wheel and finale (phases 9 + 10) · UI
  - `Wheel` SVG (six segments from content, two spins max, result saved in `lunch.spins`). Chopstick timer and ratings sections render as "later" stubs or hidden until M3.
  - `finale`: Bélyegek (stamp sheet), A nap számokban (hint that solved each guess, trivia score, chopsticks, "A nap falatja", both lap times — skipped values left out; pure `finaleStats()` + tests), letter (Dávid's text placeholder in `font-hand`), closing line "Boldog szülinapi hétvégét!". Collage section absent until M3.
  - Done when: gates pass; wheel ≤ 2 spins and result persists; finale letter opens; skipped values omitted.
  - Commit: `feat(finale): add sushi wheel, finale letter and day stats`

## M3 · Tier 3: photos and polish

- [x] **T08** · ui · PhotoTask, polaroids, collage and share (phase 11) · UI
  - `src/lib/photos.ts`: `<input type="file" accept="image/*" capture>` (`environment`, `user` on selfie tasks), downscale to 1600 px long edge, JPEG 0.82, store Blob in IndexedDB (`idb-keyval`) by task id, retake overwrites, `photos` in store. `PhotoTask` + `Polaroid` wired into `siofok` (4 tasks) and `kart` ("Sisakos közös kép").
  - `src/lib/collage.ts`: canvas collage of polaroids under the date; "Mentés és megosztás" → `navigator.share` with file, fallback download link. Added to finale.
  - Tests for downscale math and collage layout (pure parts).
  - Done when: gates pass; photo appears as polaroid; persists after reload; collage generated (share/camera need a real phone: log as manual check).
  - Commit: `feat(siofok): add photo tasks, polaroids and finale collage`

- [x] **T09** · ui · Chopsticks, ratings, unlock animation, confetti, reduced motion (phase 12) · UI
  - Lunch: chopstick 30 s timer (timestamp-based) + number input; ratings (name + 1–5 hearts, top-rated → "A nap falatja" in finale).
  - Motion: unlock animation (seal cracks, flap lifts ~600 ms, once per stage via `opened`), stamp press animation, `canvas-confetti` petals (rose, blush, gold) on stamp and podium. Everything `motion-safe:`; verify nothing animates with `prefers-reduced-motion`.
  - Done when: gates pass; validator confirms animations play once and are off under reduced motion.
  - Commit: `feat(lunch): add chopstick timer, ratings, motion and confetti`

- [x] **T10** · validate · Full-day dress rehearsal and docs · UI
  - ui-validator walks the whole day in preview mode: every stage opened and completed, locked cards leak no titles at any simulated time, +15 perc moves countdowns and hints together, Következő megnyitása opens exactly one, offline reload (`npm run preview`), Safari-mode shows only install gate. Implementer fixes findings.
  - Update `docs/deploy.md` with the plan's test checklist (iPhone items as manual) and the "on her phone" checklist.
  - Commit: `docs: add rehearsal results and test checklist`

---

## Manual checks on the iPhone

- **After M1 (Milestone A, Friday night):** install from the Pages URL, walk the whole day in preview mode, airplane-mode reload works, ő/ű render, Safari tab shows only install instructions.
- **After M2:** hints open on offsets, kart predictions lock, wheel max 2 spins, finale stats skip missing values.
- **After M3:** camera opens from the installed app, photo shows as polaroid, collage reaches Photos via share sheet, force-quit keeps answers/stamps/photos.
- **Before showing her (Milestone B, Sat by 08:00):** preview off, shift 0, no test data, only `prep` open.
