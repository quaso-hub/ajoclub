<script setup lang="ts">
import type { ScenePreset } from '~/utils/portfolio'

const props = withDefaults(defineProps<{
  preset?: ScenePreset
  accent?: string
  label?: string
}>(), {
  preset: 'particle-morph',
  accent: '#fb7185',
  label: 'Scene preview',
})

const ringCount = computed(() => props.preset === 'case-timeline' ? 5 : 3)

function ringStyle(index: number) {
  return {
    '--size': `${110 + index * 46}px`,
    '--rot': `${index * 16}deg`,
    '--opacity': `${0.5 - index * 0.07}`,
  }
}
</script>

<template>
  <div class="scene-preview" :style="{ '--accent': accent }" :aria-label="label" role="img">
    <div class="scene-preview__grid" />
    <div class="scene-preview__orb" />
    <div
      v-for="index in ringCount"
      :key="index"
      class="scene-preview__ring"
      :style="ringStyle(index)"
    />
    <div v-if="preset === 'case-timeline'" class="scene-preview__timeline">
      <span v-for="index in 5" :key="index" />
    </div>
  </div>
</template>
