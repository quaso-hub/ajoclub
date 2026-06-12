export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const body = await readBody<{
    authorName?: string
    authorRole?: string
    quote?: string
    consentStatus?: string
    source?: string
    portfolioId?: string
  }>(event)

  if (!body.authorName || !body.quote) {
    throw createError({ statusCode: 400, message: 'authorName and quote are required' })
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      authorName: body.authorName,
      authorRole: body.authorRole,
      quote: body.quote,
      consentStatus: body.consentStatus || 'PENDING',
      source: body.source || 'CLIENT_WORK',
      portfolioId: body.portfolioId,
    },
  })

  return { testimonial }
})
