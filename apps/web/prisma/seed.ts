import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.portfolioCategory.upsert({
      where: { slug: 'growth' },
      update: {},
      create: {
        slug: 'growth',
        label: 'Growth Site',
        description: 'Landing page dan company profile yang fokus ke konversi.',
        sortOrder: 0,
      },
    }),
    prisma.portfolioCategory.upsert({
      where: { slug: 'product' },
      update: {},
      create: {
        slug: 'product',
        label: 'Product App',
        description: 'SaaS, dashboard, dan web app untuk operasional.',
        sortOrder: 1,
      },
    }),
    prisma.portfolioCategory.upsert({
      where: { slug: 'experience' },
      update: {},
      create: {
        slug: 'experience',
        label: 'Immersive',
        description: 'Portfolio dan event dengan visual interaktif.',
        sortOrder: 2,
      },
    }),
    prisma.portfolioCategory.upsert({
      where: { slug: 'commerce' },
      update: {},
      create: {
        slug: 'commerce',
        label: 'Commerce',
        description: 'Menu, katalog, booking, dan alur order.',
        sortOrder: 3,
      },
    }),
  ])

  console.log(`  Categories: ${categories.length}`)

  // Templates
  const templates = await Promise.all([
    prisma.portfolioTemplate.upsert({
      where: { slug: 'company-profile' },
      update: {},
      create: {
        slug: 'company-profile',
        title: 'Company Profile',
        summary: 'Website untuk bisnis yang perlu terlihat kredibel.',
        icon: 'i-lucide-building-2',
        tags: JSON.stringify(['Corporate', 'Trust', 'SEO']),
        scenePreset: 'cinematic-scroll',
        themeKey: 'executive',
        accentColor: '#60a5fa',
        categoryId: categories[0].id,
      },
    }),
    prisma.portfolioTemplate.upsert({
      where: { slug: 'landing-page' },
      update: {},
      create: {
        slug: 'landing-page',
        title: 'Conversion Landing',
        summary: 'Landing page dengan narasi dan CTA yang jelas.',
        icon: 'i-lucide-rocket',
        tags: JSON.stringify(['Marketing', 'Lead', 'Analytics']),
        scenePreset: 'shader-portal',
        themeKey: 'launch',
        accentColor: '#fb7185',
        categoryId: categories[0].id,
      },
    }),
    prisma.portfolioTemplate.upsert({
      where: { slug: 'saas-dashboard' },
      update: {},
      create: {
        slug: 'saas-dashboard',
        title: 'SaaS Dashboard',
        summary: 'Dashboard untuk produk yang dipakai harian.',
        icon: 'i-lucide-chart-no-axes-combined',
        tags: JSON.stringify(['SaaS', 'RBAC', 'Data UX']),
        scenePreset: 'case-timeline',
        themeKey: 'control-room',
        accentColor: '#a78bfa',
        categoryId: categories[1].id,
      },
    }),
    prisma.portfolioTemplate.upsert({
      where: { slug: 'portfolio-showroom' },
      update: {},
      create: {
        slug: 'portfolio-showroom',
        title: 'Portfolio Showroom',
        summary: 'Showcase karya dengan motion dan detail.',
        icon: 'i-lucide-sparkles',
        tags: JSON.stringify(['Portfolio', '3D', 'Case Study']),
        scenePreset: 'particle-morph',
        themeKey: 'studio',
        accentColor: '#2dd4bf',
        categoryId: categories[2].id,
      },
    }),
    prisma.portfolioTemplate.upsert({
      where: { slug: 'restaurant-booking' },
      update: {},
      create: {
        slug: 'restaurant-booking',
        title: 'Restaurant Booking',
        summary: 'Menu, reservasi, dan CTA order untuk restoran.',
        icon: 'i-lucide-utensils',
        tags: JSON.stringify(['Menu', 'Booking', 'Mobile']),
        scenePreset: 'orbit-product',
        themeKey: 'hospitality',
        accentColor: '#f59e0b',
        categoryId: categories[3].id,
      },
    }),
  ])

  console.log(`  Templates: ${templates.length}`)

  // Portfolio Items
  const items = await Promise.all([
    prisma.portfolioItem.upsert({
      where: { slug: 'launch-suite-local-service' },
      update: {},
      create: {
        slug: 'launch-suite-local-service',
        title: 'Launch Suite for Local Service Business',
        summary: 'Blueprint landing untuk bisnis jasa lokal.',
        problem: 'Website lama terasa generik dan tidak menjawab pertanyaan calon klien.',
        approach: 'Narasi proof-first: positioning, problem framing, process, FAQ, CTA WhatsApp.',
        result: 'Struktur lead yang lebih tajam dan waktu setup lebih pendek.',
        credibility: 'Dirancang sebagai template yang bisa disesuaikan dengan bisnis nyata.',
        source: 'INTERNAL_DEMO',
        status: 'PUBLISHED',
        consentStatus: 'NOT_REQUIRED',
        tags: JSON.stringify(['Landing Page', 'WhatsApp CTA', 'Trust Copy']),
        scenePreset: 'shader-portal',
        themeKey: 'launch',
        accentColor: '#fb7185',
        motionIntensity: 'immersive',
        featured: true,
        publishedAt: new Date('2026-06-01'),
        categoryId: categories[0].id,
        templateId: templates[1].id,
      },
    }),
    prisma.portfolioItem.upsert({
      where: { slug: 'operator-control-room' },
      update: {},
      create: {
        slug: 'operator-control-room',
        title: 'Operator Control Room',
        summary: 'Dashboard SaaS untuk operasi kecil.',
        problem: 'Tim kecil memakai spreadsheet untuk proses yang butuh permission dan riwayat.',
        approach: 'Dashboard: command center, queue kerja, metric cards, detail drawer.',
        result: 'Konsep siap jadi MVP SaaS dengan RBAC dan database Postgres.',
        credibility: 'Concept work untuk menjelaskan kualitas aplikasi internal.',
        source: 'CONCEPT',
        status: 'PUBLISHED',
        consentStatus: 'NOT_REQUIRED',
        tags: JSON.stringify(['SaaS', 'Dashboard', 'RBAC']),
        scenePreset: 'case-timeline',
        themeKey: 'control-room',
        accentColor: '#a78bfa',
        motionIntensity: 'balanced',
        featured: true,
        publishedAt: new Date('2026-06-02'),
        categoryId: categories[1].id,
        templateId: templates[2].id,
      },
    }),
    prisma.portfolioItem.upsert({
      where: { slug: 'immersive-studio-showroom' },
      update: {},
      create: {
        slug: 'immersive-studio-showroom',
        title: 'Immersive Studio Showroom',
        summary: 'Portfolio interaktif dengan 3D canvas dan filtered cards.',
        problem: 'Portfolio agensi sering terlihat statis.',
        approach: 'Fixed WebGL canvas, DOM editorial, card tilt, scene presets.',
        result: 'Showroom bisa berkembang dari satu karya menjadi library case study.',
        credibility: 'Fondasi portfolio AjoClub sendiri.',
        source: 'INTERNAL_DEMO',
        status: 'PUBLISHED',
        consentStatus: 'NOT_REQUIRED',
        tags: JSON.stringify(['Three.js', 'Portfolio', 'Motion']),
        scenePreset: 'particle-morph',
        themeKey: 'studio',
        accentColor: '#2dd4bf',
        motionIntensity: 'immersive',
        featured: true,
        publishedAt: new Date('2026-06-03'),
        categoryId: categories[2].id,
        templateId: templates[3].id,
      },
    }),
    prisma.portfolioItem.upsert({
      where: { slug: 'hospitality-booking-flow' },
      update: {},
      create: {
        slug: 'hospitality-booking-flow',
        title: 'Hospitality Booking Flow',
        summary: 'Experience restoran dengan menu dan reservasi.',
        problem: 'Pengunjung ingin lihat menu dan booking tanpa mencari terlalu lama.',
        approach: 'Alur goal-based: lihat menu, cek signature, booking, chat.',
        result: 'Siap untuk restoran, coffee shop, katering, atau venue.',
        credibility: 'Kekuatan datang dari foto, menu, review, dan proof asli.',
        source: 'TEMPLATE',
        status: 'PUBLISHED',
        consentStatus: 'NOT_REQUIRED',
        tags: JSON.stringify(['Restaurant', 'Booking', 'Mobile UX']),
        scenePreset: 'orbit-product',
        themeKey: 'hospitality',
        accentColor: '#f59e0b',
        motionIntensity: 'calm',
        featured: false,
        publishedAt: new Date('2026-06-04'),
        categoryId: categories[3].id,
        templateId: templates[4].id,
      },
    }),
  ])

  console.log(`  Portfolio items: ${items.length}`)

  // Metrics for each portfolio item
  const metricsData = [
    {
      portfolioId: items[0].id,
      metrics: [
        { label: 'Target load', value: '<2s', note: 'Budget performa untuk mobile 4G.', sortOrder: 0 },
        { label: 'Build cycle', value: '2-4 minggu', note: 'Untuk scope standar.', sortOrder: 1 },
        { label: 'CTA paths', value: '4', note: 'Hero, proof, FAQ, floating action.', sortOrder: 2 },
      ],
    },
    {
      portfolioId: items[1].id,
      metrics: [
        { label: 'Core views', value: '6', note: 'Overview, queue, detail, user, audit, setting.', sortOrder: 0 },
        { label: 'Roles', value: '4', note: 'Owner, admin, editor, viewer.', sortOrder: 1 },
        { label: 'Data model', value: 'Postgres-ready', note: 'Untuk Supabase atau Neon.', sortOrder: 2 },
      ],
    },
    {
      portfolioId: items[2].id,
      metrics: [
        { label: 'Scene presets', value: '5', note: 'Orbit, portal, timeline, morph, cinematic.', sortOrder: 0 },
        { label: 'Fallback', value: '100%', note: 'Konten tetap terbaca tanpa WebGL.', sortOrder: 1 },
        { label: 'Trust proof', value: 'Wajib', note: 'Hasil dan testimonial hanya tampil kalau datanya siap.', sortOrder: 2 },
      ],
    },
    {
      portfolioId: items[3].id,
      metrics: [
        { label: 'Primary actions', value: '3', note: 'Menu, booking, WhatsApp.', sortOrder: 0 },
        { label: 'Mobile first', value: 'Ya', note: 'Card dan CTA aman untuk thumb reach.', sortOrder: 1 },
        { label: 'Proof slots', value: '5', note: 'Review, partner, gallery, map, FAQ.', sortOrder: 2 },
      ],
    },
  ]

  for (const { portfolioId, metrics } of metricsData) {
    await prisma.caseStudyMetric.deleteMany({ where: { portfolioId } })
    await prisma.caseStudyMetric.createMany({
      data: metrics.map(m => ({ ...m, portfolioId })),
    })
  }

  console.log(`  Metrics: ${metricsData.reduce((a, b) => a + b.metrics.length, 0)}`)

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
