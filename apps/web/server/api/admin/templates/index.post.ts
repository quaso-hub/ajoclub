export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const body = await readBody<{
    slug?: string
    title?: string
    summary?: string
    icon?: string
    tags?: string
    scenePreset?: string
    themeKey?: string
    accentColor?: string
    motionIntensity?: string
    categoryId?: string
  }>(event)

  if (!body.slug || !body.title || !body.summary) {
    throw createError({ statusCode: 400, message: 'slug, title, and summary are required' })
  }

  const template = await prisma.portfolioTemplate.create({
    data: {
      slug: body.slug,
      title: body.title,
      summary: body.summary,
      icon: body.icon,
      tags: body.tags || '[]',
      scenePreset: body.scenePreset || 'cinematic-scroll',
      themeKey: body.themeKey || 'studio',
      accentColor: body.accentColor || '#fb7185',
      motionIntensity: body.motionIntensity || 'balanced',
      categoryId: body.categoryId,
    },
  })

  return { template }
})
