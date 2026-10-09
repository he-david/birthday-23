import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App scaffold', () => {
  it('renders the placeholder with Hungarian double-acute letters', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Küldetés' })).toBeInTheDocument()
    expect(screen.getByText(/ő ű Ő Ű/, { selector: 'p.font-hand' })).toBeInTheDocument()
  })
})
