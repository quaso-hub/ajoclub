export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Category id is required' })

  const body = await readBody<Record<string, unknown>>(event)
  const allowed = ['slug', 'label', 'description', 'sortOrder']
  const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)))
  const category = await prisma.portfolioCategory.update({ where: { id }, data })

  return { category }
})
