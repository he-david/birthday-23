import { TRIVIA } from '../src/content/stages'
import { driveOutcome, guessesLeft, hintNumber, isCorrectGuess } from '../src/lib/hints'
import { formatLap, kartResult, parseLap } from '../src/lib/kart'
import { triviaScore } from '../src/lib/trivia'

describe('hints', () => {
  it.each([
    [0, 0, 0],
    [1, 0, 1],
    [2, 1, 1],
    [3, 3, 0],
    [1, 2, 0],
  ])('guessesLeft(open %i, tries %i) = %i', (open, tries, left) => {
    expect(guessesLeft(open, tries)).toBe(left)
  })
  it('judges guesses and outcome', () => {
    expect(isCorrectGuess('Siófok', 'Siófok')).toBe(true)
    expect(isCorrectGuess('Tihany', 'Siófok')).toBe(false)
    expect(driveOutcome(2, false)).toBe('solved')
    expect(driveOutcome(undefined, true)).toBe('revealed')
    expect(driveOutcome(undefined, false)).toBe('playing')
    expect(hintNumber(3)).toBe(3)
    expect(hintNumber(0)).toBe(1)
  })
})

describe('triviaScore', () => {
  it('counts correct and answered', () => {
    expect(triviaScore(TRIVIA, {})).toEqual({ correct: 0, answered: 0, total: 2 })
    expect(triviaScore(TRIVIA, { 'torony-ev': '1912', 'kilato-hely': 'Harangok' })).toEqual({
      correct: 1,
      answered: 2,
      total: 2,
    })
  })
})

describe('kart', () => {
  it.each([
    ['62,5', 62.5],
    ['62.5', 62.5],
    [' 70 ', 70],
    ['', undefined],
    ['abc', undefined],
    ['0', undefined],
    ['-3', undefined],
    ['1,2,3', undefined],
  ])('parseLap(%j)', (text, expected) => {
    expect(parseLap(text)).toBe(expected)
  })
  it('formats with decimal comma', () => {
    expect(formatLap(62.5)).toBe('62,5')
    expect(formatLap(70)).toBe('70,0')
  })
  it('ranks the podium and compares predictions', () => {
    const r = kartResult({ herLap: 64.3, davidLap: 61.2, predictedLap: 62, predictedWinner: 'her' })
    expect(r.winner).toBe('david')
    expect(r.podium.map((p) => [p.who, p.place])).toEqual([
      ['david', 1],
      ['her', 2],
    ])
    expect(r.lapDiff).toBe(2.3)
    expect(r.winnerHit).toBe(false)
  })
  it('handles ties and missing predictions', () => {
    const r = kartResult({ herLap: 60, davidLap: 60 })
    expect(r.winner).toBe('tie')
    expect(r.podium.every((p) => p.place === 1)).toBe(true)
    expect(r.lapDiff).toBeUndefined()
    expect(r.winnerHit).toBeUndefined()
    expect(kartResult({ herLap: 59, davidLap: 60, predictedWinner: 'her' }).winnerHit).toBe(true)
  })
})
