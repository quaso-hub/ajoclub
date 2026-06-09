import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Name, email, and message are required.',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email address.',
    })
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        project: body.project || null,
        message: body.message,
      },
    })

    return {
      success: true,
      id: contact.id,
    }
  }
  catch (error) {
    console.error('Contact form error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save contact. Please try again.',
    })
  }
  finally {
    await prisma.$disconnect()
  }
})
