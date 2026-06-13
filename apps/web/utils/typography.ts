/**
 * AjoClub Typography System
 *
 * 24 templates × distinct typography. Each template defines:
 * - display: H1/H2 font (often serif italic for editorial, sans bold for modern)
 * - body: paragraph font
 * - mono: code/labels/metadata
 * - h1: clamp(min, vw, max) for fluid type
 * - h2: secondary heading clamp
 * - h1Weight, h1LineHeight, h1LetterSpacing: H1 details
 * - bodyLineHeight: typically 1.6 for reading, 1.4 for UI
 * - allCss: comma-separated Google Fonts import string
 * - preconnect: preconnect URLs (googleapis, gstatic)
 *
 * Fonts are preloaded via useHead in each template page.
 */

export interface Typography {
  display: string         // font-family for H1/H2
  body: string            // font-family for body
  mono: string            // font-family for metadata/labels
  h1: string              // clamp() string
  h2: string              // clamp() string
  h1Weight: number
  h1LineHeight: number
  h1LetterSpacing: string // CSS letter-spacing value
  h1Style?: 'italic' | 'normal'
  bodyLineHeight: number
  bodySize: string        // clamp() string
  allCss: string          // Google Fonts URL
  preconnect: string[]
}

const inter = 'Inter:wght@300;400;500;600;700;800;900'
const jbmono = 'JetBrains+Mono:wght@400;500;600'

function fonts(...args: string[]): string {
  return args.join('&family=').replace(/^/, 'family=')
}

const T = {
  // ====== SAAS ======
  atur: {
    display: '"Instrument Serif", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6.5rem)',
    h2: 'clamp(2rem, 4vw, 3.25rem)',
    h1Weight: 400,
    h1LineHeight: 0.98,
    h1LetterSpacing: '-0.025em',
    h1Style: 'italic',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Instrument+Serif:ital@0;1', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  kas: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6vw, 5.5rem)',
    h2: 'clamp(1.85rem, 3.5vw, 2.75rem)',
    h1Weight: 700,
    h1LineHeight: 1.02,
    h1LetterSpacing: '-0.03em',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1.05vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts(inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  lintas: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 8vw, 7rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 600,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.03em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(1rem, 1.1vw, 1.1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== RESTAURANT ======
  sasana: {
    display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 400,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.015em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  kopi: {
    display: '"Space Grotesk", "Inter", sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 8vw, 7rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 600,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.03em',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1.05vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Space+Grotesk:wght@400;500;600;700', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  sate: {
    display: '"Bebas Neue", "Anton", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.5rem, 7vw, 6rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 400,
    h1LineHeight: 1.05,
    h1LetterSpacing: '0.02em',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Bebas+Neue', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== EVENT ======
  devtalk: {
    display: '"PP Editorial New", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 8vw, 7.5rem)',
    h2: 'clamp(2rem, 4vw, 3.25rem)',
    h1Weight: 500,
    h1LineHeight: 0.98,
    h1LetterSpacing: '-0.025em',
    h1Style: 'italic',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  nadafest: {
    display: '"Anton", "Bebas Neue", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"Space Mono", monospace',
    h1: 'clamp(3.5rem, 10vw, 8.5rem)',
    h2: 'clamp(2.5rem, 5vw, 4rem)',
    h1Weight: 400,
    h1LineHeight: 0.92,
    h1LetterSpacing: '-0.02em',
    bodyLineHeight: 1.5,
    bodySize: 'clamp(0.95rem, 1.05vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Anton', inter, 'Space+Mono:wght@400;700')}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  forumid: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(4rem, 12vw, 11rem)',
    h2: 'clamp(2.5rem, 5vw, 4rem)',
    h1Weight: 800,
    h1LineHeight: 0.9,
    h1LetterSpacing: '-0.04em',
    h1Style: 'italic',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== MEMBERSHIP ======
  catatan: {
    display: '"Lora", "Charter", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6.5vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 500,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.02em',
    bodyLineHeight: 1.65,
    bodySize: 'clamp(1rem, 1.1vw, 1.1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  sinau: {
    display: '"Geist", "Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 600,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.025em',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts(inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  raka: {
    display: '"Cardo", "Playfair Display", Georgia, serif',
    body: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 400,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.015em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Cardo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700', 'Plus+Jakarta+Sans:wght@300;400;500;600;700;800', jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== PORTFOLIO ======
  grapiku: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 8vw, 7.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 800,
    h1LineHeight: 0.98,
    h1LetterSpacing: '-0.035em',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts(inter, jbmono, 'Fraunces:ital,wght@0,500;1,500')}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  daida: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Lora", Georgia, serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6.5rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 500,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.025em',
    h1Style: 'italic',
    bodyLineHeight: 1.65,
    bodySize: 'clamp(1rem, 1.1vw, 1.1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500', jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  idx: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"Space Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 900,
    h1LineHeight: 0.95,
    h1LetterSpacing: '-0.04em',
    bodyLineHeight: 1.5,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Inter:wght@400;500;600;700;800;900', 'Space+Mono:wght@400;700')}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== ECOMMERCE ======
  erigo: {
    display: '"Instrument Serif", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6.5vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 400,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Instrument+Serif:ital@0;1', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  somethinc: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 400,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  bazaar: {
    display: '"Newsreader", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 500,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.55,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== WEDDING (subtle 3D, but distinct type) ======
  anindya: {
    display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3.5rem, 9vw, 8rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 300,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.01em',
    h1Style: 'italic',
    bodyLineHeight: 1.7,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  dita: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7.5vw, 6.5rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 300,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.7,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  sarah: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7vw, 6.5rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 400,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.015em',
    h1Style: 'italic',
    bodyLineHeight: 1.65,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  // ====== ARCHITECTURE ======
  archiry: {
    display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(3rem, 7.5vw, 6.5rem)',
    h2: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    h1Weight: 500,
    h1LineHeight: 1.02,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  bukit: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6.5vw, 6rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 800,
    h1LineHeight: 1.0,
    h1LetterSpacing: '-0.035em',
    bodyLineHeight: 1.5,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts(inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  ruang: {
    display: '"Fraunces", "Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    h1: 'clamp(2.75rem, 6vw, 5.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h1Weight: 400,
    h1LineHeight: 1.05,
    h1LetterSpacing: '-0.02em',
    h1Style: 'italic',
    bodyLineHeight: 1.6,
    bodySize: 'clamp(0.95rem, 1vw, 1rem)',
    allCss: `https://fonts.googleapis.com/css2?family=${fonts('Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900', inter, jbmono)}&display=swap`,
    preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
}

export const typography: Record<string, Typography> = T

export function getTypography(slug: string): Typography {
  return T[slug as keyof typeof T] ?? T.atur
}

export type TypographySlug = keyof typeof T
