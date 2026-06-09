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
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-(--ui-bg) border-b border-(--ui-border)' : 'bg-transparent'"
  >
    <UContainer class="h-20 flex items-center justify-between">
      <a href="#" class="text-xl font-bold">AjoClub</a>

      <div class="hidden md:flex items-center gap-8">
        <button
          v-for="link in links"
          :key="link.href"
          class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors uppercase tracking-wide cursor-pointer"
          @click="scrollTo(link.href)"
        >
          {{ link.label }}
        </button>
        <UButton @click="scrollTo('#contact')">Start a Project</UButton>
      </div>

      <UButton
        class="md:hidden"
        variant="ghost"
        color="neutral"
        icon="i-lucide-menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      />
    </UContainer>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-(--ui-bg) border-b border-(--ui-border)"
      >
        <UContainer class="py-4 space-y-2">
          <button
            v-for="link in links"
            :key="link.href"
            class="block w-full text-left py-3 text-(--ui-text-muted) hover:text-(--ui-text) transition-colors cursor-pointer"
            @click="scrollTo(link.href)"
          >
            {{ link.label }}
          </button>
          <UButton block @click="scrollTo('#contact')">Start a Project</UButton>
        </UContainer>
      </div>
    </Transition>
  </nav>
</template>
