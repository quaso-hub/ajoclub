<script setup lang="ts">
const route = useRoute()
const { buildUrl } = useWhatsApp()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useFetch(`/api/portfolio/${slug.value}`)

const item = computed(() => data.value?.item)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Portfolio tidak ditemukan' })
}

const whatsappUrl = computed(() => item.value
  ? buildUrl(`Halo, saya tertarik dengan template "${item.value.title}". Bisa dijelaskan lebih detail?`)
  : '#')

const caseSections = computed(() => item.value ? [
  { title: 'Masalah', body: item.value.problem, icon: 'i-lucide-alert-circle' },
  { title: 'Solusi', body: item.value.approach, icon: 'i-lucide-route' },
  { title: 'Hasil', body: item.value.result, icon: 'i-lucide-chart-spline' },
] : [])

useHead({
  title: `${item.value?.title || 'Portfolio'} - AjoClub`,
  meta: [
    { name: 'description', content: item.value?.summary || '' },
  ],
})
</script>

<template>
  <div v-if="item" class="bg-(--ui-bg) min-h-screen">
    <div class="fixed top-4 left-4 z-50">
      <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" size="sm" to="/#work">
        Kembali
      </UButton>
    </div>

    <section class="min-h-screen relative flex items-center overflow-hidden noise-overlay">
      <ClientOnly>
        <ExperienceCanvas
          :preset="item.scenePreset"
          :accent="item.accentColor"
          :intensity="item.motionIntensity"
          :label="`${item.title} scene`"
          class="absolute inset-0"
        />
      </ClientOnly>
      <div class="absolute inset-0 bg-gradient-to-b from-(--ui-bg)/10 via-(--ui-bg)/55 to-(--ui-bg)" />

      <UContainer class="relative z-10 py-32">
        <div class="max-w-4xl">
          <div class="flex flex-wrap items-center gap-2 mb-6">
            <UBadge variant="solid" color="neutral">{{ item.source === 'CLIENT_WORK' ? 'Client Work' : item.source === 'TEMPLATE' ? 'Template' : item.source === 'CONCEPT' ? 'Concept' : 'Internal Demo' }}</UBadge>
            <UBadge variant="soft" color="primary">{{ item.category?.label }}</UBadge>
          </div>
          <h1 class="text-5xl md:text-7xl font-black leading-none mb-6 text-balance">{{ item.title }}</h1>
          <p class="text-lg md:text-xl text-(--ui-text-muted) max-w-2xl mb-10">{{ item.summary }}</p>
          <div class="flex flex-wrap gap-4">
            <UButton size="xl" :to="whatsappUrl" target="_blank" rel="noopener noreferrer">
              Tanya template ini
              <template #trailing><UIcon name="i-lucide-message-circle" /></template>
            </UButton>
            <UButton size="xl" variant="outline" color="neutral" to="/#showcase">Lihat template lain</UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-20">
      <UContainer>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="metric in item.metrics" :key="metric.label" class="glass-card p-6">
            <p class="text-3xl font-black mb-2">{{ metric.value }}</p>
            <p class="font-semibold mb-2">{{ metric.label }}</p>
            <p class="text-sm text-(--ui-text-muted)">{{ metric.note }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-20">
      <UContainer>
        <div class="grid lg:grid-cols-3 gap-6">
          <article v-for="section in caseSections" :key="section.title" class="glass-card p-7">
            <UIcon :name="section.icon" class="w-7 h-7 text-(--ui-primary) mb-5" />
            <h2 class="text-xl font-bold mb-3">{{ section.title }}</h2>
            <p class="text-(--ui-text-muted) leading-relaxed">{{ section.body }}</p>
          </article>
        </div>
      </UContainer>
    </section>

    <section class="py-20">
      <UContainer>
        <div class="grid lg:grid-cols-[1fr_0.8fr] gap-6 items-stretch">
          <div class="glass-card p-8 md:p-10">
            <UBadge variant="soft" color="warning" class="mb-4">Sumber</UBadge>
            <h2 class="text-3xl font-bold mb-4">Ini bukan klaim client palsu.</h2>
            <p class="text-(--ui-text-muted) leading-relaxed">{{ item.credibility }}</p>
          </div>
          <div class="glass-card p-8 md:p-10">
            <p class="text-sm text-(--ui-text-muted) mb-2">Template dasar</p>
            <p class="text-2xl font-bold mb-4">{{ item.template?.title || 'Custom' }}</p>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="tag in item.tags" :key="tag" variant="soft" color="primary">{{ tag }}</UBadge>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-24">
      <UContainer>
        <div class="glass-card p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Tertarik dengan template ini?</h2>
          <p class="text-(--ui-text-muted) max-w-2xl mx-auto mb-8">
            Chat kami. Ceritakan bisnis Anda, kami sesuaikan template ini dengan kebutuhan Anda.
          </p>
          <UButton size="xl" :to="whatsappUrl" target="_blank" rel="noopener noreferrer">Chat WhatsApp</UButton>
        </div>
      </UContainer>
    </section>

    <WhatsAppFAB />
  </div>
</template>
