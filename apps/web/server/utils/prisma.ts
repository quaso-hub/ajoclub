import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }

  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getPrismaClient(), property, receiver)
  },
})

export async function disconnectPrisma() {
  if (env.NODE_ENV === 'production') return
  await globalForPrisma.prisma?.$disconnect()
}
