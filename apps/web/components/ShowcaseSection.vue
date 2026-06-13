<script setup lang="ts">
const { scrollTo } = useScrollTo()
const activeCategory = ref('all')

const { templates, categories } = usePortfolio()

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates.value
  return templates.value.filter(t => t.category === activeCategory.value)
})
</script>

<template>
  <section id="showcase" class="py-20 sm:py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--ui-primary)/30 to-transparent" />

    <UContainer class="relative">
      <div class="mb-12 sm:mb-16 max-w-2xl">
        <p class="text-(--ui-primary) text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4">Template</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">24 template, 24 website berbeda.</h2>
        <p class="text-(--ui-text-muted) mt-3 sm:mt-4 text-sm sm:text-base">Setiap template adalah website lengkap dengan style, tipografi, dan 3D sendiri. Bukan variasi dari satu desain.</p>
      </div>

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

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="template in filteredTemplates"
          :key="template.slug"
          :to="`/templates/${template.slug}`"
          class="group rounded-xl border border-(--ui-border) bg-(--ui-bg) overflow-hidden hover:-translate-y-1 transition-all duration-300 block"
        >
          <div class="h-40 sm:h-44 relative overflow-hidden" :style="{ '--accent': template.accentColor }">
            <ScenePreview
              :preset="template.scenePreset"
              :accent="template.accentColor"
              :label="`${template.title} preview`"
              class="absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-(--ui-bg) via-transparent to-transparent" />
            <div class="absolute left-3 top-3">
              <div class="w-8 h-8 rounded-lg backdrop-blur border flex items-center justify-center" :style="{ background: `${template.accentColor}20`, borderColor: `${template.accentColor}40` }">
                <UIcon :name="template.icon" class="w-4 h-4" :style="{ color: template.accentColor }" />
              </div>
            </div>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm sm:text-base">{{ template.title }}</h3>
              <span class="text-[10px] text-(--ui-text-muted) font-mono uppercase tracking-wider shrink-0">{{ template.category }}</span>
            </div>
            <p class="text-xs sm:text-sm text-(--ui-text-muted) leading-relaxed">{{ template.description }}</p>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-12 sm:mt-16">
        <p class="text-(--ui-text-muted) mb-4 sm:mb-6 text-sm sm:text-base">Tidak menemukan yang cocok?</p>
        <UButton size="lg" @click="scrollTo('#contact')">Chat WhatsApp</UButton>
      </div>
    </UContainer>
  </section>
</template>
