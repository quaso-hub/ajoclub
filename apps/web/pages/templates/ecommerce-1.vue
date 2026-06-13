<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Erigo Store',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const products = [
  { name: 'Kaos Oversize — Hitam', price: 'Rp 189.000', desc: '100% cotton combed 30s, sablon DTG.' },
  { name: 'Hoodie — Navy', price: 'Rp 349.000', desc: 'Fleece 380gsm, embroidered logo.' },
  { name: 'Tote Bag — Natural', price: 'Rp 89.000', desc: 'Canvas 12oz, screen printed.' },
  { name: 'Cap — Black', price: 'Rp 129.000', desc: 'Adjustable, embroidered.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Erigo Store. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #111827; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(255,255,255,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-extrabold">ERIGO</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#produk" class="hover:text-gray-900 transition-colors">Produk</a>
          <a href="#tentang" class="hover:text-gray-900 transition-colors">Tentang</a>
          <a href="#kontak" class="hover:text-gray-900 transition-colors">Kontak</a>
        </div>
        <a href="#keranjang" class="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">Keranjang (0)</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-14">
      <div class="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <template v-if="!isLoaded">
              <div class="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
              <div class="h-12 w-full bg-gray-200 rounded mb-4 animate-pulse" />
              <div class="h-12 w-3/4 bg-gray-200 rounded mb-8 animate-pulse" />
              <div class="h-5 w-full bg-gray-200 rounded mb-2 animate-pulse" />
              <div class="h-5 w-2/3 bg-gray-200 rounded mb-8 animate-pulse" />
              <div class="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
            </template>

            <template v-else>
              <p class="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-4">Koleksi Terbaru</p>
              <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Streetwear lokal,<br />kualitas internasional.</h1>
              <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                Dari Bandung untuk Indonesia. Kaos, hoodie, dan aksesoris — semua desain sendiri, produksi sendiri.
              </p>
              <a href="#produk" class="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                Lihat Koleksi
              </a>
            </template>
          </div>
          <div class="aspect-square rounded-2xl" style="background: linear-gradient(135deg, #111827, #374151);">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-[10px] tracking-[0.3em] uppercase text-white/30">Foto produk</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Produk -->
    <section id="produk" class="py-16 border-t border-gray-200/60">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-8">Produk</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <article v-for="p in products" :key="p.name" class="group cursor-pointer">
            <div class="aspect-[3/4] rounded-xl mb-3 bg-gray-100">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-gray-400">Foto</span>
              </div>
            </div>
            <h3 class="text-sm font-semibold mb-1 group-hover:text-gray-600 transition-colors">{{ p.name }}</h3>
            <p class="text-[12px] text-gray-500 mb-1">{{ p.desc }}</p>
            <p class="text-sm font-bold">{{ p.price }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Tentang -->
    <section id="tentang" class="py-20 border-t border-gray-200/60" style="background: #FAFAFA;">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <p class="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-6">Tentang Erigo</p>
        <p class="text-lg text-gray-700 leading-relaxed">
          Erigo dimulai dari garasi di Bandung tahun 2015. Sekarang kami produksi 50.000+ item per bulan, kirim ke seluruh Indonesia, dan masih desain sendiri setiap piece.
        </p>
      </div>
    </section>

    <!-- Pengiriman -->
    <section class="py-12 border-t border-gray-200/60">
      <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><p class="text-sm font-semibold">Gratis Ongkir</p><p class="text-[12px] text-gray-500 mt-1">Min. belanja Rp 200.000</p></div>
        <div><p class="text-sm font-semibold">Bayar di Tempat</p><p class="text-[12px] text-gray-500 mt-1">COD tersedia</p></div>
        <div><p class="text-sm font-semibold">Pengiriman 1-3 Hari</p><p class="text-[12px] text-gray-500 mt-1">Via JNE/POS</p></div>
        <div><p class="text-sm font-semibold">Garansi 30 Hari</p><p class="text-[12px] text-gray-500 mt-1">Tukar jika tidak cocok</p></div>
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

    <TemplateFooter brand-name="ERIGO" :links="[{ label: 'Produk', href: '#produk' }, { label: 'Tentang', href: '#tentang' }, { label: 'Kontak', href: '#kontak' }]" accent="#111827" />
  </div>
</template>
