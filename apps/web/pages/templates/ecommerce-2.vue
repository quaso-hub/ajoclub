<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'SOMETHINC',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const products = [
  { name: 'Serum Niacinamide 10%', price: 'Rp 89.000', desc: 'Mencerahkan, mengecilkan pori. 30ml.' },
  { name: 'Moisturizer Ceramide', price: 'Rp 119.000', desc: 'Barrier repair. 50ml.' },
  { name: 'Sunscreen SPF 50+', price: 'Rp 79.000', desc: 'Tidak whitecast. 50ml.' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template SOMETHINC. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #F5F2EC; color: #1C1917; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(245,242,236,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-emerald-800">SOMETHINC</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#produk" class="hover:text-gray-900 transition-colors">Produk</a>
          <a href="#nilai" class="hover:text-gray-900 transition-colors">Nilai Kami</a>
          <a href="#cerita" class="hover:text-gray-900 transition-colors">Cerita</a>
        </div>
        <a href="#keranjang" class="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">Keranjang (0)</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 pb-16">
      <div class="max-w-4xl mx-auto px-6 text-center pt-12">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-emerald-200 rounded mb-4 mx-auto animate-pulse" />
          <div class="h-12 w-full bg-gray-200 rounded mb-4 animate-pulse" />
          <div class="h-5 w-3/4 bg-gray-200 rounded mb-8 mx-auto animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-700 mb-4">Skincare Indonesia</p>
          <h1 class="text-4xl md:text-6xl font-bold leading-[1.05] mb-6">Skincare yang jujur.</h1>
          <p class="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Bahan terbuka, harga transparan, hasil terbukti. Dari laboratorium kami langsung ke tangan kamu.
          </p>
        </template>
      </div>
    </section>

    <!-- Produk -->
    <section id="produk" class="py-16 border-t border-gray-200/60" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-700 mb-8 text-center">Bestseller</p>
        <div class="grid md:grid-cols-3 gap-4">
          <article v-for="p in products" :key="p.name" class="group cursor-pointer text-center">
            <div class="aspect-[3/4] rounded-xl mb-4 bg-gray-100">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-gray-400">Foto produk</span>
              </div>
            </div>
            <h3 class="text-base font-semibold mb-1 group-hover:text-emerald-700 transition-colors">{{ p.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ p.desc }}</p>
            <p class="text-lg font-bold text-emerald-800">{{ p.price }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Nilai -->
    <section id="nilai" class="py-20 border-t border-gray-200/60">
      <div class="max-w-4xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-700 mb-3 text-center">Nilai Kami</p>
        <h2 class="text-3xl font-bold text-center mb-12">Kenapa beda.</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Bahan Terbuka</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Setiap bahan dicantumkan lengkap. Nggak ada "proprietary blend."</p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Harga Transparan</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Nggak ada markup 10x. Harga = biaya produksi + margin wajar.</p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Uji Klinis</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Setiap produk diuji di lab independen. Hasilnya dipublish.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cerita -->
    <section id="cerita" class="py-20 border-t border-gray-200/60" style="background: #FFFFFF;">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-700 mb-6">Cerita Kami</p>
        <p class="text-lg text-gray-700 leading-relaxed">
          SOMETHINC dimulai tahun 2019 dari pertanyaan sederhana: kenapa skincare harus mahal? Kami buktikan bahwa bahan bagus nggak harus mahal. Sekarang 2 juta+ produk terjual, dari Jakarta ke seluruh Indonesia.
        </p>
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

    <TemplateFooter brand-name="SOMETHINC" :links="[{ label: 'Produk', href: '#produk' }, { label: 'Nilai', href: '#nilai' }, { label: 'Cerita', href: '#cerita' }]" accent="#166534" />
  </div>
</template>
