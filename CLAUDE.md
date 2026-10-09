# Szülinapi küldetés – birthday trip PWA

Hungarian-language iPhone PWA for one user (a birthday trip on Sat 10 Oct 2026). Seven time-locked stages on one timeline, each a sealed envelope that opens at its time, shows a message from Dávid, one small challenge, and earns a stamp. Hidden admin panel for Dávid. All data on device. No backend, no auth.

- Architecture & product spec: `implementation-plan.md` (source of truth for behaviour, copy, theme, state shape). All Hungarian copy in it is final: copy it exactly.
- **No design mockups.** Visual source of truth = the "Design theme" section of `implementation-plan.md` and `docs/design/tokens.md`. Never invent colours or fonts.
- Work backlog & progress: `docs/progress/tasks.md`, handoff notes: `docs/progress/log.md`. Run `/work` to continue.
- **Hard deadline:** final build deployed by Sat 10 Oct 08:00. Ship whole tiers only (see plan "Build phases"). Tier 1 = M1, tier 2 = M2, tier 3 = M3.

## Stack & commands

Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 (`@theme`, no tailwind.config) + zustand (`persist`) + idb-keyval + vite-plugin-pwa (`generateSW`, `registerType: 'autoUpdate'`) + canvas-confetti + Vitest + Testing Library + ESLint + Prettier. Fonts self-hosted via `@fontsource` (latin + latin-ext: Cormorant Garamond, Nunito Sans, Caveat). **No router**: current view lives in the store.

```
npm run dev        # vite dev server (validation uses port 5173, --strictPort)
npm test           # vitest run
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build to dist/
```

## Definition of done

A task is done only when `npm run typecheck`, `npm run lint`, `npm test` and `npm run build` all pass. Never mark a task done otherwise. UI tasks additionally pass the `ui-validator` check in Chrome.

## Architecture rules

- `src/state/unlock.ts` is pure TypeScript: no React, no zustand, no browser APIs, no `Date.now()` / `new Date()` without an argument (time is passed in). Every function there gets unit tests in `tests/`. Other pure logic (kart results, trivia scoring, wheel result, finale stats) goes in `src/lib/` or `src/state/` as pure functions with tests too.
- Browser APIs (camera input, canvas, share, IndexedDB, confetti, `navigator.standalone`) only in `src/lib/` and the components that need them.
- All user-facing text, times, options, answers and the admin PIN live in `src/content/stages.ts`. Components never hard-code copy except tiny UI chrome (button labels like "Kész", "Kihagyom").
- Stage unlock times are ISO strings with `+02:00`. Effective time = `unlockAt` + `shiftMinutes` (only for stages not yet open). Open = `now >= effective` or forced. Hints are offsets from the stage's effective time.
- `useNow()` is the only clock for UI; it honours `simulatedNow` (preview mode).
- Locked cards render no stage title anywhere, not even `aria-label`. No spoilers in title, manifest, icon, welcome screen.
- Nothing can block her: every challenge skippable, no fail states, a stage never depends on another being finished.
- Persist under localStorage key `kuldetes-v1`; photo blobs in IndexedDB keyed by task id.
- Under `import.meta.env.DEV` the install gate is off and the admin opens without PIN.
- Small files, one job each. Follow the project structure in `implementation-plan.md`.

## Dependencies

Allowed without asking: react, react-dom, zustand, idb-keyval, canvas-confetti, @types/canvas-confetti, vite-plugin-pwa, @vite-pwa/assets-generator, tailwindcss, @tailwindcss/vite, @fontsource/cormorant-garamond, @fontsource/nunito-sans, @fontsource/caveat, vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, fake-indexeddb, eslint (+ @eslint/js, typescript-eslint, react-hooks, react-refresh plugins), prettier, typescript, @types/*. Anything else: do not add: report it as a blocker.

## UI rules

- UI text is Hungarian. Voice: informal "te", warm, short, at most one exclamation mark per screen.
- Colours/fonts/radii/shadows only from the Tailwind `@theme` block (see `docs/design/tokens.md`). Rose and gold decorative only; text is ink or wine. No pure white or black. Light mode only.
- Mobile-first, 390–393 px, single column `max-w-md mx-auto px-5 min-h-dvh`. `100dvh` not `100vh`, `overscroll-behavior: none`, `env(safe-area-inset-*)` padding top and bottom, `viewport-fit=cover`.
- Inputs ≥ 16px font; numeric inputs `inputmode="decimal"`. `touch-action: manipulation` on buttons. Tap targets ≥ 44px (primary buttons ≥ 48px).
- Motion wrapped in `motion-safe:`; nothing animates under `prefers-reduced-motion`.
- No UI component library. Shared primitives in `src/components/ui/`.

## Git conventions

- Conventional Commits: `type(scope): imperative summary` (≤ 72 chars). Types: feat, fix, test, refactor, chore, docs, build, ci, style, perf. Scopes: `infra`, `ui`, `state`, `content`, `pwa`, `admin`, plus a stage name (`prep`, `drive`, `siofok`, `lunch`, `kart`, `finale`).
- One commit per backlog task, with footer `Refs: Txx`. Body explains what and why in 1–5 lines.
- Only the orchestrator (`/work`) commits. Subagents never commit, never push, never rewrite history.
- Never commit `.vscode/`, `node_modules/`, `dist/`, `.validation/`.
