<script setup lang="ts">
/**
 * TmplBack.vue
 *
 * Back-to-AjoClub button, fixed top-left, semi-transparent.
 * Visible on every template page.
 */
const props = withDefaults(defineProps<{
  to?: string
  label?: string
  /** Visual style: 'glass' (default) or 'solid' */
  variant?: 'glass' | 'solid'
  /** Accent color for hover */
  accent?: string
}>(), {
  to: '/',
  label: 'AjoClub',
  variant: 'glass',
  accent: '#0A0A0A',
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="tmpl-back"
    :class="`tmpl-back--${variant}`"
    :aria-label="`Kembali ke ${label}`"
  >
    <UIcon name="i-lucide-arrow-left" class="tmpl-back__icon" />
    <span class="tmpl-back__label">{{ label }}</span>
  </NuxtLink>
</template>

<style scoped>
.tmpl-back {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 45;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem 0.5rem 0.625rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: all 200ms ease;
  background: color-mix(in srgb, currentColor 4%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  color: inherit;
}
.tmpl-back--solid {
  background: var(--tmpl-bg-elevated, white);
  border-color: color-mix(in srgb, currentColor 18%, transparent);
}
.tmpl-back:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  border-color: color-mix(in srgb, currentColor 22%, transparent);
  transform: translateX(-2px);
}
.tmpl-back__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.tmpl-back__label {
  display: none;
}
@media (min-width: 480px) {
  .tmpl-back__label {
    display: inline;
  }
}
</style>
