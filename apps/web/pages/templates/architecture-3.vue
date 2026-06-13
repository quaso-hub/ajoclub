<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Ruang Studio',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const projects = [
  { name: 'Villa Andara', type: 'Residensial', location: 'Bali', year: '2025', materials: 'Jati, batu alam, kuningan' },
  { name: 'Hotel Tugu Malang', type: 'Hospitality', location: 'Malang', year: '2024', materials: 'Bambu, batu vulkanik, katun' },
  { name: 'Café Nusa', type: 'Komersial', location: 'Bandung', year: '2024', materials: 'Terrazzo, rotan, keramik' },
]
const services = [
  { title: 'Residensial', desc: 'Rumah, villa, apartemen. Dari konsep sampai penataan furnitur.' },
  { title: 'Hospitality', desc: 'Hotel, restoran, café. Desain yang mendukung pengalaman tamu.' },
  { title: 'Komersial', desc: 'Kantor, retail, co-working. Ruang yang mendukung cara kerja.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Ruang Studio. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #F8F4ED; color: #2C2620; font-family: 'Outfit', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-md" style="background: rgba(248,244,237,0.85);">
      <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-semibold" style="font-family: 'JetBrains Mono', monospace;">Ruang Studio</span>
        <div class="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase text-gray-600">
          <a href="#proyek" class="hover:text-gray-900 transition-colors">Proyek</a>
          <a href="#layanan" class="hover:text-gray-900 transition-colors">Layanan</a>
          <a href="#kontak" class="hover:text-gray-900 transition-colors">Kontak</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-16 pb-12">
      <div class="max-w-6xl mx-auto px-6 pt-16">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-amber-200 rounded mb-4 animate-pulse" />
          <div class="h-12 w-3/4 bg-gray-200 rounded mb-6 animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded mb-2 animate-pulse" />
          <div class="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-4" style="font-family: 'JetBrains Mono', monospace;">Studio desain interior · Bandung</p>
          <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">Ruang Studio</h1>
          <p class="text-lg text-gray-600 max-w-xl leading-relaxed">Desain interior residensial dan hospitality. Berbasis di Bandung, bekerja di seluruh Asia.</p>
        </template>
      </div>
    </section>

    <!-- Proyek -->
    <section id="proyek" class="py-16 border-t border-gray-200/60">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-8" style="font-family: 'JetBrains Mono', monospace;">Proyek Terpilih</p>
        <div class="space-y-16">
          <article v-for="(p, i) in projects" :key="p.name" class="grid md:grid-cols-2 gap-8 items-start group cursor-pointer">
            <div class="aspect-[4/3] rounded-xl overflow-hidden" :style="{ background: `linear-gradient(${135+i*30}deg, #D4C4A8, #A67150)` }">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-white/40">Foto interior</span>
              </div>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-2" style="font-family: 'JetBrains Mono', monospace;">{{ p.type }} · {{ p.year }}</p>
              <h3 class="text-2xl font-semibold mb-2 group-hover:text-amber-700 transition-colors">{{ p.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ p.location }}</p>
              <p class="text-sm text-gray-600 italic">Material: {{ p.materials }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Layanan -->
    <section id="layanan" class="py-20 border-t border-gray-200/60" style="background: #EDE7DD;">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-8" style="font-family: 'JetBrains Mono', monospace;">Layanan</p>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="s in services" :key="s.title" class="p-5 border border-gray-300/40 rounded-xl">
            <h3 class="text-lg font-semibold mb-2">{{ s.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tentang -->
    <section class="py-16 border-t border-gray-200/60">
      <div class="max-w-2xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-6" style="font-family: 'JetBrains Mono', monospace;">Tentang</p>
        <p class="text-lg leading-[1.7] text-gray-700">
          Ruang Studio adalah praktik desain interior 4 orang. Kami kerja sama dengan pemilik rumah, developer hotel, dan brand F&B. Pendekatan kami dimulai dari material: apa yang tersedia lokal, apa yang menua dengan baik, apa yang terasa benar.
        </p>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-20 border-t border-gray-200/60 text-center">
      <h2 class="text-3xl font-semibold mb-4">Mulai proyek.</h2>
      <p class="text-base text-gray-600 mb-8 max-w-md mx-auto">Balas dalam 48 jam. Konsultasi pertama gratis.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors">WhatsApp</a>
        <a href="mailto:halo@ruangstudio.id" class="border border-gray-400 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Email</a>
      </div>
    </section>

    <footer class="py-10 text-center" style="background: #2C2620; color: #F8F4ED;">
      <p class="text-sm opacity-60">Ruang Studio</p>
      <p class="text-[9px] tracking-[0.3em] uppercase opacity-40 mt-2">© 2026 Bandung · Template by AjoClub</p>
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
