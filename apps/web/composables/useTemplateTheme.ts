/**
 * useTemplateTheme(slug)
 *
 * Applies the per-template palette + typography + dark/light mode to a template page.
 * Returns reactive CSS variable bindings for use in :style.
 *
 * Usage in template page:
 *
 *   const theme = useTemplateTheme('saas-1')
 *   const styles = theme.styles
 *
 *   <div :style="styles"> ... </div>
 *
 * The composable also calls useHead with the right fonts.
 */
import { computed } from 'vue'
import { getTemplateBySlug } from '~/utils/portfolio'
import { getPalette, toCss } from '~/utils/palettes'
import { getTypography } from '~/utils/typography'

export function useTemplateTheme(slug: string) {
  const tpl = getTemplateBySlug(slug)
  if (!tpl) {
    throw new Error(`[useTemplateTheme] Unknown template: ${slug}`)
  }

  const typography = getTypography(tpl.typo)
  const palette = getPalette(tpl.palette)

  // Build the CSS variables based on the active color mode
  const styles = computed(() => {
    const colorMode = useColorMode()
    const isDark = colorMode.value === 'dark' && palette.dark
    const source = isDark ? { ...palette, ...palette.dark } : palette
    return {
      '--tmpl-bg': toCss(source.bg),
      '--tmpl-fg': toCss(source.fg),
      '--tmpl-muted': toCss(source.muted),
      '--tmpl-border': toCss(source.border),
      '--tmpl-surface': toCss(source.surface),
      '--tmpl-surface-elevated': toCss(source.surfaceElevated),
      '--tmpl-accent': toCss(source.accent),
      '--tmpl-accent-soft': toCss(source.accentSoft),
      '--tmpl-accent-fg': toCss(source.accentFg),
      '--tmpl-bg-elevated': toCss(source.surfaceElevated),
      '--tmpl-font-display': typography.display,
      '--tmpl-font-body': typography.body,
      '--tmpl-font-mono': typography.mono,
      '--tmpl-h1': typography.h1,
      '--tmpl-h2': typography.h2,
      '--tmpl-body-size': typography.bodySize,
      '--tmpl-body-line-height': String(typography.bodyLineHeight),
      background: toCss(source.bg),
      color: toCss(source.fg),
      fontFamily: typography.body,
      fontSize: typography.bodySize,
      lineHeight: String(typography.bodyLineHeight),
    } as Record<string, string>
  })

  const h1Style = computed(() => ({
    fontFamily: typography.display,
    fontSize: typography.h1,
    fontWeight: typography.h1Weight,
    lineHeight: String(typography.h1LineHeight),
    letterSpacing: typography.h1LetterSpacing,
    fontStyle: typography.h1Style || 'normal',
  }))

  const h2Style = computed(() => ({
    fontFamily: typography.display,
    fontSize: typography.h2,
    fontWeight: typography.h1Weight,
    lineHeight: '1.05',
    letterSpacing: typography.h1LetterSpacing,
    fontStyle: typography.h1Style || 'normal',
  }))

  const monoStyle = computed(() => ({
    fontFamily: typography.mono,
  }))

  // useHead with the right fonts + title
  const head = useHead({
    title: tpl.title,
    htmlAttrs: { lang: 'id' },
    link: [
      ...typography.preconnect.map((href) => ({ rel: 'preconnect', href })),
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: typography.allCss },
    ],
    meta: [
      { name: 'description', content: tpl.description },
      { property: 'og:title', content: tpl.title },
      { property: 'og:description', content: tpl.description },
      { property: 'og:type', content: 'website' },
      { name: 'theme-color', content: toCss(palette.accent) },
    ],
  })

  return {
    tpl,
    template: tpl,
    typography,
    palette,
    styles,
    h1Style,
    h2Style,
    monoStyle,
    head,
    vibe: palette.vibe,
  }
}
