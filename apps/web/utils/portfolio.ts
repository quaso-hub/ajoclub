export type PortfolioStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type PortfolioSource = 'TEMPLATE' | 'INTERNAL_DEMO' | 'CONCEPT' | 'CLIENT_WORK'
export type ConsentStatus = 'APPROVED' | 'PENDING' | 'NOT_REQUIRED'
export type ScenePreset = 'orbit-product' | 'shader-portal' | 'case-timeline' | 'particle-morph' | 'cinematic-scroll'
export type MotionIntensity = 'calm' | 'balanced' | 'immersive'

export interface PortfolioCategory {
  id: string
  slug: string
  label: string
  description: string
}

export interface PortfolioTemplate {
  id: string
  title: string
  slug: string
  categorySlug: string
  summary: string
  icon: string
  scenePreset: ScenePreset
  themeKey: string
  accentColor: string
  tags: string[]
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  categorySlug: string
  templateSlug: string
  source: PortfolioSource
  status: PortfolioStatus
  consentStatus: ConsentStatus
  summary: string
  problem: string
  approach: string
  result: string
  credibility: string
  tags: string[]
  metrics: { label: string; value: string; note: string }[]
  scenePreset: ScenePreset
  themeKey: string
  accentColor: string
  motionIntensity: MotionIntensity
  featured: boolean
  publishedAt: string
}

