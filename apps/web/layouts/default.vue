<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-border">
      <nav class="container mx-auto flex items-center justify-between h-16 px-4">
        <NuxtLink to="/" class="font-bold text-lg">
          AjoClub
        </NuxtLink>
        <div class="flex gap-4">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-border py-8">
      <div class="container mx-auto text-center text-sm text-muted-foreground px-4">
        &copy; {{ new Date().getFullYear() }} AjoClub. All rights reserved.
      </div>
    </footer>
  </div>
</template>
