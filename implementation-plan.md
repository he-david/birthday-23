# Szülinapi küldetés — implementation plan

Oct 9, 2026 · @Heda

## Overview

"Szülinapi küldetés" is a Hungarian-language iPhone PWA that reveals her birthday trip on Saturday, 10 October 2026, the day before her birthday, one stop at a time. Each stop is a sealed envelope that opens at its scheduled time, shows a short message from Dávid and one small challenge, and earns a stamp.

**Deadline:** the trip leaves on Saturday, 10 October at 10:00 and the prep quiz opens at 08:00, and Dávid shows her the app between 08:00 and 09:00, so the final build must be deployed by 08:00. That leaves one night. The build phases are split into three tiers so that a complete, working app exists even if only the first tier ships.

Four rules shape every decision below:

- **The day comes first.** Each challenge takes 2 to 5 minutes, and nothing happens on the phone during the race itself.
- **Nothing can block her.** There are no fail states; every challenge can be skipped, and a stage never depends on finishing the previous one.
- **No spoilers.** A locked stage shows a seal and a countdown, never a name or a place.
- **No backend.** Everything is static files plus on-device storage.

## Scope

The app is seven stages on one timeline screen, with a hidden admin panel for Dávid.

| In scope                                     | Out of scope                      |
| -------------------------------------------- | --------------------------------- |
| Seven time-locked stages with countdowns     | Coupons and points (dropped)      |
| Prep quiz that reveals only the packing list | Push or local notifications       |
| Two "guess the destination" hint games       | GPS-based unlocking               |
| Photo hunt and trivia in Siófok              | Backend, accounts, live sync      |
| Sushi roulette, chopstick timer, ratings     | Maps and navigation links         |
| Kart predictions, lap times, podium          | Android polish, dark mode         |
| Finale: letter, stamp sheet, photo collage   | Any language other than Hungarian |
| PIN-protected admin panel and preview mode   | Sound and haptics                 |
| Full offline support after first launch      |                                   |

## Tech stack and setup

The stack matches Tónus: a Vite React app deployed as static files on Cloudflare Pages from a private GitHub repo.

| Concern     | Choice                                                        | Note                                           |
| ----------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Build       | Vite, React, TypeScript                                       | No router; the current view lives in the store |
| Styling     | Tailwind CSS v4 with `@tailwindcss/vite`                      | CSS-first `@theme`, no `tailwind.config.js`    |
| PWA         | `vite-plugin-pwa`, `generateSW`, `registerType: 'autoUpdate'` | Precache every asset, fonts included           |
| State       | `zustand` with the `persist` middleware                       | One localStorage key                           |
| Photos      | `idb-keyval`                                                  | Blobs in IndexedDB, keyed by task id           |
| Fonts       | `@fontsource` packages, self-hosted                           | Import the `latin-ext` subsets for ő and ű     |
| Celebration | `canvas-confetti`                                             | Petal colours from the theme                   |
| Tests       | Vitest                                                        | Unlock logic only                              |
| Hosting     | Cloudflare Pages                                              | Build `npm run build`, output `dist`           |

```text
src/
  content/stages.ts        all copy, times, options, PIN (single place to edit)
  state/store.ts           zustand store + persistence
  state/unlock.ts          pure unlock functions (tested)
  hooks/useNow.ts          clock tick, honours simulated time
  lib/photos.ts            capture, downscale, IndexedDB
  lib/collage.ts           canvas collage + share
  components/ui/           EnvelopeCard, WaxSeal, Stamp, Button, Countdown, Polaroid
  components/challenges/   Quiz, HintGuess, PhotoTask, Trivia, Wheel, Timer, Ratings
  screens/                 Welcome, InstallGate, Timeline, StageScreen, Admin
  stages/                  Prep, Drive1, Siofok, Lunch, Drive2, Kart, Finale
  index.css                Tailwind import + @theme
```

## Schedule and unlock model

A stage is open when the clock passes its time or when Dávid forces it open; nothing else gates it.

