import { describe, expect, it } from 'vitest'
import { DRIVES, STAGES } from '../src/content/stages'
import {
  countdownLabel,
  currentNowMs,
  effectiveTime,
  hintTimes,
  isOpen,
  isWelcome,
  nextLockedStage,
  openHintCount,
  parseIso,
  stageCountdownLabel,
  type UnlockContext,
} from '../src/state/unlock'

const t = (hhmm: string) => parseIso(`2026-10-10T${hhmm}:00+02:00`)
const ctx = (over: Partial<UnlockContext> = {}): UnlockContext => ({
  shiftMinutes: 0,
  forcedUnlocked: [],
  opened: [],
  ...over,
})

describe('schedule content', () => {
  it('has seven stages in time order with +02:00 offsets', () => {
    expect(STAGES.map((s) => s.id)).toEqual([
      'prep',
      'drive1',
      'siofok',
      'lunch',
      'drive2',
      'kart',
      'finale',
    ])
    const times = STAGES.map((s) => parseIso(s.unlockAt))
    expect([...times].sort((a, b) => a - b)).toEqual(times)
    for (const s of STAGES) expect(s.unlockAt.endsWith('+02:00')).toBe(true)
  })
})

describe('isOpen (time unlock)', () => {
  it('is locked before and open from the exact time', () => {
    expect(isOpen('prep', ctx(), t('07:59'))).toBe(false)
    expect(isOpen('prep', ctx(), t('08:00'))).toBe(true)
    expect(isOpen('prep', ctx(), t('23:00'))).toBe(true)
  })
  it('opens stages independently of each other', () => {
    expect(isOpen('kart', ctx(), t('16:00'))).toBe(true)
    expect(isOpen('finale', ctx(), t('16:00'))).toBe(false)
  })
})

describe('shift', () => {
  it('moves not-yet-open stages', () => {
    expect(effectiveTime('lunch', ctx({ shiftMinutes: 15 }))).toBe(t('13:15'))
    expect(isOpen('lunch', ctx({ shiftMinutes: 15 }), t('13:10'))).toBe(false)
    expect(isOpen('lunch', ctx({ shiftMinutes: 15 }), t('13:15'))).toBe(true)
    expect(isOpen('lunch', ctx({ shiftMinutes: -15 }), t('12:45'))).toBe(true)
  })
  it('does not move stages that are already opened', () => {
    const c = ctx({ shiftMinutes: 30, opened: ['lunch'] })
    expect(effectiveTime('lunch', c)).toBe(t('13:00'))
    expect(isOpen('lunch', c, t('13:00'))).toBe(true)
    expect(effectiveTime('drive2', c)).toBe(t('15:00'))
  })
})

describe('forced unlock', () => {
  it('opens a stage before its time', () => {
    const c = ctx({ forcedUnlocked: ['finale'] })
    expect(isOpen('finale', c, t('09:00'))).toBe(true)
    expect(isOpen('kart', c, t('09:00'))).toBe(false)
  })
  it('is not affected by shift', () => {
    const c = ctx({ forcedUnlocked: ['finale'], shiftMinutes: 60 })
    expect(effectiveTime('finale', c)).toBe(t('17:30'))
  })
})

describe('nextLockedStage and welcome', () => {
  it('returns the first locked stage', () => {
    expect(nextLockedStage(ctx(), t('07:00'))).toBe('prep')
    expect(nextLockedStage(ctx(), t('10:30'))).toBe('siofok')
    expect(nextLockedStage(ctx(), t('18:00'))).toBeUndefined()
  })
  it('skips forced stages', () => {
    expect(nextLockedStage(ctx({ forcedUnlocked: ['prep', 'drive1'] }), t('07:00'))).toBe('siofok')
  })
  it('shows welcome only before prep opens', () => {
    expect(isWelcome(ctx(), t('07:59'))).toBe(true)
    expect(isWelcome(ctx(), t('08:00'))).toBe(false)
    expect(isWelcome(ctx({ forcedUnlocked: ['prep'] }), t('07:00'))).toBe(false)
  })
})

