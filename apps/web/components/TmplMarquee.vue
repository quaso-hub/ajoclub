<script setup lang="ts">
/**
 * TmplMarquee.vue
 *
 * Scrolling text band. CSS-only horizontal infinite scroll.
 * Pause on hover. Respects prefers-reduced-motion.
 * Used for partner logos (as text), press mentions, taglines.
 */
const props = withDefaults(defineProps<{
  items: string[]
  /** Optional: separator between items */
  separator?: string
  /** Direction */
  direction?: 'left' | 'right'
  /** Speed: 'slow' (40s), 'normal' (24s), 'fast' (16s) */
  speed?: 'slow' | 'normal' | 'fast'
  /** Accent dot color */
  accent?: string
}>(), {
  separator: '·',
  direction: 'left',
  speed: 'normal',
  accent: 'currentColor',
})

const durationMap = { slow: '48s', normal: '28s', fast: '18s' }
const duration = computed(() => durationMap[props.speed])

const rendered = computed(() => {
  // Double the array for seamless loop
  return [...props.items, ...props.items]
})
</script>

<template>
  <div
    class="tmpl-marquee"
    :style="{ '--duration': duration, '--accent': accent }"
    role="list"
  >
    <div
      class="tmpl-marquee__track"
      :class="`tmpl-marquee__track--${direction}`"
    >
      <span
        v-for="(item, i) in rendered"
        :key="i"
        class="tmpl-marquee__item"
      >
        <span>{{ item }}</span>
        <span class="tmpl-marquee__sep" aria-hidden="true">{{ separator }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.tmpl-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.tmpl-marquee__track {
  display: flex;
  width: max-content;
  align-items: center;
  gap: 2.5rem;
  animation: tmpl-marquee-scroll var(--duration, 28s) linear infinite;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.5rem 0;
}
.tmpl-marquee__track--right {
  animation-direction: reverse;
}
.tmpl-marquee:hover .tmpl-marquee__track {
  animation-play-state: paused;
}
.tmpl-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 2.5rem;
  white-space: nowrap;
  opacity: 0.7;
  transition: opacity 240ms ease;
}
.tmpl-marquee__item:hover {
  opacity: 1;
}
.tmpl-marquee__sep {
  color: var(--accent);
  opacity: 0.5;
}
@keyframes tmpl-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-marquee__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .tmpl-marquee__item:nth-child(n+7) {
    display: none;
  }
}
</style>
