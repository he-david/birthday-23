import type { DriveId, StageId } from '../state/types'

/** Single place to edit all copy, times, options, answers and the admin PIN. */

// HUMAN REVIEW: placeholder PIN, Dávid must choose the real one.
export const ADMIN_PIN = '0000'

export const ADMIN = {
  title: 'Admin',
  pinPrompt: 'Add meg a PIN-kódot',
  pinWrong: 'Hibás PIN',
  cancel: 'Mégse',
  back: 'Vissza',
  forceNext: 'Következő megnyitása',
  forceNone: 'Minden boríték nyitva',
  shiftHeading: 'Időeltolás',
  shiftNow: 'Jelenlegi eltolás',
  shiftMinus: '−15 perc',
  shiftPlus: '+15 perc',
  previewHeading: 'Előnézet',
  previewApply: 'Előnézet indítása',
  realTime: 'Valós idő',
  previewBanner: 'ELŐNÉZET',
  resetAll: 'Minden törlése',
  resetConfirm: 'Biztos? Minden haladás és fotó törlődik.',
  resetYes: 'Igen, törlöm',
} as const

export const MESSAGE_PLACEHOLDER = 'TODO: Dávid'

export interface StageDef {
  id: StageId
  title: string
  /** ISO with +02:00 (the day falls before the 25 Oct clock change). */
  unlockAt: string
  /** Dávid's message, shown at the top of the stage. */
  message: string
  /** What the stage reveals once open. */
  reveal: string
}

export const STAGES: readonly StageDef[] = [
  {
    id: 'prep',
    title: 'Felkészülés',
    unlockAt: '2026-10-10T08:00:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Csomaglista és egy kis nyom',
  },
  {
    id: 'drive1',
    title: 'Úton',
    unlockAt: '2026-10-10T10:00:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Semmi, csak nyomok az úton',
  },
  {
    id: 'siofok',
    title: 'Séta Siófokon',
    unlockAt: '2026-10-10T11:30:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Víztorony és Rózsakert',
  },
  {
    id: 'lunch',
    title: 'Ebéd',
    unlockAt: '2026-10-10T13:00:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Sushi',
  },
  {
    id: 'drive2',
    title: 'Újra úton',
    unlockAt: '2026-10-10T14:30:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Semmi, csak nyomok az úton',
  },
  {
    id: 'kart',
    title: 'Gokart',
    unlockAt: '2026-10-10T16:00:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Gokartpálya, egyedül és tandemben',
  },
  {
    id: 'finale',
    title: 'Levél',
    // HUMAN REVIEW: 17:30 is assumed, check against the kart session length.
    unlockAt: '2026-10-10T17:30:00+02:00',
    message: MESSAGE_PLACEHOLDER,
    reveal: 'Dávid levele és az összefoglaló',
  },
]

export const STAGE_IDS: readonly StageId[] = STAGES.map((s) => s.id)

export const WELCOME = {
  heading: 'Szülinapi küldetés',
  countdownLabel: 'Az első boríték',
} as const

export const INSTALL_GATE = {
  instructions: 'Koppints a Megosztás ikonra, majd válaszd: Főképernyőhöz adás.',
} as const

export const TIMELINE = {
  heading: 'Szülinapi küldetés',
  lockedHint: 'Lezárt boríték',
  backLabel: 'Vissza',
  stampedLabel: 'Megszerzett bélyeg',
  openHint: 'Nyisd ki',
} as const

// ---------- prep ----------

export interface PrepQuestion {
  id: string
  question: string
  options: readonly string[]
  reveal: string
}

// HUMAN REVIEW: shoe, trouser and hair lines assume typical kart-track rules; confirm with the venue.
export const PREP_QUESTIONS: readonly PrepQuestion[] = [
  {
    id: 'shoes',
    question: 'Milyen cipőben indulnál neki a napnak?',
    options: ['Magassarkú', 'Sportcipő', 'Balerina', 'Mezítláb'],
    reveal: 'Ma zárt, lapos cipő kell. Bízz bennem.',
  },
  {
    id: 'bottom',
    question: 'Szoknya vagy nadrág?',
    options: ['Szoknya', 'Nadrág', 'Ruha'],
    reveal: 'Ma a nadrág nyer. Legyen kényelmes, amiben mozogni is tudsz.',
  },
  {
    id: 'hair',
    question: 'A hajad ma...',
    options: ['Kiengedve', 'Copfban', 'Kontyban'],
    reveal: 'Mindegyik gyönyörű, de egy hajgumit mindenképp tegyél a táskádba.',
  },
  {
    id: 'cold',
    question: 'Mennyire vagy fázós?',
    options: ['Nagyon', 'Kicsit', 'Csak ha fúj a szél'],
    reveal: 'Öltözz rétegesen, és hozz kabátot: lesz, ahol fúj a szél.',
  },
  {
    id: 'appetite',
    question: 'Mekkora étvággyal indulsz?',
    options: ['Farkaséhesen', 'Közepesen', 'Csak csipegetek'],
    reveal: 'Az ebédről gondoskodtam. Reggelire elég valami könnyű.',
  },
  {
    id: 'ready',
    question: 'Mikorra leszel kész?',
    options: ['Már kész vagyok', 'Fél óra múlva', 'Még álmos vagyok'],
    reveal: '10:00-kor indulunk. A többit bízd rám.',
  },
]

