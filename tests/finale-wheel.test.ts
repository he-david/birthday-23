import { describe, expect, it } from 'vitest'
import { TRIVIA } from '../src/content/stages'
import { bestBite, finaleStats, formatLap } from '../src/lib/finale'
import { pickSegment, spinsLeft, targetRotation } from '../src/lib/wheel'
import { initialState } from '../src/state/store'

describe('wheel', () => {
  it('counts spins left', () => {
    expect(spinsLeft(0, 2)).toBe(2)
    expect(spinsLeft(2, 2)).toBe(0)
    expect(spinsLeft(5, 2)).toBe(0)
  })
  it('picks segments in range', () => {
    expect(pickSegment(0, 6)).toBe(0)
    expect(pickSegment(0.999, 6)).toBe(5)
    expect(pickSegment(1, 6)).toBe(5)
    expect(pickSegment(0.5, 6)).toBe(3)
  })
  it('lands the segment centre under the pointer', () => {
    for (const prev of [0, 1000, 2000]) {
      for (let i = 0; i < 6; i++) {
        const r = targetRotation(prev, i, 6)
        expect(r).toBeGreaterThan(prev + 360)
        expect((((r + (i + 0.5) * 60) % 360) + 360) % 360).toBe(0)
      }
    }
  })
})

describe('finaleStats', () => {
  it('is empty when she skipped everything', () => {
    expect(finaleStats(initialState(), TRIVIA)).toEqual([])
  })
  it('includes only values that exist', () => {
    const s = initialState()
    s.guesses.drive1.solvedAtHint = 2
    s.trivia = { [TRIVIA[0]!.id]: TRIVIA[0]!.answer }
    s.lunch = { spins: [], chopsticks: 0, ratings: [{ name: 'Maki', hearts: 4 }] }
    s.kart = { herLap: 62.5 }
    expect(finaleStats(s, TRIVIA)).toEqual([
      { key: 'drive1', value: 2 },
      { key: 'trivia', value: 1, of: TRIVIA.length },
      { key: 'chopsticks', value: 0 },
      { key: 'bestBite', value: 'Maki' },
      { key: 'herLap', value: 62.5 },
    ])
  })
})

describe('bestBite', () => {
  it('picks the top rating, first on tie, ignores blanks', () => {
    expect(bestBite([])).toBeUndefined()
    expect(bestBite([{ name: ' ', hearts: 5 }])).toBeUndefined()
    expect(
      bestBite([
        { name: 'A', hearts: 3 },
        { name: 'B', hearts: 5 },
        { name: 'C', hearts: 5 },
      ]),
    ).toBe('B')
  })
})

it('formats laps with a comma', () => expect(formatLap(62.5)).toBe('62,5'))
