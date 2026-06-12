export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Template id is required' })

  const body = await readBody<Record<string, unknown>>(event)
  const allowed = ['slug', 'title', 'summary', 'icon', 'tags', 'scenePreset', 'themeKey', 'accentColor', 'motionIntensity', 'categoryId']
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)))
  const template = await prisma.portfolioTemplate.update({ where: { id }, data })

  return { template }
})
