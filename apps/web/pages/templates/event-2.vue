<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'NadaFest 2026',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const lineup = [
  { name: 'Rossa', stage: 'Panggung Utama', time: '21:00' },
  { name: 'Tulus', stage: 'Panggung Utama', time: '20:00' },
  { name: 'Nadin Amizah', stage: 'Panggung Kecil', time: '19:00' },
  { name: 'Hindia', stage: 'Panggung Utama', time: '18:00' },
  { name: 'Fourtwnty', stage: 'Panggung Kecil', time: '17:00' },
  { name: 'Feast', stage: 'Panggung Utama', time: '16:00' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template NadaFest. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0A0A0A; color: #FFFFFF; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-white/5" style="background: rgba(10,10,10,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold">NadaFest</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#lineup" class="hover:text-white transition-colors">Lineup</a>
          <a href="#info" class="hover:text-white transition-colors">Info</a>
          <a href="#tiket" class="hover:text-white transition-colors">Tiket</a>
        </div>
        <a href="#tiket" class="text-[12px] px-4 py-1.5 rounded-full font-medium" style="background: linear-gradient(135deg, #7B2FF7, #FF2D87, #FF6B00);">Beli Tiket</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-[100dvh] flex items-center pt-14 overflow-hidden relative">
      <ClientOnly>
        <ExperienceCanvas preset="shader-portal" accent="#FF2D87" intensity="immersive" label="NadaFest" class="absolute inset-0 z-0 opacity-30" />
      </ClientOnly>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] z-[1]" />

      <div class="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full text-center">
        <template v-if="!isLoaded">
          <div class="h-4 w-48 bg-white/10 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-20 w-full bg-white/10 rounded mb-8 animate-pulse" />
          <div class="h-5 w-3/4 bg-white/10 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-12 w-48 bg-white/10 rounded-lg mx-auto animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-6">Bandung · 18-19 April 2026</p>
          <h1 class="text-7xl md:text-9xl font-black leading-[0.85] tracking-[-0.04em] mb-8" style="background: linear-gradient(135deg, #7B2FF7, #FF2D87, #FF6B00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            NadaFest
          </h1>
          <p class="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-8">
            Festival musik terbesar di Jawa Barat. 2 hari, 3 panggung, 30+ artis Indonesia.
          </p>
          <a href="#tiket" class="inline-block px-6 py-3 rounded-full text-sm font-medium" style="background: linear-gradient(135deg, #7B2FF7, #FF2D87, #FF6B00);">
            Beli Tiket — Rp 350.000
          </a>
          <p class="text-[12px] text-white/40 mt-4">Tiket 2 hari, akses semua panggung.</p>
        </template>
      </div>
    </section>

    <!-- Lineup -->
    <section id="lineup" class="py-24 border-t border-white/5">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-3">Lineup</p>
        <h2 class="text-4xl font-bold mb-12">Siapa yang main.</h2>

        <div class="divide-y divide-white/10 border-t border-white/10">
          <article v-for="a in lineup" :key="a.name" class="py-5 grid grid-cols-[1fr_120px_60px] gap-6 items-center group cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 transition-colors">
            <p class="text-xl font-bold group-hover:text-pink-400 transition-colors">{{ a.name }}</p>
            <p class="text-[11px] tracking-[0.15em] uppercase text-white/50 text-right">{{ a.stage }}</p>
            <p class="text-[11px] tracking-[0.15em] uppercase text-white/50 text-right font-mono">{{ a.time }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Info -->
    <section id="info" class="py-24 border-t border-white/5" style="background: #111111;">
      <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <p class="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">Lokasi</p>
          <p class="text-base">Lapangan Tegalega<br />Bandung, Jawa Barat</p>
        </div>
        <div>
          <p class="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">Tanggal</p>
          <p class="text-base">18 — 19 April 2026<br />Gates buka 14.00</p>
        </div>
        <div>
          <p class="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">Kapasitas</p>
          <p class="text-base">15.000 pengunjung<br />3 panggung, 30+ artis</p>
        </div>
      </div>
    </section>

    <!-- Tiket -->
    <section id="tiket" class="py-24 border-t border-white/10 text-center">
      <h2 class="text-4xl font-bold mb-4">Beli tiket sekarang.</h2>
      <p class="text-base text-white/60 max-w-md mx-auto mb-8">Tiket 2 hari. Anak di bawah 12 tahun gratis.</p>
      <a href="#" class="inline-block px-8 py-3 rounded-full text-sm font-medium" style="background: linear-gradient(135deg, #7B2FF7, #FF2D87, #FF6B00);">
        Beli Tiket — Rp 350.000
      </a>
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

    <TemplateFooter brand-name="NadaFest" :links="[{ label: 'Lineup', href: '#lineup' }, { label: 'Info', href: '#info' }, { label: 'Tiket', href: '#tiket' }]" accent="#FF2D87" />
  </div>
</template>
