export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Portfolio id is required' })

  const item = await prisma.portfolioItem.findUnique({
    where: { id },
    include: {
      category: true,
      template: true,
      sections: { orderBy: { sortOrder: 'asc' } },
      metrics: { orderBy: { sortOrder: 'asc' } },
      testimonials: true,
      media: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!item) throw createError({ statusCode: 404, message: 'Portfolio item not found' })
  return { item }
})
