export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const body = await readBody<{
    title?: string
    slug?: string
    summary?: string
    source?: string
    status?: string
    scenePreset?: string
    themeKey?: string
    accentColor?: string
    featured?: boolean
  }>(event)

  if (!body.title || !body.slug || !body.summary) {
    throw createError({ statusCode: 400, message: 'title, slug, and summary are required' })
  }

  const item = await prisma.portfolioItem.create({
    data: {
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      source: body.source || 'INTERNAL_DEMO',
      status: body.status || 'DRAFT',
      scenePreset: body.scenePreset || 'cinematic-scroll',
      themeKey: body.themeKey || 'studio',
      accentColor: body.accentColor || '#fb7185',
      featured: body.featured || false,
    },
  })

  return { item }
})
