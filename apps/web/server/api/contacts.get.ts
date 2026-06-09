import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return { contacts }
  }
  catch (error) {
    console.error('Fetch contacts error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch contacts.',
    })
  }
  finally {
    await prisma.$disconnect()
  }
})
