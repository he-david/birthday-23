// Pure helpers for the lunch ratings list (name + 1-5 hearts).

export interface Rating {
  name: string
  hearts: number
}

export const MAX_HEARTS = 5

const blank = (): Rating => ({ name: '', hearts: 0 })

function padded(list: readonly Rating[], index: number): Rating[] {
  const out = list.map((r) => ({ ...r }))
  while (out.length <= index) out.push(blank())
  return out
}

export function setRatingName(list: readonly Rating[], index: number, name: string): Rating[] {
  const out = padded(list, index)
  out[index] = { ...out[index]!, name }
  return out
}

/** Tapping the heart that is already the rating clears it. */
export function setRatingHearts(list: readonly Rating[], index: number, hearts: number): Rating[] {
  const out = padded(list, index)
  const clamped = Math.min(MAX_HEARTS, Math.max(0, Math.round(hearts)))
  const current = out[index]!
  out[index] = { ...current, hearts: current.hearts === clamped ? 0 : clamped }
  return out
}

export function addRating(list: readonly Rating[]): Rating[] {
  return [...list.map((r) => ({ ...r })), blank()]
}
