<script setup lang="ts">
/**
 * TmplScenePreview.vue
 *
 * CSS-only 3D preview used for:
 *   - Showcase grid thumbnails (homepage)
 *   - Hero fallback (no JS, no WebGL)
 *   - Reduced-motion users
 *
 * Six preset variants matched to the real 3D presets, so the visual
 * signature of each template is recognizable even on low-end devices.
 */
import type { ScenePreset } from '~/utils/portfolio'

const props = withDefaults(defineProps<{
  preset?: ScenePreset
  accent?: string
  label?: string
  /** When true, render in "frozen" state for grid thumbnails */
  thumbnail?: boolean
}>(), {
  preset: 'sphere',
  accent: '#fb7185',
  label: 'Scene preview',
  thumbnail: true,
})

const ringCount = computed(() => {
  if (props.preset === 'case-timeline') return 5
  if (props.preset === 'sphere') return 4
  if (props.preset === 'orbit-product') return 3
  return 3
})

function ringStyle(index: number) {
  return {
    '--size': `${90 + index * 42}px`,
    '--rot': `${index * 18}deg`,
    '--opacity': `${0.55 - index * 0.08}`,
  }
}

// For 'sphere' preset, draw a wireframe sphere silhouette
const isSphere = computed(() => props.preset === 'sphere')
</script>

<template>
  <div
    class="scene-preview"
    :style="{ '--tmpl-accent': accent }"
    :aria-label="label"
    role="img"
  >
    <div class="scene-preview__grid" />

    <!-- Sphere preset: layered wireframe -->
    <template v-if="isSphere">
      <div class="scene-preview__sphere" />
      <div
        v-for="i in 4"
        :key="`r${i}`"
        class="scene-preview__ring"
        :style="ringStyle(i)"
      />
    </template>

    <!-- Default: orb + rings -->
    <template v-else>
      <div class="scene-preview__orb" />
      <div
        v-for="i in ringCount"
        :key="i"
        class="scene-preview__ring"
        :style="ringStyle(i)"
      />
    </template>

    <!-- Case-timeline: dot track -->
    <div
      v-if="preset === 'case-timeline'"
      class="scene-preview__timeline"
    >
      <span v-for="i in 5" :key="i" />
    </div>
  </div>
</template>

<style scoped>
.scene-preview__sphere {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 38%;
  aspect-ratio: 1;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--tmpl-accent, #fb7185) 60%, transparent);
  background: radial-gradient(
    circle at 35% 25%,
    color-mix(in srgb, white 80%, transparent),
    var(--tmpl-accent, #fb7185) 35%,
    transparent 75%
  );
  filter: blur(1px);
  opacity: 0.92;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 60px color-mix(in srgb, var(--tmpl-accent, #fb7185) 55%, transparent);
}
</style>
