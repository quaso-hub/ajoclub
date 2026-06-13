<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Anindya & Rama',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const events = [
  { time: '08:00', label: 'Akad Nikah', location: 'Masjid Al-Ikhlas, Bandung' },
  { time: '11:00', label: 'Resepsi', location: 'Gedung Sasana Budaya, Bandung' },
  { time: '18:00', label: 'Makan Malam', location: 'Restoran Sunda Asri, Lembang' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template undangan Anindya & Rama. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #F8F5F0; color: #2D2A26; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-md" style="background: rgba(248,245,240,0.85);">
      <div class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic;">A &amp; R</span>
        <div class="hidden md:flex items-center gap-6 text-[10px] tracking-[0.3em] uppercase text-gray-500">
          <a href="#cerita" class="hover:text-gray-800 transition-colors">Cerita</a>
          <a href="#acara" class="hover:text-gray-800 transition-colors">Acara</a>
          <a href="#rsvp" class="hover:text-gray-800 transition-colors">RSVP</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-[100dvh] flex items-center justify-center pt-14 relative overflow-hidden">
      <div class="absolute inset-0" style="background: linear-gradient(180deg, #D4C4A8 0%, #A89272 50%, #7A6B5A 100%);">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[11px] tracking-[0.3em] uppercase text-white/40">Foto prewedding</span>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8F5F0]/20 to-[#F8F5F0] z-[1]" />

      <div class="relative z-10 text-center px-6 max-w-xl mx-auto">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-white/20 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-4 w-40 bg-white/20 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-20 w-full bg-white/20 rounded mb-6 animate-pulse" />
          <div class="h-4 w-24 bg-white/20 rounded mx-auto animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-6">Bismillah</p>
          <p class="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-8">Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <h1 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; line-height: 0.95;" class="text-7xl md:text-9xl mb-6 text-white">
            Anindya<br /><span class="text-white/50">&amp;</span><br />Rama
          </h1>
          <p class="text-[11px] tracking-[0.3em] uppercase text-white/60 font-mono">Sabtu · 14 · Maret · 2026</p>
          <p class="text-[11px] tracking-[0.3em] uppercase text-white/50 mt-2">Bandung, Indonesia</p>
        </template>
      </div>
    </section>

    <!-- Cerita -->
    <section id="cerita" class="py-24">
      <div class="max-w-xl mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-8">Cerita Kami</p>
        <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic;" class="text-4xl mb-12">Dari mana kami mulai.</h2>
        <div class="space-y-8 text-left">
          <div class="grid grid-cols-[60px_1fr] gap-4">
            <p class="text-[11px] font-mono text-gray-500 text-right pt-1">2019</p>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; line-height: 1.7;">Ketemu pertama kali di acara nikahan teman. Sama-sama nggak kenal siapa-siapa.</p>
          </div>
          <div class="grid grid-cols-[60px_1fr] gap-4">
            <p class="text-[11px] font-mono text-gray-500 text-right pt-1">2021</p>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; line-height: 1.7;">Pindah ke Bandung bareng. Ngekos di Cihampelas, makan nasi goreng tiap malam.</p>
          </div>
          <div class="grid grid-cols-[60px_1fr] gap-4">
            <p class="text-[11px] font-mono text-gray-500 text-right pt-1">2024</p>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; line-height: 1.7;">Dia ngelamar di Gunung Batur, Bali, pas sunrise. Saya bilang iya sebelum matahari terbit.</p>
          </div>
          <div class="grid grid-cols-[60px_1fr] gap-4">
            <p class="text-[11px] font-mono text-gray-500 text-right pt-1">2026</p>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; line-height: 1.7;">Nikah.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Acara -->
    <section id="acara" class="py-24" style="background: #EDE8DF;">
      <div class="max-w-xl mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-8">Detail Acara</p>
        <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic;" class="text-4xl mb-12">Sabtu, 14 Maret 2026.</h2>
        <div class="space-y-8">
          <article v-for="e in events" :key="e.label" class="pb-8 border-b border-gray-300/40">
            <p class="text-[12px] font-mono text-gray-500 mb-2">{{ e.time }}</p>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; font-style: italic;" class="mb-2">{{ e.label }}</h3>
            <p class="text-sm text-gray-600">{{ e.location }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- RSVP -->
    <section id="rsvp" class="py-24">
      <div class="max-w-sm mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-6">Konfirmasi</p>
        <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic;" class="text-3xl mb-4">Bisa hadir?</h2>
        <p class="text-sm text-gray-600 mb-8">Mohon konfirmasi sebelum 28 Februari 2026.</p>
        <form class="space-y-3 text-left">
          <input type="text" placeholder="Nama lengkap" class="w-full px-4 py-3 border border-gray-300 bg-transparent rounded text-sm focus:outline-none focus:border-gray-500" />
          <input type="tel" placeholder="Nomor HP" class="w-full px-4 py-3 border border-gray-300 bg-transparent rounded text-sm focus:outline-none focus:border-gray-500" />
          <select class="w-full px-4 py-3 border border-gray-300 bg-transparent rounded text-sm"><option>Insha Allah hadir</option><option>Maaf, tidak bisa</option></select>
          <button type="submit" class="w-full bg-gray-800 text-white py-3 rounded text-sm tracking-wider uppercase hover:bg-gray-700 transition-colors">Kirim</button>
        </form>
      </div>
    </section>

    <footer class="py-12 text-center" style="background: #2D2A26; color: #F8F5F0;">
      <p style="font-family: 'Cormorant Garamond', serif; font-style: italic;" class="opacity-60">A &amp; R · 14.03.2026</p>
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