export const PACKING = {
  title: 'Csomaglista',
  items: [
    'zárt, lapos cipő',
    'kényelmes nadrág',
    'hajgumi',
    'réteges felső és kabát',
    'feltöltött telefon',
  ],
  teaser: 'Annyit elárulok: víz közelében leszünk.',
} as const

// ---------- drive stages ----------

export interface DriveHint {
  /** Minutes after the stage's effective unlock time. */
  offsetMin: number
  text: string
}

export interface DriveDef {
  title: string
  tiles: readonly string[]
  answer: string
  hints: readonly [DriveHint, DriveHint, DriveHint]
  wrongGuess: string
}

export const DRIVES: Record<DriveId, DriveDef> = {
  drive1: {
    title: 'Hová megyünk?',
    tiles: ['Balatonfüred', 'Siófok', 'Tihany', 'Velence', 'Keszthely', 'Balatonalmádi'],
    answer: 'Siófok',
    hints: [
      { offsetMin: 20, text: 'Nagy víz partjára tartunk.' },
      { offsetMin: 45, text: 'Egy operettkirály szülővárosa.' },
      { offsetMin: 70, text: 'A főterén torony áll, amiben valaha víz volt.' },
    ],
    wrongGuess: 'Nem talált. Várd meg a következő nyomot.',
  },
  drive2: {
    title: 'Mi lesz az utolsó állomás?',
    tiles: ['Bowling', 'Gokart', 'Szabadulószoba', 'Falmászás', 'Korcsolya', 'Lézerharc'],
    answer: 'Gokart',
    hints: [
      { offsetMin: 0, text: 'Gyors lesz.' },
      { offsetMin: 15, text: 'Sisak kell hozzá.' },
      { offsetMin: 30, text: 'A végén kockás zászló int.' },
    ],
    wrongGuess: 'Nem talált. Várd meg a következő nyomot.',
  },
}

/** Stage whose opening reveals the drive answer if she never solved it. */
export const DRIVE_NEXT_STAGE: Record<DriveId, StageId> = { drive1: 'siofok', drive2: 'kart' }

// HUMAN REVIEW: implementer-written UI copy, not from the plan.
export const DRIVE_UI = {
  hintsTitle: 'Nyomok',
  hintLabel: 'Nyom',
  noHint: 'Az első nyom hamarosan érkezik.',
  noMoreGuesses: 'Most nincs több tipp. A válasz később kiderül.',
  solved: 'Eltaláltad!',
  answerLabel: 'A válasz',
} as const

// ---------- siofok ----------

export interface PhotoTaskDef {
  id: string
  prompt: string
  /** Short handwritten caption for the polaroid and collage. */
  caption: string
  /** Selfie tasks use the front camera. */
  facing: 'user' | 'environment'
}

export const SIOFOK_PHOTOS: readonly PhotoTaskDef[] = [
  {
    id: 'siofok-torony',
    prompt: 'Tartsd a tenyereden a Víztornyot.',
    caption: 'Víztorony',
    facing: 'environment',
  },
  {
    id: 'siofok-szelfi',
    prompt: 'Közös szelfi a kilátóból (vagy a torony előtt, ha zárva van).',
    caption: 'Mi ketten',
    facing: 'user',
  },
  {
    id: 'siofok-virag',
    prompt: 'A legszebb virág, amit ma találsz.',
    caption: 'Virág',
    facing: 'environment',
  },
  {
    id: 'siofok-szobor',
    prompt: 'Dávid szobrot utánoz. Te vagy a fotós.',
    caption: 'Élő szobor',
    facing: 'environment',
  },
]

export interface TriviaQuestion {
  id: string
  question: string
  options: readonly string[]
  answer: string
}

// HUMAN REVIEW: verify the Víztorony facts against the town guides.
export const TRIVIA: readonly TriviaQuestion[] = [
  {
    id: 'torony-ev',
    question: 'Melyik évben épült a Víztorony?',
    options: ['1892', '1912', '1932', '1952'],
    answer: '1912',
  },
  {
    id: 'kilato-hely',
    question: 'Mi volt eredetileg a kilátó helyén?',
    options: ['Harangok', 'Víztartály', 'Óraszerkezet', 'Tűzfigyelő'],
    answer: 'Víztartály',
  },
]

// HUMAN REVIEW: implementer-written UI copy, not from the plan.
export const TRIVIA_UI = {
  title: 'Kvíz',
  correct: 'Pontosan.',
  wrong: 'A helyes válasz:',
  photosTitle: 'Fotófeladatok',
} as const

// ---------- lunch ----------

