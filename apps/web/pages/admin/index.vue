<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Admin - AjoClub',
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header class="border-b border-zinc-800">
      <UContainer class="h-14 sm:h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="text-base sm:text-lg font-bold">AjoClub</NuxtLink>
          <UBadge variant="soft" color="primary" size="sm">Admin</UBadge>
        </div>
        <div class="flex items-center gap-3">
          <UButton variant="ghost" color="neutral" size="sm" to="/" icon="i-lucide-external-link">
            Lihat Situs
          </UButton>
        </div>
      </UContainer>
    </header>

    <main class="py-8 sm:py-12">
      <UContainer>
        <div class="mb-8 sm:mb-12">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p class="text-zinc-400 text-sm sm:text-base">Kelola portfolio, template, dan konten website.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <NuxtLink
            to="/admin/portfolio"
            class="group rounded-xl border border-zinc-800 hover:border-zinc-700 p-5 sm:p-6 transition-all duration-200"
          >
            <div class="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-briefcase" class="w-5 h-5 text-sky-400" />
            </div>
            <h2 class="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white">Portfolio</h2>
            <p class="text-zinc-400 text-xs sm:text-sm">Kelola proyek, publish/unpublish, edit detail.</p>
          </NuxtLink>

          <div class="rounded-xl border border-zinc-800 p-5 sm:p-6 opacity-50">
            <div class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-layout-template" class="w-5 h-5 text-zinc-500" />
            </div>
            <h2 class="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white">Template</h2>
            <p class="text-zinc-400 text-xs sm:text-sm">Segera hadir.</p>
          </div>

          <div class="rounded-xl border border-zinc-800 p-5 sm:p-6 opacity-50">
            <div class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-message-square" class="w-5 h-5 text-zinc-500" />
            </div>
            <h2 class="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-white">Testimonial</h2>
            <p class="text-zinc-400 text-xs sm:text-sm">Segera hadir.</p>
          </div>
        </div>
      </UContainer>
    </main>
  </div>
</template>
