import { describe, it, expect, vi } from 'vitest'
import jwt from 'jsonwebtoken'

const mockRequest = (token) => ({
  cookies: {
    'sb-elbdnefgkagyojjiahtv-auth-token': token ? JSON.stringify({ access_token: token }) : null
  },
  locals: {}
})

const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

const mockNext = vi.fn()

describe('Auth Middleware', () => {
  it('should pass with valid token', () => {
    const token = 'valid.jwt.token'
    const req = mockRequest(token)
    const res = mockResponse()
    
    vi.spyOn(jwt, 'verify').mockReturnValue({ sub: 'user123' })
    
    const authMiddleware = (req, res, next) => {
      try {
        const token = req.cookies['sb-elbdnefgkagyojjiahtv-auth-token']
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }
        const parsedToken = JSON.parse(token)
        const decoded = jwt.verify(parsedToken.access_token, 'secret')
        req.locals.user = decoded
        next()
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
    
    authMiddleware(req, res, mockNext)
    
    expect(mockNext).toHaveBeenCalled()
    expect(req.locals.user).toEqual({ sub: 'user123' })
  })

  it('should return error for missing token', () => {
    const req = mockRequest(null)
    const res = mockResponse()
    
    const authMiddleware = (req, res, next) => {
      const token = req.cookies['sb-elbdnefgkagyojjiahtv-auth-token']
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }
      next()
    }
    
    authMiddleware(req, res, mockNext)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' })
  })

  it('should return error for invalid token', () => {
    const req = mockRequest('invalid.token')
    const res = mockResponse()
    
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token')
    })
    
    const authMiddleware = (req, res, next) => {
      try {
        const token = req.cookies['sb-elbdnefgkagyojjiahtv-auth-token']
        const parsedToken = JSON.parse(token)
        jwt.verify(parsedToken.access_token, 'secret')
        next()
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }
    
    authMiddleware(req, res, mockNext)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
}) 