| Stage id | Title once open | Unlocks on Sat 10 Oct (Europe/Budapest) | Reveals                               |
| -------- | --------------- | --------------------------------------- | ------------------------------------- |
| `prep`   | Felkészülés     | 08:00                                   | Packing list and a vague teaser       |
| `drive1` | Úton            | 10:00                                   | Nothing; hints at 10:20, 10:45, 11:10 |
| `siofok` | Séta Siófokon   | 11:30                                   | Víztorony and Rózsakert               |
| `lunch`  | Ebéd            | 13:00                                   | Sushi                                 |
| `drive2` | Újra úton       | 14:30                                   | Nothing; hints at 14:30, 14:45, 15:00 |
| `kart`   | Gokart          | 16:00                                   | Kart center, single and tandem        |
| `finale` | Levél           | 17:30 (assumed)                         | Dávid's letter and the summary        |

Rules for `state/unlock.ts`:

1. Store each `unlockAt` as an ISO string with the `+02:00` offset. The day falls before the clock change on 25 October.
2. Effective time = `unlockAt` + `shiftMinutes`. The shift applies only to stages that are not open yet.
3. A stage is open if `now >= effective` or its id is in `forcedUnlocked`.
4. Hints inside the drive stages are offsets from that stage's effective time (`drive1`: +20, +45, +70 min; `drive2`: 0, +15, +30 min), so they move with a shift.
5. `useNow()` ticks every 15 seconds and on `visibilitychange`, and returns the simulated time when preview mode is on.
6. A locked card shows a wax seal and "?" only. The next card to open also shows a countdown, for example "2 óra 14 perc múlva nyílik".
7. Before `prep` opens, the app shows a welcome screen with one countdown and nothing else.

She could open stages early by changing the phone clock. That is accepted; there is no server to check against.

## Stages

Every stage screen has the same frame: Dávid's message at the top (a `message` string in `content/stages.ts`), the challenge, then "Kész" to earn the stamp and "Kihagyom" to leave without one. All Hungarian copy below is final unless Dávid edits it.

### 1. Felkészülés (`prep`)

Six single-choice questions, one per screen. Any answer advances and shows the reveal line; nothing is scored.

| Question                               | Options                                            | Reveal after answering                                            |
| -------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Milyen cipőben indulnál neki a napnak? | Magassarkú · Sportcipő · Balerina · Mezítláb       | Ma zárt, lapos cipő kell. Bízz bennem.                            |
| Szoknya vagy nadrág?                   | Szoknya · Nadrág · Ruha                            | Ma a nadrág nyer. Legyen kényelmes, amiben mozogni is tudsz.      |
| A hajad ma...                          | Kiengedve · Copfban · Kontyban                     | Mindegyik gyönyörű, de egy hajgumit mindenképp tegyél a táskádba. |
| Mennyire vagy fázós?                   | Nagyon · Kicsit · Csak ha fúj a szél               | Öltözz rétegesen, és hozz kabátot: lesz, ahol fúj a szél.         |
| Mekkora étvággyal indulsz?             | Farkaséhesen · Közepesen · Csak csipegetek         | Az ebédről gondoskodtam. Reggelire elég valami könnyű.            |
| Mikorra leszel kész?                   | Már kész vagyok · Fél óra múlva · Még álmos vagyok | 10:00-kor indulunk. A többit bízd rám.                            |

The end screen is titled "Csomaglista" and lists: zárt, lapos cipő; kényelmes nadrág; hajgumi; réteges felső és kabát; feltöltött telefon. Below it, one teaser line: "Annyit elárulok: víz közelében leszünk." The list stays readable from the timeline afterwards.

The shoe, trouser and hair lines assume typical kart-track rules. Confirm them with the venue before shipping (see open items).

### 2. Úton (`drive1`)

A `HintGuess` game titled "Hová megyünk?". She picks from six tiles: Balatonfüred, Siófok, Tihany, Velence, Keszthely, Balatonalmádi. One guess per hint.

| Hint opens | Text                                          |
| ---------- | --------------------------------------------- |
| 10:20      | Nagy víz partjára tartunk.                    |
| 10:45      | Egy operettkirály szülővárosa.                |
| 11:10      | A főterén torony áll, amiben valaha víz volt. |

A wrong guess shows "Nem talált. Várd meg a következő nyomot." A correct guess reveals "Siófok" and records which hint solved it. If she never guesses right, the answer appears when `siofok` opens.

