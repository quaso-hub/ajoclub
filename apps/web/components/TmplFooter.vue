<script setup lang="ts">
/**
 * TmplFooter.vue
 *
 * Per-template footer. Variants:
 *  - 'plain': simple text footer
 *  - 'marquee': scrolling band of brand or press mentions
 *  - 'signoff': large italic signoff (for weddings, restaurants)
 *  - 'columns': 4-column links + brand + CTA (for SaaS, portfolio)
 */
const props = withDefaults(defineProps<{
  brandName: string
  links?: Array<{ label: string, href: string }>
  /** Marquee items (for 'marquee' variant) */
  marqueeItems?: string[]
  /** Signoff text (for 'signoff' variant) */
  signoff?: string
  variant?: 'plain' | 'marquee' | 'signoff' | 'columns'
  accent?: string
  bg?: string
  text?: string
  /** Optional signature line */
  signature?: string
}>(), {
  links: () => [],
  marqueeItems: () => [],
  variant: 'plain',
})
</script>

<template>
  <!-- MARQUEE: scrolling band, signature element -->
  <footer
    v-if="variant === 'marquee'"
    class="tmpl-footer tmpl-footer--marquee"
    :style="{ background: bg, color: text }"
  >
    <div class="tmpl-footer__marquee" :style="{ '--accent': accent }">
      <div class="tmpl-footer__marquee-track">
        <span v-for="(item, i) in [...marqueeItems, ...marqueeItems]" :key="i" class="tmpl-footer__marquee-item">
          <span class="tmpl-footer__marquee-dot" :style="{ background: accent }" />
          {{ item }}
        </span>
      </div>
    </div>
    <div class="tmpl-footer__bottom">
      <span class="tmpl-footer__brand">{{ brandName }}</span>
      <span class="tmpl-footer__sig">{{ signature || 'Template by AjoClub' }}</span>
    </div>
  </footer>

  <!-- SIGNOFF: large italic for weddings/restaurants -->
  <footer
    v-else-if="variant === 'signoff'"
    class="tmpl-footer tmpl-footer--signoff"
    :style="{ background: bg, color: text }"
  >
    <div class="tmpl-footer__signoff-wrap">
      <p v-if="signoff" class="tmpl-footer__signoff-text" :style="{ color: accent }">
        {{ signoff }}
      </p>
      <p class="tmpl-footer__brand">{{ brandName }}</p>
      <p class="tmpl-footer__sig">{{ signature || 'Template by AjoClub' }}</p>
    </div>
  </footer>

  <!-- COLUMNS: 4-col with links -->
  <footer
    v-else-if="variant === 'columns'"
    class="tmpl-footer tmpl-footer--columns"
    :style="{ background: bg, color: text }"
  >
    <div class="tmpl-footer__cols">
      <div>
        <p class="tmpl-footer__col-title">{{ brandName }}</p>
        <p class="tmpl-footer__col-sub">
          {{ signature || 'Template by AjoClub' }}
        </p>
      </div>
      <nav v-for="(group, gi) in [{ label: 'Links', items: links }]" :key="gi">
        <p class="tmpl-footer__col-title">{{ group.label }}</p>
        <ul class="tmpl-footer__col-list">
          <li v-for="link in group.items" :key="link.href">
            <a :href="link.href" :style="{ '--accent': accent }" class="tmpl-footer__col-link">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>
      <div>
        <p class="tmpl-footer__col-title">Hubungi</p>
        <a
          href="https://wa.me/6285188627365"
          target="_blank"
          rel="noopener"
          class="tmpl-footer__col-link tmpl-footer__cta"
          :style="{ '--accent': accent, color: accent }"
        >
          WhatsApp →
        </a>
      </div>
    </div>
    <div class="tmpl-footer__legal">
      <span>© {{ new Date().getFullYear() }} {{ brandName }}</span>
      <span>Dibuat dengan AjoClub</span>
    </div>
  </footer>

  <!-- PLAIN: default -->
  <footer
    v-else
    class="tmpl-footer tmpl-footer--plain"
    :style="{ background: bg, color: text }"
  >
    <div class="tmpl-footer__plain-wrap">
      <div>
        <p class="tmpl-footer__brand">{{ brandName }}</p>
        <p class="tmpl-footer__sig">{{ signature || 'Template by AjoClub' }}</p>
      </div>
      <nav v-if="links.length" class="tmpl-footer__plain-nav">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :style="{ '--accent': accent }"
          class="tmpl-footer__plain-link"
        >
          {{ link.label }}
        </a>
      </nav>
      <a
        href="https://wa.me/6285188627365"
        target="_blank"
        rel="noopener"
        class="tmpl-footer__plain-cta"
        :style="{ color: accent }"
      >
        WhatsApp →
      </a>
    </div>
  </footer>
