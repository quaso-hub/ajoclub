<script setup lang="ts">
const { data: portfolioData, status: portfolioStatus } = await useFetch('/api/portfolio', {
  query: { featured: 'true' },
})

const projects = computed(() => portfolioData.value?.items || [])
</script>

<template>
  <section id="work" class="py-32 bg-(--ui-bg)">
    <UContainer>
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 work-title">Proyek</p>
        <h2 class="text-4xl md:text-5xl font-bold work-title">
          Contoh arahan yang sudah<br />
          <span class="text-(--ui-text-muted)">kami siapkan.</span>
        </h2>
        <p class="text-(--ui-text-muted) mt-4 max-w-2xl work-title">
          Ini adalah arahan desain yang bisa dijadikan dasar untuk proyek nyata. Bukan klaim client, tapi bukti kemampuan.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="portfolioStatus === 'pending'" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="glass-card overflow-hidden animate-pulse">
          <div class="h-56 md:h-64 bg-(--ui-bg-elevated)" />
          <div class="p-6 space-y-3">
            <div class="h-6 bg-(--ui-bg-elevated) rounded w-24" />
            <div class="h-5 bg-(--ui-bg-elevated) rounded w-3/4" />
            <div class="h-4 bg-(--ui-bg-elevated) rounded w-full" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!projects.length" class="glass-card p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 text-(--ui-text-muted) mx-auto mb-4" />
        <p class="text-(--ui-text-muted)">Belum ada proyek yang dipublikasikan.</p>
      </div>

      <!-- Project grid -->
      <div v-else class="grid md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="(project, i) in projects"
          :key="project.id"
          :to="`/portfolio/${project.slug}`"
          class="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-300 work-card block"
        >
          <div class="h-56 md:h-64 relative overflow-hidden" :style="{ '--accent': project.accentColor }">
            <ScenePreview
              :preset="project.scenePreset"
              :accent="project.accentColor"
              :label="`${project.title} scene preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/70" />
            <div class="absolute left-5 bottom-5 flex items-center gap-2">
              <span class="text-7xl font-black text-white/10">{{ String(i + 1).padStart(2, '0') }}</span>
              <UBadge variant="solid" color="neutral">Arahan Desain</UBadge>
            </div>
          </div>
          <div class="p-6">
            <UBadge variant="soft" color="primary" class="mb-3">{{ project.category?.label || 'Web' }}</UBadge>
            <h3 class="text-lg font-semibold mb-2">{{ project.title }}</h3>
            <p class="text-(--ui-text-muted) mb-5 text-sm leading-relaxed">{{ project.summary }}</p>
            <div class="grid grid-cols-3 gap-2 mb-5">
              <div v-for="metric in project.metrics?.slice(0, 3)" :key="metric.label" class="rounded-lg border border-(--ui-border) p-3">
                <p class="font-bold">{{ metric.value }}</p>
                <p class="text-[11px] text-(--ui-text-muted) uppercase tracking-wide">{{ metric.label }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="tag in project.tags" :key="tag" variant="outline" color="neutral" size="sm">{{ tag }}</UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
