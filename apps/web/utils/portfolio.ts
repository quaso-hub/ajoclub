/**
 * AjoClub Template metadata
 *
 * 24 templates. Each is a unique sandbox. Each maps:
 *  - typography (font, weight, line-height, clamp H1)
 *  - palette (OKLCH bg/fg/accent + dark variant)
 *  - WhatsApp FAB messages (per template type)
 *  - scene preset (which 3D variant)
 *  - Indonesian mock brand
 *
 * NOTE: This file replaces the legacy portfolio.ts but keeps the same
 * exports (`templates`, `templateCategories`) so existing imports work.
 */

import type { ScenePreset, MotionIntensity } from './portfolio'
import { getTypography } from './typography'
import { getPalette } from './palettes'

export type { ScenePreset, MotionIntensity }

export interface Template {
  id: string
  slug: string
  /** typography key, e.g. 'atur' */
  typo: string
  /** palette key, e.g. 'atur' */
  palette: string
  title: string
  description: string
  category: 'saas' | 'restaurant' | 'event' | 'membership' | 'portfolio' | 'ecommerce' | 'wedding' | 'architecture'
  icon: string
  tags: string[]
  scenePreset: ScenePreset
  motionIntensity: MotionIntensity
  /** WhatsApp base message — appended with project name */
  whatsappMessage: string
  /** Indonesian mock brand name (used in titles, copy) */
  brand: string
  sortOrder: number
  accentColor: string  // legacy hex (used by ScenePreview only)
}

const t = (overrides: Partial<Template> & {
  id: string
  slug: string
  title: string
  description: string
  category: Template['category']
  brand: string
  whatsappMessage: string
  typo: string
  palette: string
}): Template => ({
  tags: [],
  scenePreset: 'sphere',
  motionIntensity: 'balanced',
  icon: 'i-lucide-globe',
  accentColor: '#5E6AD2',
  ...overrides,
})

const CATEGORIES = {
  saas: 'i-lucide-monitor-smartphone',
  restaurant: 'i-lucide-utensils',
  event: 'i-lucide-calendar-days',
  membership: 'i-lucide-newspaper',
  portfolio: 'i-lucide-sparkles',
  ecommerce: 'i-lucide-package',
  wedding: 'i-lucide-heart',
  architecture: 'i-lucide-building',
}

