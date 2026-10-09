// Pure helpers for the sushi wheel.

export function spinsLeft(used: number, max: number): number {
  return Math.max(0, max - used)
}

/** Picks a segment index from a random value in [0, 1). */
export function pickSegment(random: number, count: number): number {
  const i = Math.floor(random * count)
  return Math.min(count - 1, Math.max(0, i))
}

/**
 * Next cumulative rotation (degrees, clockwise) that brings the centre of
 * `index` under the pointer at the top, after at least `turns` full turns.
 */
export function targetRotation(prev: number, index: number, count: number, turns = 5): number {
  const seg = 360 / count
  const center = (index + 0.5) * seg
  return (Math.floor(prev / 360) + turns + 1) * 360 - center
}
