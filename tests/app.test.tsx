import { render, screen } from '@testing-library/react'
import { App } from '../src/App'
import { initialState, useStore } from '../src/state/store'

describe('App shell', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.setState({ ...initialState(), view: { name: 'timeline' } })
  })

  it('shows only the welcome countdown before the first stage opens', () => {
    useStore.setState({ simulatedNow: '2026-10-09T20:00:00+02:00' })
    render(<App />)
    expect(screen.getByText(/múlva nyílik/)).toBeInTheDocument()
    expect(screen.queryByText('Felkészülés')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
