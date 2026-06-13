<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Studio Daida',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const projects = [
  { title: 'Typeface untuk Kopi Rumah', category: 'Typography', year: '2026', desc: 'Custom display typeface untuk brand kopi lokal.' },
  { title: 'Identity System — Sunda Asri', category: 'Brand', year: '2025', desc: 'Visual identity untuk restoran keluarga di Bandung.' },
  { title: 'Majalah Bulanan — Catatan Bandung', category: 'Editorial', year: '2025', desc: 'Layout dan desain untuk majalah lokal.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Studio Daida. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FAFAF7; color: #111827; font-family: 'DM Sans', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(250,250,247,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'DM Serif Display', serif;" class="text-lg">Studio Daida</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#karya" class="hover:text-gray-900 transition-colors">Karya</a>
          <a href="#tentang" class="hover:text-gray-900 transition-colors">Tentang</a>
          <a href="#kontak" class="hover:text-gray-900 transition-colors">Kontak</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 pb-16">
      <div class="max-w-4xl mx-auto px-6 pt-16">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-pink-200 rounded mb-4 animate-pulse" />
          <div class="h-16 w-3/4 bg-gray-200 rounded mb-8 animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded mb-2 animate-pulse" />
          <div class="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.2em] uppercase text-pink-500 mb-4">Studio desain · Bandung</p>
          <h1 style="font-family: 'DM Serif Display', serif; font-style: italic; line-height: 1.05;" class="text-5xl md:text-7xl mb-8">Studio Daida</h1>
          <p class="text-lg text-gray-600 max-w-xl leading-relaxed">Brand, editorial, dan typography untuk publisher independen dan studio kecil.</p>
        </template>
      </div>
    </section>

    <!-- Karya -->
    <section id="karya" class="py-16 border-t border-gray-200/60">
      <div class="max-w-4xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-pink-500 mb-8">Proyek Terpilih</p>
        <div class="space-y-16">
          <article v-for="p in projects" :key="p.title" class="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start group cursor-pointer">
            <div class="aspect-[4/3] rounded-xl overflow-hidden" style="background: linear-gradient(135deg, #F3E8FF, #E8D5B7);">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-gray-400">Foto proyek</span>
              </div>
            </div>
            <div>
              <p class="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-2">{{ p.category }} · {{ p.year }}</p>
              <h3 class="text-2xl font-medium mb-3 group-hover:text-pink-500 transition-colors" style="font-family: 'DM Serif Display', serif;">{{ p.title }}</h3>
              <p class="text-base text-gray-600 leading-relaxed">{{ p.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Tentang -->
    <section id="tentang" class="py-20 border-t border-gray-200/60" style="background: #FFFFFF;">
      <div class="max-w-2xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-pink-500 mb-6">Tentang</p>
        <p class="text-lg leading-[1.7] text-gray-700">
          Studio Daida adalah praktik desain dua orang di Bandung. Kami kerja sama dengan penerbit, brand independen, dan institusi budaya. Fokus kami: typography, desain editorial, dan sistem visual identity yang bertahan lebih lama dari tren.
        </p>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-20 border-t border-gray-200/60 text-center">
      <h2 style="font-family: 'DM Serif Display', serif; font-style: italic;" class="text-3xl mb-4">Kerja sama?</h2>
      <p class="text-base text-gray-600 mb-8 max-w-md mx-auto">Balas dalam 48 jam. Tanpa pitch deck.</p>
      <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors">Hubungi via WhatsApp</a>
    </section>

    <!-- FAB -->
    <div class="fixed bottom-5 right-5 z-50">
      <Transition enter-active-class="transition-all duration-300 ease-out" leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4 scale-95" leave-to-class="opacity-0 translate-y-4 scale-95">
        <div v-if="fabOpen" class="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          <p class="text-sm font-semibold text-gray-900 mb-2">Tertarik dengan template ini?</p>
          <p class="text-xs text-gray-500 mb-3">Chat langsung untuk diskusi fitur, harga, dan customisasi.</p>
          <a :href="waUrl" target="_blank" rel="noopener" class="flex items-center gap-2 w-full px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat WhatsApp
          </a>
        </div>
      </Transition>
      <button @click="fabOpen = !fabOpen" class="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>
    </div>

    <TemplateFooter brand-name="Studio Daida" :links="[{ label: 'Karya', href: '#karya' }, { label: 'Tentang', href: '#tentang' }, { label: 'Kontak', href: '#kontak' }]" accent="#EC4899" />
  </div>
</template>
