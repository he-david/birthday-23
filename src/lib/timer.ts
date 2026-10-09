// Pure helpers for the chopstick timer. Time is passed in, so it survives backgrounding:
// the remaining time is always derived from the start timestamp.

/** Milliseconds left, clamped to 0..durationMs. */
export function remainingMs(startedAt: number, now: number, durationMs: number): number {
  return Math.min(durationMs, Math.max(0, durationMs - (now - startedAt)))
}

/** Whole seconds left, rounded up so "0" only shows when time is truly up. */
export function remainingSeconds(startedAt: number, now: number, durationMs: number): number {
  return Math.ceil(remainingMs(startedAt, now, durationMs) / 1000)
}

/** Parses a whole-number count. Empty or invalid input gives undefined. */
export function parseCount(text: string): number | undefined {
  const t = text.trim()
  if (!/^\d{1,3}$/.test(t)) return undefined
  return Number(t)
}
