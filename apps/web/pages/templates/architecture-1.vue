<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Archiry Studio',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const projects = [
  { name: 'Villa Andara', location: 'Bali', year: '2025', type: 'Residensial', area: '420 m²', desc: 'Villa tropis dengan material lokal: batu alam, kayu jati, bambu.' },
  { name: 'Rumah Tinggal Dago', location: 'Bandung', year: '2024', type: 'Residensial', area: '280 m²', desc: 'Rumah keluarga 2 lantai, atap pelana, carport luas.' },
  { name: 'Kantor Startup Jakarta', location: 'Jakarta', year: '2024', type: 'Komersial', area: '150 m²', desc: 'Open office untuk tim 20 orang. Meeting room, pantry, area istirahat.' },
]

const services = [
  { title: 'Arsitektur', desc: 'Rumah tinggal, villa, kantor. Dari sketsa sampai serah terima.' },
  { title: 'Interior', desc: 'Desain interior yang responsif terhadap cahaya, material, dan ritme harian.' },
  { title: 'Perencanaan', desc: 'Analisis site, programming, dan strategi pengembangan bertahap.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Archiry Studio. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #F5F5F0; color: #1C1917; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-md" style="background: rgba(245,245,240,0.85);">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span style="font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 500;">Archiry</span>
        <div class="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase text-gray-600">
          <a href="#proyek" class="hover:text-gray-900 transition-colors">Proyek</a>
          <a href="#layanan" class="hover:text-gray-900 transition-colors">Layanan</a>
          <a href="#kontak" class="hover:text-gray-900 transition-colors">Kontak</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative min-h-[80vh] flex items-end pb-16 pt-20 overflow-hidden">
      <div class="absolute inset-0" style="background: linear-gradient(135deg, #C9A961, #8B7355 50%, #5C5048);">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[10px] tracking-[0.3em] uppercase text-white/40">Foto villa</span>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#F5F5F0] via-transparent to-transparent" />

      <div class="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div class="max-w-lg p-6" style="background: rgba(245,245,240,0.92); backdrop-filter: blur(12px); border-radius: 12px;">
          <template v-if="!isLoaded">
            <div class="h-4 w-24 bg-amber-200 rounded mb-3 animate-pulse" />
            <div class="h-10 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
            <div class="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
            <div class="h-4 w-2/3 bg-gray-200 rounded mb-4 animate-pulse" />
            <div class="flex gap-3">
              <div class="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div class="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div class="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </template>

          <template v-else>
            <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3">Studio arsitektur · Bandung</p>
            <h1 style="font-family: 'Cormorant Garamond', serif; font-weight: 400; line-height: 1.1;" class="text-3xl md:text-5xl mb-4">
              Arsitektur yang<br />menghormati tempat.
            </h1>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">12 orang, 23 proyek, sejak 2018. Berbasis di Bandung, bekerja di seluruh Indonesia.</p>
            <div class="flex items-center gap-4 text-[11px] text-gray-500">
              <span>Residensial</span><span>·</span><span>Komersial</span><span>·</span><span>Adaptive Reuse</span>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Proyek -->
    <section id="proyek" class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3">Proyek Terpilih</p>
        <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 400;" class="text-4xl mb-16">Proyek terbaru.</h2>

        <div class="space-y-24">
          <article v-for="(p, i) in projects" :key="p.name" class="grid md:grid-cols-2 gap-8 md:gap-12 items-start" :class="i%2===1 ? 'md:[direction:rtl]' : ''">
            <div class="aspect-[4/3] rounded-xl overflow-hidden" :class="i%2===1 ? 'md:order-2' : ''" style="background: linear-gradient(135deg, #D4C4A8, #8B7355);">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[10px] tracking-[0.3em] uppercase text-white/40">Foto proyek</span>
              </div>
            </div>
            <div :class="i%2===1 ? 'md:order-1' : ''">
              <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3">{{ p.type }} · {{ p.year }}</p>
              <h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 400;" class="text-3xl mb-2">{{ p.name }}</h3>
              <p class="text-sm text-gray-500 mb-3">{{ p.location }} · {{ p.area }}</p>
              <p class="text-sm text-gray-600 leading-relaxed">{{ p.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Layanan -->
    <section id="layanan" class="py-24" style="background: #EAE5D5;">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-3">Layanan</p>
        <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 400;" class="text-4xl mb-16">Apa yang kami kerjakan.</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="s in services" :key="s.title" class="p-6 border border-amber-800/10 rounded-xl">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 500;" class="text-xl mb-3">{{ s.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-24 text-center">
      <p class="text-[10px] tracking-[0.3em] uppercase text-amber-700 mb-6">Ada lahan?</p>
      <h2 style="font-family: 'Cormorant Garamond', serif; font-weight: 400; font-style: italic;" class="text-5xl mb-6">Mari ngobrol.</h2>
      <p class="text-base text-gray-600 mb-8 max-w-md mx-auto">Balas dalam 48 jam. Konsultasi pertama gratis.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">WhatsApp</a>
        <a href="mailto:hello@archiry.id" class="border border-gray-400 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Email</a>
      </div>
    </section>

    <footer class="py-10 text-center" style="background: #1C1917; color: #F5F5F0;">
      <p style="font-family: 'Cormorant Garamond', serif;" class="opacity-60">Archiry Studio</p>
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
