<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'INDEX',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const index = [
  { num: '001', title: 'Website toko baju online', client: 'Toko Sari', year: '2026', tags: 'Web · E-commerce' },
  { num: '002', title: 'Identity system — kopi lokal', client: 'Kopi Rumah', year: '2026', tags: 'Brand · Identity' },
  { num: '003', title: 'Dashboard admin — POS', client: 'Majoo', year: '2025', tags: 'UI · Dashboard' },
  { num: '004', title: 'Landing page — event musik', client: 'NadaFest', year: '2025', tags: 'Event · Web' },
  { num: '005', title: 'Website restoran keluarga', client: 'Sunda Asri', year: '2025', tags: 'Web · Restaurant' },
  { num: '006', title: 'Newsletter template', client: 'Catatan Harian', year: '2024', tags: 'Editorial · Newsletter' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template INDEX. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <TemplateBack />

    <nav class="border-b border-black">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold uppercase tracking-[0.3em]">INDEX</span>
        <div class="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
          <a href="#karya" class="hover:text-red-600 transition-colors">Karya</a>
          <a href="#tentang" class="hover:text-red-600 transition-colors">Tentang</a>
          <a href="#kontak" class="hover:text-red-600 transition-colors">Kontak</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="py-20 md:py-32 border-b border-black">
      <div class="max-w-5xl mx-auto px-6">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-red-200 rounded mb-8 animate-pulse" />
          <div class="h-16 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
          <div class="h-16 w-1/2 bg-gray-200 rounded mb-8 animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] uppercase tracking-[0.3em] text-red-600 mb-8">Bandung, Indonesia · 2018 —</p>
          <h1 class="text-6xl md:text-8xl font-black leading-[0.85] tracking-[-0.03em] mb-8 uppercase">Grapiku<br />Studio</h1>
          <p class="text-lg text-black/70 max-w-lg leading-relaxed">Brand, web, dan desain untuk publisher independen dan studio kecil.</p>
        </template>
      </div>
    </section>

    <!-- Index table -->
    <section id="karya" class="border-b border-black">
      <div class="max-w-5xl mx-auto px-6">
        <div class="flex items-center justify-between py-4 border-b border-black text-[10px] uppercase tracking-[0.2em] text-black/50">
          <span class="w-16">No.</span>
          <span class="flex-1">Judul</span>
          <span class="w-32 hidden sm:block">Klien</span>
          <span class="w-20 hidden sm:block">Tahun</span>
          <span class="w-32 hidden md:block">Tag</span>
        </div>
        <article v-for="p in index" :key="p.num" class="flex items-center py-4 border-b border-black/20 group cursor-pointer hover:bg-red-50 transition-colors">
          <span class="w-16 text-[11px] font-mono text-black/50">{{ p.num }}</span>
          <span class="flex-1 text-base font-medium group-hover:text-red-600 transition-colors">{{ p.title }}</span>
          <span class="w-32 text-[11px] text-black/50 hidden sm:block">{{ p.client }}</span>
          <span class="w-20 text-[11px] font-mono text-black/50 hidden sm:block">{{ p.year }}</span>
          <span class="w-32 text-[10px] uppercase tracking-[0.15em] text-black/40 hidden md:block">{{ p.tags }}</span>
        </article>
      </div>
    </section>

    <!-- Tentang -->
    <section id="tentang" class="py-20 border-b border-black">
      <div class="max-w-3xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4">Tentang</p>
          <p class="text-base leading-relaxed text-black/80">Grapiku adalah praktik desain dua orang. Kami kerja sama dengan penerbit, brand independen, dan institusi budaya. Kami nggak bikin pitch deck.</p>
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4">Kemampuan</p>
          <ul class="text-sm space-y-2 text-black/80">
            <li>Brand identity</li>
            <li>Editorial design</li>
            <li>Typography</li>
            <li>Web design & development</li>
            <li>Signage & wayfinding</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-20 border-b border-black">
      <div class="max-w-3xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4">Kontak</p>
          <p class="text-base leading-relaxed">hello@grapiku.id<br />0851-8862-7365</p>
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-red-600 mb-4">Alamat</p>
          <p class="text-base leading-relaxed">Jl. Cihampelas No. 6<br />Bandung 40131<br />Indonesia</p>
        </div>
      </div>
    </section>

    <footer class="py-8">
      <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-black/40">
        <span>© 2026 Grapiku Studio</span>
        <span>Template by AjoClub</span>
      </div>
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
