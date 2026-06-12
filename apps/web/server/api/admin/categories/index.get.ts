export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const categories = await prisma.portfolioCategory.findMany({ orderBy: { sortOrder: 'asc' } })
  return { categories }
})
