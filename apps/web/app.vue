<script setup lang="ts">
const config = useRuntimeConfig()

// Phase 4.1 — global micro-interactions (ripple on data-micro, magnet, tilt)
// Picks up all [data-micro="ripple|magnet|tilt"] elements across the app.
// Auto-skips on touch + reduced-motion (see composable).
useMicroInteractions()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: { lang: 'id' },
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
