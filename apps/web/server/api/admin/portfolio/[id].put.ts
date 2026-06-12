export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Portfolio id is required' })

  const body = await readBody<Record<string, unknown>>(event)
  const allowed = [
    'title',
    'slug',
    'summary',
    'problem',
    'approach',
    'result',
    'credibility',
    'source',
    'consentStatus',
    'tags',
    'scenePreset',
    'themeKey',
    'accentColor',
    'mediaRefs',
    'cameraShots',
    'motionIntensity',
    'featured',
  ]
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)))

  const item = await prisma.portfolioItem.update({
    where: { id },
    data,
  })

  return { item }
})
