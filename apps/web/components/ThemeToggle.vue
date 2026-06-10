<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => {
    colorMode.preference = v ? 'dark' : 'light'
  },
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>
