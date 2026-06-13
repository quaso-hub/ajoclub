<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Grapiku Studio',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const works = [
  { title: 'Brand identity untuk Kopi Rumah', tag: 'Brand · Web', year: '2026', color: '#F59E0B' },
  { title: 'Website Toko Sari — e-commerce', tag: 'Web · E-commerce', year: '2026', color: '#10B981' },
  { title: 'Dashboard admin untuk Majoo', tag: 'UI/UX · Dashboard', year: '2025', color: '#6366F1' },
  { title: 'Landing page NadaFest', tag: 'Event · Landing', year: '2025', color: '#EC4899' },
]

const process = [
  { step: '01', title: 'Ngobrol', desc: 'Kita ngobrol dulu. Kamu ceritain bisnisnya, saya tanya detailnya. 30 menit, gratis.' },
  { step: '02', title: 'Desain', desc: 'Saya bikin 2-3 opsi desain. Kamu pilih yang paling cocok.' },
  { step: '03', title: 'Bikin', desc: 'Desain yang dipilih jadi website. Kamu bisa lihat progress setiap hari.' },
  { step: '04', title: 'Online', desc: 'Website di-deploy, domain diarahkan, kamu bisa share ke customer.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Grapiku Studio. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0A0A0A; color: #F8FAFC; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-white/5" style="background: rgba(10,10,10,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-indigo-400">Grapiku</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#karya" class="hover:text-white transition-colors">Karya</a>
          <a href="#proses" class="hover:text-white transition-colors">Proses</a>
          <a href="#kontak" class="hover:text-white transition-colors">Kontak</a>
        </div>
        <a href="#kontak" class="text-[12px] px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Mulai Proyek</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-[100dvh] flex items-center pt-14 overflow-hidden relative">
      <ClientOnly>
        <ExperienceCanvas preset="particle-morph" accent="#6366F1" intensity="immersive" label="Grapiku" class="absolute inset-0 z-0" />
      </ClientOnly>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] z-[1]" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <template v-if="!isLoaded">
          <div class="h-4 w-40 bg-white/10 rounded mb-6 animate-pulse" />
          <div class="h-16 w-3/4 bg-white/10 rounded mb-4 animate-pulse" />
          <div class="h-16 w-1/2 bg-white/10 rounded mb-8 animate-pulse" />
          <div class="h-5 w-full bg-white/10 rounded mb-2 animate-pulse" />
          <div class="h-5 w-2/3 bg-white/10 rounded mb-8 animate-pulse" />
          <div class="flex gap-2">
            <div v-for="i in 4" :key="i" class="h-8 w-20 bg-white/10 rounded-full animate-pulse" />
          </div>
        </template>

        <template v-else>
          <div class="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-end">
            <div>
              <p class="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40 mb-6">Studio desain · Bandung</p>
              <h1 class="text-6xl md:text-8xl font-extrabold leading-[0.9] tracking-[-0.03em] mb-8">
                Kami bikin<br />yang <span class="text-indigo-400">bekerja.</span>
              </h1>
            </div>
            <div class="max-w-sm">
              <p class="text-lg text-white/60 leading-relaxed mb-6">
                Studio desain kecil di Bandung. 47 proyek sejak 2021. Brand, web, dan dashboard.
              </p>
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="tag in ['Brand', 'Web', 'Dashboard', 'Mobile']" :key="tag" class="px-3 py-1 text-[10px] tracking-[0.15em] uppercase border border-white/20 rounded-full">{{ tag }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Karya -->
    <section id="karya" class="py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40 mb-3">Karya Terpilih</p>
            <h2 class="text-4xl font-extrabold">47 proyek.</h2>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <article v-for="(work, i) in works" :key="work.title" class="group cursor-pointer">
            <div class="aspect-[4/3] rounded-xl mb-4 relative overflow-hidden" :style="{ background: work.color }">
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,0,0,0.4);">
                <span class="text-[10px] tracking-[0.2em] uppercase text-white/80">Lihat detail</span>
              </div>
              <div class="absolute top-4 left-4 text-[10px] font-mono text-white/70">{{ String(i+1).padStart(2,'0') }} / 47</div>
            </div>
            <h3 class="text-lg font-bold group-hover:text-indigo-400 transition-colors">{{ work.title }}</h3>
            <p class="text-[11px] font-mono tracking-[0.15em] uppercase text-white/40 mt-1">{{ work.tag }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Proses -->
    <section id="proses" class="py-24 border-t border-white/5" style="background: #111111;">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40 mb-3">Proses</p>
        <h2 class="text-4xl font-extrabold mb-12">4 langkah.</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          <article v-for="step in process" :key="step.step" class="p-8" style="background: #0A0A0A;">
            <p class="text-[10px] font-mono tracking-[0.2em] text-indigo-400 mb-4">{{ step.step }}</p>
            <h3 class="text-2xl font-bold mb-3">{{ step.title }}</h3>
            <p class="text-sm text-white/60 leading-relaxed">{{ step.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-24 border-t border-white/5 text-center">
      <p class="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40 mb-6">Ada proyek?</p>
      <h2 class="text-5xl font-extrabold mb-6">Mari <span class="text-indigo-400">ngobrol.</span></h2>
      <p class="text-lg text-white/60 max-w-md mx-auto mb-10">Balas dalam 24 jam. Konsultasi pertama gratis.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">WhatsApp</a>
        <a href="mailto:hello@grapiku.id" class="px-5 py-2.5 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Email</a>
      </div>
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

    <TemplateFooter brand-name="Grapiku" :links="[{ label: 'Karya', href: '#karya' }, { label: 'Proses', href: '#proses' }, { label: 'Kontak', href: '#kontak' }]" accent="#6366F1" />
  </div>
</template>
