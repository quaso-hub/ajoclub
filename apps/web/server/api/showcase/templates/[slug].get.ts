export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

  const template = await prisma.portfolioTemplate.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, label: true, description: true } },
    },
  })

  if (!template) throw createError({ statusCode: 404, message: 'Template not found' })

  return {
    template: {
      ...template,
      tags: JSON.parse(template.tags),
    },
  }
})
