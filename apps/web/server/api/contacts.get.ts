export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        project: true,
        status: true,
        createdAt: true,
      },
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
})
