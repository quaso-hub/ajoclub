import type { H3Event } from 'h3'

// Simple session-based auth using cookies
// Replace with Supabase Auth when @nuxtjs/supabase is installed

export async function requireAuth(event: H3Event) {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}

export async function optionalAuth(event: H3Event) {
  return await getAuthUser(event)
}

async function getAuthUser(event: H3Event) {
  // Check for session cookie (placeholder - implement with Supabase Auth)
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) return null

  // TODO: Validate session token against Supabase when installed
  // For now, return null (no auth)
  return null
}
