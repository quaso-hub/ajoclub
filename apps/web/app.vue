<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: {
    lang: 'en',
    class: 'dark',
  },
  bodyAttrs: {
    class: 'bg-zinc-950 text-zinc-100 antialiased',
  },
})
</script>

<template>
  <NuxtPage />
</template>