describe('simulated clock', () => {
  it('returns real time when no simulation', () => {
    expect(currentNowMs(123)).toBe(123)
  })
  it('returns simulated time when set', () => {
    expect(currentNowMs(123, '2026-10-10T11:30:00+02:00')).toBe(t('11:30'))
  })
  it('falls back to real time on an invalid string', () => {
    expect(currentNowMs(123, 'nope')).toBe(123)
  })
  it('drives unlocking', () => {
    const sim = currentNowMs(0, '2026-10-10T13:00:00+02:00')
    expect(isOpen('lunch', ctx(), sim)).toBe(true)
    expect(isOpen('drive2', ctx(), sim)).toBe(false)
  })
})

describe('hint offsets', () => {
  it('drive1 hints at 10:20, 10:45, 11:10', () => {
    expect(hintTimes('drive1', ctx())).toEqual([t('10:20'), t('10:45'), t('11:10')])
  })
  it('drive2 hints at 14:30, 14:45, 15:00', () => {
    expect(hintTimes('drive2', ctx())).toEqual([t('14:30'), t('14:45'), t('15:00')])
  })
  it('uses the offsets from content', () => {
    expect(DRIVES.drive1.hints.map((h) => h.offsetMin)).toEqual([20, 45, 70])
    expect(DRIVES.drive2.hints.map((h) => h.offsetMin)).toEqual([0, 15, 30])
  })
  it('moves with the shift', () => {
    expect(hintTimes('drive1', ctx({ shiftMinutes: 15 }))).toEqual([
      t('10:35'),
      t('11:00'),
      t('11:25'),
    ])
    expect(hintTimes('drive2', ctx({ shiftMinutes: -15 }))).toEqual([
      t('14:15'),
      t('14:30'),
      t('14:45'),
    ])
  })
  it('counts open hints', () => {
    expect(openHintCount('drive1', ctx(), t('09:59'))).toBe(0)
    expect(openHintCount('drive1', ctx(), t('10:19'))).toBe(0)
    expect(openHintCount('drive1', ctx(), t('10:20'))).toBe(1)
    expect(openHintCount('drive1', ctx(), t('10:45'))).toBe(2)
    expect(openHintCount('drive1', ctx(), t('11:10'))).toBe(3)
    expect(openHintCount('drive2', ctx(), t('14:30'))).toBe(1)
    expect(openHintCount('drive2', ctx({ shiftMinutes: 15 }), t('14:40'))).toBe(0)
  })
})

describe('countdown label', () => {
  const min = 60_000
  it('formats hours and minutes', () => {
    expect(countdownLabel(134 * min)).toBe('2 óra 14 perc múlva nyílik')
  })
  it('formats whole hours and minutes only', () => {
    expect(countdownLabel(120 * min)).toBe('2 óra múlva nyílik')
    expect(countdownLabel(14 * min)).toBe('14 perc múlva nyílik')
  })
  it('rounds seconds up to the next minute', () => {
    expect(countdownLabel(14 * min + 1)).toBe('15 perc múlva nyílik')
    expect(countdownLabel(5_000)).toBe('1 perc múlva nyílik')
  })
  it('handles days and the zero case', () => {
    expect(countdownLabel(26 * 60 * min)).toBe('1 nap 2 óra múlva nyílik')
    expect(countdownLabel(0)).toBe('most nyílik')
    expect(countdownLabel(-5)).toBe('most nyílik')
  })
  it('labels a stage with shift applied', () => {
    expect(stageCountdownLabel('prep', ctx(), t('05:46'))).toBe('2 óra 14 perc múlva nyílik')
    expect(stageCountdownLabel('prep', ctx({ shiftMinutes: 15 }), t('05:46'))).toBe(
      '2 óra 29 perc múlva nyílik',
    )
  })
})
