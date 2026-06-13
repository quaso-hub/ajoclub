import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await prisma.user.upsert({
    where: { email: 'ajoclubofficial@gmail.com' },
    update: {},
    create: {
      email: 'ajoclubofficial@gmail.com',
      name: 'AjoClub Owner',
      role: 'OWNER',
    },
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
