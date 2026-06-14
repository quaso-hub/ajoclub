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
  'saas-1': 'SaaS untuk tim kecil. Pembukuan, stok, multi-cabang.',
  'saas-2': 'Dashboard UMKM. Kasir, faktur, inventori, laporan.',
  'saas-3': 'SaaS editorial. Setiap section beda warna.',
  'restaurant-1': 'Fine dining. 7 kursi, 1 chef, reservasi online.',
  'restaurant-2': 'Kafe modern. Menu, lokasi, jam buka, reservasi.',
  'restaurant-3': 'Warung sate. Menu, harga, pesan via WhatsApp.',
  'event-1': 'Konferensi tech. 3 hari, 14 pembicara, tiket online.',
  'event-2': 'Festival musik. Lineup, jadwal, tiket, venue.',
  'event-3': 'Festival desain. 4 hari, 16 pembicara, arsip.',
  'membership-1': 'Newsletter. Tulisan, arsip, langganan.',
  'membership-2': 'Komunitas dev. 6 space, event, diskusi.',
  'membership-3': 'Creator support. Dukung tulisan, traktir kopi.',
  'portfolio-1': 'Agensi. 8 studi kasus, layanan, tim.',
  'portfolio-2': 'Studio desain. 12 studi kasus, editorial.',
  'portfolio-3': 'Manifesto. 8 proyek, layanan, kontak.',
  'ecommerce-1': 'Produk premium. 6 produk, keranjang, checkout.',
  'ecommerce-2': 'Skincare DTC. 6 produk, quiz, langganan.',
  'ecommerce-3': 'Marketplace. 12 produk, 4 penjual, filter.',
  'wedding-1': 'Undangan nikah. Cerita, galeri, RSVP, amplop.',
  'wedding-2': 'Undangan minimal. Cerita, galeri, RSVP.',
  'wedding-3': 'Undangan Bali. Cerita, travel info, RSVP.',
  'architecture-1': 'Firma arsitektur. 6 proyek, layanan, tim.',
  'architecture-2': 'Developer properti. 6 proyek, KPR, unit.',
  'architecture-3': 'Studio interior. 6 proyek, material, quiz.',
}
</script>

<template>
  <section id="showcase" class="py-20 sm:py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-(--ui-primary)/30 to-transparent" />

    <UContainer class="relative">
      <div class="mb-12 sm:mb-16 max-w-2xl">
        <p class="text-(--ui-primary) text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4">Contoh kerja</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">24 template. Klik, lihat hasilnya.</h2>
        <p class="text-(--ui-text-muted) mt-3 sm:mt-4 text-sm sm:text-base">Setiap template punya style, font, dan 3D sendiri. Bukan satu desain yang diulang. Klik salah satu, lihat isinya.</p>
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
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Lihat →
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
        <p class="text-(--ui-text-muted) mb-4 sm:mb-6 text-sm sm:text-base">Tidak ada yang pas? Kami bisa bikin dari nol.</p>
        <UButton size="lg" @click="scrollTo('#contact')">Chat WhatsApp</UButton>
      </div>
    </UContainer>
  </section>
</template>
