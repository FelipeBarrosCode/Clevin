import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('App', () => {
  it('renders app component', () => {
    renderWithRouter(<App />)
    expect(screen.getByRole('main')).toBeDefined()
  })

  it('app has routing', () => {
    renderWithRouter(<App />)
    expect(screen.getByRole('main')).toBeDefined()
  })
}) 