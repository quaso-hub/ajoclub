<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Sarah & Kevin',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const days = [
  { day: 'Kamis, 12 Maret', title: 'Welcome Dinner', desc: 'Makan malam di pantai. Santai, pakai baju casual.' },
  { day: 'Jumat, 13 Maret', title: 'Hari Bebas', desc: 'Snorkeling pagi, jalan-jalan sore. Opsional.' },
  { day: 'Sabtu, 14 Maret', title: 'Hari H', desc: 'Akad nikah di pantai jam 4 sore. Resepsi di bawah bintang.' },
]
const travel = [
  { label: 'Terbang ke', value: 'Bali (DPS) — 20 menit taksi ke hotel' },
  { label: 'Hotel', value: 'The Ungasan Clifftop Resort' },
  { label: 'Check-in', value: '12 Maret 2026' },
  { label: 'Check-out', value: '15 Maret 2026' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template undangan Sarah & Kevin. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #F0EBE0; color: #3A2E2A; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-md" style="background: rgba(240,235,224,0.85);">
      <div class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'Fraunces', serif; font-size: 16px; font-style: italic;">S &amp; K</span>
        <div class="hidden md:flex items-center gap-6 text-[10px] tracking-[0.3em] uppercase text-amber-800">
          <a href="#jadwal" class="hover:text-gray-800 transition-colors">Jadwal</a>
          <a href="#travel" class="hover:text-gray-800 transition-colors">Travel</a>
          <a href="#rsvp" class="hover:text-gray-800 transition-colors">RSVP</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-[100dvh] flex items-center justify-center pt-14 relative overflow-hidden">
      <div class="absolute inset-0" style="background: linear-gradient(180deg, #D4B896 0%, #A67150 50%, #3A2E2A 100%);">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[11px] tracking-[0.3em] uppercase text-white/40">Foto pantai Bali</span>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F0EBE0] to-transparent z-[1]" />

      <div class="relative z-10 text-center px-6 max-w-lg mx-auto">
        <template v-if="!isLoaded">
          <div class="h-4 w-40 bg-white/20 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-20 w-full bg-white/20 rounded mb-6 animate-pulse" />
          <div class="h-4 w-48 bg-white/20 rounded mx-auto animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-6">Bali · 14 Maret 2026</p>
          <h1 style="font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; line-height: 0.95;" class="text-7xl md:text-9xl text-white mb-6">
            Sarah<br /><span class="text-white/50">&amp;</span><br />Kevin
          </h1>
          <p class="text-[11px] tracking-[0.3em] uppercase text-white/50">3 hari, 1 pantai, orang-orang yang penting.</p>
        </template>
      </div>
    </section>

    <!-- Jadwal -->
    <section id="jadwal" class="py-24">
      <div class="max-w-xl mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-amber-800 mb-8">Jadwal</p>
        <h2 style="font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;" class="text-4xl mb-12">3 hari di Bali.</h2>
        <div class="space-y-10 text-left">
          <article v-for="d in days" :key="d.day" class="pb-8 border-b border-amber-800/15">
            <p class="text-[11px] font-mono text-amber-800 mb-2">{{ d.day }}</p>
            <h3 style="font-family: 'Fraunces', serif; font-size: 22px; font-style: italic;" class="mb-2">{{ d.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ d.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Travel -->
    <section id="travel" class="py-24" style="background: #E5DDD0;">
      <div class="max-w-xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.4em] uppercase text-amber-800 mb-8 text-center">Info Travel</p>
        <div class="grid md:grid-cols-2 gap-4">
          <article v-for="t in travel" :key="t.label" class="p-4 border border-amber-800/10 rounded">
            <p class="text-[11px] tracking-[0.2em] uppercase text-amber-800 mb-2">{{ t.label }}</p>
            <p class="text-base font-medium">{{ t.value }}</p>
          </article>
        </div>
        <p class="text-sm text-gray-600 text-center mt-8">Hotel ditanggung untuk semua tamu.</p>
      </div>
    </section>

    <!-- RSVP -->
    <section id="rsvp" class="py-24 text-center">
      <p class="text-[10px] tracking-[0.4em] uppercase text-amber-800 mb-6">RSVP</p>
      <h2 style="font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;" class="text-3xl mb-4">Gabung ke Bali?</h2>
      <p class="text-sm text-gray-600 mb-8 max-w-md mx-auto">Konfirmasi sebelum 1 Februari 2026. Hotel ditanggung.</p>
      <form class="max-w-sm mx-auto space-y-3 px-6 text-left">
        <input type="text" placeholder="Nama" class="w-full px-4 py-3 border border-amber-800/20 bg-transparent rounded text-sm focus:outline-none focus:border-amber-800" />
        <select class="w-full px-4 py-3 border border-amber-800/20 bg-transparent rounded text-sm"><option>Hadir</option><option>Tidak bisa</option></select>
        <button type="submit" class="w-full bg-amber-800 text-white py-3 rounded text-sm tracking-wider uppercase hover:bg-amber-700 transition-colors">Kirim</button>
      </form>
    </section>

    <footer class="py-12 text-center" style="background: #3A2E2A; color: #F0EBE0;">
      <p style="font-family: 'Fraunces', serif; font-style: italic;" class="opacity-60">S &amp; K · Bali · 14.03.2026</p>
      <p class="text-[9px] tracking-[0.3em] uppercase opacity-40 mt-2">Template by AjoClub</p>
    </footer>

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
  </div>
</template>
