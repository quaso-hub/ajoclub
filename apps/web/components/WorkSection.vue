<script setup lang="ts">
const { data: portfolioData, pending: portfolioPending, error: portfolioError } = await useAsyncData('work-portfolio', () =>
  $fetch('/api/portfolio', { query: { featured: 'true' } }),
)

const projects = computed(() => portfolioData.value?.items || [])
</script>

<template>
  <section id="work" class="py-20 sm:py-32 bg-(--ui-bg)">
    <UContainer>
      <div class="mb-12 sm:mb-20">
        <p class="text-(--ui-primary) text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4">Proyek</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Contoh bagaimana kami kerjakan.
        </h2>
        <p class="text-(--ui-text-muted) mt-3 sm:mt-4 max-w-xl text-sm sm:text-base">
          Contoh bagaimana kami merangkai halaman, copy, dan interaksi untuk berbagai jenis website.
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="portfolioPending" class="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div v-for="i in 4" :key="i" class="glass-card overflow-hidden animate-pulse">
          <div class="h-48 sm:h-56 md:h-64 bg-(--ui-bg-elevated)" />
          <div class="p-5 sm:p-6 space-y-3">
            <div class="h-4 bg-(--ui-bg-elevated) rounded w-20" />
            <div class="h-5 bg-(--ui-bg-elevated) rounded w-3/4" />
            <div class="h-4 bg-(--ui-bg-elevated) rounded w-full" />
            <div class="grid grid-cols-3 gap-2">
              <div class="h-14 bg-(--ui-bg-elevated) rounded" />
              <div class="h-14 bg-(--ui-bg-elevated) rounded" />
              <div class="h-14 bg-(--ui-bg-elevated) rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="portfolioError" class="glass-card p-12 text-center">
        <UIcon name="i-lucide-alert-circle" class="w-10 h-10 text-red-500 mx-auto mb-4" />
        <p class="text-(--ui-text-muted)">Gagal memuat data. Coba refresh.</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!projects.length" class="glass-card p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-10 h-10 text-(--ui-text-muted) mx-auto mb-4" />
        <p class="text-(--ui-text-muted)">Belum ada proyek yang dipublikasikan.</p>
      </div>

      <!-- Project grid -->
      <div v-else class="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <NuxtLink
          v-for="(project, i) in projects"
          :key="project.id"
          :to="`/portfolio/${project.slug}`"
          class="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-300 block"
        >
          <div class="h-48 sm:h-56 md:h-64 relative overflow-hidden" :style="{ '--accent': project.accentColor }">
            <ScenePreview
              :preset="project.scenePreset"
              :accent="project.accentColor"
              :label="`${project.title} preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-(--ui-bg) via-transparent to-transparent" />
            <div class="absolute left-4 bottom-4 flex items-center gap-2">
              <span class="text-5xl sm:text-6xl font-black text-(--ui-text)/10">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
          </div>
          <div class="p-5 sm:p-6">
            <div class="flex items-center gap-2 mb-2 sm:mb-3">
              <UBadge variant="soft" color="primary" size="sm">{{ project.category?.label || 'Web' }}</UBadge>
              <span class="text-xs text-(--ui-text-muted)">
                {{ project.source === 'CLIENT_WORK' ? 'Client Work' : project.source === 'TEMPLATE' ? 'Template' : project.source === 'CONCEPT' ? 'Concept' : 'Internal' }}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-semibold mb-2">{{ project.title }}</h3>
            <p class="text-(--ui-text-muted) text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">{{ project.summary }}</p>
            <div class="grid grid-cols-3 gap-2 mb-4 sm:mb-5">
              <div v-for="metric in project.metrics?.slice(0, 3)" :key="metric.label" class="rounded-lg border border-(--ui-border) p-2 sm:p-3">
                <p class="font-bold text-sm sm:text-base">{{ metric.value }}</p>
                <p class="text-[10px] sm:text-[11px] text-(--ui-text-muted) uppercase tracking-wide">{{ metric.label }}</p>
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
