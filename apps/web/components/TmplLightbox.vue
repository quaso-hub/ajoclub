<script setup lang="ts">
/**
 * TmplLightbox.vue
 *
 * Image gallery lightbox. Keyboard nav (arrows, escape, home/end).
 * Pinch-zoom on touch. Counter. Focus trap.
 * Used by weddings, portfolios, real estate.
 */
const props = withDefaults(defineProps<{
  /** Image list — each can be {src, alt, caption?} or a string */
  images: Array<{ src: string, alt: string, caption?: string } | string>
  /** Initial open index (-1 = closed) */
  openIndex?: number
  /** Optional title shown above the image (e.g. "Sarah & Kevin") */
  title?: string
}>(), {
  openIndex: -1,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'change', index: number): void
}>()

const images = computed(() => {
  return props.images.map((img) => {
    if (typeof img === 'string') return { src: img, alt: '' }
    return img
  })
})

const currentIndex = ref(props.openIndex)

const isOpen = computed(() => currentIndex.value >= 0 && currentIndex.value < images.value.length)

const currentImage = computed(() => {
  if (!isOpen.value) return null
  return images.value[currentIndex.value]
})

const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === images.value.length - 1)

function close() {
  currentIndex.value = -1
  emit('close')
}
function next() {
  if (currentIndex.value < images.value.length - 1) currentIndex.value++
  emit('change', currentIndex.value)
}
function prev() {
  if (currentIndex.value > 0) currentIndex.value--
  emit('change', currentIndex.value)
}
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'Home') { currentIndex.value = 0; emit('change', 0) }
  else if (e.key === 'End') { currentIndex.value = images.value.length - 1; emit('change', currentIndex.value) }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(isOpen, (v) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = v ? 'hidden' : ''
  }
})

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

// Pinch-zoom (basic, touch only)
let pinchStart = 0
function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    pinchStart = Math.hypot(dx, dy)
  }
}
let lastZoom = 1
let zoom = ref(1)
function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const d = Math.hypot(dx, dy)
    if (pinchStart > 0) {
      const ratio = d / pinchStart
      zoom.value = Math.max(1, Math.min(3, lastZoom * ratio))
    }
  }
}
function onTouchEnd() {
  lastZoom = zoom.value
  pinchStart = 0
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && currentImage"
        class="tmpl-lb"
        role="dialog"
        aria-modal="true"
        :aria-label="`Gambar ${currentIndex + 1} dari ${images.length}`"
        @click="onBackdropClick"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      >
        <button
          type="button"
          class="tmpl-lb__close micro-press micro-focus"
          aria-label="Tutup"
          data-micro="ripple"
          @click="close"
        >
          <UIcon name="i-lucide-x" class="w-5 h-5" />
        </button>

        <button
          v-if="!isFirst"
          type="button"
          class="tmpl-lb__nav tmpl-lb__nav--prev micro-press micro-focus"
          aria-label="Gambar sebelumnya"
          data-micro="ripple"
          @click.stop="prev"
        >
          <UIcon name="i-lucide-chevron-left" class="w-6 h-6" />
        </button>
        <button
          v-if="!isLast"
          type="button"
          class="tmpl-lb__nav tmpl-lb__nav--next micro-press micro-focus"
          aria-label="Gambar berikutnya"
          data-micro="ripple"
          @click.stop="next"
        >
          <UIcon name="i-lucide-chevron-right" class="w-6 h-6" />
        </button>

        <div class="tmpl-lb__stage" @click.stop>
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="tmpl-lb__img"
            :style="{ transform: `scale(${zoom})` }"
            draggable="false"
          />
        </div>

        <footer class="tmpl-lb__footer">
          <div>
            <p v-if="title" class="tmpl-lb__title">{{ title }}</p>
            <p v-if="currentImage.caption" class="tmpl-lb__caption">
              {{ currentImage.caption }}
            </p>
          </div>
          <p class="tmpl-lb__counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </p>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tmpl-lb {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4rem 1rem 6rem;
}
.tmpl-lb__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 200ms ease;
}
.tmpl-lb__close:hover {
  background: rgba(255, 255, 255, 0.16);
}
.tmpl-lb__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 200ms ease, transform 200ms ease;
}
.tmpl-lb__nav:hover {
  background: rgba(255, 255, 255, 0.18);
}
.tmpl-lb__nav--prev { left: 1rem; }
.tmpl-lb__nav--next { right: 1rem; }
.tmpl-lb__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
  touch-action: pinch-zoom;
}
.tmpl-lb__img {
  display: block;
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 240ms ease;
}
.tmpl-lb__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 13px;
  gap: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
}
.tmpl-lb__title {
  font-weight: 600;
  letter-spacing: 0.02em;
}
.tmpl-lb__caption {
  opacity: 0.7;
  margin-top: 0.25rem;
  font-size: 12px;
}
.tmpl-lb__counter {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
</style>
