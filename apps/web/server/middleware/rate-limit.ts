const rateLimit = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // per window

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  // Only rate limit API endpoints
  if (!path.startsWith('/api/')) return

  const ip = getRequestIP(event) || 'unknown'
  const key = `${ip}:${path}`
  const now = Date.now()

  const entry = rateLimit.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + WINDOW_MS })
    return
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
    })
  }
})
