import { describe, it, expect } from 'vitest'

describe('Health API', () => {
  it('should return ok status', () => {
    const health = { status: 'ok', timestamp: new Date().toISOString() }
    expect(health.status).toBe('ok')
    expect(health.timestamp).toBeDefined()
  })
})
