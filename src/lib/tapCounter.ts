// Pure helper for the hidden "tap the seal N times quickly" gesture. Time is passed in.

export const REQUIRED_TAPS = 5
export const TAP_WINDOW_MS = 3000

export interface TapResult {
  /** Timestamps still inside the window (empty after a trigger). */
  taps: number[]
  triggered: boolean
}

export function registerTap(
  taps: readonly number[],
  nowMs: number,
  required: number = REQUIRED_TAPS,
  windowMs: number = TAP_WINDOW_MS,
): TapResult {
  const recent = [...taps, nowMs].filter((t) => nowMs - t <= windowMs)
  if (recent.length >= required) return { taps: [], triggered: true }
  return { taps: recent, triggered: false }
}
