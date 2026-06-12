export default defineEventHandler(async () => {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, slug: true, label: true, description: true },
  })

  return { categories }
})
