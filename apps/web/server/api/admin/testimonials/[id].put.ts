export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Testimonial id is required' })

  const body = await readBody<Record<string, unknown>>(event)
  const allowed = ['authorName', 'authorRole', 'quote', 'consentStatus', 'source', 'portfolioId']
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)))
  const testimonial = await prisma.testimonial.update({ where: { id }, data })

  return { testimonial }
})
