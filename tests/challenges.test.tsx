import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DRIVES, KART, TRIVIA } from '../src/content/stages'
import { Drive1 } from '../src/stages/Drive1'
import { Kart } from '../src/stages/Kart'
import { Siofok } from '../src/stages/Siofok'
import { initialState, useStore } from '../src/state/store'

const at = (hhmm: string) => `2026-10-10T${hhmm}:00+02:00`

beforeEach(() => {
  localStorage.clear()
  useStore.setState({ ...initialState(), view: { name: 'timeline' } })
})

describe('HintGuess (drive1)', () => {
  it('shows no hint before +20 min and cannot be guessed', () => {
    useStore.setState({ simulatedNow: at('10:10') })
    render(<Drive1 />)
    expect(screen.queryByText(DRIVES.drive1.hints[0].text)).toBeNull()
    expect(screen.getByRole('button', { name: 'Tihany' })).toBeDisabled()
  })

  it('allows one guess per hint, then a wrong message and wait', async () => {
    const user = userEvent.setup()
    useStore.setState({ simulatedNow: at('10:25') })
    render(<Drive1 />)
    expect(screen.getByText(DRIVES.drive1.hints[0].text)).toBeInTheDocument()
    expect(screen.queryByText(DRIVES.drive1.hints[1].text)).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Tihany' }))
    expect(screen.getByText(DRIVES.drive1.wrongGuess)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Velence' })).toBeDisabled()
    expect(useStore.getState().guesses.drive1.tries).toEqual(['Tihany'])
  })

  it('reveals and records the hint on a correct guess', async () => {
    const user = userEvent.setup()
    useStore.setState({ simulatedNow: at('10:50') })
    render(<Drive1 />)
    await user.click(screen.getByRole('button', { name: 'Siófok' }))
    expect(useStore.getState().guesses.drive1.solvedAtHint).toBe(2)
    expect(screen.queryByRole('button', { name: 'Siófok' })).toBeNull()
    expect(screen.getByText('Siófok')).toBeInTheDocument()
  })

  it('moves with the shift', () => {
    useStore.setState({ simulatedNow: at('10:25'), shiftMinutes: 15 })
    render(<Drive1 />)
    expect(screen.queryByText(DRIVES.drive1.hints[0].text)).toBeNull()
  })

  it('shows the answer when siofok opens, even if unsolved', () => {
    useStore.setState({ simulatedNow: at('11:31') })
    render(<Drive1 />)
    expect(screen.getByText('Siófok')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tihany' })).toBeNull()
  })
})

describe('Trivia (siofok)', () => {
  it('shows the right answer after a wrong one and stores it', async () => {
    const user = userEvent.setup()
    render(<Siofok />)
    await user.click(screen.getByRole('button', { name: '1892' }))
    expect(screen.getByText(/A helyes válasz: 1912/)).toBeInTheDocument()
    expect(useStore.getState().trivia[TRIVIA[0]?.id as string]).toBe('1892')
    await user.click(screen.getByRole('button', { name: 'Víztartály' }))
    expect(screen.getByText('Pontosan.')).toBeInTheDocument()
  })
})

describe('Kart', () => {
  it('locks predictions on Rajt, then shows the podium after both laps', async () => {
    const user = userEvent.setup()
    render(<Kart />)
    const input = screen.getByLabelText(KART.lapPrompt)
    expect(input).toHaveAttribute('inputmode', 'decimal')
    await user.type(input, '62,5')
    await user.click(screen.getByRole('button', { name: 'Dávid' }))
    await user.click(screen.getByRole('button', { name: KART.startLabel }))
    expect(useStore.getState().kart).toMatchObject({
      predictedLap: 62.5,
      predictedWinner: 'david',
      locked: true,
    })
    expect(screen.queryByLabelText(KART.lapPrompt)).toBeNull()
    const show = screen.getByRole('button', { name: KART.showResult })
    expect(show).toBeDisabled()
    await user.type(screen.getByLabelText(KART.herLapLabel), '64.3')
    await user.type(screen.getByLabelText(KART.davidLapLabel), '61,2')
    await user.click(show)
    expect(screen.getByText(`${KART.winnerLine} ${KART.david}`)).toBeInTheDocument()
    expect(screen.getByText(KART.winnerHit)).toBeInTheDocument()
  })

  it('lets Rajt through with no tips', async () => {
    const user = userEvent.setup()
    render(<Kart />)
    await user.click(screen.getByRole('button', { name: KART.startLabel }))
    expect(useStore.getState().kart.locked).toBe(true)
  })
})
