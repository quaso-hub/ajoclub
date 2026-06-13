/**
 * AjoClub Color Palette System
 *
 * 24 templates × distinct OKLCH palette + dark/light variant.
 * All in OKLCH (perceptually uniform, Tailwind v4 default).
 *
 * Each template defines:
 *  - bg, fg, muted, border, surface, surfaceElevated
 *  - accent, accentSoft, accentFg
 *  - dark: optional override
 *  - forceMode: optional, no toggle
 *  - vibe: team label
 */

export interface OklchTriplet { l: number; c: number; h: number }
export interface Palette {
  bg: OklchTriplet
  fg: OklchTriplet
  muted: OklchTriplet
  border: OklchTriplet
  surface: OklchTriplet
  surfaceElevated: OklchTriplet
  accent: OklchTriplet
  accentSoft: OklchTriplet
  accentFg: OklchTriplet
  dark?: Partial<Palette>
  forceMode?: 'light' | 'dark'
  vibe: string
}

export function o(l: number, c: number, h: number): OklchTriplet {
  return { l, c, h }
}

export function toCss(t: OklchTriplet, alpha = 1): string {
  if (alpha < 1) return `oklch(${t.l}% ${t.c} ${t.h} / ${alpha})`
  return `oklch(${t.l}% ${t.c} ${t.h})`
}