export const LUNCH = {
  wheelTitle: 'Sushi rulett',
  maxSpins: 2,
  wheelSegments: [
    'Valami lazacos',
    'Amit még sosem kóstoltál',
    'Dávid választ neked',
    'Te választasz Dávidnak',
    'A legfurcsább nevű tekercs',
    'Valami csípős',
  ],
  chopstickTitle: 'Pálcika-kihívás',
  chopstickPrompt: 'Hány falatot tudsz pálcikával Dávid tányérjára átrakni 30 másodperc alatt?',
  chopstickSeconds: 30,
  ratingTitle: 'Értékelés',
  bestBiteTitle: 'A nap falatja',
  // HUMAN REVIEW: implementer-written UI copy, not from the plan.
  spinLabel: 'Pörgess',
  spinsLeft: 'Még hátralévő pörgetés:',
  noSpinsLeft: 'Ennyi volt, a rulett döntött.',
  resultLabel: 'A rulett szerint',
  wheelAria: 'Sushi rulett',
  timerStart: 'Indítás',
  timerAgain: 'Újra',
  timerRunning: 'Másodperc van hátra',
  timerDone: 'Letelt az idő.',
  timerAria: 'Visszaszámláló',
  chopstickCountLabel: 'Hány falat ment át?',
  chopstickUnit: 'falat',
  ratingHint: 'Mit ettél? Adj neki szíveket.',
  ratingNameLabel: 'Étel neve',
  ratingNamePlaceholder: 'pl. lazacos maki',
  ratingAdd: 'Még egy falat',
  heartLabel: 'szív',
  bestBiteLine: 'Eddig ez nyer:',
} as const

// ---------- kart ----------

export const KART = {
  tipsTitle: 'Tippek',
  lapPrompt: 'Mennyi lesz a legjobb köröd?',
  winnerPrompt: 'Ki lesz a gyorsabb?',
  winnerOptions: [
    { value: 'her', label: 'Én' },
    { value: 'david', label: 'Dávid' },
  ],
  startLabel: 'Rajt',
  resultTitle: 'Eredmény',
  // HUMAN REVIEW: implementer-written UI copy, not from the plan.
  lapUnit: 'mp',
  lapPlaceholder: 'pl. 62,5',
  locked: 'A tippjeid lezárva. Jó versenyt!',
  yourTip: 'Tipp',
  tipLapLabel: 'Köröd',
  tipWinnerLabel: 'Gyorsabb',
  noTip: 'nincs tipp',
  herLapLabel: 'Te, legjobb kör (mp)',
  davidLapLabel: 'Dávid, legjobb kör (mp)',
  showResult: 'Eredmény megmutatása',
  podiumTitle: 'Dobogó',
  you: 'Te',
  david: 'Dávid',
  winnerLine: 'A győztes:',
  tieLine: 'Döntetlen',
  predicted: 'Tippelt kör',
  real: 'Valós kör',
  diff: 'Eltérés',
  winnerHit: 'A győztest eltaláltad.',
  winnerMiss: 'A győztest most nem találtad el.',
  photo: {
    id: 'kart-sisak',
    prompt: 'Sisakos közös kép.',
    caption: 'Sisakosan',
    facing: 'user',
  } as PhotoTaskDef,
} as const

// HUMAN REVIEW: implementer-written photo UI copy and polaroid captions.
export const PHOTO_UI = {
  take: 'Fotózok',
  retake: 'Újra',
  saving: 'Mentés…',
  error: 'Nem sikerült elmenteni. Próbáld újra, vagy hagyd ki.',
  alt: 'A te fotód',
  collageTitle: 'Fotók',
  collageHeading: 'Szülinapi küldetés',
  collageDate: '2026. október 10.',
  collageFile: 'szulinapi-kuldetes.jpg',
  collageAlt: 'A fotóidból készült kollázs',
  downloaded: 'A kép letöltődött.',
} as const

/** Every photo task in day order (collage order). */
export const ALL_PHOTO_TASKS: readonly PhotoTaskDef[] = [...SIOFOK_PHOTOS, KART.photo]

// ---------- finale ----------

export const FINALE = {
  stampsTitle: 'Bélyegek',
  statsTitle: 'A nap számokban',
  shareLabel: 'Mentés és megosztás',
  // HUMAN REVIEW: implementer-written UI copy, not from the plan.
  noStamps: 'Ma még nem gyűjtöttél bélyeget, de a nap velem így is teljes.',
  noStats: 'Ma nem írtunk fel számokat. Ez is rendben van.',
  letterTitle: 'Levél',
  hintStat: (n: number) => `${n}. nyom`,
  triviaStat: 'Kvíz',
  chopsticksStat: 'Pálcikával átrakott falat',
  bestBiteStat: 'A nap falatja',
  herLapStat: 'A te legjobb köröd',
  davidLapStat: 'Dávid legjobb köre',
  lapUnit: 'mp',
  driveNames: { drive1: 'Úton', drive2: 'Újra úton' } as const,
  // HUMAN REVIEW: Dávid's letter goes here.
  letter: MESSAGE_PLACEHOLDER,
  closingLine: 'Boldog szülinapi hétvégét!',
} as const
