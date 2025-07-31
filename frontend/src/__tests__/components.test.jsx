import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Components', () => {
  it('renders header component', () => {
    renderWithRouter(<Header />)
    expect(screen.getByRole('banner')).toBeDefined()
  })

  it('renders footer component', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeDefined()
  })

  it('header has navigation', () => {
    renderWithRouter(<Header />)
    expect(screen.getByRole('navigation')).toBeDefined()
  })
}) 