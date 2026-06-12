export default defineEventHandler(async (event) => {
  await requireRole(event, 'ADMIN')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Portfolio id is required' })

  const item = await prisma.portfolioItem.delete({ where: { id } })
  return { item }
})
