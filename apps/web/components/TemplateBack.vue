<script setup lang="ts">
defineProps<{
  to?: string
  label?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to ?? '/'"
    class="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black/5 backdrop-blur-md border border-black/10 text-sm font-medium hover:bg-black/10 transition-colors"
  >
    <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
    <span>{{ label ?? 'AjoClub' }}</span>
  </NuxtLink>
</template>
