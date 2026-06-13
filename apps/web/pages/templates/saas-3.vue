<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Stop Pakai Spreadsheet — Desty',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const painPoints = [
  { pain: 'Stok hilang karena dicatat di Excel', fix: 'Stok terupdate otomatis setiap transaksi.' },
  { pain: 'Laporan bikin pusing, nggak pernah akurat', fix: 'Laporan real-time, siap kirim ke akuntan.' },
  { pain: 'Kasir sering salah hitung', fix: 'Kasir digital, nggak bisa salah.' },
]

const steps = [
  { num: '01', title: 'Daftar', desc: 'Isi nama dan nomor HP. 2 menit.' },
  { num: '02', title: 'Setup', desc: 'Import data produk dari Excel. 5 menit.' },
  { num: '03', title: 'Jalan', desc: 'Mulai transaksi. Semua tercatat otomatis.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Desty. Bisa jelaskan fitur dan harga?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0F172A; color: #F8FAFC; font-family: 'Bricolage Grotesque', 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-white/10" style="background: rgba(15,23,42,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-emerald-400">Desty</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#masalah" class="hover:text-white transition-colors">Masalah</a>
          <a href="#solusi" class="hover:text-white transition-colors">Solusi</a>
          <a href="#cara" class="hover:text-white transition-colors">Cara Kerja</a>
        </div>
        <a href="#mulai" class="text-[13px] px-4 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Ganti Sekarang</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-6 w-40 bg-white/10 rounded-full mb-6 mx-auto animate-pulse" />
          <div class="h-14 w-full bg-white/10 rounded mb-4 animate-pulse" />
          <div class="h-14 w-3/4 bg-white/10 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-5 w-full bg-white/10 rounded mb-2 animate-pulse" />
          <div class="h-5 w-2/3 bg-white/10 rounded mb-10 mx-auto animate-pulse" />
          <div class="flex justify-center gap-3">
            <div class="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
            <div class="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </template>

        <template v-else>
          <p class="text-[12px] text-emerald-400 font-semibold tracking-wide uppercase mb-6">Untuk UMKM di Indonesia</p>
          <h1 class="text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-[-0.03em] mb-8">
            Stop pakai spreadsheet<br />
            <span class="text-emerald-400">untuk kelola bisnis.</span>
          </h1>
          <p class="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-10">
            Excel nggak dirancang untuk kasir, stok, dan laporan. Kami bikin aplikasi yang memang untuk itu.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#mulai" class="px-6 py-3 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors">
              Ganti ke Sistem yang Benar
            </a>
            <a href="#masalah" class="px-6 py-3 border border-white/20 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
              Lihat Bedanya
            </a>
          </div>
        </template>
      </div>
    </section>

    <!-- Pain points -->
    <section id="masalah" class="py-24 border-t border-white/10" style="background: #111827;">
      <div class="max-w-4xl mx-auto px-6">
        <p class="text-[12px] text-emerald-400 font-semibold tracking-wide uppercase mb-3 text-center">Masalah</p>
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Kamu pasti pernah ngalamin ini.</h2>

        <div class="space-y-6">
          <div v-for="p in painPoints" :key="p.pain" class="grid md:grid-cols-2 gap-4 items-stretch">
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <p class="text-[11px] text-red-400 font-semibold uppercase mb-2">Masalah</p>
              <p class="text-base text-white/90">{{ p.pain }}</p>
            </div>
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <p class="text-[11px] text-emerald-400 font-semibold uppercase mb-2">Solusi</p>
              <p class="text-base text-white/90">{{ p.fix }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="cara" class="py-24 border-t border-white/10">
      <div class="max-w-4xl mx-auto px-6">
        <p class="text-[12px] text-emerald-400 font-semibold tracking-wide uppercase mb-3 text-center">Cara Kerja</p>
        <h2 class="text-3xl font-bold text-center mb-16">3 langkah. 10 menit.</h2>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="s in steps" :key="s.num" class="text-center">
            <p class="text-4xl font-extrabold text-emerald-400/30 mb-4">{{ s.num }}</p>
            <h3 class="text-xl font-bold mb-2">{{ s.title }}</h3>
            <p class="text-sm text-white/60 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="mulai" class="py-24 text-center border-t border-white/10" style="background: #065F46;">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Siap berhenti pakai Excel?</h2>
      <p class="text-lg opacity-90 mb-8 max-w-lg mx-auto">Gratis 14 hari. Setup 10 menit. Nggak perlu kartu kredit.</p>
      <a href="#" class="inline-block px-8 py-3 bg-white text-emerald-800 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
        Mulai Sekarang
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

    <TemplateFooter brand-name="Desty" :links="[{ label: 'Masalah', href: '#masalah' }, { label: 'Solusi', href: '#solusi' }, { label: 'Cara Kerja', href: '#cara' }]" accent="#10B981" />
  </div>
</template>
