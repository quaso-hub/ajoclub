export default defineEventHandler(async (event) => {
  try {
    // Require authentication for accessing contacts
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
        // Exclude message from list view (PII minimization)
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
