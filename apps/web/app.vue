<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} — ${config.public.appName}` : config.public.appName,
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtErrorBoundary>
        <NuxtPage />
        <template #error="{ error, clearError }">
          <div class="min-h-screen flex items-center justify-center bg-(--ui-bg)">
            <div class="text-center p-8">
              <h1 class="text-2xl font-bold mb-4">Something went wrong</h1>
              <p class="text-(--ui-text-muted) mb-6">{{ error.message }}</p>
              <UButton @click="clearError">Try again</UButton>
            </div>
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
  </UApp>
</template>
