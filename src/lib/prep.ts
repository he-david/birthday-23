import type { PrepQuestion } from '../content/stages'

/** Index of the first question without an answer, or -1 when all are answered. */
export function firstUnanswered(
  questions: readonly PrepQuestion[],
  answers: Readonly<Record<string, string>>,
): number {
  return questions.findIndex((q) => answers[q.id] === undefined)
}
