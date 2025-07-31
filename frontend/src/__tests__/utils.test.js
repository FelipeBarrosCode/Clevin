import { describe, it, expect } from 'vitest'

describe('Utils', () => {
  it('should add two numbers', () => {
    const add = (a, b) => a + b
    expect(add(2, 3)).toBe(5)
  })

  it('should multiply two numbers', () => {
    const multiply = (a, b) => a * b
    expect(multiply(4, 5)).toBe(20)
  })

  it('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
}) 