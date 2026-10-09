import { KART, PREP_QUESTIONS, SIOFOK_PHOTOS, TRIVIA } from '../content/stages'
import type { AppState, StageId } from '../state/types'

type ReadyState = Pick<AppState, 'prep' | 'guesses' | 'trivia' | 'lunch' | 'kart' | 'photos'>

/**
 * True when everything in a stage is done, so "Kész" may be shown.
 * Drive stages count as done when solved or when the answer was revealed
 * (the next stage is open).
 */
export function stageReady(id: StageId, s: ReadyState, nextStageOpen: boolean): boolean {
  switch (id) {
    case 'prep':
      return PREP_QUESTIONS.every((q) => s.prep[q.id] !== undefined)
    case 'drive1':
    case 'drive2':
      return s.guesses[id].solvedAtHint !== undefined || nextStageOpen
    case 'siofok':
      return (
        SIOFOK_PHOTOS.every((p) => s.photos.includes(p.id)) &&
        TRIVIA.every((q) => s.trivia[q.id] !== undefined)
      )
    case 'lunch':
      return (
        s.lunch.spins.length > 0 &&
        s.lunch.chopsticks !== undefined &&
        s.lunch.ratings.some((r) => r.name.trim() !== '' && r.hearts > 0)
      )
    case 'kart':
      return (
        Boolean(s.kart.locked) &&
        s.kart.herLap !== undefined &&
        s.kart.davidLap !== undefined &&
        s.photos.includes(KART.photo.id)
      )
    case 'finale':
      return true
  }
}
