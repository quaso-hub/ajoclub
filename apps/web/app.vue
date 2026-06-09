<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
