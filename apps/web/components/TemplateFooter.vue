<script setup lang="ts">
defineProps<{
  brandName: string
  links: Array<{ label: string; href: string }>
  accent?: string
  bg?: string
  text?: string
}>()
</script>

<template>
  <footer
    class="py-12"
    :style="{
      background: bg ?? 'transparent',
      color: text ?? 'inherit',
    }"
  >
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <span class="text-lg font-semibold tracking-tight">{{ brandName }}</span>
          <p class="text-[11px] tracking-[0.2em] uppercase opacity-50 mt-1">
            Template by AjoClub
          </p>
        </div>
        <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            v-for="link in links"
            :key="link.label"
            :href="link.href"
            class="text-[11px] tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            {{ link.label }}
          </a>
        </nav>
        <a
          href="https://wa.me/6285188627365"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[11px] tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity"
          :style="{ color: accent }"
        >
          Contact via WhatsApp →
        </a>
      </div>
    </div>
  </footer>
</template>
