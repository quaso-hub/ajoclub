<script setup lang="ts">
const { scrollTo } = useScrollTo()
const activeCategory = ref('all')

const { templates, categories } = usePortfolio()

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates.value
  return templates.value.filter(t => t.category === activeCategory.value)
})

// Brand stories per template — what each template pitches to the client
const brandStories: Record<string, string> = {
  'saas-1': 'Seperti majalah, bukan dashboard.',
  'saas-2': 'Real product, bukan marketing page.',
  'saas-3': 'Setiap section warna berbeda. Setiap warna mood berbeda.',
  'restaurant-1': '7 kursi. 1 chef. 1 filosofi.',
  'restaurant-2': 'Kopi yang baik, dari biji yang baik.',
  'restaurant-3': 'Sate ayam bumbu kacang khas Madura.',
  'event-1': '3 hari. 1 ruangan. 14 pembicara.',
  'event-2': 'Musik yang tidak bisa dideskripsikan.',
  'event-3': 'Desain bukan hanya visual. Desain adalah keputusan.',
  'membership-1': 'Tulisan yang layak dibaca.',
  'membership-2': 'Belajar bareng, tumbuh bareng.',
  'membership-3': 'Dukung tulisan yang kamu suka.',
  'portfolio-1': 'Bikin brand yang jalan.',
  'portfolio-2': 'Desain yang bercerita.',
  'portfolio-3': 'Ini bukan portofolio. Ini manifesto.',
  'ecommerce-1': 'Objek yang tenang.',
  'ecommerce-2': 'Bahan yang jujur. Harga yang jujur.',
  'ecommerce-3': 'Semua ada. Dari semua penjual.',
  'wedding-1': 'Sabtu · 14 Maret 2026 · Bandung',
  'wedding-2': 'Sederhana. Bersih. Jelas.',
  'wedding-3': 'Bali. Pantai. Sunset.',
  'architecture-1': 'Rumah yang menghormati tempatnya.',
  'architecture-2': 'Properti yang layak dihuni.',
  'architecture-3': 'Ruang yang bercerita.',
}
</script>

<template>
  <section id="showcase" class="py-20 sm:py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--ui-primary)/30 to-transparent" />

    <UContainer class="relative">
      <div class="mb-12 sm:mb-16 max-w-2xl">
        <p class="text-(--ui-primary) text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4">24 Pintu</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Pilih yang cocok. Masuk ke dunianya.</h2>
        <p class="text-(--ui-text-muted) mt-3 sm:mt-4 text-sm sm:text-base">Setiap template adalah website lengkap dengan style, tipografi, dan 3D sendiri. Bukan variasi dari satu desain. Klik salah satu, rasakan perbedaannya.</p>
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
          class="group rounded-xl border border-(--ui-border) bg-(--ui-bg) overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 block"
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
            <!-- Hover overlay: "Masuk" -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span class="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Masuk →
              </span>
            </div>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm sm:text-base">{{ template.title }}</h3>
              <span class="text-[10px] text-(--ui-text-muted) font-mono uppercase tracking-wider shrink-0">{{ template.category }}</span>
            </div>
            <p class="text-xs sm:text-sm text-(--ui-text-muted) leading-relaxed mb-2">{{ template.description }}</p>
            <p class="text-xs italic text-(--ui-text-muted)/70 leading-relaxed">"{{ brandStories[template.slug] || '' }}"</p>
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
