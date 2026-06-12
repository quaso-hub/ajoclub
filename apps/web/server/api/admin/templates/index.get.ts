export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const templates = await prisma.portfolioTemplate.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })
  return { templates }
})
