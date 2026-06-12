export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

  const item = await prisma.portfolioItem.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: { select: { slug: true, label: true } },
      template: { select: { slug: true, title: true } },
      metrics: { orderBy: { sortOrder: 'asc' }, select: { label: true, value: true, note: true } },
      testimonials: {
        where: { consentStatus: 'APPROVED' },
        select: { authorName: true, authorRole: true, quote: true },
      },
    },
  })

  if (!item) throw createError({ statusCode: 404, message: 'Portfolio not found' })

  return {
    item: {
      ...item,
      tags: JSON.parse(item.tags),
    },
  }
})
