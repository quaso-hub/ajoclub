<script setup lang="ts">
/**
 * TmplCountdown.vue
 *
 * Live countdown to a target date. Smooth RAF ticking.
 * Used by events, weddings, product launches.
 *
 * Variants: 'blocks' (large 4 blocks: days/hours/minutes/seconds) or
 *           'inline' (single line, smaller)
 */
const props = withDefaults(defineProps<{
  target: string | Date  // ISO string or Date
  variant?: 'blocks' | 'inline'
  label?: string
  expiredMessage?: string
}>(), {
  variant: 'blocks',
  label: 'Hitung mundur',
  expiredMessage: 'Sudah dimulai',
})

const targetTime = computed(() => {
  if (props.target instanceof Date) return props.target.getTime()
  return new Date(props.target).getTime()
})

const now = ref(Date.now())
let raf = 0

function tick() {
  now.value = Date.now()
  raf = requestAnimationFrame(tick)
}

const isExpired = computed(() => now.value >= targetTime.value)

const parts = computed(() => {
  const diff = Math.max(0, targetTime.value - now.value)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
})

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Still update, but at 1Hz not 60fps
    const interval = setInterval(() => { now.value = Date.now() }, 1000)
    onBeforeUnmount(() => clearInterval(interval))
    return
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="tmpl-countdown" :class="`tmpl-countdown--${variant}`" role="timer">
    <p v-if="label" class="tmpl-countdown__label">{{ label }}</p>

    <p v-if="isExpired" class="tmpl-countdown__expired">
      {{ expiredMessage }}
    </p>

    <div v-else-if="variant === 'blocks'" class="tmpl-countdown__blocks">
      <div class="tmpl-countdown__block">
        <span class="tmpl-countdown__num">{{ pad(parts.days) }}</span>
        <span class="tmpl-countdown__unit">hari</span>
      </div>
      <span class="tmpl-countdown__sep">:</span>
      <div class="tmpl-countdown__block">
        <span class="tmpl-countdown__num">{{ pad(parts.hours) }}</span>
        <span class="tmpl-countdown__unit">jam</span>
      </div>
      <span class="tmpl-countdown__sep">:</span>
      <div class="tmpl-countdown__block">
        <span class="tmpl-countdown__num">{{ pad(parts.minutes) }}</span>
        <span class="tmpl-countdown__unit">menit</span>
      </div>
      <span class="tmpl-countdown__sep">:</span>
      <div class="tmpl-countdown__block">
        <span class="tmpl-countdown__num">{{ pad(parts.seconds) }}</span>
        <span class="tmpl-countdown__unit">detik</span>
      </div>
    </div>

    <p v-else class="tmpl-countdown__inline">
      {{ pad(parts.days) }} hari {{ pad(parts.hours) }}:{{ pad(parts.minutes) }}:{{ pad(parts.seconds) }}
    </p>
  </div>
</template>

<style scoped>
.tmpl-countdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tmpl-countdown__label {
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.5;
}
.tmpl-countdown__blocks {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  font-variant-numeric: tabular-nums;
}
.tmpl-countdown__block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4rem;
  padding: 0.5rem 0.75rem;
  background: color-mix(in srgb, currentColor 5%, transparent);
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 10px;
}
.tmpl-countdown__num {
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  font-weight: 700;
  font-feature-settings: "tnum";
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.tmpl-countdown__unit {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-top: 0.25rem;
}
.tmpl-countdown__sep {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 700;
  opacity: 0.4;
  align-self: center;
  margin-bottom: 1.5rem;
}
.tmpl-countdown__inline {
  font-size: 1.125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tmpl-countdown__expired {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--accent, currentColor);
}
</style>
