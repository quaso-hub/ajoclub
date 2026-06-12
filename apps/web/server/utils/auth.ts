import type { H3Event } from 'h3'
import { createError, getCookie, getHeader, getRequestURL } from 'h3'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'
}

const roleRank: Record<AuthUser['role'], number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  OWNER: 3,
}

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

export async function requireRole(event: H3Event, minimumRole: AuthUser['role']) {
  const user = await requireAuth(event)
  if (roleRank[user.role] < roleRank[minimumRole]) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
  return user
}

async function getAuthUser(event: H3Event) {
  const config = useRuntimeConfig(event)
  const bearer = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  const token = bearer
    || getCookie(event, 'sb-access-token')
    || getCookie(event, 'supabase-access-token')
    || getCookie(event, 'session')

  const devToken = getHeader(event, 'x-admin-token')
  if (config.adminAuthToken && devToken === config.adminAuthToken) {
    return upsertKnownUser(config.adminEmail || `admin@${getRequestURL(event).hostname}`, 'OWNER')
  }

  if (!token || !config.supabaseUrl || !config.supabaseAnonKey) return null

  try {
    const response = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: config.supabaseAnonKey,
        authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return null

    const supabaseUser = await response.json() as {
      id: string
      email?: string
      user_metadata?: { name?: string; full_name?: string }
    }

    if (!supabaseUser.email) return null

    return await upsertKnownUser(
      supabaseUser.email,
      supabaseUser.email === config.adminEmail ? 'OWNER' : 'VIEWER',
      supabaseUser.id,
      supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || null,
    )
  }
  catch {
    return null
  }
}

async function upsertKnownUser(
  email: string,
  fallbackRole: AuthUser['role'],
  supabaseId?: string,
  name?: string | null,
): Promise<AuthUser> {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return normalizeUser(existing)
  }

  const created = await prisma.user.create({
    data: {
      email,
      name,
      supabaseId,
      role: fallbackRole,
    },
  })

  return normalizeUser(created)
}

function normalizeUser(user: { id: string; email: string; name: string | null; role: string }): AuthUser {
  const role = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'].includes(user.role)
    ? user.role as AuthUser['role']
    : 'VIEWER'

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role,
  }
}
