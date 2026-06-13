<script setup lang="ts">
/**
 * TmplNavbar.vue
 *
 * Per-template navigation bar. Each template passes its own:
 *  - brand (logo text)
 *  - links (anchor list)
 *  - accent (CSS color)
 *  - bg (background color)
 *  - text (text color)
 *  - style: 'transparent' | 'solid' | 'glass'
 *  - position: 'fixed' | 'absolute' | 'static'
 *
 * Includes:
 *  - Mobile menu (full overlay)
 *  - Theme toggle (if not forceMode)
 *  - Optional WhatsApp CTA in nav
 */
import { getPalette } from '~/utils/palettes'

const props = withDefaults(defineProps<{
  brand: string
  links?: Array<{ label: string, href: string }>
  accent?: string
  bg?: string
  text?: string
  /** Visual style: solid, transparent (scroll), glass */
  style?: 'solid' | 'transparent' | 'glass'
  /** Use 2-letter wordmark or full brand */
  wordmark?: string
  /** Whether to show theme toggle */
  showThemeToggle?: boolean
  /** Show WhatsApp CTA in nav */
  showWhatsappCta?: boolean
  whatsappMessage?: string
  /** Force dark or light (hides theme toggle) */
  forceMode?: 'dark' | 'light'
}>(), {
  links: () => [],
  style: 'transparent',
  showThemeToggle: true,
  showWhatsappCta: false,
  forceMode: undefined,
})

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const colorMode = useColorMode()

const showToggle = computed(() => {
  if (!props.showThemeToggle) return false
  if (props.forceMode) return false
  return true
})

const navStyle = computed(() => {
  if (props.style === 'solid') {
    return { background: props.bg, color: props.text }
  }
  if (props.style === 'glass') {
    return {
      background: 'color-mix(in srgb, currentColor 4%, transparent)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      color: props.text,
    }
  }
  // transparent (default — fades in on scroll)
  return isScrolled.value
    ? {
        background: props.bg
          ? `color-mix(in srgb, ${props.bg} 88%, transparent)`
          : 'color-mix(in srgb, currentColor 6%, transparent)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        color: props.text,
      }
    : { background: 'transparent', color: props.text }
})

const { buildUrl } = useWhatsApp()

function handleScroll() {
  isScrolled.value = window.scrollY > 30
}

function handleNavClick(e: MouseEvent, href: string) {
  e.preventDefault()
  isMobileMenuOpen.value = false
  if (href.startsWith('#')) {
    const el = document.querySelector(href)
    if (el) {
      const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}

const whatsappHref = computed(() => {
  if (!props.showWhatsappCta) return '#'
  return buildUrl(props.whatsappMessage || 'Halo, saya tertarik dengan template ini.')
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="tmpl-nav"
    :class="[`tmpl-nav--${style}`, { 'tmpl-nav--scrolled': isScrolled }]"
    :style="navStyle"
    role="navigation"
  >
    <a
      href="#top"
      class="tmpl-nav__brand"
      :style="brandStyle"
      @click.prevent="handleNavClick($event, '#top')"
    >
      <span v-if="wordmark" class="tmpl-nav__wordmark" :style="{ color: accent }">
        {{ wordmark }}
      </span>
      <span v-else class="tmpl-nav__brand-text">{{ brand }}</span>
    </a>

    <!-- Desktop links -->
    <ul class="tmpl-nav__links" v-if="links.length">
      <li v-for="link in links" :key="link.href">
        <a
          :href="link.href"
          class="tmpl-nav__link"
          :style="{ '--accent': accent }"
          @click="handleNavClick($event, link.href)"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>

    <div class="tmpl-nav__actions">
      <button
        v-if="showToggle"
        type="button"
        class="tmpl-nav__theme"
        :aria-label="`Ganti ke mode ${colorMode.value === 'dark' ? 'terang' : 'gelap'}`"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      >
        <ClientOnly>
          <UIcon
            :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            class="w-4 h-4"
          />
        </ClientOnly>
      </button>

      <a
        v-if="showWhatsappCta"
        :href="whatsappHref"
        target="_blank"
        rel="noopener"
        class="tmpl-nav__cta"
        :style="{ background: accent, color: '#fff' }"
      >
        WhatsApp
      </a>

      <button
        type="button"
        class="tmpl-nav__burger md:hidden"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Buka menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <UIcon
          :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          class="w-5 h-5"
        />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="tmpl-nav__mobile"
        :style="navStyle"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="tmpl-nav__mobile-link"
          :style="{ '--accent': accent }"
          @click="handleNavClick($event, link.href)"
        >
          {{ link.label }}
        </a>
        <a
          v-if="showWhatsappCta"
          :href="whatsappHref"
          target="_blank"
          rel="noopener"
          class="tmpl-nav__mobile-cta"
          :style="{ background: accent, color: '#fff' }"
        >
          Chat WhatsApp
        </a>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.tmpl-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.875rem 1.25rem;
  transition: background-color 240ms ease, color 240ms ease, backdrop-filter 240ms ease;
  font-size: 14px;
}
@media (min-width: 768px) {
  .tmpl-nav {
    padding: 1rem 2rem;
    font-size: 13px;
  }
}
.tmpl-nav--scrolled {
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.tmpl-nav__brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.01em;
  font-size: 16px;
  flex-shrink: 0;
  color: inherit;
}
@media (min-width: 768px) {
  .tmpl-nav__brand { font-size: 18px; }
}
.tmpl-nav__wordmark {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.tmpl-nav__links {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.75rem;
  align-items: center;
  flex: 1;
  justify-content: center;
}
@media (min-width: 768px) {
  .tmpl-nav__links {
    display: flex;
  }
}
.tmpl-nav__link {
  color: color-mix(in srgb, currentColor 70%, transparent);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 200ms ease;
  cursor: pointer;
}
.tmpl-nav__link:hover {
  color: var(--accent, currentColor);
}
.tmpl-nav__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}
@media (min-width: 768px) {
  .tmpl-nav__actions {
    gap: 0.75rem;
  }
}
.tmpl-nav__theme {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  background: color-mix(in srgb, currentColor 4%, transparent);
  color: inherit;
  border-radius: 999px;
  cursor: pointer;
  transition: all 200ms ease;
}
.tmpl-nav__theme:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  border-color: color-mix(in srgb, currentColor 25%, transparent);
}
.tmpl-nav__cta {
  display: none;
  align-items: center;
  height: 36px;
  padding: 0 1rem;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: opacity 200ms ease, transform 200ms ease;
}
.tmpl-nav__cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
@media (min-width: 768px) {
  .tmpl-nav__cta {
    display: inline-flex;
  }
}
.tmpl-nav__burger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  background: color-mix(in srgb, currentColor 4%, transparent);
  color: inherit;
  border-radius: 999px;
  cursor: pointer;
}
.tmpl-nav__mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}
.tmpl-nav__mobile-link {
  display: block;
  padding: 0.75rem 0;
  color: color-mix(in srgb, currentColor 75%, transparent);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}
.tmpl-nav__mobile-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  height: 44px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
</style>
