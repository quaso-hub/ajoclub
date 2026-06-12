export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : undefined
  const template = typeof query.template === 'string' ? query.template : undefined
  const featured = query.featured === 'true'
  const limit = typeof query.limit === 'string' ? Number.parseInt(query.limit, 10) : undefined
  const cursor = typeof query.cursor === 'string' ? query.cursor : undefined

  const where: Record<string, unknown> = { status: 'PUBLISHED' }
  if (category) where.category = { slug: category }
  if (template) where.template = { slug: template }
  if (featured) where.featured = true

  const take = Number.isFinite(limit) && limit ? Math.max(1, Math.min(limit, 24)) : 50

  const items = await prisma.portfolioItem.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      category: { select: { slug: true, label: true } },
      template: { select: { slug: true, title: true } },
      metrics: { orderBy: { sortOrder: 'asc' }, select: { label: true, value: true, note: true } },
    },
  })

  const nextItem = items[take]
  const data = items.slice(0, take)

  return {
    items: data.map(item => ({
      ...item,
      tags: JSON.parse(item.tags),
      metrics: item.metrics,
    })),
    total: data.length,
    nextCursor: nextItem?.id ?? null,
    source: 'database',
  }
})
