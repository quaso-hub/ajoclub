export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Portfolio id is required' })

  const item = await prisma.portfolioItem.update({
    where: { id },
    data: { status: 'ARCHIVED', archivedAt: new Date() },
  })

  return { item }
})
