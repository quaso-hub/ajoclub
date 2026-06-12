export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')

  const items = await prisma.portfolioItem.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: true,
      template: true,
      metrics: { orderBy: { sortOrder: 'asc' } },
    },
  })

  return { items }
})
