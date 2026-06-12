<script setup lang="ts">
const route = useRoute()
const { scrollTo } = useScrollTo()
const type = computed(() => String(route.params.type || ''))

const { data, error } = await useFetch(`/api/showcase/templates/${type.value}`)

const template = computed(() => data.value?.template)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Template tidak ditemukan' })
}

const capabilities = computed(() => [
  'Struktur halaman sudah disesuaikan untuk jenis website ini.',
  'Navigasi mobile dibuat pendek: lihat, pahami, chat.',
  'Tidak ada elemen dekoratif yang memperlambat.',
  'Bisa dikembangkan dari satu halaman menjadi website lengkap.',
])

useHead({
  title: `${template.value?.title || 'Showcase'} - AjoClub`,
  meta: [
    { name: 'description', content: template.value?.summary || '' },
  ],
})
</script>

<template>
  <div v-if="template" class="bg-(--ui-bg) min-h-screen">
    <div class="fixed top-4 left-4 z-50">
      <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" size="sm" to="/#showcase">
        Kembali
      </UButton>
    </div>

    <section class="min-h-screen flex items-center relative overflow-hidden noise-overlay">
      <ClientOnly>
        <ExperienceCanvas
          :preset="template.scenePreset"
          :accent="template.accentColor"
          intensity="immersive"
          :label="`${template.title} scene`"
          class="absolute inset-0"
        />
      </ClientOnly>
      <div class="absolute inset-0 bg-gradient-to-b from-(--ui-bg)/20 via-(--ui-bg)/45 to-(--ui-bg)" />

      <UContainer class="relative z-10 py-32">
        <div class="max-w-3xl">
          <UBadge variant="solid" color="neutral" class="mb-6">{{ template.category?.label || 'Template' }}</UBadge>
          <h1 class="text-5xl md:text-7xl font-black leading-none mb-6 text-balance">{{ template.title }}</h1>
          <p class="text-lg md:text-xl text-(--ui-text-muted) max-w-2xl mb-8">{{ template.summary }}</p>
          <div class="flex flex-wrap gap-2 mb-10">
            <UBadge v-for="tag in template.tags" :key="tag" variant="soft" color="primary">{{ tag }}</UBadge>
          </div>
          <div class="flex flex-wrap gap-4">
            <UButton size="xl" @click="scrollTo('#template-system')">
              Lihat strukturnya
              <template #trailing><UIcon name="i-lucide-arrow-down" /></template>
            </UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/#contact">Chat WhatsApp</UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <section id="template-system" class="py-24">
      <UContainer>
        <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4">Struktur Template</p>
            <h2 class="text-3xl md:text-5xl font-bold mb-5">Dirancang untuk jenis website ini.</h2>
            <p class="text-(--ui-text-muted)">
              Setiap section punya fungsi: menjelaskan, meyakinkan, atau mengarahkan ke chat.
            </p>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div v-for="item in capabilities" :key="item" class="glass-card p-5">
              <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-(--ui-primary) mb-4" />
              <p class="text-sm leading-relaxed">{{ item }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-24">
      <UContainer>
        <div class="glass-card p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <UBadge variant="soft" color="warning" class="mb-4">Catatan</UBadge>
            <h2 class="text-2xl md:text-3xl font-bold mb-3">Template ini bukan klaim client.</h2>
            <p class="text-(--ui-text-muted) max-w-2xl">
              Ini adalah arahan desain yang kami buat sebagai contoh. Saat ada proyek nyata, konten diisi dengan data asli.
            </p>
          </div>
          <UButton size="xl" to="/portfolio/immersive-studio-showroom">Lihat contoh proyek</UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>
