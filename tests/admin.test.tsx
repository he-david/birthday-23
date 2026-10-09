import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../src/App'
import { PinPad } from '../src/components/admin/PinPad'
import { ADMIN_PIN } from '../src/content/stages'
import { fromPickerValue, toPickerValue } from '../src/lib/clock'
import { appendDigit, isPinCorrect, removeDigit } from '../src/lib/pin'
import { registerTap } from '../src/lib/tapCounter'
import { initialState, useStore } from '../src/state/store'
import { isOpen } from '../src/state/unlock'

describe('registerTap', () => {
  it('triggers on the fifth tap within 3 s', () => {
    let taps: number[] = []
    let triggered = false
    for (const t of [0, 500, 1000, 1500, 2000]) ({ taps, triggered } = registerTap(taps, t))
    expect(triggered).toBe(true)
    expect(taps).toEqual([])
  })
  it('does not trigger when taps are spread out', () => {
    let taps: number[] = []
    let triggered = false
    for (const t of [0, 1000, 2000, 3000, 4000]) ({ taps, triggered } = registerTap(taps, t))
    expect(triggered).toBe(false)
  })
  it('does not trigger on four taps', () => {
    let taps: number[] = []
    let triggered = false
    for (const t of [0, 100, 200, 300]) ({ taps, triggered } = registerTap(taps, t))
    expect(triggered).toBe(false)
  })
})

describe('pin helpers', () => {
  it('builds and checks a PIN', () => {
    expect(appendDigit('12', '3')).toBe('123')
    expect(appendDigit('1234', '5')).toBe('1234')
    expect(appendDigit('1', 'x')).toBe('1')
    expect(removeDigit('123')).toBe('12')
    expect(isPinCorrect(ADMIN_PIN, ADMIN_PIN)).toBe(true)
    expect(isPinCorrect('9999', ADMIN_PIN)).toBe(false)
    expect(isPinCorrect('', ADMIN_PIN)).toBe(false)
  })
})

describe('picker conversion', () => {
  it('round-trips Budapest wall clock', () => {
    const iso = fromPickerValue('2026-10-10T14:30')
    expect(iso).toBe('2026-10-10T14:30:00+02:00')
    expect(toPickerValue(Date.parse(iso as string))).toBe('2026-10-10T14:30')
    expect(fromPickerValue('')).toBeUndefined()
  })
})

describe('PinPad', () => {
  it('accepts the right PIN and rejects a wrong one', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<PinPad onSuccess={onSuccess} onCancel={() => undefined} />)
    for (const d of '9999') await user.click(screen.getByRole('button', { name: d }))
    expect(onSuccess).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Hibás PIN')
    for (const d of ADMIN_PIN) await user.click(screen.getByRole('button', { name: d }))
    expect(onSuccess).toHaveBeenCalledOnce()
  })
})

describe('store admin actions', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.setState({ ...initialState(), view: { name: 'timeline' }, simulatedNow: undefined })
  })

  it('forceNext opens exactly one stage', () => {
    const now = Date.parse('2026-10-09T20:00:00+02:00')
    expect(useStore.getState().forceNext(now)).toBe('prep')
    expect(useStore.getState().forcedUnlocked).toEqual(['prep'])
    expect(useStore.getState().forceNext(now)).toBe('drive1')
    expect(useStore.getState().forcedUnlocked).toEqual(['prep', 'drive1'])
  })

  it('simulating a time opens the right stages and shows the banner', () => {
    useStore.setState({ simulatedNow: '2026-10-10T12:00:00+02:00' })
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('ELŐNÉZET')
    const s = useStore.getState()
    const now = Date.parse('2026-10-10T12:00:00+02:00')
    expect(isOpen('siofok', s, now)).toBe(true)
    expect(isOpen('lunch', s, now)).toBe(false)
  })

  it('five seal taps open the admin in dev, +15 shifts the locked stages', async () => {
    useStore.setState({ simulatedNow: '2026-10-10T09:00:00+02:00' })
    render(<App />)
    const seal = screen.getByRole('button', { name: 'Pecsét' })
    for (let i = 0; i < 5; i++) fireEvent.click(seal)
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '+15 perc' }))
    expect(useStore.getState().shiftMinutes).toBe(15)
    expect(screen.getByTestId('shift')).toHaveTextContent('+15 perc')
    expect(screen.getByText('10:15')).toBeInTheDocument()
  })
})
