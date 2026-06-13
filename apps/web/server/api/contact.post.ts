import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  project: z.string().max(100).optional(),
  message: z.string().min(1).max(5000),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, bodySchema.parse)

    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        project: body.project || null,
        message: body.message,
      },
    })

    return { success: true, id: contact.id }
  }
  catch (error) {
    console.error('Contact form error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to submit. Please try again.',
    })
  }
})
