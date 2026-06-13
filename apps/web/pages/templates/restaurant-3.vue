<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Rumah Makan Sunda Asri',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const menuCategories = [
  {
    name: 'Nasi & Lauk',
    items: [
      { name: 'Nasi Timbel Komplit', desc: 'Nasi timbel, ayam goreng, tahu, tempe, sambal, lalapan.', price: 'Rp 35.000' },
      { name: 'Gurame Bakar Madu', desc: 'Gurame bakar dengan bumbu madu, porsi besar.', price: 'Rp 65.000' },
      { name: 'Sayur Asem', desc: 'Sayur asem segar khas Sunda.', price: 'Rp 18.000' },
    ],
  },
  {
    name: 'Paket Keluarga',
    items: [
      { name: 'Paket Keluarga A (4 orang)', desc: '4 nasi, ayam goreng, ikan bakar, sayur asem, sambal, lalapan, 4 es teh.', price: 'Rp 149.000' },
      { name: 'Paket Keluarga B (6 orang)', desc: '6 nasi, ayam goreng, gurame bakar, sayur asem, karedok, sambal, 6 es teh.', price: 'Rp 219.000' },
    ],
  },
  {
    name: 'Menu Anak',
    items: [
      { name: 'Nasi Goreng Mini', desc: 'Nasi goreng porsi anak, dengan sosis dan telur.', price: 'Rp 18.000' },
      { name: 'Mie Goreng', desc: 'Mie goreng dengan sayuran dan telur.', price: 'Rp 16.000' },
    ],
  },
]

const activeCategory = ref(0)
const currentItems = computed(() => menuCategories[activeCategory.value].items)

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Rumah Makan Sunda Asri. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FEFCE8; color: #1C1917; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-green-200/60" style="background: rgba(254,252,232,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'Libre Baskerville', serif;" class="text-sm font-bold text-green-900">Sunda Asri</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-green-800/70">
          <a href="#menu" class="hover:text-green-900 transition-colors">Menu</a>
          <a href="#paket" class="hover:text-green-900 transition-colors">Paket</a>
          <a href="#lokasi" class="hover:text-green-900 transition-colors">Lokasi</a>
        </div>
        <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="text-[13px] px-4 py-1.5 bg-green-800 text-white rounded-lg font-medium hover:bg-green-900 transition-colors">Booking Meja</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 pb-16">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <template v-if="!isLoaded">
              <div class="h-4 w-32 bg-green-200 rounded mb-4 animate-pulse" />
              <div class="h-12 w-full bg-green-200 rounded mb-4 animate-pulse" />
              <div class="h-5 w-3/4 bg-green-200 rounded mb-8 animate-pulse" />
              <div class="flex gap-3">
                <div class="h-10 w-40 bg-green-200 rounded-lg animate-pulse" />
                <div class="h-10 w-32 bg-green-200 rounded-lg animate-pulse" />
              </div>
            </template>

            <template v-else>
              <p class="text-[11px] tracking-[0.2em] uppercase text-green-700 mb-4">Rumah Makan Sunda · Bandung</p>
              <h1 style="font-family: 'Libre Baskerville', serif;" class="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
                Masakan Sunda,<br />seperti di rumah.
              </h1>
              <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                Nasi timbel, gurame bakar, sayur asem — semua dimasak fresh setiap hari. Cocok buat makan bareng keluarga.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="px-5 py-2.5 bg-green-800 text-white rounded-lg text-sm font-semibold hover:bg-green-900 transition-colors text-center">
                  Booking Meja
                </a>
                <a href="#menu" class="px-5 py-2.5 border border-green-800/30 rounded-lg text-sm font-medium text-green-800 hover:bg-green-50 transition-colors text-center">
                  Lihat Menu
                </a>
              </div>
            </template>
          </div>
          <div class="aspect-[4/3] rounded-2xl" style="background: linear-gradient(135deg, #166534, #854D0E);">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-[10px] tracking-[0.3em] uppercase text-white/30">Foto nasi timbel</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info bar -->
    <section class="py-5 border-y border-green-200/60" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-green-800/70">
        <span>Jl. Raya Lembang No. 12, Bandung</span>
        <span>Buka setiap hari, 10.00 — 21.00</span>
        <span>Parkir luas, muat 20 mobil</span>
      </div>
    </section>

    <!-- Menu -->
    <section id="menu" class="py-20">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-green-700 mb-3">Menu</p>
        <h2 style="font-family: 'Libre Baskerville', serif;" class="text-3xl font-bold mb-10 text-gray-900">Menu hari ini.</h2>

        <div class="flex flex-wrap gap-2 mb-8">
          <button v-for="(cat, i) in menuCategories" :key="cat.name" @click="activeCategory = i"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeCategory === i ? 'bg-green-800 text-white' : 'bg-white border border-green-200 text-green-800 hover:bg-green-50'">
            {{ cat.name }}
          </button>
        </div>

        <div class="divide-y divide-green-100 border-t border-b border-green-100">
          <div v-for="item in currentItems" :key="item.name" class="py-5 grid grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <h3 class="text-base font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
              <p class="text-sm text-gray-600">{{ item.desc }}</p>
            </div>
            <span class="text-base font-bold text-green-800 shrink-0">{{ item.price }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Fasilitas -->
    <section class="py-16 border-t border-green-200/60" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-green-700 mb-3">Fasilitas</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-sm font-semibold text-green-900">Parkir Luas</p>
            <p class="text-[12px] text-green-700 mt-1">20 mobil, 50 motor</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-sm font-semibold text-green-900">Ruang VIP</p>
            <p class="text-[12px] text-green-700 mt-1">Untuk 20 orang</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-sm font-semibold text-green-900">Kids Area</p>
            <p class="text-[12px] text-green-700 mt-1">Aman buat anak</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-sm font-semibold text-green-900">WiFi</p>
            <p class="text-[12px] text-green-700 mt-1">Gratis</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lokasi -->
    <section id="lokasi" class="py-20 border-t border-green-200/60">
      <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-green-700 mb-3">Lokasi</p>
          <h3 style="font-family: 'Libre Baskerville', serif;" class="text-2xl font-bold mb-3 text-gray-900">Jl. Raya Lembang No. 12</h3>
          <p class="text-sm text-gray-600 leading-relaxed mb-4">Lembang, Bandung, Jawa Barat 40391<br />Dekat Farmhouse Lembang.</p>
          <p class="text-sm text-gray-600"><strong>Jam:</strong> Setiap hari, 10.00 — 21.00</p>
          <p class="text-sm text-gray-600 mt-2"><strong>Telepon:</strong> 0851-8862-7365</p>
        </div>
        <div class="aspect-[4/3] rounded-xl bg-green-100 flex items-center justify-center">
          <span class="text-[11px] text-green-600">Google Maps embed</span>
        </div>
      </div>
    </section>

    <!-- FAB -->
    <div class="fixed bottom-5 right-5 z-50">
      <Transition enter-active-class="transition-all duration-300 ease-out" leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4 scale-95" leave-to-class="opacity-0 translate-y-4 scale-95">
        <div v-if="fabOpen" class="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          <p class="text-sm font-semibold text-gray-900 mb-2">Booking meja?</p>
          <p class="text-xs text-gray-500 mb-3">Chat langsung untuk reservasi atau tanya menu.</p>
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

    <TemplateFooter brand-name="Sunda Asri" :links="[{ label: 'Menu', href: '#menu' }, { label: 'Paket', href: '#paket' }, { label: 'Lokasi', href: '#lokasi' }]" accent="#166534" />
  </div>
</template>