export const templates: Template[] = [
  // ========== SAAS ==========
  t({
    id: '1', slug: 'saas-1', typo: 'atur', palette: 'atur',
    title: 'Atur — Editorial SaaS', brand: 'Atur',
    description: 'Anti-SaaS editorial. Instrument Serif italic, aubergine accent, scroll storytelling.',
    category: 'saas', tags: ['SaaS', 'Editorial', 'Italic'], scenePreset: 'sphere',
    icon: CATEGORIES.saas, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya tertarik dengan template Atur. Saya pengen liat cara kerja dan diskusi paket harga.',
    accentColor: '#5E6AD2', sortOrder: 1,
  }),
  t({
    id: '2', slug: 'saas-2', typo: 'kas', palette: 'kas',
    title: 'Kas — Dashboard-First SaaS', brand: 'Kas',
    description: 'Real interactive product UI as hero. Dark electric blue, magnetic particles.',
    category: 'saas', tags: ['SaaS', 'Product', 'Dashboard'], scenePreset: 'particle-morph',
    icon: CATEGORIES.saas, motionIntensity: 'immersive',
    whatsappMessage: 'Halo, saya tertarik dengan template Kas (dashboard). Saya pengen liat demo dan diskusi integrasi.',
    accentColor: '#0099FF', sortOrder: 2,
  }),
  t({
    id: '3', slug: 'saas-3', typo: 'lintas', palette: 'lintas',
    title: 'Lintas — Color-Wash SaaS', brand: 'Lintas',
    description: 'Section color washes, Fraunces italic H1, GLSL morphing blob.',
    category: 'saas', tags: ['SaaS', 'Editorial', 'Color'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.saas, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya tertarik dengan template Lintas. Saya pengen diskusi warna, tipografi, dan paketnya.',
    accentColor: '#635BFF', sortOrder: 3,
  }),

  // ========== RESTAURANT ==========
  t({
    id: '4', slug: 'restaurant-1', typo: 'sasana', palette: 'sasana',
    title: 'Sasana — Fine Dining', brand: 'Sasana',
    description: 'White space, Cormorant italic, scroll photo essay, slow particles.',
    category: 'restaurant', tags: ['Fine Dining', 'Editorial', 'Serif'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.restaurant, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya punya restoran dan tertarik dengan template Sasana. Bisa diskusi?',
    accentColor: '#3B4A2E', sortOrder: 4,
  }),
  t({
    id: '5', slug: 'restaurant-2', typo: 'kopi', palette: 'kopi',
    title: 'Kopi Rumah — Modern Café', brand: 'Kopi Rumah',
    description: 'Space Grotesk, asymmetric, "hari ini brew" ticker, cup 3D follows cursor.',
    category: 'restaurant', tags: ['Café', 'Modern', 'Block'], scenePreset: 'case-timeline',
    icon: CATEGORIES.restaurant, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya punya kafe dan tertarik dengan template Kopi Rumah. Bisa diskusi menu dan reservasi?',
    accentColor: '#E8C547', sortOrder: 5,
  }),
  t({
    id: '6', slug: 'restaurant-3', typo: 'sate', palette: 'sate',
    title: 'Sate Madura Pak Karto', brand: 'Sate Madura Pak Karto',
    description: 'Bebas Neue, raw, "kitchen cam" feel, WhatsApp order flow, GPU smoke.',
    category: 'restaurant', tags: ['Casual', 'Warung', 'Smoke'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.restaurant, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya punya warung dan tertarik dengan template Sate Madura. Bisa diskusi order via WhatsApp?',
    accentColor: '#D44B2B', sortOrder: 6,
  }),

  // ========== EVENT ==========
  t({
    id: '7', slug: 'event-1', typo: 'devtalk', palette: 'devtalk',
    title: 'DevTalk 2026 — Tech Conference', brand: 'DevTalk 2026',
    description: 'Marquee bands, kelly green, day tabs, speaker grid, ticket tiers.',
    category: 'event', tags: ['Tech', 'Conference', 'Marquee'], scenePreset: 'particle-morph',
    icon: CATEGORIES.event, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya mau bikin website untuk event teknologi. Bisa jelaskan proses dan harganya?',
    accentColor: '#A4DD00', sortOrder: 7,
  }),
  t({
    id: '8', slug: 'event-2', typo: 'nadafest', palette: 'nadafest',
    title: 'NadaFest 2026 — Music Festival', brand: 'NadaFest 2026',
    description: 'Gradient hero, lineup list, stage grid, audio-reactive particles.',
    category: 'event', tags: ['Music', 'Festival', 'Audio'], scenePreset: 'shader-portal',
    icon: CATEGORIES.event, motionIntensity: 'immersive',
    whatsappMessage: 'Halo, saya mau bikin website untuk festival musik. Bisa diskusi timeline dan paket?',
    accentColor: '#FF2D87', sortOrder: 8,
  }),
  t({
    id: '9', slug: 'event-3', typo: 'forumid', palette: 'forumid',
    title: 'ForumID 2026 — Design Festival', brand: 'ForumID 2026',
    description: 'Year hologram, archive, rotating identity, dimensional gallery.',
    category: 'event', tags: ['Design', 'Archive', 'Editorial'], scenePreset: 'particle-morph',
    icon: CATEGORIES.event, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya mau bikin website untuk festival / konferensi desain. Bisa diskusi?',
    accentColor: '#FF3D00', sortOrder: 9,
  }),

  // ========== MEMBERSHIP ==========
  t({
    id: '10', slug: 'membership-1', typo: 'catatan', palette: 'catatan',
    title: 'Catatan Harian — Newsletter', brand: 'Catatan Harian',
    description: 'Charter serif, founder photo, archive, paper-grain ambient.',
    category: 'membership', tags: ['Newsletter', 'Substack', 'Serif'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.membership, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya mau bikin website newsletter / tulisan. Bisa diskusi paket dan fitur?',
    accentColor: '#FF6719', sortOrder: 10,
  }),
  t({
    id: '11', slug: 'membership-2', typo: 'sinau', palette: 'sinau',
    title: 'Sinau Koding — Community', brand: 'Sinau Koding',
    description: 'Geist mono, spaces, events, tier comparison, member constellation.',
    category: 'membership', tags: ['Community', 'Platform', 'Dark'], scenePreset: 'case-timeline',
    icon: CATEGORIES.membership, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya mau bikin website komunitas online. Bisa diskusi?',
    accentColor: '#5856E0', sortOrder: 11,
  }),
  t({
    id: '12', slug: 'membership-3', typo: 'raka', palette: 'raka',
    title: 'Raka Writes — Creator Tip', brand: 'Raka Writes',
    description: 'Cardo italic, butter yellow, tier cards, coffee cup + steam.',
    category: 'membership', tags: ['Creator', 'Support', 'Tip'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.membership, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya content creator dan tertarik template "support the work". Bisa diskusi?',
    accentColor: '#D4A843', sortOrder: 12,
  }),

  // ========== PORTFOLIO ==========
  t({
    id: '13', slug: 'portfolio-1', typo: 'grapiku', palette: 'grapiku',
    title: 'Grapiku — Dark Agency', brand: 'Grapiku',
    description: 'Inter Tight + JetBrains Mono, particle morph, 4-step process, marquee.',
    category: 'portfolio', tags: ['Agency', 'Dark', 'Particles'], scenePreset: 'particle-morph',
    icon: CATEGORIES.portfolio, motionIntensity: 'immersive',
    whatsappMessage: 'Halo, saya butuh website portfolio / agensi. Bisa diskusi scope dan harga?',
    accentColor: '#2563EB', sortOrder: 13,
  }),
  t({
    id: '14', slug: 'portfolio-2', typo: 'daida', palette: 'daida',
    title: 'Studio Daida — Light Editorial', brand: 'Studio Daida',
    description: 'Fraunces italic, magazine grid, rotating wordmark morph, 12 case studies.',
    category: 'portfolio', tags: ['Studio', 'Editorial', 'Magazine'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.portfolio, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya studio desain dan tertarik dengan template Studio Daida. Bisa diskusi?',
    accentColor: '#FF3366', sortOrder: 14,
  }),
  t({
    id: '15', slug: 'portfolio-3', typo: 'idx', palette: 'idx',
    title: 'INDEX — Brutalist', brand: 'INDEX',
    description: 'Inter Black + Space Mono, pure red, manifest grid, rotating tetrahedron.',
    category: 'portfolio', tags: ['Brutalist', 'Raw', 'Mono'], scenePreset: 'particle-morph',
    icon: CATEGORIES.portfolio, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya butuh website portfolio gaya brutal/raw. Bisa diskusi?',
    accentColor: '#FF0000', sortOrder: 15,
  }),

  // ========== ECOMMERCE ==========
  t({
    id: '16', slug: 'ecommerce-1', typo: 'erigo', palette: 'erigo',
    title: 'Erigo — Premium Product', brand: 'Erigo',
    description: 'Instrument Serif, full-bleed, draggable 3D product, variant selector.',
    category: 'ecommerce', tags: ['Product', 'Premium', 'Apple'], scenePreset: 'orbit-product',
    icon: CATEGORIES.ecommerce, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya punya brand produk dan tertarik dengan template Erigo. Bisa diskusi?',
    accentColor: '#0071E3', sortOrder: 16,
  }),
  t({
    id: '17', slug: 'ecommerce-2', typo: 'somethinc', palette: 'somethinc',
    title: 'SOMETHINC — DTC Brand', brand: 'SOMETHINC',
    description: 'Fraunces, story-first, ingredient list, glass bottle with sloshing liquid.',
    category: 'ecommerce', tags: ['DTC', 'Brand', 'Story'], scenePreset: 'orbit-product',
    icon: CATEGORIES.ecommerce, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya punya brand skincare/DTC dan tertarik template SOMETHINC. Bisa diskusi?',
    accentColor: '#A67150', sortOrder: 17,
  }),
  t({
    id: '18', slug: 'ecommerce-3', typo: 'bazaar', palette: 'bazaar',
    title: 'Bazaar — Marketplace', brand: 'Bazaar',
    description: 'Newsreader italic, multi-vendor, category filter, 60-icon morph sphere.',
    category: 'ecommerce', tags: ['Marketplace', 'Multi-vendor', 'Filter'], scenePreset: 'case-timeline',
    icon: CATEGORIES.ecommerce, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya mau bikin marketplace (multi-vendor). Bisa diskusi?',
    accentColor: '#E85A2C', sortOrder: 18,
  }),

  // ========== WEDDING ==========
  t({
    id: '19', slug: 'wedding-1', typo: 'anindya', palette: 'anindya',
    title: 'Anindya & Rama — Luxury', brand: 'Anindya & Rama',
    description: 'Cormorant italic 300, dust-mote particles (5-7 only), love story timeline.',
    category: 'wedding', tags: ['Luxury', 'Romantic', 'Subtle'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.wedding, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya tertarik dengan template undangan Anindya & Rama. Bisa diskusi?',
    accentColor: '#8B7355', sortOrder: 19,
  }),
  t({
    id: '20', slug: 'wedding-2', typo: 'dita', palette: 'dita',
    title: 'Dita & Budi — Modern Minimal', brand: 'Dita & Budi',
    description: 'Fraunces italic 300, ultra-clean, wireframe torus barely visible.',
    category: 'wedding', tags: ['Modern', 'Minimal', 'Wire'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.wedding, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya tertarik template undangan modern minimalis. Bisa diskusi?',
    accentColor: '#0A0A0A', sortOrder: 20,
  }),
  t({
    id: '21', slug: 'wedding-3', typo: 'sarah', palette: 'sarah',
    title: 'Sarah & Kevin — Destination', brand: 'Sarah & Kevin',
    description: 'Fraunces, sand palette, weather widget, slow wireframe wave.',
    category: 'wedding', tags: ['Destination', 'Travel', 'Beach'], scenePreset: 'cinematic-scroll',
    icon: CATEGORIES.wedding, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya tertarik template undangan destinasi (luar kota/pantai). Bisa diskusi?',
    accentColor: '#C4622A', sortOrder: 21,
  }),

  // ========== ARCHITECTURE ==========
  t({
    id: '22', slug: 'architecture-1', typo: 'archiry', palette: 'archiry',
    title: 'Archiry — Architecture Firm', brand: 'Archiry',
    description: 'Cormorant serif, brass accent, rotating wireframe building, project filter.',
    category: 'architecture', tags: ['Firm', 'Serif', 'Editorial'], scenePreset: 'case-timeline',
    icon: CATEGORIES.architecture, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya butuh website studio arsitektur. Bisa diskusi portofolio dan harga?',
    accentColor: '#8B7355', sortOrder: 22,
  }),
  t({
    id: '23', slug: 'architecture-2', typo: 'bukit', palette: 'bukit',
    title: 'Bukit Hijau — Real Estate', brand: 'Bukit Hijau',
    description: 'Inter Tight Black, moss green, unit grid, KPR calculator, site visit.',
    category: 'architecture', tags: ['Real Estate', 'Grid', 'KPR'], scenePreset: 'orbit-product',
    icon: CATEGORIES.architecture, motionIntensity: 'balanced',
    whatsappMessage: 'Halo, saya developer / agen properti dan tertarik template Bukit Hijau. Bisa diskusi?',
    accentColor: '#0050FF', sortOrder: 23,
  }),
  t({
    id: '24', slug: 'architecture-3', typo: 'ruang', palette: 'ruang',
    title: 'Ruang Studio — Interior', brand: 'Ruang Studio',
    description: 'Fraunces, terracotta, mood board, 6-PBR material sphere, 5-question quiz.',
    category: 'architecture', tags: ['Interior', 'Mood', 'Material'], scenePreset: 'case-timeline',
    icon: CATEGORIES.architecture, motionIntensity: 'calm',
    whatsappMessage: 'Halo, saya studio interior dan tertarik template Ruang Studio. Bisa diskusi?',
    accentColor: '#A67150', sortOrder: 24,
  }),
]

export const templateCategories = [
  { slug: 'all', label: 'Semua' },
  { slug: 'saas', label: 'SaaS' },
  { slug: 'restaurant', label: 'Restaurant' },
  { slug: 'event', label: 'Event' },
  { slug: 'membership', label: 'Membership' },
  { slug: 'portfolio', label: 'Portfolio' },
  { slug: 'ecommerce', label: 'E-commerce' },
  { slug: 'wedding', label: 'Wedding' },
  { slug: 'architecture', label: 'Architecture' },
]

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find(t => t.slug === slug)
}
export function getPublishedTemplates(): Template[] {
  return [...templates].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getTemplateTypography(slug: string) {
  const tpl = getTemplateBySlug(slug)
  return getTypography(tpl?.typo ?? 'atur')
}
export function getTemplatePalette(slug: string) {
  const tpl = getTemplateBySlug(slug)
  return getPalette(tpl?.palette ?? 'atur')
}
