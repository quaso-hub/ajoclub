<script setup lang="ts">
/**
 * TmplSkeleton.vue
 *
 * Loading placeholder. CSS shimmer animation.
 * Variants: 'block' (rectangle), 'text' (lines), 'circle', 'card'
 */
const props = withDefaults(defineProps<{
  variant?: 'block' | 'text' | 'circle' | 'card'
  width?: string
  height?: string
  /** Number of text lines (for variant='text') */
  lines?: number
  /** Optional class for the parent */
  rounded?: string
}>(), {
  variant: 'block',
  width: '100%',
  height: '1em',
  lines: 3,
  rounded: '',
})
</script>

<template>
  <!-- Text variant: N lines of varying width -->
  <div v-if="variant === 'text'" class="tmpl-skel tmpl-skel--text">
    <span
      v-for="i in lines"
      :key="i"
      class="tmpl-skel__line"
      :style="{ width: i === lines ? '60%' : i === 1 ? '85%' : '100%' }"
    />
  </div>

  <!-- Circle variant -->
  <span
    v-else-if="variant === 'circle'"
    class="tmpl-skel tmpl-skel--circle"
    :style="{ width: height, height }"
  />

  <!-- Card variant: image area + 3 text lines -->
  <div v-else-if="variant === 'card'" class="tmpl-skel tmpl-skel--card">
    <span class="tmpl-skel__img" />
    <div class="tmpl-skel__body">
      <span class="tmpl-skel__line" style="width: 30%" />
      <span class="tmpl-skel__line" style="width: 75%" />
      <span class="tmpl-skel__line" style="width: 100%" />
    </div>
  </div>

  <!-- Block variant: default rectangle -->
  <span
    v-else
    class="tmpl-skel tmpl-skel--block"
    :style="{ width, height, borderRadius: rounded }"
  />
</template>

<style scoped>
.tmpl-skel {
  display: block;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, currentColor 6%, transparent) 0%,
    color-mix(in srgb, currentColor 14%, transparent) 50%,
    color-mix(in srgb, currentColor 6%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: tmpl-skel-shimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}
.tmpl-skel--circle {
  border-radius: 999px;
}
.tmpl-skel--text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: transparent;
  animation: none;
}
.tmpl-skel--text .tmpl-skel__line {
  display: block;
  height: 0.85em;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, currentColor 6%, transparent) 0%,
    color-mix(in srgb, currentColor 14%, transparent) 50%,
    color-mix(in srgb, currentColor 6%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: tmpl-skel-shimmer 1.6s ease-in-out infinite;
  border-radius: 4px;
}
.tmpl-skel--card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: transparent;
  animation: none;
  padding: 0;
  border: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  border-radius: 12px;
  overflow: hidden;
}
.tmpl-skel__img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, currentColor 6%, transparent) 0%,
    color-mix(in srgb, currentColor 14%, transparent) 50%,
    color-mix(in srgb, currentColor 6%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: tmpl-skel-shimmer 1.6s ease-in-out infinite;
}
.tmpl-skel__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}
.tmpl-skel__body .tmpl-skel__line {
  display: block;
  height: 0.85em;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, currentColor 6%, transparent) 0%,
    color-mix(in srgb, currentColor 14%, transparent) 50%,
    color-mix(in srgb, currentColor 6%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: tmpl-skel-shimmer 1.6s ease-in-out infinite;
  border-radius: 4px;
}
@keyframes tmpl-skel-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-skel,
  .tmpl-skel__line,
  .tmpl-skel__img {
    animation: none;
    opacity: 0.6;
  }
}
</style>