const P: Record<string, Palette> = {
  // ========== SAAS ==========
  atur: {
    bg: o(98, 0.005, 90), fg: o(15, 0.02, 280), muted: o(50, 0.01, 280),
    border: o(90, 0.005, 90), surface: o(96, 0.005, 90), surfaceElevated: o(99, 0.005, 90),
    accent: o(45, 0.16, 305), accentSoft: o(92, 0.04, 305), accentFg: o(99, 0.005, 90),
    dark: {
      bg: o(12, 0.02, 280), fg: o(96, 0.005, 90), muted: o(70, 0.01, 280),
      border: o(25, 0.02, 280), surface: o(18, 0.02, 280), surfaceElevated: o(22, 0.02, 280),
      accent: o(72, 0.16, 305), accentSoft: o(25, 0.10, 305), accentFg: o(12, 0.02, 280),
    },
    vibe: 'Editorial, soft aubergine, no shouting',
  },
  kas: {
    bg: o(15, 0.02, 250), fg: o(98, 0.005, 250), muted: o(70, 0.01, 250),
    border: o(28, 0.015, 250), surface: o(20, 0.02, 250), surfaceElevated: o(25, 0.02, 250),
    accent: o(72, 0.18, 235), accentSoft: o(35, 0.10, 235), accentFg: o(98, 0.005, 250),
    forceMode: 'dark',
    vibe: 'Dashboard, dark electric blue',
  },
  lintas: {
    bg: o(99, 0.005, 80), fg: o(15, 0.02, 250), muted: o(45, 0.01, 250),
    border: o(90, 0.005, 80), surface: o(96, 0.005, 80), surfaceElevated: o(99, 0.005, 80),
    accent: o(55, 0.20, 270), accentSoft: o(92, 0.05, 270), accentFg: o(99, 0.005, 80),
    dark: {
      bg: o(12, 0.02, 250), fg: o(98, 0.005, 80), muted: o(70, 0.01, 250),
      border: o(25, 0.02, 250), surface: o(18, 0.02, 250), surfaceElevated: o(22, 0.02, 250),
      accent: o(72, 0.18, 270), accentSoft: o(30, 0.12, 270), accentFg: o(99, 0.005, 80),
    },
    vibe: 'Editorial, color washes, violet to amber to teal',
  },

  // ========== RESTAURANT ==========
  sasana: {
    bg: o(99, 0.005, 100), fg: o(20, 0.02, 130), muted: o(45, 0.02, 130),
    border: o(92, 0.01, 100), surface: o(98, 0.005, 100), surfaceElevated: o(99, 0.005, 100),
    accent: o(35, 0.06, 145), accentSoft: o(92, 0.04, 145), accentFg: o(99, 0.005, 100),
    forceMode: 'light',
    vibe: 'Fine dining, white space, forest',
  },
  kopi: {
    bg: o(96, 0.02, 80), fg: o(20, 0.02, 60), muted: o(40, 0.02, 60),
    border: o(88, 0.04, 80), surface: o(94, 0.02, 80), surfaceElevated: o(98, 0.02, 80),
    accent: o(72, 0.16, 80), accentSoft: o(92, 0.06, 80), accentFg: o(20, 0.02, 60),
    forceMode: 'light',
    vibe: 'Cafe, warm cream, sun',
  },
  sate: {
    bg: o(96, 0.02, 60), fg: o(18, 0.02, 40), muted: o(40, 0.02, 40),
    border: o(88, 0.04, 60), surface: o(94, 0.02, 60), surfaceElevated: o(98, 0.02, 60),
    accent: o(55, 0.20, 35), accentSoft: o(92, 0.06, 35), accentFg: o(99, 0.005, 60),
    forceMode: 'light',
    vibe: 'Warung, raw, smoke, spice',
  },

  // ========== EVENT ==========
  devtalk: {
    bg: o(8, 0.005, 140), fg: o(98, 0.005, 140), muted: o(70, 0.01, 140),
    border: o(20, 0.02, 140), surface: o(14, 0.02, 140), surfaceElevated: o(18, 0.02, 140),
    accent: o(85, 0.22, 130), accentSoft: o(35, 0.15, 130), accentFg: o(8, 0.005, 140),
    forceMode: 'dark',
    vibe: 'Tech conference, kelly green, marquee',
  },
  nadafest: {
    bg: o(8, 0.01, 320), fg: o(98, 0.005, 320), muted: o(70, 0.01, 320),
    border: o(20, 0.02, 320), surface: o(14, 0.02, 320), surfaceElevated: o(18, 0.02, 320),
    accent: o(68, 0.28, 350), accentSoft: o(30, 0.18, 350), accentFg: o(98, 0.005, 320),
    forceMode: 'dark',
    vibe: 'Music festival, magenta-violet gradient',
  },
  forumid: {
    bg: o(99, 0.005, 80), fg: o(15, 0.02, 250), muted: o(45, 0.01, 250),
    border: o(90, 0.005, 80), surface: o(96, 0.005, 80), surfaceElevated: o(99, 0.005, 80),
    accent: o(65, 0.22, 25), accentSoft: o(92, 0.06, 25), accentFg: o(99, 0.005, 80),
    forceMode: 'light',
    vibe: 'Design festival, year typography, archive',
  },

  // ========== MEMBERSHIP ==========
  catatan: {
    bg: o(98, 0.01, 60), fg: o(20, 0.02, 40), muted: o(45, 0.02, 40),
    border: o(90, 0.02, 60), surface: o(96, 0.01, 60), surfaceElevated: o(99, 0.01, 60),
    accent: o(60, 0.16, 40), accentSoft: o(92, 0.05, 40), accentFg: o(99, 0.01, 60),
    forceMode: 'light',
    vibe: 'Newsletter, charter, paper',
  },
  sinau: {
    bg: o(15, 0.02, 280), fg: o(98, 0.005, 280), muted: o(70, 0.01, 280),
    border: o(25, 0.02, 280), surface: o(20, 0.02, 280), surfaceElevated: o(24, 0.02, 280),
    accent: o(72, 0.16, 290), accentSoft: o(30, 0.10, 290), accentFg: o(98, 0.005, 280),
    forceMode: 'dark',
    vibe: 'Community, deep night, coral',
  },
  raka: {
    bg: o(97, 0.015, 70), fg: o(20, 0.02, 50), muted: o(45, 0.02, 50),
    border: o(90, 0.02, 70), surface: o(95, 0.015, 70), surfaceElevated: o(98, 0.015, 70),
    accent: o(78, 0.15, 80), accentSoft: o(94, 0.06, 80), accentFg: o(20, 0.02, 50),
    forceMode: 'light',
    vibe: 'Creator, warm cream, butter',
  },

  // ========== PORTFOLIO ==========
  grapiku: {
    bg: o(12, 0.02, 250), fg: o(98, 0.005, 250), muted: o(70, 0.01, 250),
    border: o(22, 0.02, 250), surface: o(16, 0.02, 250), surfaceElevated: o(20, 0.02, 250),
    accent: o(72, 0.18, 250), accentSoft: o(30, 0.12, 250), accentFg: o(98, 0.005, 250),
    forceMode: 'dark',
    vibe: 'Agency, dark electric blue, particles',
  },
  daida: {
    bg: o(98, 0.01, 80), fg: o(15, 0.02, 350), muted: o(45, 0.01, 350),
    border: o(90, 0.01, 80), surface: o(96, 0.01, 80), surfaceElevated: o(99, 0.01, 80),
    accent: o(58, 0.22, 350), accentSoft: o(92, 0.06, 350), accentFg: o(99, 0.005, 80),
    forceMode: 'light',
    vibe: 'Studio, paper, magenta accent',
  },
  idx: {
    bg: o(99, 0.005, 80), fg: o(8, 0.005, 80), muted: o(30, 0.005, 80),
    border: o(90, 0.005, 80), surface: o(98, 0.005, 80), surfaceElevated: o(99, 0.005, 80),
    accent: o(58, 0.24, 25), accentSoft: o(92, 0.08, 25), accentFg: o(99, 0.005, 80),
    forceMode: 'light',
    vibe: 'Brutalist, raw, pure red, monospace',
  },

  // ========== ECOMMERCE ==========
  erigo: {
    bg: o(99, 0.005, 250), fg: o(15, 0.02, 250), muted: o(40, 0.02, 250),
    border: o(92, 0.005, 250), surface: o(97, 0.005, 250), surfaceElevated: o(99, 0.005, 250),
    accent: o(45, 0.18, 280), accentSoft: o(92, 0.04, 280), accentFg: o(99, 0.005, 250),
    forceMode: 'light',
    vibe: 'Premium, light, aubergine+graphite',
  },
  somethinc: {
    bg: o(97, 0.015, 90), fg: o(20, 0.02, 70), muted: o(45, 0.02, 70),
    border: o(90, 0.02, 90), surface: o(95, 0.015, 90), surfaceElevated: o(98, 0.015, 90),
    accent: o(40, 0.10, 145), accentSoft: o(92, 0.05, 145), accentFg: o(99, 0.01, 90),
    forceMode: 'light',
    vibe: 'DTC, cream, forest+amber',
  },
  bazaar: {
    bg: o(99, 0.005, 60), fg: o(15, 0.02, 30), muted: o(45, 0.02, 30),
    border: o(90, 0.005, 60), surface: o(96, 0.005, 60), surfaceElevated: o(99, 0.005, 60),
    accent: o(58, 0.18, 35), accentSoft: o(92, 0.06, 35), accentFg: o(99, 0.005, 60),
    forceMode: 'light',
    vibe: 'Marketplace, terracotta+mustard+sage',
  },

  // ========== WEDDING (subtle, warm) ==========
  anindya: {
    bg: o(98, 0.01, 50), fg: o(25, 0.04, 30), muted: o(50, 0.03, 30),
    border: o(90, 0.02, 50), surface: o(96, 0.01, 50), surfaceElevated: o(99, 0.01, 50),
    accent: o(45, 0.10, 30), accentSoft: o(92, 0.05, 30), accentFg: o(99, 0.01, 50),
    forceMode: 'light',
    vibe: 'Luxury romantic, sienna, dust motes',
  },
  dita: {
    bg: o(99, 0.005, 250), fg: o(15, 0.02, 250), muted: o(45, 0.01, 250),
    border: o(92, 0.005, 250), surface: o(98, 0.005, 250), surfaceElevated: o(99, 0.005, 250),
    accent: o(45, 0.10, 250), accentSoft: o(92, 0.04, 250), accentFg: o(99, 0.005, 250),
    forceMode: 'light',
    vibe: 'Modern minimal, cool paper, blue',
  },
  sarah: {
    bg: o(96, 0.02, 70), fg: o(22, 0.04, 40), muted: o(45, 0.03, 40),
    border: o(88, 0.03, 70), surface: o(94, 0.02, 70), surfaceElevated: o(98, 0.02, 70),
    accent: o(50, 0.14, 40), accentSoft: o(92, 0.05, 40), accentFg: o(99, 0.01, 70),
    forceMode: 'light',
    vibe: 'Destination, sand+terracotta+sea',
  },

  // ========== ARCHITECTURE ==========
  archiry: {
    bg: o(98, 0.01, 80), fg: o(18, 0.02, 60), muted: o(45, 0.02, 60),
    border: o(90, 0.01, 80), surface: o(96, 0.01, 80), surfaceElevated: o(99, 0.01, 80),
    accent: o(50, 0.08, 60), accentSoft: o(92, 0.04, 60), accentFg: o(99, 0.01, 80),
    forceMode: 'light',
    vibe: 'Architecture firm, brass, restrained',
  },
  bukit: {
    bg: o(99, 0.005, 145), fg: o(15, 0.02, 250), muted: o(40, 0.02, 250),
    border: o(90, 0.005, 145), surface: o(97, 0.005, 145), surfaceElevated: o(99, 0.005, 145),
    accent: o(45, 0.16, 145), accentSoft: o(92, 0.06, 145), accentFg: o(99, 0.005, 145),
    forceMode: 'light',
    vibe: 'Real estate, moss green, grid',
  },
  ruang: {
    bg: o(96, 0.02, 50), fg: o(20, 0.04, 30), muted: o(45, 0.03, 30),
    border: o(88, 0.03, 50), surface: o(94, 0.02, 50), surfaceElevated: o(98, 0.02, 50),
    accent: o(50, 0.12, 30), accentSoft: o(92, 0.05, 30), accentFg: o(99, 0.01, 50),
    forceMode: 'light',
    vibe: 'Interior studio, terracotta, mood',
  },
}

export const palettes = P
export function getPalette(slug: string): Palette {
  return P[slug] ?? P.atur
}
