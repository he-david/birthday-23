import { describe, expect, it } from 'vitest'
import { bestBite } from '../src/lib/finale'
import { addRating, setRatingHearts, setRatingName } from '../src/lib/ratings'
import { parseCount, remainingMs, remainingSeconds } from '../src/lib/timer'

describe('chopstick timer', () => {
  it('counts down from the start timestamp', () => {
    expect(remainingMs(1000, 1000, 30000)).toBe(30000)
    expect(remainingMs(1000, 11000, 30000)).toBe(20000)
    expect(remainingMs(1000, 31000, 30000)).toBe(0)
  })
  it('clamps before start and after the end (backgrounded for long)', () => {
    expect(remainingMs(5000, 1000, 30000)).toBe(30000)
    expect(remainingMs(0, 10 * 60_000, 30000)).toBe(0)
  })
  it('rounds seconds up', () => {
    expect(remainingSeconds(0, 0, 30000)).toBe(30)
    expect(remainingSeconds(0, 100, 30000)).toBe(30)
    expect(remainingSeconds(0, 29001, 30000)).toBe(1)
    expect(remainingSeconds(0, 30000, 30000)).toBe(0)
  })
  it('parses counts', () => {
    expect(parseCount('7')).toBe(7)
    expect(parseCount(' 12 ')).toBe(12)
    expect(parseCount('0')).toBe(0)
    expect(parseCount('')).toBeUndefined()
    expect(parseCount('-1')).toBeUndefined()
    expect(parseCount('3,5')).toBeUndefined()
    expect(parseCount('abc')).toBeUndefined()
  })
})

describe('ratings', () => {
  it('pads to the edited index', () => {
    expect(setRatingName([], 0, 'Maki')).toEqual([{ name: 'Maki', hearts: 0 }])
    expect(setRatingHearts([], 1, 3)).toEqual([
      { name: '', hearts: 0 },
      { name: '', hearts: 3 },
    ])
  })
  it('clears when the same heart is tapped again and clamps range', () => {
    const one = [{ name: 'A', hearts: 4 }]
    expect(setRatingHearts(one, 0, 4)[0]?.hearts).toBe(0)
    expect(setRatingHearts(one, 0, 9)[0]?.hearts).toBe(5)
  })
  it('does not mutate and adds blank rows', () => {
    const list = [{ name: 'A', hearts: 2 }]
    const next = addRating(list)
    expect(list).toHaveLength(1)
    expect(next).toEqual([
      { name: 'A', hearts: 2 },
      { name: '', hearts: 0 },
    ])
  })
})

describe('best bite', () => {
  it('needs a name and at least one heart', () => {
    expect(bestBite([])).toBeUndefined()
    expect(bestBite([{ name: '', hearts: 5 }])).toBeUndefined()
    expect(bestBite([{ name: 'Maki', hearts: 0 }])).toBeUndefined()
  })
  it('picks the highest, first wins ties, trims', () => {
    expect(
      bestBite([
        { name: ' Maki ', hearts: 4 },
        { name: 'Nigiri', hearts: 5 },
        { name: 'Uramaki', hearts: 5 },
      ]),
    ).toBe('Nigiri')
    expect(bestBite([{ name: ' Maki ', hearts: 3 }])).toBe('Maki')
  })
})