### 3. Séta Siófokon (`siofok`)

Four optional `PhotoTask` cards in any order, then two trivia questions.

- Tartsd a tenyereden a Víztornyot.
- Közös szelfi a kilátóból (vagy a torony előtt, ha zárva van).
- A legszebb virág, amit ma találsz.
- Dávid szobrot utánoz. Te vagy a fotós.

| Trivia question                     | Options                                           | Answer     |
| ----------------------------------- | ------------------------------------------------- | ---------- |
| Melyik évben épült a Víztorony?     | 1892 · 1912 · 1932 · 1952                         | 1912       |
| Mi volt eredetileg a kilátó helyén? | Harangok · Víztartály · Óraszerkezet · Tűzfigyelő | Víztartály |

A wrong trivia answer simply shows the right one. Trivia facts come from the town's own guides: [Siófok látnivalók](https://siofok.hu/storage/tinymce/uploads/Letolthet---kiadvanyok/LATNIVALOK_2023_HUN.pdf?u=1afFmz) and [Épületmesék](https://siofok.hu/storage/tinymce/uploads/EPULETMESEK_HUN.pdf?u=1ddz+X). The flower task is worded to work even if the rose garden has finished blooming.

### 4. Ebéd (`lunch`)

Three small parts on one screen; each is optional.

- **Sushi rulett.** A six-segment wheel, two spins at most: Valami lazacos · Amit még sosem kóstoltál · Dávid választ neked · Te választasz Dávidnak · A legfurcsább nevű tekercs · Valami csípős.
- **Pálcika-kihívás.** A 30-second countdown under the prompt "Hány falatot tudsz pálcikával Dávid tányérjára átrakni 30 másodperc alatt?", then a number input.
- **Értékelés.** She adds what she tried (free-text name, 1 to 5 hearts). The top-rated item becomes "A nap falatja" in the finale.

The wheel uses categories, not dish names, so it does not depend on the restaurant's menu.

### 5. Újra úton (`drive2`)

The same `HintGuess` component, titled "Mi lesz az utolsó állomás?". Tiles: Bowling, Gokart, Szabadulószoba, Falmászás, Korcsolya, Lézerharc.

| Hint opens | Text                       |
| ---------- | -------------------------- |
| 14:30      | Gyors lesz.                |
| 14:45      | Sisak kell hozzá.          |
| 15:00      | A végén kockás zászló int. |

The city is not named until `kart` opens.

### 6. Gokart (`kart`)

Two phases around the race, with the phone put away in between.

1. **Tippek.** "Mennyi lesz a legjobb köröd?" (seconds) and "Ki lesz a gyorsabb?" (Én · Dávid). The "Rajt" button locks both.
2. **Eredmény.** She enters both best lap times. A podium screen shows the winner, her predicted versus real lap, and petal confetti.

One `PhotoTask`: "Sisakos közös kép."

### 7. Levél (`finale`)

The closing screen, read on the way home.

- **Bélyegek.** The sheet of stamps she collected.
- **A nap számokban.** Which hint solved each guess, trivia score, chopstick count, "A nap falatja", both lap times. Any value she skipped is left out.
- **Photo collage.** A canvas image of her photos as polaroids under the date. "Mentés és megosztás" calls `navigator.share` with the file and falls back to a download link.
- Closing line: "Boldog szülinapi hétvégét!"

## Design theme

The theme is "szerelmes levél": the app looks like a bundle of love letters, with cream paper, sealed envelopes, wine-red wax and postage stamps. Every locked stage is a sealed envelope, opening one breaks the seal, and finishing one sticks a stamp on it.

### Tokens

All tokens live in `src/index.css` using Tailwind v4's `@theme`, which generates utilities such as `bg-paper`, `text-wine`, `font-display`, `rounded-card` and `shadow-card`.

