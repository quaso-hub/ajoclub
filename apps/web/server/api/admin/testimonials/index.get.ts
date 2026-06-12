export default defineEventHandler(async (event) => {
  await requireRole(event, 'EDITOR')
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { portfolio: { select: { id: true, title: true, slug: true } } },
  })
  return { testimonials }
})
