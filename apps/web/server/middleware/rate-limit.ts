const rateLimit = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 100

// Purge expired entries every 60s to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetTime) rateLimit.delete(key)
  }
}, 60_000)

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
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