</template>

<style scoped>
.tmpl-footer {
  position: relative;
  width: 100%;
  padding: 3rem 1.5rem;
}
@media (min-width: 768px) {
  .tmpl-footer {
    padding: 4rem 2.5rem;
  }
}

.tmpl-footer--marquee {
  padding: 0;
}
.tmpl-footer__marquee {
  padding: 1.75rem 0;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.tmpl-footer__marquee-track {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: tmpl-marquee 32s linear infinite;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.tmpl-footer__marquee:hover .tmpl-footer__marquee-track {
  animation-play-state: paused;
}
.tmpl-footer__marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
}
.tmpl-footer__marquee-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
}
.tmpl-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 0.75rem;
}
@media (min-width: 768px) {
  .tmpl-footer__bottom {
    padding: 1.5rem 2.5rem;
  }
}
.tmpl-footer__bottom .tmpl-footer__brand {
  font-weight: 700;
  font-size: 15px;
}
.tmpl-footer__bottom .tmpl-footer__sig {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
}

.tmpl-footer--signoff {
  text-align: center;
  padding: 4rem 1.5rem;
}
@media (min-width: 768px) {
  .tmpl-footer--signoff {
    padding: 6rem 2.5rem;
  }
}
.tmpl-footer__signoff-wrap {
  max-width: 36rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}
.tmpl-footer__signoff-text {
  font-family: 'Cormorant Garamond', 'Fraunces', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-style: italic;
  font-weight: 300;
  line-height: 1.15;
}
.tmpl-footer--signoff .tmpl-footer__brand {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}
.tmpl-footer--signoff .tmpl-footer__sig {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.4;
}

.tmpl-footer--columns .tmpl-footer__cols {
  max-width: 80rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 0 1.5rem;
}
@media (min-width: 768px) {
  .tmpl-footer--columns .tmpl-footer__cols {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    padding: 0 2.5rem;
  }
}
.tmpl-footer__col-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 0.75rem;
}
.tmpl-footer__col-sub {
  font-size: 13px;
  opacity: 0.7;
  margin-top: 0.5rem;
}
.tmpl-footer__col-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tmpl-footer__col-link {
  font-size: 13px;
  text-decoration: none;
  color: inherit;
  opacity: 0.7;
  transition: opacity 200ms ease, color 200ms ease;
}
.tmpl-footer__col-link:hover {
  opacity: 1;
  color: var(--accent, currentColor);
}
.tmpl-footer__cta {
  font-weight: 600;
}
.tmpl-footer__legal {
  max-width: 80rem;
  margin: 2.5rem auto 0;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.5;
  flex-wrap: wrap;
  gap: 0.5rem;
}
@media (min-width: 768px) {
  .tmpl-footer__legal {
    padding: 1.5rem 2.5rem 0;
  }
}

.tmpl-footer--plain {
  padding: 2.5rem 1.5rem;
}
.tmpl-footer__plain-wrap {
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.tmpl-footer--plain .tmpl-footer__brand {
  font-weight: 700;
  font-size: 15px;
}
.tmpl-footer--plain .tmpl-footer__sig {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-top: 0.25rem;
}
.tmpl-footer__plain-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.tmpl-footer__plain-link {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  color: inherit;
  opacity: 0.7;
  transition: opacity 200ms ease, color 200ms ease;
}
.tmpl-footer__plain-link:hover {
  opacity: 1;
  color: var(--accent, currentColor);
}
.tmpl-footer__plain-cta {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 700;
  transition: opacity 200ms ease;
}
.tmpl-footer__plain-cta:hover {
  opacity: 0.7;
}

@keyframes tmpl-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-footer__marquee-track {
    animation: none;
  }
}
</style>
