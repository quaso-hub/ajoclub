<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: {
    lang: 'en',
    class: 'dark',
    'data-theme': 'dark',
  },
  bodyAttrs: {
    class: 'antialiased',
  },
})
</script>

<template>
  <NuxtPage />
</template>
