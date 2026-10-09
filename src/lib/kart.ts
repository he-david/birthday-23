// Pure helpers for the kart predictions and results.

export type Racer = 'her' | 'david'

/** Parses "62,5" or "62.5" seconds. Returns undefined for empty or invalid input. */
export function parseLap(text: string): number | undefined {
  const cleaned = text.trim().replace(',', '.')
  if (cleaned === '' || !/^\d+(\.\d+)?$/.test(cleaned)) return undefined
  const n = Number(cleaned)
  return n > 0 && n < 1000 ? n : undefined
}

/** Hungarian decimal comma, one decimal: 62.5 -> "62,5". */
export function formatLap(seconds: number): string {
  return seconds.toFixed(1).replace('.', ',')
}

export interface PodiumEntry {
  who: Racer
  lap: number
  place: 1 | 2
}

export interface KartResult {
  winner: Racer | 'tie'
  podium: PodiumEntry[]
  /** Her real lap minus her predicted lap (positive = slower than predicted). */
  lapDiff?: number
  winnerHit?: boolean
}

export function kartResult(input: {
  herLap: number
  davidLap: number
  predictedLap?: number
  predictedWinner?: Racer
}): KartResult {
  const { herLap, davidLap, predictedLap, predictedWinner } = input
  const winner: Racer | 'tie' = herLap === davidLap ? 'tie' : herLap < davidLap ? 'her' : 'david'
  const entries: { who: Racer; lap: number }[] = [
    { who: 'her', lap: herLap },
    { who: 'david', lap: davidLap },
  ]
  entries.sort((a, b) => a.lap - b.lap)
  const podium: PodiumEntry[] = entries.map((e, i) => ({
    ...e,
    place: winner === 'tie' || i === 0 ? 1 : 2,
  }))
  const result: KartResult = { winner, podium }
  if (predictedLap !== undefined) {
    result.lapDiff = Math.round((herLap - predictedLap) * 10) / 10
  }
  if (predictedWinner !== undefined) {
    result.winnerHit = winner === predictedWinner
  }
  return result
}
