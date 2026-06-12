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
  <footer class="py-10 sm:py-16 bg-zinc-950 border-t border-zinc-800">
    <UContainer>
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div class="text-center md:text-left">
          <span class="text-lg sm:text-xl font-bold text-white">AjoClub</span>
          <p class="text-xs sm:text-sm text-zinc-500 mt-1 sm:mt-2">Digital Agency. Web, SaaS, Mobile.</p>
        </div>
        <div class="flex items-center gap-4 sm:gap-6">
          <button
            v-for="link in links"
            :key="link.href"
            class="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer"
            @click="scrollTo(link.href)"
          >
            {{ link.label }}
          </button>
        </div>
        <p class="text-xs sm:text-sm text-zinc-500">&copy; {{ new Date().getFullYear() }} AjoClub.</p>
      </div>
    </UContainer>
  </footer>
</template>
