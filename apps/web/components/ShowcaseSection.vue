<script setup lang="ts">
const { scrollTo } = useScrollTo()

const activeCategory = ref('all')

const { data: categoriesData } = await useFetch('/api/portfolio/categories')
const { data: templatesData, status: templatesStatus } = await useFetch('/api/showcase/templates')

const categories = computed(() => [
  { slug: 'all', label: 'Semua' },
  ...(categoriesData.value?.categories || []),
])

const filteredTemplates = computed(() => {
  const templates = templatesData.value?.templates || []
  if (activeCategory.value === 'all') return templates
  return templates.filter((t: { category?: { slug: string } }) => t.category?.slug === activeCategory.value)
})
</script>

<template>
  <section id="showcase" class="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

    <UContainer class="relative">
      <div class="mb-12 sm:mb-16 max-w-2xl">
        <p class="text-sky-400 text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4 showcase-title">
          Template
        </p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold showcase-title leading-tight">
          Pilih jenis website.
        </h2>
        <p class="text-zinc-400 mt-3 sm:mt-4 text-sm sm:text-base showcase-title">
          Setiap template punya struktur yang berbeda. Klik untuk lihat detail.
        </p>
      </div>

      <!-- Category filter -->
      <div class="flex flex-wrap gap-2 mb-8 sm:mb-12">
        <UButton
          v-for="cat in categories"
          :key="cat.slug"
          :variant="activeCategory === cat.slug ? 'solid' : 'outline'"
          :color="activeCategory === cat.slug ? 'primary' : 'neutral'"
          size="sm"
          class="text-xs sm:text-sm"
          @click="activeCategory = cat.slug"
        >
          {{ cat.label }}
        </UButton>
      </div>

      <!-- Skeleton loading -->
      <div v-if="templatesStatus === 'pending'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div v-for="i in 6" :key="i" class="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 animate-pulse">
          <div class="h-48 sm:h-56 bg-zinc-800" />
          <div class="p-4 sm:p-5 space-y-3">
            <div class="h-5 bg-zinc-800 rounded w-3/4" />
            <div class="h-4 bg-zinc-800 rounded w-full" />
            <div class="flex gap-2">
              <div class="h-5 bg-zinc-800 rounded w-14" />
              <div class="h-5 bg-zinc-800 rounded w-18" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!filteredTemplates.length" class="rounded-xl border border-zinc-800 p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-10 h-10 text-zinc-600 mx-auto mb-4" />
        <p class="text-zinc-400">Belum ada template di kategori ini.</p>
      </div>

      <!-- Template grid -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <NuxtLink
          v-for="template in filteredTemplates"
          :key="template.id"
          :to="`/showcase/${template.slug}`"
          class="group rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 showcase-card block"
        >
          <div class="h-48 sm:h-56 relative overflow-hidden" :style="{ '--accent': template.accentColor }">
            <ScenePreview
              :preset="template.scenePreset"
              :accent="template.accentColor"
              :label="`${template.title} preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            <div class="absolute left-4 top-4">
              <div class="w-10 h-10 rounded-lg bg-zinc-900/80 backdrop-blur border border-zinc-700 flex items-center justify-center">
                <UIcon :name="template.icon" class="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div class="p-4 sm:p-5">
            <h3 class="font-semibold mb-2 text-white text-sm sm:text-base">{{ template.title }}</h3>
            <p class="text-zinc-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{{ template.summary }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="tag in template.tags" :key="tag" variant="soft" color="primary" size="sm">
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-12 sm:mt-16">
        <p class="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base">Tidak menemukan yang cocok?</p>
        <UButton size="lg" @click="scrollTo('#contact')">Chat WhatsApp</UButton>
      </div>
    </UContainer>
  </section>
</template>
