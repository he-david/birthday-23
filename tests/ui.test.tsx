import { act, fireEvent, render, screen } from '@testing-library/react'
import { App } from '../src/App'
import { EnvelopeCard } from '../src/components/ui/EnvelopeCard'
import { Stamp } from '../src/components/ui/Stamp'
import { InstallGate } from '../src/screens/InstallGate'
import { PREP_QUESTIONS, STAGES, INSTALL_GATE } from '../src/content/stages'
import { initialState, useStore } from '../src/state/store'

function reset(simulatedNow: string) {
  localStorage.clear()
  useStore.setState({ ...initialState(), view: { name: 'timeline' }, simulatedNow })
}

describe('locked envelope', () => {
  it('has no stage title or reveal anywhere in its DOM', () => {
    const { container } = render(<EnvelopeCard state="locked" lockedLabel="Lezárt boríték" />)
    const html = container.innerHTML
    for (const s of STAGES) {
      expect(html).not.toContain(s.title)
      expect(html).not.toContain(s.reveal)
    }
    expect(container.querySelector('[aria-label],[title],img[alt]')).toBeNull()
  })
})

describe('Stamp', () => {
  it('renders an icon for every stage', () => {
    for (const s of STAGES) {
      const { container, unmount } = render(<Stamp id={s.id} />)
      expect(container.querySelector('svg path')).not.toBeNull()
      unmount()
    }
  })
})

describe('InstallGate', () => {
  it('shows only the install instructions', () => {
    render(<InstallGate />)
    expect(screen.getByText(INSTALL_GATE.instructions)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('Timeline', () => {
  it('shows 7 envelopes, locked ones without titles, next one with countdown', () => {
    reset('2026-10-10T10:30:00+02:00') // prep + drive1 open
    render(<App />)
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
    expect(screen.getByRole('button', { name: /Felkészülés/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Úton/ })).toBeInTheDocument()
    for (const t of ['Séta Siófokon', 'Ebéd', 'Újra úton', 'Gokart', 'Levél']) {
      expect(screen.queryByText(t)).not.toBeInTheDocument()
    }
    expect(screen.getAllByText('Lezárt boríték')).toHaveLength(5)
    expect(screen.getAllByText(/múlva nyílik/)).toHaveLength(1)
  })

  it('stamps a stage with Kész and keeps it in the store', () => {
    reset('2026-10-10T08:05:00+02:00')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Felkészülés/ }))
    expect(screen.queryByRole('button', { name: 'Kész' })).not.toBeInTheDocument()
    act(() => {
      useStore.setState({
        prep: Object.fromEntries(PREP_QUESTIONS.map((q) => [q.id, q.options[0]!])),
      })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Kész' }))
    expect(useStore.getState().stamps.prep).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Megszerzett bélyeg' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Kihagyom' })).not.toBeInTheDocument()
    expect(localStorage.getItem('kuldetes-v1')).toContain('"prep"')
  })

  it('offers no skip button', () => {
    reset('2026-10-10T08:05:00+02:00')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Felkészülés/ }))
    expect(screen.queryByRole('button', { name: 'Kihagyom' })).not.toBeInTheDocument()
  })

  it('a locked stage view falls back to the timeline', () => {
    reset('2026-10-10T08:05:00+02:00')
    useStore.setState({ view: { name: 'stage', id: 'kart' } })
    render(<App />)
    expect(screen.queryByText('Gokart')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(7)
  })
})
