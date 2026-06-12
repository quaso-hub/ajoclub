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
  <section id="showcase" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--ui-primary)/50 to-transparent" />
    <div class="absolute top-1/3 right-[-15%] w-[650px] h-[650px] bg-(--ui-primary)/8 rounded-full blur-[140px]" />

    <UContainer class="relative">
      <div class="mb-16 max-w-3xl">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 showcase-title">
          Template
        </p>
        <h2 class="text-4xl md:text-5xl font-bold showcase-title">
          Pilih jenis website yang cocok.
        </h2>
        <p class="text-(--ui-text-muted) mt-4 max-w-xl showcase-title">
          Setiap template punya struktur yang berbeda. Klik untuk lihat contoh dan detailnya.
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mb-12">
        <UButton
          v-for="cat in categories"
          :key="cat.slug"
          :variant="activeCategory === cat.slug ? 'solid' : 'outline'"
          :color="activeCategory === cat.slug ? 'primary' : 'neutral'"
          size="sm"
          @click="activeCategory = cat.slug"
        >
          {{ cat.label }}
        </UButton>
      </div>

      <!-- Loading state -->
      <div v-if="templatesStatus === 'pending'" class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="glass-card overflow-hidden animate-pulse">
          <div class="h-56 bg-(--ui-bg-elevated)" />
          <div class="p-5 space-y-3">
            <div class="h-5 bg-(--ui-bg-elevated) rounded w-3/4" />
            <div class="h-4 bg-(--ui-bg-elevated) rounded w-full" />
            <div class="flex gap-2">
              <div class="h-6 bg-(--ui-bg-elevated) rounded w-16" />
              <div class="h-6 bg-(--ui-bg-elevated) rounded w-20" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!filteredTemplates.length" class="glass-card p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 text-(--ui-text-muted) mx-auto mb-4" />
        <p class="text-(--ui-text-muted)">Belum ada template di kategori ini.</p>
      </div>

      <!-- Template grid -->
      <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <NuxtLink
          v-for="template in filteredTemplates"
          :key="template.id"
          :to="`/showcase/${template.slug}`"
          class="group glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer showcase-card block"
        >
          <div class="h-56 relative overflow-hidden" :style="{ '--accent': template.accentColor }">
            <ScenePreview
              :preset="template.scenePreset"
              :accent="template.accentColor"
              :label="`${template.title} scene preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/60" />
            <div class="absolute left-5 top-5 flex items-center gap-2">
              <div class="w-11 h-11 rounded-xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center">
                <UIcon :name="template.icon" class="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div class="p-5">
            <h3 class="font-semibold mb-2">{{ template.title }}</h3>
            <p class="text-(--ui-text-muted) text-sm mb-4 leading-relaxed">{{ template.summary }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="tag in template.tags" :key="tag" variant="soft" color="primary" size="sm">
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-16">
        <p class="text-(--ui-text-muted) mb-6">Tidak menemukan yang cocok? Ceritakan kebutuhan Anda.</p>
        <UButton size="xl" @click="scrollTo('#contact')">
          Chat WhatsApp
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
