import { KART, PREP_QUESTIONS, SIOFOK_PHOTOS, TRIVIA } from '../src/content/stages'
import { stageReady } from '../src/lib/stageReady'
import { initialState } from '../src/state/store'

const base = () => initialState()

describe('stageReady', () => {
  it('prep needs every question answered', () => {
    const s = base()
    expect(stageReady('prep', s, false)).toBe(false)
    s.prep = Object.fromEntries(PREP_QUESTIONS.map((q) => [q.id, 'x']))
    expect(stageReady('prep', s, false)).toBe(true)
  })

  it('drive needs solved or revealed', () => {
    const s = base()
    expect(stageReady('drive1', s, false)).toBe(false)
    expect(stageReady('drive1', s, true)).toBe(true)
    s.guesses.drive2.solvedAtHint = 2
    expect(stageReady('drive2', s, false)).toBe(true)
  })

  it('siofok needs all photos and trivia', () => {
    const s = base()
    s.photos = SIOFOK_PHOTOS.map((p) => p.id)
    expect(stageReady('siofok', s, false)).toBe(false)
    s.trivia = Object.fromEntries(TRIVIA.map((q) => [q.id, 'x']))
    expect(stageReady('siofok', s, false)).toBe(true)
  })

  it('lunch needs a spin, chopsticks and a rated bite', () => {
    const s = base()
    s.lunch = { spins: ['a'], chopsticks: 3, ratings: [{ name: 'maki', hearts: 0 }] }
    expect(stageReady('lunch', s, false)).toBe(false)
    s.lunch.ratings = [{ name: 'maki', hearts: 4 }]
    expect(stageReady('lunch', s, false)).toBe(true)
  })

  it('kart needs locked tips, both laps and the photo', () => {
    const s = base()
    s.kart = { locked: true, herLap: 50, davidLap: 48 }
    expect(stageReady('kart', s, false)).toBe(false)
    s.photos = [KART.photo.id]
    expect(stageReady('kart', s, false)).toBe(true)
  })

  it('finale is always ready', () => {
    expect(stageReady('finale', base(), false)).toBe(true)
  })
})
