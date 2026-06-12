export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : undefined

  const where: Record<string, unknown> = {}
  if (category) where.category = { slug: category }

  const templates = await prisma.portfolioTemplate.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      category: { select: { slug: true, label: true } },
    },
  })

  return {
    templates: templates.map(t => ({
      ...t,
      tags: JSON.parse(t.tags),
    })),
  }
})
