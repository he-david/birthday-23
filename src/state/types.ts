export type StageId = 'prep' | 'drive1' | 'siofok' | 'lunch' | 'drive2' | 'kart' | 'finale'

export type DriveId = 'drive1' | 'drive2'

export type View = { name: 'timeline' } | { name: 'stage'; id: StageId } | { name: 'admin' }

export interface AppState {
  v: 1
  shiftMinutes: number // admin time shift
  forcedUnlocked: StageId[] // admin overrides
  opened: StageId[] // unlock animation already played
  stamps: Partial<Record<StageId, string>> // ISO time earned
  prep: Record<string, string> // questionId -> option
  guesses: Record<DriveId, { tries: string[]; solvedAtHint?: 1 | 2 | 3 }>
  trivia: Record<string, string> // questionId -> option
  lunch: {
    spins: string[]
    chopsticks?: number
    ratings: { name: string; hearts: number }[]
  }
  kart: {
    predictedLap?: number
    predictedWinner?: 'her' | 'david'
    locked?: boolean // "Rajt" pressed: predictions are final
    herLap?: number
    davidLap?: number
  }
  photos: string[] // task ids that have a photo
  simulatedNow?: string // preview mode only
}
