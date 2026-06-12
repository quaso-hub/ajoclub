<script setup lang="ts">
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const { scrollTo } = useScrollTo()

const links = [
  { label: 'Layanan', href: '#services' },
  { label: 'Proyek', href: '#work' },
  { label: 'Tentang', href: '#about' },
  { label: 'Kontak', href: '#contact' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function handleScrollTo(href: string) {
  isMobileMenuOpen.value = false
  scrollTo(href)
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800' : 'bg-transparent'"
  >
    <UContainer class="h-14 sm:h-16 flex items-center justify-between">
      <a href="#" class="text-base sm:text-lg font-bold text-white">AjoClub</a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <button
          v-for="link in links"
          :key="link.href"
          class="text-sm text-zinc-400 hover:text-white transition-colors uppercase tracking-wide cursor-pointer"
          @click="handleScrollTo(link.href)"
        >
          {{ link.label }}
        </button>
        <ThemeToggle />
        <UButton size="sm" @click="handleScrollTo('#contact')">Chat WhatsApp</UButton>
      </div>

      <!-- Mobile nav -->
      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          size="sm"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        />
      </div>
    </UContainer>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-zinc-950 border-b border-zinc-800"
      >
        <UContainer class="py-4 space-y-2">
          <button
            v-for="link in links"
            :key="link.href"
            class="block w-full text-left py-3 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm"
            @click="handleScrollTo(link.href)"
          >
            {{ link.label }}
          </button>
          <UButton block size="sm" @click="handleScrollTo('#contact')">Chat WhatsApp</UButton>
        </UContainer>
      </div>
    </Transition>
  </nav>
</template>
