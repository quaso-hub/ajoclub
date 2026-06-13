<script setup lang="ts">
const { scrollTo } = useScrollTo()

const links = [
  { label: 'Layanan', href: '#services' },
  { label: 'Proyek', href: '#work' },
  { label: 'Tentang', href: '#about' },
  { label: 'Kontak', href: '#contact' },
]
</script>

<template>
  <footer class="py-10 sm:py-16 bg-(--ui-bg) border-t border-(--ui-border)">
    <UContainer>
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div class="text-center md:text-left">
          <span class="text-lg sm:text-xl font-bold">AjoClub</span>
          <p class="text-xs sm:text-sm text-(--ui-text-muted) mt-1 sm:mt-2">Digital Agency. Web, SaaS, Mobile.</p>
        </div>
        <div class="flex items-center gap-4 sm:gap-6">
          <button
            v-for="link in links"
            :key="link.href"
            class="text-xs sm:text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors cursor-pointer"
            @click="scrollTo(link.href)"
          >
            {{ link.label }}
          </button>
        </div>
        <p class="text-xs sm:text-sm text-(--ui-text-muted)">&copy; {{ new Date().getFullYear() }} AjoClub.</p>
      </div>
    </UContainer>
  </footer>
</template>
