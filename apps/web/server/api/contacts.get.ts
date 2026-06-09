export default defineEventHandler(async () => {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return { contacts }
})
