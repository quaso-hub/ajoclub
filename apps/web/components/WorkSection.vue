<script setup lang="ts">
const { data: portfolioData, status: portfolioStatus } = await useFetch('/api/portfolio', {
  query: { featured: 'true' },
})

const projects = computed(() => portfolioData.value?.items || [])
</script>

<template>
  <section id="work" class="py-20 sm:py-32 bg-zinc-950">
    <UContainer>
      <div class="mb-12 sm:mb-20">
        <p class="text-sky-400 text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4 work-title">Proyek</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold work-title leading-tight">
          Contoh arahan desain.
        </h2>
        <p class="text-zinc-400 mt-3 sm:mt-4 max-w-xl text-sm sm:text-base work-title">
          Ini bukan klaim client. Ini bukti kemampuan kami.
        </p>
      </div>

      <!-- Skeleton loading -->
      <div v-if="portfolioStatus === 'pending'" class="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div v-for="i in 4" :key="i" class="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 animate-pulse">
          <div class="h-48 sm:h-56 md:h-64 bg-zinc-800" />
          <div class="p-5 sm:p-6 space-y-3">
            <div class="h-4 bg-zinc-800 rounded w-20" />
            <div class="h-5 bg-zinc-800 rounded w-3/4" />
            <div class="h-4 bg-zinc-800 rounded w-full" />
            <div class="grid grid-cols-3 gap-2">
              <div class="h-14 bg-zinc-800 rounded" />
              <div class="h-14 bg-zinc-800 rounded" />
              <div class="h-14 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!projects.length" class="rounded-xl border border-zinc-800 p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-10 h-10 text-zinc-600 mx-auto mb-4" />
        <p class="text-zinc-400">Belum ada proyek yang dipublikasikan.</p>
      </div>

      <!-- Project grid -->
      <div v-else class="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <NuxtLink
          v-for="(project, i) in projects"
          :key="project.id"
          :to="`/portfolio/${project.slug}`"
          class="group rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 work-card block"
        >
          <div class="h-48 sm:h-56 md:h-64 relative overflow-hidden" :style="{ '--accent': project.accentColor }">
            <ScenePreview
              :preset="project.scenePreset"
              :accent="project.accentColor"
              :label="`${project.title} preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            <div class="absolute left-4 bottom-4 flex items-center gap-2">
              <span class="text-5xl sm:text-6xl font-black text-white/10">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
          </div>
          <div class="p-5 sm:p-6">
            <UBadge variant="soft" color="primary" size="sm" class="mb-3">{{ project.category?.label || 'Web' }}</UBadge>
            <h3 class="text-base sm:text-lg font-semibold mb-2 text-white">{{ project.title }}</h3>
            <p class="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">{{ project.summary }}</p>
            <div class="grid grid-cols-3 gap-2 mb-4 sm:mb-5">
              <div v-for="metric in project.metrics?.slice(0, 3)" :key="metric.label" class="rounded-lg border border-zinc-800 p-2 sm:p-3">
                <p class="font-bold text-sm sm:text-base text-white">{{ metric.value }}</p>
                <p class="text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wide">{{ metric.label }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="tag in project.tags" :key="tag" variant="outline" color="neutral" size="sm">{{ tag }}</UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
