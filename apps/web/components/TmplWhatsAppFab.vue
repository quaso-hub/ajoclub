<script setup lang="ts">
/**
 * TmplWhatsAppFab.vue
 *
 * Floating WhatsApp button with multi-option menu.
 * Each template passes its own list of "what to chat about" options.
 * Click an option -> opens WhatsApp with the relevant pre-filled message.
 */
const { buildUrl } = useWhatsApp()

export interface FabAction {
  label: string
  detail: string
  icon: string
  /** Pre-filled WhatsApp message body */
  message: string
}

const props = withDefaults(defineProps<{
  actions?: FabAction[]
  accent?: string
  /** Delay before showing (ms) */
  delay?: number
  /** Label for screen readers */
  label?: string
}>(), {
  actions: () => [
    {
      label: 'Mau bikin website',
      detail: 'Landing page, company profile, toko online',
      icon: 'i-lucide-globe',
      message: 'Halo, saya mau tanya soal bikin website.',
    },
    {
      label: 'Butuh SaaS / dashboard',
      detail: 'Aplikasi internal, CRM, sistem operasional',
      icon: 'i-lucide-layout-dashboard',
      message: 'Halo, saya butuh aplikasi web / dashboard.',
    },
    {
      label: 'Website sudah ada, mau diperbaiki',
      detail: 'Desain kurang pas, lambat, susah di-update',
      icon: 'i-lucide-wrench',
      message: 'Halo, website saya sudah ada tapi perlu diperbaiki.',
    },
  ],
  accent: '#25d366',
  delay: 1500,
  label: 'Buka pilihan chat WhatsApp',
})

const isVisible = ref(false)
const isOpen = ref(false)

onMounted(() => {
  setTimeout(() => { isVisible.value = true }, props.delay)
})

function handleSelect(message: string) {
  window.open(buildUrl(message), '_blank', 'noopener,noreferrer')
  isOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-3 scale-90"
    leave-to-class="opacity-0 translate-y-3 scale-90"
  >
    <div
      v-if="isVisible"
      class="tmpl-fab"
      role="region"
      :aria-label="label"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-if="isOpen"
          class="tmpl-fab__menu"
        >
          <header class="tmpl-fab__menu-head">
            <p class="tmpl-fab__menu-title">Mau mulai dari mana?</p>
            <p class="tmpl-fab__menu-subtitle">Pilih konteks, pesan WhatsApp otomatis lebih jelas.</p>
          </header>
          <button
            v-for="(action, i) in actions"
            :key="i"
            type="button"
            class="tmpl-fab__item"
            @click="handleSelect(action.message)"
          >
            <span
              class="tmpl-fab__item-icon"
              :style="{ background: 'rgba(37, 211, 102, 0.12)', color: '#25d366' }"
            >
              <UIcon :name="action.icon" class="w-4 h-4" />
            </span>
            <span class="tmpl-fab__item-text">
              <span class="tmpl-fab__item-label">{{ action.label }}</span>
              <span class="tmpl-fab__item-detail">{{ action.detail }}</span>
            </span>
            <UIcon name="i-lucide-arrow-up-right" class="tmpl-fab__item-arrow w-4 h-4" />
          </button>
        </div>
      </Transition>

      <button
        type="button"
        class="tmpl-fab__trigger"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Tutup pilihan chat' : 'Buka pilihan chat WhatsApp'"
        @click="isOpen = !isOpen"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 rotate-90 scale-50"
          leave-to-class="opacity-0 rotate-90 scale-50"
          mode="out-in"
        >
          <UIcon
            v-if="!isOpen"
            key="wa"
            name="i-lucide-message-circle"
            class="w-6 h-6 text-white"
          />
          <UIcon
            v-else
            key="x"
            name="i-lucide-x"
            class="w-6 h-6 text-white"
          />
        </Transition>
        <span v-if="!isOpen" class="tmpl-fab__pulse" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.tmpl-fab {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
}
@media (min-width: 640px) {
  .tmpl-fab {
    bottom: 1.25rem;
    right: 1.25rem;
  }
}
.tmpl-fab__menu {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  right: 0;
  width: min(calc(100vw - 2rem), 22rem);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  padding: 0.5rem;
  overflow: hidden;
}
:global(.dark) .tmpl-fab__menu {
  background: rgba(20, 20, 22, 0.96);
  border-color: rgba(255, 255, 255, 0.08);
}
.tmpl-fab__menu-head {
  padding: 0.875rem 0.875rem 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
:global(.dark) .tmpl-fab__menu-head {
  border-color: rgba(255, 255, 255, 0.06);
}
.tmpl-fab__menu-title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(17, 17, 17);
}
:global(.dark) .tmpl-fab__menu-title {
  color: rgb(238, 238, 238);
}
.tmpl-fab__menu-subtitle {
  font-size: 12px;
  color: rgb(115, 115, 115);
  margin-top: 2px;
}
:global(.dark) .tmpl-fab__menu-subtitle {
  color: rgb(160, 160, 160);
}
.tmpl-fab__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 200ms ease;
  font: inherit;
  color: inherit;
}
.tmpl-fab__item:hover {
  background: rgba(0, 0, 0, 0.04);
}
:global(.dark) .tmpl-fab__item:hover {
  background: rgba(255, 255, 255, 0.05);
}
.tmpl-fab__item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex-shrink: 0;
}
.tmpl-fab__item-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.tmpl-fab__item-label {
  font-size: 13px;
  font-weight: 600;
  color: rgb(17, 17, 17);
}
:global(.dark) .tmpl-fab__item-label {
  color: rgb(238, 238, 238);
}
.tmpl-fab__item-detail {
  font-size: 11px;
  color: rgb(115, 115, 115);
  margin-top: 1px;
}
:global(.dark) .tmpl-fab__item-detail {
  color: rgb(160, 160, 160);
}
.tmpl-fab__item-arrow {
  color: rgb(160, 160, 160);
  flex-shrink: 0;
}
.tmpl-fab__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 0;
  background: #25d366;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}
.tmpl-fab__trigger:hover {
  background: #1ebe57;
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(37, 211, 102, 0.5);
}
.tmpl-fab__trigger:focus-visible {
  outline: 3px solid rgba(37, 211, 102, 0.4);
  outline-offset: 3px;
}
.tmpl-fab__pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(37, 211, 102, 0.5);
  animation: tmpl-fab-pulse 2.4s ease-out infinite;
  pointer-events: none;
  z-index: -1;
}
@keyframes tmpl-fab-pulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-fab__pulse { animation: none; }
}
</style>
