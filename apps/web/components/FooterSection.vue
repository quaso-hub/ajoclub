<script setup lang="ts">
const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <footer class="py-16 bg-(--ui-bg) border-t border-(--ui-border)">
    <UContainer>
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-xl font-bold">AjoClub</span>
          <p class="text-sm text-(--ui-text-muted) mt-2">Digital Agency. Web, SaaS, Mobile.</p>
        </div>
        <div class="flex items-center gap-6">
          <button
            v-for="link in links"
            :key="link.href"
            class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors cursor-pointer"
            @click="scrollTo(link.href)"
          >
            {{ link.label }}
          </button>
        </div>
        <p class="text-sm text-(--ui-text-muted)">&copy; {{ new Date().getFullYear() }} AjoClub.</p>
      </div>
    </UContainer>
  </footer>
</template>
