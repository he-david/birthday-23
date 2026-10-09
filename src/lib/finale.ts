import type { DriveId } from '../state/types'
import type { AppState } from '../state/types'
import { triviaScore } from './trivia'
import type { TriviaQuestion } from '../content/stages'

export type StatKey =
  'drive1' | 'drive2' | 'trivia' | 'chopsticks' | 'bestBite' | 'herLap' | 'davidLap'

export interface Stat {
  key: StatKey
  /** Raw value; the view formats and labels it. */
  value: string | number
  /** Secondary number (trivia total). */
  of?: number
}

type StatsInput = Pick<AppState, 'guesses' | 'trivia' | 'lunch' | 'kart'>

const DRIVES: readonly DriveId[] = ['drive1', 'drive2']

/** The day's numbers. Anything she skipped is left out. */
export function finaleStats(state: StatsInput, questions: readonly TriviaQuestion[]): Stat[] {
  const out: Stat[] = []
  for (const d of DRIVES) {
    const n = state.guesses[d].solvedAtHint
    if (n !== undefined) out.push({ key: d, value: n })
  }
  const t = triviaScore(questions, state.trivia)
  if (t.answered > 0) out.push({ key: 'trivia', value: t.correct, of: t.total })
  if (state.lunch.chopsticks !== undefined) {
    out.push({ key: 'chopsticks', value: state.lunch.chopsticks })
  }
  const bite = bestBite(state.lunch.ratings)
  if (bite) out.push({ key: 'bestBite', value: bite })
  if (state.kart.herLap !== undefined) out.push({ key: 'herLap', value: state.kart.herLap })
  if (state.kart.davidLap !== undefined) out.push({ key: 'davidLap', value: state.kart.davidLap })
  return out
}

/** Highest-rated named item; the first one wins a tie. */
export function bestBite(ratings: readonly { name: string; hearts: number }[]): string | undefined {
  let best: { name: string; hearts: number } | undefined
  for (const r of ratings) {
    if (r.name.trim() === '' || r.hearts <= 0) continue
    if (!best || r.hearts > best.hearts) best = r
  }
  return best?.name.trim()
}

/** Hungarian decimal comma. */
export function formatLap(seconds: number): string {
  return String(seconds).replace('.', ',')
}
