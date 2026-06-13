<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Bazaar Indonesia',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const products = [
  { name: 'Keramik tangan — Cirebon', maker: 'Tanah Liat Studio', price: 'Rp 85.000' },
  { name: 'Lilin soya — Kopi', maker: 'Api Kecil', price: 'Rp 65.000' },
  { name: 'Tas tote — Canvas', maker: 'Kain & Co', price: 'Rp 55.000' },
  { name: 'Notebook — Linen', maker: 'Buku Tangan', price: 'Rp 45.000' },
  { name: 'Sabun — Oat', maker: 'Sabun Desa', price: 'Rp 25.000' },
  { name: 'Gantungan kunci — Tembaga', maker: 'Logam Studio', price: 'Rp 35.000' },
]
const categories = ['Semua', 'Rumah', 'Dapur', 'Pribadi', 'Alat Tulis']

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Bazaar. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FAFAFA; color: #111827; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(250,250,250,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-orange-600">Bazaar</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#produk" class="hover:text-gray-900 transition-colors">Produk</a>
          <a href="#pembuat" class="hover:text-gray-900 transition-colors">Pembuat</a>
          <a href="#tentang" class="hover:text-gray-900 transition-colors">Tentang</a>
        </div>
        <div class="flex items-center gap-4">
          <a href="#cari" class="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">Cari</a>
          <a href="#keranjang" class="text-[13px] text-gray-600 hover:text-gray-900 transition-colors">Keranjang (0)</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-14">
      <div class="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <template v-if="!isLoaded">
          <div class="h-4 w-48 bg-orange-200 rounded mb-3 animate-pulse" />
          <div class="h-10 w-3/4 bg-gray-200 rounded mb-3 animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded animate-pulse" />
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.2em] uppercase text-orange-600 mb-3">Temukan pembuat independen Indonesia</p>
          <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-3">Buat tangan, dari 38 kota.</h1>
          <p class="text-base text-gray-600 max-w-xl">2.400+ produk dari pembuat lokal. Setiap item punya cerita.</p>
        </template>
      </div>
    </section>

    <!-- Filter -->
    <section id="produk" class="py-6 border-t border-gray-200/60">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-wrap gap-2 mb-6">
          <button v-for="cat in categories" :key="cat" class="px-3 py-1.5 text-[12px] tracking-[0.1em] uppercase border border-gray-300 rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">
            {{ cat }}
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <article v-for="p in products" :key="p.name" class="group cursor-pointer">
            <div class="aspect-[3/4] rounded-xl mb-3 bg-gray-100">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-[9px] tracking-[0.2em] uppercase text-gray-400">Foto</span>
              </div>
            </div>
            <p class="text-[11px] text-gray-500 mb-1">{{ p.maker }}</p>
            <h3 class="text-sm font-medium mb-1 group-hover:text-orange-600 transition-colors">{{ p.name }}</h3>
            <p class="text-sm font-bold">{{ p.price }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Pembuat -->
    <section id="pembuat" class="py-16 border-t border-gray-200/60" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <p class="text-[11px] tracking-[0.2em] uppercase text-orange-600 mb-3">Pembuat</p>
        <h2 class="text-3xl font-bold mb-4">Kenal dengan yang bikin.</h2>
        <p class="text-base text-gray-600 max-w-lg mx-auto mb-8">Setiap produk di Bazaar dibuat oleh orang asli. Kami kunjungi setiap pembuat sebelum listing.</p>
        <a href="#" class="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">Lihat Semua Pembuat</a>
      </div>
    </section>

    <!-- Tentang -->
    <section id="tentang" class="py-16 border-t border-gray-200/60">
      <div class="max-w-2xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-orange-600 mb-6">Tentang Bazaar</p>
        <p class="text-lg text-gray-700 leading-relaxed">
          Bazaar adalah marketplace untuk barang buatan tangan. Dimulai 2023 dengan 12 pembuat di Bandung. Sekarang 340 pembuat di 38 kota. Setiap produk dibuat tangan, dikirim oleh pembuatnya, dan dijamin kualitasnya.
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

    <TemplateFooter brand-name="Bazaar" :links="[{ label: 'Produk', href: '#produk' }, { label: 'Pembuat', href: '#pembuat' }, { label: 'Tentang', href: '#tentang' }]" accent="#EA580C" />
  </div>
</template>
