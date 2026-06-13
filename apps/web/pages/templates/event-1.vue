<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'DevTalk Bandung',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const speakers = [
  { name: 'Budi Santoso', role: 'Staff Engineer', company: 'GoTo' },
  { name: 'Rina Wijaya', role: 'Engineering Manager', company: 'Tokopedia' },
  { name: 'Andi Prasetyo', role: 'CTO', company: 'Paper.id' },
  { name: 'Dina Kusuma', role: 'ML Engineer', company: 'Bukalapak' },
]

const agenda = [
  { time: '09:00', topic: 'Registrasi & Kopi', speaker: '' },
  { time: '10:00', topic: 'Keynote: Masa Depan AI di Indonesia', speaker: 'Budi Santoso' },
  { time: '11:00', topic: 'Workshop: Bangun API dengan FastAPI', speaker: 'Rina Wijaya' },
  { time: '13:00', topic: 'Makan Siang & Networking', speaker: '' },
  { time: '14:00', topic: 'Talk: Scaling Database di Production', speaker: 'Andi Prasetyo' },
  { time: '15:30', topic: 'Hackathon: 2 Jam, 1 Ide, 1 Prototype', speaker: '' },
  { time: '17:30', topic: 'Demo & Hadiah', speaker: '' },
]

const stats = [
  { value: '500+', label: 'Developer' },
  { value: '20+', label: 'Speaker' },
  { value: '1', label: 'Hari' },
  { value: 'Gratis', label: 'Tiket' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template DevTalk. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0A1628; color: #F8FAFC; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-white/5" style="background: rgba(10,22,40,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'JetBrains Mono', monospace;" class="text-sm font-bold text-emerald-400">DevTalk</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#speaker" class="hover:text-white transition-colors">Speaker</a>
          <a href="#agenda" class="hover:text-white transition-colors">Agenda</a>
          <a href="#daftar" class="hover:text-white transition-colors">Daftar</a>
        </div>
        <a href="#daftar" class="text-[12px] px-4 py-1.5 bg-emerald-500 text-black rounded font-bold hover:bg-emerald-400 transition-colors" style="font-family: 'JetBrains Mono', monospace;">DAFTAR GRATIS</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-8 w-48 bg-white/10 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-14 w-full bg-white/10 rounded mb-4 animate-pulse" />
          <div class="h-14 w-3/4 bg-white/10 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-5 w-full bg-white/10 rounded mb-2 animate-pulse" />
          <div class="h-5 w-2/3 bg-white/10 rounded mb-10 mx-auto animate-pulse" />
          <div class="flex justify-center gap-3">
            <div class="h-12 w-40 bg-white/10 rounded-lg animate-pulse" />
            <div class="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </template>

        <template v-else>
          <div class="inline-flex items-center gap-4 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-8" style="font-family: 'JetBrains Mono', monospace;">
            <span class="text-[11px] text-emerald-400">COUNTDOWN</span>
            <span class="text-lg font-bold text-emerald-400">42 : 15 : 30</span>
            <span class="text-[11px] text-white/40">hari : jam : menit</span>
          </div>

          <h1 style="font-family: 'JetBrains Mono', monospace;" class="text-5xl md:text-7xl font-bold leading-[0.95] mb-6">
            DevTalk<br /><span class="text-emerald-400">Bandung</span>
          </h1>
          <p class="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-8">
            Konferensi developer terbesar di Jawa Barat. AI, backend, cloud, dan hackathon — dalam satu hari.
          </p>

          <div class="grid grid-cols-4 gap-4 max-w-md mx-auto mb-10">
            <div v-for="s in stats" :key="s.label" class="text-center">
              <p class="text-2xl font-bold text-emerald-400" style="font-family: 'JetBrains Mono', monospace;">{{ s.value }}</p>
              <p class="text-[11px] text-white/40 mt-1">{{ s.label }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#daftar" class="px-6 py-3 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors" style="font-family: 'JetBrains Mono', monospace;">
              DAFTAR GRATIS
            </a>
            <a href="#agenda" class="px-6 py-3 border border-white/20 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
              Lihat Agenda
            </a>
          </div>

          <p class="text-[13px] text-white/50 mt-8" style="font-family: 'JetBrains Mono', monospace;">
            15 Maret 2026 · Gedung Sasana Budaya, Bandung · 09.00 — 17.30
          </p>
        </template>
      </div>
    </section>

    <!-- Speakers -->
    <section id="speaker" class="py-24 border-t border-white/5" style="background: #111D32;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] text-emerald-400 font-bold tracking-wide uppercase mb-3" style="font-family: 'JetBrains Mono', monospace;">SPEAKER</p>
        <h2 class="text-3xl font-bold mb-12">Siapa yang bakal ngisi.</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <article v-for="s in speakers" :key="s.name" class="group">
            <div class="aspect-[3/4] rounded-lg mb-3" style="background: linear-gradient(135deg, #1E3A5F, #0A1628);">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-white/30">Foto</span>
              </div>
            </div>
            <p class="text-sm font-semibold group-hover:text-emerald-400 transition-colors">{{ s.name }}</p>
            <p class="text-[11px] text-white/50">{{ s.role }}</p>
            <p class="text-[10px] text-emerald-400/70" style="font-family: 'JetBrains Mono', monospace;">{{ s.company }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Agenda -->
    <section id="agenda" class="py-24 border-t border-white/5">
      <div class="max-w-3xl mx-auto px-6">
        <p class="text-[11px] text-emerald-400 font-bold tracking-wide uppercase mb-3" style="font-family: 'JetBrains Mono', monospace;">AGENDA</p>
        <h2 class="text-3xl font-bold mb-12">Satu hari, penuh ilmu.</h2>

        <div class="space-y-0">
          <div v-for="item in agenda" :key="item.time" class="grid grid-cols-[60px_1fr] gap-6 py-4 border-b border-white/5">
            <p class="text-[13px] text-emerald-400 font-mono pt-0.5">{{ item.time }}</p>
            <div>
              <p class="text-base font-medium">{{ item.topic }}</p>
              <p v-if="item.speaker" class="text-[12px] text-white/50 mt-0.5">{{ item.speaker }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="daftar" class="py-24 text-center border-t border-white/5" style="background: #065F46;">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Daftar sekarang, gratis.</h2>
      <p class="text-lg opacity-90 mb-8 max-w-lg mx-auto">Kuota terbatas. Makan siang dan kopi gratis.</p>
      <a href="#" class="inline-block px-8 py-3 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors" style="font-family: 'JetBrains Mono', monospace;">
        DAFTAR GRATIS
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

    <TemplateFooter brand-name="DevTalk Bandung" :links="[{ label: 'Speaker', href: '#speaker' }, { label: 'Agenda', href: '#agenda' }, { label: 'Daftar', href: '#daftar' }]" accent="#00FF88" />
  </div>
</template>