```css
@import "tailwindcss";

@theme {
  --color-paper: #fbf5ec; /* app background */
  --color-paper-deep: #f3e7d8; /* cards, letter sheet */
  --color-blush: #f2d5d0; /* locked envelopes, chips */
  --color-rose: #c96f7b; /* hearts, progress, accents */
  --color-wine: #6e2435; /* wax seal, primary buttons, headings */
  --color-ink: #3b2a2f; /* body text */
  --color-gold: #b5915a; /* hairlines, stamp edges, seal highlight */

  --font-display: "Cormorant Garamond", ui-serif, Georgia, serif;
  --font-body: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
  --font-hand: "Caveat", cursive;

  --radius-card: 1.25rem;
  --shadow-card: 0 8px 24px -12px rgb(110 36 53 / 0.25);
  --shadow-seal: 0 2px 6px rgb(110 36 53 / 0.4);
}

:root {
  color-scheme: light;
}
body {
  @apply bg-paper text-ink font-body antialiased;
}
```

### Typography

| Role        | Font                                        | Use                                                                   |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------- |
| Display     | Cormorant Garamond 600, italic for emphasis | Stage titles, countdown numbers, reveals; `text-3xl` and up           |
| Body        | Nunito Sans 400 and 700                     | Questions, options, buttons; `text-base`, never below 16 px in inputs |
| Handwriting | Caveat 500                                  | Dávid's messages, polaroid captions, the letter; `text-xl` and up     |

Self-host all three through `@fontsource` and import their `latin-ext` subsets. Check that ő, ű, Ő and Ű render in each font before building screens.

### Colour rules

- Primary button: `bg-wine text-paper`, full-rounded, at least 48 px tall. Secondary: wine text with a 1 px gold border.
- Rose and gold are decorative only. They are too light for small text on paper, so text is always ink or wine.
- Selected option tile: `bg-blush` with a wine border and a small heart; unselected: `bg-paper-deep`.
- Light mode only. No pure white and no pure black anywhere.

### Components

| Component      | Look                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `EnvelopeCard` | Locked: blush envelope, closed flap drawn as an SVG triangle, wax seal with "?". Open: flap up, title in display font, stamp slot top right |
| `WaxSeal`      | Wine SVG disc with an irregular edge, a heart in the middle, gold highlight; also the app icon and the hidden admin trigger                 |
| `Stamp`        | Perforated edge (radial-gradient mask), gold frame, one simple line icon per stage, rotated between -4 and 4 degrees                        |
| `Polaroid`     | Off-white frame, slight rotation, caption in handwriting font                                                                               |
| `Countdown`    | Display-font numerals on a blush chip                                                                                                       |
| `StageScreen`  | Full screen, back chevron, message block in handwriting font on `paper-deep` with a gold left rule                                          |
| `Wheel`        | SVG wheel alternating blush and paper-deep segments, wine pointer                                                                           |

Layout is a single column: `max-w-md mx-auto px-5 min-h-dvh`, with `env(safe-area-inset-*)` padding top and bottom. The background carries a faint paper grain from an inline SVG noise filter at about 4% opacity, so no image needs the network.

### Motion and voice

- **Unlock:** on the first view of a newly open stage the seal cracks and the flap lifts, about 600 ms. It plays once per stage.
- **Stamp:** scales from 1.3 to 1 with a small rotation, like being pressed onto paper.
- **Confetti:** petals in rose, blush and gold when a stamp lands and on the podium.
- Wrap all of it in `motion-safe:` and skip it under `prefers-reduced-motion`.
- **Voice:** informal "te", warm, short sentences, at most one exclamation mark per screen.

## State and data

All progress lives in one persisted store; photos live beside it in IndexedDB.

```ts
type StageId =
  | "prep"
  | "drive1"
  | "siofok"
  | "lunch"
  | "drive2"
  | "kart"
  | "finale";

interface AppState {
  v: 1;
  shiftMinutes: number; // admin time shift
  forcedUnlocked: StageId[]; // admin overrides
  opened: StageId[]; // unlock animation already played
  stamps: Partial<Record<StageId, string>>; // ISO time earned
  prep: Record<string, string>; // questionId -> option
  guesses: Record<
    "drive1" | "drive2",
    { tries: string[]; solvedAtHint?: 1 | 2 | 3 }
  >;
  trivia: Record<string, string>; // questionId -> option
  lunch: {
    spins: string[];
    chopsticks?: number;
    ratings: { name: string; hearts: number }[];
  };
  kart: {
    predictedLap?: number;
    predictedWinner?: "her" | "david";
    herLap?: number;
    davidLap?: number;
  };
  photos: string[]; // task ids that have a photo
  simulatedNow?: string; // preview mode only
}
```

