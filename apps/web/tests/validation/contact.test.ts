import { describe, it, expect } from 'vitest'
import * as v from 'valibot'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.pipe(v.string(), v.email()),
  project: v.optional(v.string()),
  message: v.pipe(v.string(), v.minLength(1)),
})

describe('Contact form validation', () => {
  it('accepts valid data', () => {
    const result = v.safeParse(schema, {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = v.safeParse(schema, {
      name: 'John',
      email: 'not-an-email',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = v.safeParse(schema, {
      name: '',
      email: 'john@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty message', () => {
    const result = v.safeParse(schema, {
      name: 'John',
      email: 'john@example.com',
      message: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional project field', () => {
    const result = v.safeParse(schema, {
      name: 'John',
      email: 'john@example.com',
      project: 'landing',
      message: 'Hello',
    })
    expect(result.success).toBe(true)
  })
})
