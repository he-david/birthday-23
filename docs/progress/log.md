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

## 2026-10-09 · T04 · Admin panel and preview mode · done
- SealTrigger (5 taps/3 s), PinPad, Admin screen, PreviewBanner, helpers in `src/lib/{tapCounter,pin,clock,photos}.ts`. Validator: pass.
- `clearAllPhotos` clears default idb-keyval store: T08 must use same store or update it.
- Admin copy written by implementer (ADMIN block in stages.ts): review.
- Minor: after "Minden törlése" app shows Welcome (correct when nothing open); admin lists locked titles (Dávid-only).

## 2026-10-09 · T05 · Prep quiz and packing list · done
- `stages/Prep.tsx`, reusable `OptionTile`, pure `lib/prep.ts`. Validator: pass. Step derived from persisted answers; reload mid-reveal skips that reveal.
- follow-ups (minor): selected-tile style (blush/wine/heart) never visible because reveal replaces tiles at once; Kész/Kihagyom shown during quiz (nothing blocks her, kept).
- HUMAN REVIEW: kart-rule clothing lines in prep reveals still unverified.
- M1 complete.

## 2026-10-09 · T06 · Drive hints, trivia, kart · done
- `HintGuess`, `Trivia`, `KartTips`/`KartResult`, pure `lib/{hints,kart,trivia}.ts`. New `kart.locked` flag persists "Rajt". Validator: pass.
- Guess rule `tries.length < openHints`; `solvedAtHint` = hints open at correct guess.
- HUMAN REVIEW: implementer-written copy (DRIVE_UI, TRIVIA_UI, extra KART strings, "Hamarosan itt a fotózás."); Víztorony facts (1912, Víztartály).
- follow-ups (minor): drive1 shows two near-duplicate "wait" lines after wrong guess; stale "Nem talált" stays when next hint opens; kart result has redundant "Eredmény"/"Dobogó" headings; petal confetti stub until T09.

## 2026-10-09 · T07 · Lunch wheel and finale · done
- `Wheel` (spin saved on tap, ≤2), `DayStats`, pure `lib/{wheel,finale}.ts`, Finale stamps/stats/letter/closing. Fixed T06 minors (single wait line, stale line cleared). Validator: pass. M2 complete.
- HUMAN REVIEW: implementer copy ("Pörgess", "A rulett szerint", empty-state lines, stat labels, "Levél"); finale shows stage message and letter separately, both `TODO: Dávid`: check reads well with real text; finale 17:30 assumed.
- follow-ups (minor): wheel labels ~11px and upside-down in lower half; reduced-motion not browser-verified (manual check / T09).
