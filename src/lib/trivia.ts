import type { TriviaQuestion } from '../content/stages'

export interface TriviaScore {
  correct: number
  answered: number
  total: number
}

export function triviaScore(
  questions: readonly TriviaQuestion[],
  answers: Readonly<Record<string, string>>,
): TriviaScore {
  let correct = 0
  let answered = 0
  for (const q of questions) {
    const a = answers[q.id]
    if (a === undefined) continue
    answered += 1
    if (a === q.answer) correct += 1
  }
  return { correct, answered, total: questions.length }
}