export const portfolioCategories: PortfolioCategory[] = [
  { id: 'cat-growth', slug: 'growth', label: 'Growth Site', description: 'Landing dan company profile yang fokus ke trust, conversion, dan lead.' },
  { id: 'cat-product', slug: 'product', label: 'Product App', description: 'SaaS, dashboard, dan web app yang butuh UX operasional serius.' },
  { id: 'cat-experience', slug: 'experience', label: 'Immersive', description: 'Portfolio, event, dan campaign dengan visual interaktif.' },
  { id: 'cat-commerce', slug: 'commerce', label: 'Commerce', description: 'Menu, katalog, booking, dan alur order yang mobile-first.' },
]

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: 'tpl-company-profile',
    title: 'Company Profile',
    slug: 'company-profile',
    categorySlug: 'growth',
    summary: 'Presence premium untuk bisnis yang perlu terlihat kredibel sebelum sales call pertama.',
    icon: 'i-lucide-building-2',
    scenePreset: 'cinematic-scroll',
    themeKey: 'executive',
    accentColor: '#60a5fa',
    tags: ['Corporate', 'Trust', 'SEO'],
  },
  {
    id: 'tpl-landing-page',
    title: 'Conversion Landing',
    slug: 'landing-page',
    categorySlug: 'growth',
    summary: 'Landing page cepat dengan narasi, proof, dan CTA yang sengaja diarahkan ke lead.',
    icon: 'i-lucide-rocket',
    scenePreset: 'shader-portal',
    themeKey: 'launch',
    accentColor: '#fb7185',
    tags: ['Marketing', 'Lead', 'Analytics'],
  },
  {
    id: 'tpl-saas-dashboard',
    title: 'SaaS Dashboard',
    slug: 'saas-dashboard',
    categorySlug: 'product',
    summary: 'Interface data dan workflow untuk produk yang harus dipakai harian, bukan hanya dilihat.',
    icon: 'i-lucide-chart-no-axes-combined',
    scenePreset: 'case-timeline',
    themeKey: 'control-room',
    accentColor: '#a78bfa',
    tags: ['SaaS', 'RBAC', 'Data UX'],
  },
  {
    id: 'tpl-portfolio-showroom',
    title: 'Portfolio Showroom',
    slug: 'portfolio-showroom',
    categorySlug: 'experience',
    summary: 'Showcase karya dengan rhythm editorial, motion, dan case-study detail.',
    icon: 'i-lucide-sparkles',
    scenePreset: 'particle-morph',
    themeKey: 'studio',
    accentColor: '#2dd4bf',
    tags: ['Portfolio', '3D', 'Case Study'],
  },
  {
    id: 'tpl-restaurant-booking',
    title: 'Restaurant Booking',
    slug: 'restaurant-booking',
    categorySlug: 'commerce',
    summary: 'Menu, story, reservasi, dan CTA order yang enak dilihat di mobile.',
    icon: 'i-lucide-utensils',
    scenePreset: 'orbit-product',
    themeKey: 'hospitality',
    accentColor: '#f59e0b',
    tags: ['Menu', 'Booking', 'Mobile'],
  },
]

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'porto-launch-suite',
    title: 'Launch Suite for Local Service Business',
    slug: 'launch-suite-local-service',
    categorySlug: 'growth',
    templateSlug: 'landing-page',
    source: 'INTERNAL_DEMO',
    status: 'PUBLISHED',
    consentStatus: 'NOT_REQUIRED',
    summary: 'Blueprint landing untuk bisnis jasa lokal yang butuh inquiry cepat, jelas, dan mudah dipercaya.',
    problem: 'Banyak calon klien ragu karena website lama terasa generik, lambat, dan tidak menjawab risiko sebelum chat.',
    approach: 'Kami susun narasi proof-first: positioning, problem framing, process, FAQ, CTA WhatsApp contextual, dan event tracking-ready.',
    result: 'Arah ini mempercepat campaign jasa lokal dengan struktur lead yang lebih tajam dan waktu setup lebih pendek.',
    credibility: 'Dirancang sebagai launch system yang bisa disesuaikan dengan proof, visual, dan offer bisnis sebenarnya.',
    tags: ['Landing Page', 'WhatsApp CTA', 'Trust Copy'],
    metrics: [
      { label: 'Target load', value: '<2s', note: 'Budget performa untuk mobile 4G.' },
      { label: 'Build cycle', value: '2-4 minggu', note: 'Untuk scope standar setelah konten siap.' },
      { label: 'CTA paths', value: '4', note: 'Hero, proof, FAQ, floating action.' },
    ],
    scenePreset: 'shader-portal',
    themeKey: 'launch',
    accentColor: '#fb7185',
    motionIntensity: 'immersive',
    featured: true,
    publishedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'porto-control-room',
    title: 'Operator Control Room',
    slug: 'operator-control-room',
    categorySlug: 'product',
    templateSlug: 'saas-dashboard',
    source: 'CONCEPT',
    status: 'PUBLISHED',
    consentStatus: 'NOT_REQUIRED',
    summary: 'Konsep dashboard SaaS untuk operasi kecil yang membutuhkan status, role, audit trail, dan workflow harian.',
    problem: 'Tim kecil sering memakai spreadsheet untuk proses yang sudah butuh permission, status, dan riwayat.',
    approach: 'Dashboard dibagi menjadi command center, queue kerja, metric cards, dan detail drawer agar action tetap dekat dengan data.',
    result: 'Konsep siap diturunkan menjadi MVP SaaS dengan RBAC, API Nitro, dan database Postgres.',
    credibility: 'Concept work. Digunakan untuk menjelaskan kualitas aplikasi internal yang bisa dibangun AjoClub.',
    tags: ['SaaS', 'Dashboard', 'RBAC'],
    metrics: [
      { label: 'Core views', value: '6', note: 'Overview, queue, detail, user, audit, setting.' },
      { label: 'Roles', value: '4', note: 'Owner, admin, editor, viewer.' },
      { label: 'Data model', value: 'Postgres-ready', note: 'Dirancang untuk Supabase atau Neon.' },
    ],
    scenePreset: 'case-timeline',
    themeKey: 'control-room',
    accentColor: '#a78bfa',
    motionIntensity: 'balanced',
    featured: true,
    publishedAt: '2026-06-02T00:00:00.000Z',
  },
  {
    id: 'porto-studio-showroom',
    title: 'Immersive Studio Showroom',
    slug: 'immersive-studio-showroom',
    categorySlug: 'experience',
    templateSlug: 'portfolio-showroom',
    source: 'INTERNAL_DEMO',
    status: 'PUBLISHED',
    consentStatus: 'NOT_REQUIRED',
    summary: 'Portfolio interaktif dengan 3D canvas, filtered cards, cinematic detail, dan proof layer.',
    problem: 'Portfolio agency sering terlihat statis, sehingga kualitas craft, proses, dan ambisi visual sulit terasa.',
    approach: 'Kami pakai fixed WebGL canvas, DOM editorial, card tilt, scene presets, dan label sumber karya agar tetap jujur.',
    result: 'Showroom menjadi pengalaman yang bisa berkembang dari satu karya menjadi library case study tanpa kehilangan rasa premium.',
    credibility: 'Dirancang sebagai fondasi portfolio AjoClub sendiri: visual kuat, content-ready, dan tetap mudah dikembangkan.',
    tags: ['Three.js', 'Portfolio', 'Motion'],
    metrics: [
      { label: 'Scene presets', value: '5', note: 'Orbit, portal, timeline, morph, cinematic.' },
      { label: 'Fallback', value: '100%', note: 'Konten tetap terbaca tanpa WebGL.' },
      { label: 'Trust proof', value: 'Wajib', note: 'Hasil dan testimonial hanya tampil saat datanya siap.' },
    ],
    scenePreset: 'particle-morph',
    themeKey: 'studio',
    accentColor: '#2dd4bf',
    motionIntensity: 'immersive',
    featured: true,
    publishedAt: '2026-06-03T00:00:00.000Z',
  },
  {
    id: 'porto-hospitality-flow',
    title: 'Hospitality Booking Flow',
    slug: 'hospitality-booking-flow',
    categorySlug: 'commerce',
    templateSlug: 'restaurant-booking',
    source: 'TEMPLATE',
    status: 'PUBLISHED',
    consentStatus: 'NOT_REQUIRED',
    summary: 'Experience restoran dengan menu, reservasi, proof, dan CTA order yang ramah mobile.',
    problem: 'Pengunjung ingin melihat menu, suasana, lokasi, dan cara booking tanpa mencari terlalu lama.',
    approach: 'Alur dibuat goal-based: lihat menu, cek signature, booking, lalu chat dengan message otomatis.',
    result: 'Arah ini siap dikembangkan untuk restoran, coffee shop, katering, atau venue kecil.',
    credibility: 'Kekuatan halaman datang dari foto, menu, review, dan proof asli yang dimasukkan saat project berjalan.',
    tags: ['Restaurant', 'Booking', 'Mobile UX'],
    metrics: [
      { label: 'Primary actions', value: '3', note: 'Menu, booking, WhatsApp.' },
      { label: 'Mobile first', value: 'Yes', note: 'Card dan CTA aman untuk thumb reach.' },
      { label: 'Proof slots', value: '5', note: 'Review, partner, gallery, map, FAQ.' },
    ],
    scenePreset: 'orbit-product',
    themeKey: 'hospitality',
    accentColor: '#f59e0b',
    motionIntensity: 'calm',
    featured: false,
    publishedAt: '2026-06-04T00:00:00.000Z',
  },
]

export function getPublishedPortfolio() {
  return portfolioItems
    .filter(item => item.status === 'PUBLISHED')
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
}

export function getPortfolioBySlug(slug: string) {
  return getPublishedPortfolio().find(item => item.slug === slug)
}

export function getTemplateBySlug(slug: string) {
  return portfolioTemplates.find(template => template.slug === slug)
}

export function getCategoryBySlug(slug: string) {
  return portfolioCategories.find(category => category.slug === slug)
}

export function sourceLabel(source: PortfolioSource) {
  return {
    TEMPLATE: 'Template',
    INTERNAL_DEMO: 'Internal Demo',
    CONCEPT: 'Concept',
    CLIENT_WORK: 'Client Work',
  }[source]
}
