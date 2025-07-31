import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World! Server is running.' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.post('/api/test', (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  res.json({ message: `Hello ${name}!` })
})

describe('Server Routes', () => {
  it('should return hello message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Hello World! Server is running.')
  })

  it('should return health status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('OK')
    expect(response.body.timestamp).toBeDefined()
  })

  it('should handle POST request with valid data', async () => {
    const response = await request(app)
      .post('/api/test')
      .send({ name: 'John' })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Hello John!')
  })

  it('should return error for missing name', async () => {
    const response = await request(app)
      .post('/api/test')
      .send({})
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Name is required')
  })
}) 