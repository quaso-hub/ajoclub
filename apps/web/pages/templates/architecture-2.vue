<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Bukit Hijau Residence',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const units = [
  { name: 'Tipe A — Studio', area: '36 m²', price: 'Rp 480 Jt', status: 'Tersedia' },
  { name: 'Tipe B — 1 BR', area: '54 m²', price: 'Rp 720 Jt', status: 'Tersedia' },
  { name: 'Tipe C — 2 BR', area: '78 m²', price: 'Rp 1,1 M', status: 'Habis' },
]
const features = [
  { title: 'Smart Home', desc: 'Lighting, kunci, AC dikontrol dari HP.' },
  { title: 'Rooftop Garden', desc: '500 m² taman bersama, BBQ area, city view.' },
  { title: 'Co-working', desc: 'Ruang kerja 24/7 dengan WiFi cepat.' },
  { title: 'EV Charging', desc: '12 charger mobil listrik di basement.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Bukit Hijau Residence. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #111827; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(255,255,255,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-blue-700">Bukit Hijau</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#unit" class="hover:text-gray-900 transition-colors">Unit</a>
          <a href="#fitur" class="hover:text-gray-900 transition-colors">Fitur</a>
          <a href="#lokasi" class="hover:text-gray-900 transition-colors">Lokasi</a>
        </div>
        <a href="#kontak" class="text-[12px] px-4 py-1.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">Hubungi Marketing</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-14">
      <div class="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <template v-if="!isLoaded">
          <div class="h-4 w-40 bg-blue-200 rounded mb-3 animate-pulse" />
          <div class="h-10 w-3/4 bg-gray-200 rounded mb-3 animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.2em] uppercase text-blue-700 font-mono mb-3">Perumahan baru · Bandung Selatan</p>
          <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-3">Bukit Hijau Residence</h1>
          <p class="text-base text-gray-600 max-w-xl">24 rumah tapak. 3-4 kamar tidur. Smart home ready. Serah terima Q2 2027.</p>
        </template>
      </div>
    </section>

    <!-- Render -->
    <section class="py-4">
      <div class="max-w-7xl mx-auto px-6 aspect-[21/9] rounded-xl bg-gray-100 flex items-center justify-center">
        <span class="text-[10px] tracking-[0.3em] uppercase text-gray-400">Render arsitektur</span>
      </div>
    </section>

    <!-- Unit -->
    <section id="unit" class="py-16 border-t border-gray-200/60">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-blue-700 font-mono mb-8">Unit Tersedia</p>
        <div class="divide-y divide-gray-200 border-t border-b border-gray-200">
          <article v-for="u in units" :key="u.name" class="py-5 grid md:grid-cols-[1.5fr_1fr_1fr_100px] gap-6 items-center">
            <p class="text-base font-medium">{{ u.name }}</p>
            <p class="text-sm text-gray-600 font-mono">{{ u.area }}</p>
            <p class="text-sm font-medium">{{ u.price }}</p>
            <span class="text-[11px] px-2 py-1 rounded text-center font-medium" :class="u.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ u.status }}</span>
          </article>
        </div>
      </div>
    </section>

    <!-- Fitur -->
    <section id="fitur" class="py-20 border-t border-gray-200/60" style="background: #FAFAFA;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-blue-700 font-mono mb-8">Fitur</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="f in features" :key="f.title" class="bg-white border border-gray-200 rounded-xl p-5">
            <h3 class="text-base font-semibold mb-2">{{ f.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lokasi -->
    <section id="lokasi" class="py-20 border-t border-gray-200/60">
      <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-blue-700 font-mono mb-3">Lokasi</p>
          <h3 class="text-xl font-bold mb-3">Bandung Selatan</h3>
          <p class="text-sm text-gray-600 leading-relaxed">15 menit dari CBD. 5 menit dari gerbang tol. Jalan kaki ke stasiun kereta Cimahi.</p>
        </div>
        <div class="aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center">
          <span class="text-[10px] tracking-[0.3em] uppercase text-gray-400">Peta</span>
        </div>
      </div>
    </section>

    <!-- Kontak -->
    <section id="kontak" class="py-20 border-t border-gray-200/60 text-center">
      <h2 class="text-2xl font-bold mb-3">Daftar minat.</h2>
      <p class="text-base text-gray-600 mb-8 max-w-md mx-auto">Akses prioratif untuk yang daftar duluan. Tanpa kewajiban.</p>
      <form class="max-w-sm mx-auto px-6 space-y-3">
        <input type="text" placeholder="Nama" class="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600" />
        <input type="email" placeholder="Email" class="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600" />
        <button type="submit" class="w-full bg-blue-700 text-white py-3 rounded text-sm font-medium hover:bg-blue-800 transition-colors">Daftar</button>
      </form>
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

    <TemplateFooter brand-name="Bukit Hijau" :links="[{ label: 'Unit', href: '#unit' }, { label: 'Fitur', href: '#fitur' }, { label: 'Lokasi', href: '#lokasi' }]" accent="#1D4ED8" />
  </div>
</template>
