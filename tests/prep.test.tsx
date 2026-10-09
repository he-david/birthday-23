import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PACKING, PREP_QUESTIONS } from '../src/content/stages'
import { firstUnanswered } from '../src/lib/prep'
import { Prep } from '../src/stages/Prep'
import { initialState, useStore } from '../src/state/store'

describe('firstUnanswered', () => {
  it('finds the first gap and -1 when complete', () => {
    expect(firstUnanswered(PREP_QUESTIONS, {})).toBe(0)
    expect(firstUnanswered(PREP_QUESTIONS, { shoes: 'x', hair: 'y' })).toBe(1)
    const all = Object.fromEntries(PREP_QUESTIONS.map((q) => [q.id, 'x']))
    expect(firstUnanswered(PREP_QUESTIONS, all)).toBe(-1)
  })
})

describe('Prep quiz', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.setState({ ...initialState(), view: { name: 'timeline' } })
  })

  it('walks six questions, shows reveals, then the packing list', async () => {
    const user = userEvent.setup()
    render(<Prep />)
    for (const q of PREP_QUESTIONS) {
      expect(screen.getByRole('heading', { name: q.question })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: q.options[0] as string }))
      expect(screen.getByText(q.reveal)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Tovább' }))
    }
    expect(screen.getByRole('heading', { name: PACKING.title })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(PACKING.items.length)
    expect(screen.getByText(PACKING.teaser)).toBeInTheDocument()
    expect(useStore.getState().prep['shoes']).toBe(PREP_QUESTIONS[0]?.options[0])
  })

  it('resumes from persisted answers and keeps the list readable', () => {
    const all = Object.fromEntries(PREP_QUESTIONS.map((q) => [q.id, q.options[0] as string]))
    useStore.setState({ prep: all })
    render(<Prep />)
    expect(screen.getByRole('heading', { name: PACKING.title })).toBeInTheDocument()
  })

  it('resumes at the first unanswered question', () => {
    useStore.setState({ prep: { shoes: 'Sportcipő' } })
    render(<Prep />)
    expect(screen.getByRole('heading', { name: PREP_QUESTIONS[1]?.question })).toBeInTheDocument()
  })
})
