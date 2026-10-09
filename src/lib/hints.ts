// Pure helpers for the drive hint games.

export type DriveOutcome = 'playing' | 'solved' | 'revealed'

/** One guess per open hint. */
export function guessesLeft(openHints: number, tries: number): number {
  return Math.max(0, openHints - tries)
}

export function isCorrectGuess(option: string, answer: string): boolean {
  return option === answer
}

/** Solved wins; otherwise the answer is revealed once the next stage is open. */
export function driveOutcome(
  solvedAtHint: number | undefined,
  nextStageOpen: boolean,
): DriveOutcome {
  if (solvedAtHint !== undefined) return 'solved'
  return nextStageOpen ? 'revealed' : 'playing'
}

/** Hint number (1..3) recorded when a correct guess is made. */
export function hintNumber(openHints: number): 1 | 2 | 3 {
  return Math.min(3, Math.max(1, openHints)) as 1 | 2 | 3
}
