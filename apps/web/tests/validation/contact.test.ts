import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  project: z.string().max(100).optional(),
  message: z.string().min(1).max(5000),
})

describe('Contact form validation', () => {
  it('accepts valid data', () => {
    const result = schema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = schema.safeParse({
      name: 'John',
      email: 'not-an-email',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = schema.safeParse({
      name: '',
      email: 'john@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty message', () => {
    const result = schema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional project field', () => {
    const result = schema.safeParse({
      name: 'John',
      email: 'john@example.com',
      project: 'landing',
      message: 'Hello',
    })
    expect(result.success).toBe(true)
  })
})
