<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'bg-black text-white antialiased',
  },
})
</script>

<template>
  <NuxtPage />
</template>
