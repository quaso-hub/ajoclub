<script setup lang="ts">
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function scrollTo(href: string) {
  isMobileMenuOpen.value = false
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="isScrolled ? 'bg-[var(--popover)]/90 backdrop-blur-xl border-b border-[var(--border)]' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="text-xl font-bold tracking-tight text-[var(--foreground)]">
        AjoClub
      </a>

      <div class="hidden md:flex items-center gap-8">
        <button
          v-for="link in links"
          :key="link.href"
          class="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-300 tracking-wide uppercase"
          @click="scrollTo(link.href)"
        >
          {{ link.label }}
        </button>
        <button
          class="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity duration-300"
          @click="scrollTo('#contact')"
        >
          Start a Project
        </button>
      </div>

      <button
        class="md:hidden text-[var(--foreground)]"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!isMobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-[var(--popover)]/95 backdrop-blur-xl border-b border-[var(--border)] px-6 pb-6"
      >
        <button
          v-for="link in links"
          :key="link.href"
          class="block w-full text-left py-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          @click="scrollTo(link.href)"
        >
          {{ link.label }}
        </button>
        <button
          class="w-full mt-4 px-5 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-[var(--radius)]"
          @click="scrollTo('#contact')"
        >
          Start a Project
        </button>
      </div>
    </Transition>
  </nav>
</template>
