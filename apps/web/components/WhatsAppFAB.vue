<script setup lang="ts">
const isVisible = ref(false)
const isOpen = ref(false)
const { buildUrl } = useWhatsApp()

const actions = [
  {
    label: 'Mau bikin website',
    detail: 'Landing, company profile, toko online',
    icon: 'i-lucide-globe',
    href: computed(() => buildUrl('Halo, saya mau tanya soal bikin website.')),
  },
  {
    label: 'Butuh SaaS / dashboard',
    detail: 'Aplikasi internal, CRM, sistem operasional',
    icon: 'i-lucide-layout-dashboard',
    href: computed(() => buildUrl('Halo, saya butuh aplikasi web / dashboard.')),
  },
  {
    label: 'Website sudah ada, mau diperbaiki',
    detail: 'Desain jelek, lambat, susah diupdate',
    icon: 'i-lucide-wrench',
    href: computed(() => buildUrl('Halo, website saya sudah ada tapi perlu diperbaiki.')),
  },
]

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 2000)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] sm:w-80 rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl"
        >
          <div class="px-2 pb-3">
            <p class="text-sm font-semibold text-white">Mau mulai dari mana?</p>
            <p class="text-xs text-zinc-400">Pilih konteks, pesan WhatsApp otomatis lebih jelas.</p>
          </div>
          <a
            v-for="action in actions"
            :key="action.label"
            :href="action.href.value"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-zinc-800 transition-colors"
          >
            <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <UIcon :name="action.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-medium text-white">{{ action.label }}</span>
              <span class="block text-xs text-zinc-400">{{ action.detail }}</span>
            </span>
            <UIcon name="i-lucide-external-link" class="w-4 h-4 text-zinc-500 ml-auto shrink-0" />
          </a>
        </div>
      </Transition>

      <button
        type="button"
        class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/25"
        :aria-expanded="isOpen"
        aria-label="Buka pilihan chat WhatsApp"
        @click="isOpen = !isOpen"
        @keydown.escape="isOpen = false"
      >
        <UIcon :name="isOpen ? 'i-lucide-x' : 'i-lucide-message-circle'" class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </div>
  </Transition>
</template>