- **Persistence:** zustand `persist` under the localStorage key `kuldetes-v1`.
- **Photos:** `<input type="file" accept="image/*" capture="environment">`, with `capture="user"` on selfie tasks. Downscale to 1600 px on the long edge, encode as JPEG at 0.82, store the Blob with `idb-keyval` under the task id. Retaking a photo overwrites it.
- **Content:** every string, time, option list and the PIN sit in `content/stages.ts`, so Dávid edits text in one file.
- Photos taken through the app do not land in her camera roll, which is why the finale has the save and share button.

## Admin panel and preview mode

The admin panel is how Dávid keeps the app in step with the real day, because lunch will not end at exactly 14:30.

**Opening it:** tap the wax seal in the header five times within three seconds, then enter the four-digit PIN from `content/stages.ts`. The PIN ships in the bundle; it only needs to stop curiosity.

| Action               | Effect                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Következő megnyitása | Adds the next locked stage to `forcedUnlocked`                                                                          |
| -15 perc / +15 perc  | Changes `shiftMinutes`; the panel shows the current shift and the resulting times                                       |
| Előnézet             | Sets `simulatedNow` from a date-time picker; a fixed banner reading "ELŐNÉZET" stays on every screen while it is active |
| Valós idő            | Clears `simulatedNow`                                                                                                   |
| Minden törlése       | Clears the store and all photos after a confirmation                                                                    |

Under `npm run dev` the panel opens without the PIN and the install gate is off, so Claude Code and Dávid can walk the whole day on a laptop.

## iPhone PWA and spoiler hygiene

The app must run only as an installed Home Screen app, and nothing she can see before a stage opens may hint at the plan.

### iPhone specifics

- **Manifest:** `name` and `short_name` "Küldetés", `display: standalone`, `orientation: portrait`, theme and background colour `#fbf5ec`, icons at 192 and 512 px.
- **`index.html`:** `lang="hu"`, `viewport-fit=cover`, `apple-mobile-web-app-capable`, a 180 px `apple-touch-icon`, title "Küldetés".
- **Install gate:** when the page is not standalone (`navigator.standalone` false and no `display-mode: standalone` match), show only install instructions: "Koppints a Megosztás ikonra, majd válaszd: Főképernyőhöz adás." Safari and the installed app keep separate storage, so progress must never start in a Safari tab.
- **Offline:** the service worker precaches every asset. After the first launch the app must work in airplane mode.
- **Updates:** with `autoUpdate`, a new deploy reaches her phone only when the app is opened online, and it applies on the following launch. Ship the final build before installing where possible.
- **No notifications.** Dávid tells her when to look; the countdown does the rest.
- **Inputs:** 16 px minimum font size to stop iOS zooming; numeric inputs use `inputmode="decimal"`.

### Spoiler hygiene

- The repo is private and the Pages URL goes to nobody but her.
- Add `<meta name="robots" content="noindex">` and no description or Open Graph tags, so a pasted link shows no preview text.
- The app name, icon, title and welcome screen carry no place, food or activity.
- Locked cards render no stage title, not even in `aria-label`.
- The prep quiz reveals clothing only. The single teaser is "víz közelében leszünk".

## Build phases for Claude Code

Twelve phases in three tiers, all of which must be finished before Dávid shows her the app on Saturday morning. Tier 1 alone is a complete app: every envelope opens on time with Dávid's message and a stamp. Tiers 2 and 3 add the challenges, cheapest first.

