<script setup lang="ts">
/**
 * TmplAudioToggle.vue
 *
 * Background music toggle (for weddings).
 * Muted by default (autoplay policy).
 * One user gesture to enable.
 * Persists preference to localStorage.
 */
const props = withDefaults(defineProps<{
  src: string
  /** Volume 0-1 */
  volume?: number
  /** Optional label */
  label?: string
  /** Persist preference key */
  storageKey?: string
  accent?: string
}>(), {
  volume: 0.4,
  label: 'Musik latar',
  storageKey: 'tmpl-audio',
  accent: '#0A0A0A',
})

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)

onMounted(() => {
  // Restore preference
  try {
    const saved = localStorage.getItem(props.storageKey)
    if (saved === '1' && audio.value) {
      audio.value.volume = props.volume
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch(() => {
        // Autoplay blocked — user must click
        isPlaying.value = false
      })
    }
  }
  catch { /* ignore */ }
})

function toggle() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
    try { localStorage.setItem(props.storageKey, '0') } catch { /* ignore */ }
  }
  else {
    audio.value.volume = props.volume
    audio.value.play().then(() => {
      isPlaying.value = true
      try { localStorage.setItem(props.storageKey, '1') } catch { /* ignore */ }
    }).catch((e) => {
      console.warn('Audio play failed:', e)
      hasError.value = true
    })
  }
}

function onLoaded() {
  isLoaded.value = true
}
</script>

<template>
  <div class="tmpl-audio" :style="{ '--accent': accent }">
    <audio
      ref="audio"
      :src="src"
      loop
      preload="none"
      @loadedmetadata="onLoaded"
      @error="hasError = true"
    />
    <button
      type="button"
      class="tmpl-audio__btn"
      :class="{ 'tmpl-audio__btn--on': isPlaying }"
      :aria-pressed="isPlaying"
      :aria-label="isPlaying ? 'Matikan musik' : 'Putar musik'"
      @click="toggle"
    >
      <span class="tmpl-audio__icon" aria-hidden="true">
        <span v-if="isPlaying">
          <span class="tmpl-audio__bar tmpl-audio__bar--1" />
          <span class="tmpl-audio__bar tmpl-audio__bar--2" />
          <span class="tmpl-audio__bar tmpl-audio__bar--3" />
          <span class="tmpl-audio__bar tmpl-audio__bar--4" />
        </span>
        <UIcon v-else name="i-lucide-volume-x" class="w-4 h-4" />
      </span>
      <span class="tmpl-audio__label">{{ isPlaying ? 'Musik on' : 'Musik' }}</span>
    </button>
  </div>
</template>

<style scoped>
.tmpl-audio {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 44;
}
.tmpl-audio__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem 0.4rem 0.5rem;
  background: color-mix(in srgb, currentColor 4%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: background-color 200ms ease;
}
.tmpl-audio__btn:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.tmpl-audio__btn--on {
  border-color: var(--accent);
  color: var(--accent);
}
.tmpl-audio__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.tmpl-audio__icon > :not(.tmpl-audio__bar) {
  display: inline-flex;
}
.tmpl-audio__bar {
  display: inline-block;
  width: 2px;
  background: currentColor;
  margin: 0 1px;
  border-radius: 1px;
  animation: tmpl-audio-bar 1s ease-in-out infinite;
}
.tmpl-audio__bar--1 { height: 60%; animation-delay: 0s; }
.tmpl-audio__bar--2 { height: 100%; animation-delay: 0.2s; }
.tmpl-audio__bar--3 { height: 70%; animation-delay: 0.4s; }
.tmpl-audio__bar--4 { height: 90%; animation-delay: 0.6s; }
@keyframes tmpl-audio-bar {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-audio__bar { animation: none; }
}
.tmpl-audio__label {
  display: none;
}
@media (min-width: 480px) {
  .tmpl-audio__label {
    display: inline;
  }
}
</style>
