export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const body = await readBody<{ slug?: string; label?: string; description?: string; sortOrder?: number }>(event)
  if (!body.slug || !body.label) {
    throw createError({ statusCode: 400, message: 'slug and label are required' })
  }

  const category = await prisma.portfolioCategory.create({
    data: {
      slug: body.slug,
      label: body.label,
      description: body.description,
      sortOrder: body.sortOrder || 0,
    },
  })

  return { category }
})