| #   | Tier | Phase                                                                                                                 | Done when                                                                     |
| --- | ---- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | 1    | Scaffold: Vite React TS, Tailwind v4 theme, fonts, PWA plugin, Cloudflare Pages deploy                                | A themed placeholder installs on an iPhone and loads in airplane mode         |
| 2   | 1    | Core logic: `content/stages.ts`, store, `useNow`, `unlock.ts` with Vitest tests                                       | Tests cover time unlock, shift, forced unlock, simulated clock, hint offsets  |
| 3   | 1    | UI kit: `EnvelopeCard`, `WaxSeal`, `Stamp`, `Button`, `Countdown`, `StageScreen`                                      | Each component renders in locked and open states                              |
| 4   | 1    | Shell: install gate, welcome countdown, timeline; every stage opens to its reveal, Dávid's message and a "Kész" stamp | Seven envelopes render; locked ones show no titles; each stage can be stamped |
| 5   | 1    | Admin panel and preview mode                                                                                          | Simulating any time opens the right stages; the banner shows                  |
| 6   | 1    | `prep` quiz and packing list                                                                                          | Six questions, reveals, list, stamp; state survives a restart                 |
| 7   | 2    | `HintGuess` for `drive1` and `drive2`                                                                                 | Hints open on offsets; one guess per hint; reveal on success                  |
| 8   | 2    | `Trivia` for `siofok`; `kart` predictions, results and podium                                                         | Wrong answers show the right one; predictions lock on "Rajt"                  |
| 9   | 2    | `lunch` sushi wheel                                                                                                   | Two spins max; result saved                                                   |
| 10  | 2    | `finale`: letter, stamp sheet, stats                                                                                  | Letter opens; skipped values are left out                                     |
| 11  | 3    | `PhotoTask`, `Polaroid`, collage and share                                                                            | Camera opens from the installed app; collage saves to Photos                  |
| 12  | 3    | Chopstick timer, ratings, unlock animation, confetti, reduced motion                                                  | The test checklist below passes                                               |

**Milestone A, Friday night:** tier 1 deployed and walked through in preview mode on Dávid's iPhone. From here the day is safe.

**Milestone B, Saturday by 08:00:** the last tested build is deployed. Dávid shows her the app between 08:00 and 09:00 and installs it on her iPhone then, so the prep quiz is already open. Stop adding features at that point; an untested late deploy is the main risk to the day.

Ship whole tiers only. If tier 3 is not finished and tested, leave it out: the photo tasks and the collage disappear, and she simply takes photos with the Camera app. If tier 2 runs short, drop from the bottom: `finale` stats, then the sushi wheel, then the `drive2` hints.

Suggested kickoff prompt for Claude Code:

```text
Read PLAN.md fully before writing code. Build it phase by phase in the
order given, finishing each tier before starting the next. After each
phase run typecheck, tests and build, then commit with the phase number.
Keep all user-facing text in src/content/stages.ts and copy the Hungarian
strings from the plan exactly. Stop after phase 6, phase 10 and phase 12
so I can test on a phone.
```

## Test checklist

Run these on Dávid's own iPhone as an installed app before her phone is touched.

- [ ] Full simulated run of the day in preview mode, every stage opened and completed
- [ ] Locked cards show no stage titles or place names at any simulated time
- [ ] Airplane mode: every stage loads and photos still save
- [ ] Force-quit and reopen: answers, stamps and photos are still there
- [ ] ő, ű, Ő and Ű render correctly in all three fonts
- [ ] +15 perc moves the countdowns and the hint times together
- [ ] Következő megnyitása opens exactly one stage
- [ ] The camera opens from the installed app and the photo appears as a polaroid
- [ ] The collage reaches Photos through the share sheet
- [ ] Opening the URL in Safari shows only the install instructions

On her phone, after installing:

- [ ] Preview mode is off, the shift is 0, and no test data exists
- [ ] The prep quiz is the only open stage when she first sees the app

## Open items for Dávid

These need a person, not Claude Code.

- [ ] Write the seven short stage messages and the finale letter into `content/stages.ts`
- [ ] Choose the four-digit admin PIN
- [ ] Confirm the kart center's rules on shoes, hair and clothing, and that a tandem kart is available at 16:00. The booking page did not show them, and the prep quiz wording depends on them
- [ ] Confirm the Víztorony lookout is open on Saturday 10 October. One [listing](https://bb365.dev.bigfish.hu/en/poi/1001) shows opening hours only for 1 June to 30 September
- [ ] Reserve the sushi table for 13:00
- [ ] Check the 17:30 finale time against how long the kart sessions take, and change it in `content/stages.ts` if needed
- [ ] Install the app on her phone when you show it to her between 08:00 and 09:00: open the link in Safari and add it to the Home Screen
- [ ] Bring a charging cable for the car
