import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../pages/Landing'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Pages', () => {
  it('renders landing page', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByRole('main')).toBeDefined()
  })

  it('landing page has hero text', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/The First AI/)).toBeDefined()
  })
}) 