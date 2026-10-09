# Szülinapi küldetés – Work log

Append-only handoff notes written by `/work` after each task (newest at the bottom). Keep entries short.

Format:

```
## YYYY-MM-DD · Txx · <title> · done | blocked
- what changed / decisions
- HUMAN REVIEW: … (if any)
- follow-ups: …
```

---

## 2026-10-09 · T00 · Orchestration setup · done
- Ported the Tónus (`../pilates-workout`) setup: CLAUDE.md, `/work` skill, `implementer` + `ui-validator` agents (Sonnet 5.5), `.claude/settings.json`, `.mcp.json` (chrome-devtools), Prettier/gitignore.
- No design mockups: visual contract = plan "Design theme" + `docs/design/tokens.md`. Backlog in 10 bigger tasks across 3 milestones = the plan's 3 tiers.
- HUMAN REVIEW (open from plan): Dávid's stage messages + finale letter, admin PIN, kart-rule wording in prep quiz, Víztorony facts/opening, finale time 17:30.

## 2026-10-09 · T01 · Scaffold, theme, fonts, PWA · done
- Vite 8 + React 19 + TS strict + Tailwind v4 + PWA (generateSW, autoUpdate); manifest + sw emitted, 39 precache entries incl. fonts. Icons from `public/seal.svg` via `npm run generate-pwa-assets`.
- JSX via `oxc` automatic runtime; `@vitejs/plugin-react` not added (not allowed).
- Task not flagged UI: validator not run. Follow-up: confirm ő/ű font rendering in Chrome during T03 validation.

## 2026-10-09 · T02 · Content, store, clock, unlock logic · done
- Content, zustand store (`kuldetes-v1`, view not persisted), pure `unlock.ts`, `useNow`; 24 unlock tests.
- Decision: stages in `opened`/`forcedUnlocked` keep base time. Admin must call store `shiftBy(delta, nowMs)` (it first marks open stages as opened), not set shiftMinutes directly. Side effect: those skip unlock animation.
- Forced stage keeps scheduled time for hint anchoring.
- HUMAN REVIEW: admin PIN `0000`; all stage messages + finale letter `TODO: Dávid`; finale time 17:30 assumed; kart-rule clothing reveal lines (shoe/trouser/hair); Víztorony trivia facts (1912, Víztartály); WELCOME copy ("Szülinapi küldetés" / "Az első boríték") is implementer wording, not from plan.

## 2026-10-09 · T03 · UI kit and shell · done
- UI kit, Welcome/InstallGate/Timeline/StageScreen, stage stubs (`src/stages/*`), `StageFrame` owns title/message/Kész/Kihagyom. Validator: pass, spoiler hygiene clean.
- tests/setup.ts shims localStorage (Node 25 breaks jsdom's).
- HUMAN REVIEW: implementer-written copy "Szülinapi küldetés", "Az első boríték", locked-card label "Lezárt boríték" (visible on locked cards).
- follow-ups (minor): confirm safe-area padding includes env(); unlock animation + confetti in T09; admin view falls back to timeline until T04.
