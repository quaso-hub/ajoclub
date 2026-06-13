<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Warung Nasi Berkah',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const menuItems = [
  { name: 'Nasi Goreng Spesial', desc: 'Nasi goreng dengan telur mata sapi, ayam suwir, dan kerupuk. Porsi besar.', price: 'Rp 22.000' },
  { name: 'Sate Ayam Madura (10 tusuk)', desc: 'Sate ayam bumbu kacang khas Madura, lontong, dan acar.', price: 'Rp 28.000' },
  { name: 'Rendang Daging Sapi', desc: 'Rendang empuk dimasak 4 jam dengan bumbu rempah asli Padang.', price: 'Rp 38.000' },
  { name: 'Es Teh Manis', desc: 'Teh manis dingin, segar buat temen makan.', price: 'Rp 5.000' },
]

const paketHemat = [
  { name: 'Paket A', items: 'Nasi + 2 lauk + es teh', price: 'Rp 25.000' },
  { name: 'Paket B', items: 'Nasi + 3 lauk + es teh + kerupuk', price: 'Rp 32.000' },
  { name: 'Paket Keluarga', items: '4 nasi + 6 lauk + 4 es teh', price: 'Rp 99.000' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Warung Nasi Berkah. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFBEB; color: #1C1917; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <!-- Hero -->
    <section class="relative min-h-[70vh] flex items-end overflow-hidden">
      <div class="absolute inset-0" style="background: linear-gradient(180deg, #D97706 0%, #78350F 100%);">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[11px] tracking-[0.3em] uppercase text-white/40">Foto nasi goreng dari atas</span>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#FFFBEB] via-transparent to-transparent" />

      <div class="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full">
        <div class="max-w-lg">
          <template v-if="!isLoaded">
            <div class="h-12 w-3/4 bg-white/20 rounded mb-4 animate-pulse" />
            <div class="h-5 w-1/2 bg-white/20 rounded mb-4 animate-pulse" />
            <div class="h-4 w-2/3 bg-white/20 rounded mb-6 animate-pulse" />
            <div class="flex gap-3">
              <div class="h-10 w-40 bg-white/20 rounded-lg animate-pulse" />
              <div class="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </template>

          <template v-else>
            <h1 style="font-family: 'Playfair Display', serif;" class="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
              Warung Nasi Berkah
            </h1>
            <p class="text-lg text-white/80 mb-4">Masakan rumahan, harga warung.</p>
            <p class="text-sm text-white/60 mb-6">Nasi hangat, lauk lengkap, perut kenyang.</p>
            <div class="flex flex-wrap gap-3">
              <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="px-5 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
                Pesan via WhatsApp
              </a>
              <a href="#menu" class="px-5 py-2.5 border border-white/30 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                Lihat Menu
              </a>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Info bar -->
    <section class="py-6 border-b border-amber-200/60" style="background: #FFFBEB;">
      <div class="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-amber-900/70">
        <span class="flex items-center gap-2">Jl. Cihampelas No. 6, Bandung</span>
        <span class="flex items-center gap-2">Buka setiap hari, 07.00 — 22.00</span>
        <span class="flex items-center gap-2">0851-8862-7365</span>
      </div>
    </section>

    <!-- Menu -->
    <section id="menu" class="py-20">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[12px] text-amber-700 font-semibold tracking-wide uppercase mb-3">Menu Hari Ini</p>
        <h2 style="font-family: 'Playfair Display', serif;" class="text-3xl md:text-4xl font-bold mb-12 text-gray-900">Apa yang hari ini.</h2>

        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="item in menuItems" :key="item.name" class="bg-white border border-amber-200 rounded-xl p-5 hover:border-amber-300 transition-colors cursor-pointer group">
            <div class="flex items-start justify-between gap-4 mb-2">
              <h3 style="font-family: 'Playfair Display', serif;" class="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{{ item.name }}</h3>
              <span class="text-base font-bold text-amber-700 shrink-0">{{ item.price }}</span>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Paket Hemat -->
    <section class="py-20 border-t border-amber-200/60" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[12px] text-amber-700 font-semibold tracking-wide uppercase mb-3">Paket Hemat</p>
        <h2 style="font-family: 'Playfair Display', serif;" class="text-3xl font-bold mb-12 text-gray-900">Makan hemat, kenyang maksimal.</h2>

        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="p in paketHemat" :key="p.name" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <h3 class="text-lg font-bold text-amber-800 mb-2">{{ p.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ p.items }}</p>
            <p class="text-2xl font-bold text-amber-700">{{ p.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lokasi -->
    <section class="py-20 border-t border-amber-200/60">
      <div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-[12px] text-amber-700 font-semibold tracking-wide uppercase mb-3">Lokasi</p>
          <h3 style="font-family: 'Playfair Display', serif;" class="text-2xl font-bold mb-3 text-gray-900">Jl. Cihampelas No. 6</h3>
          <p class="text-sm text-gray-600 leading-relaxed mb-4">Bandung, Jawa Barat 40131<br />Dekat Cihampelas Walk, sebrang Indomaret.</p>
          <p class="text-sm text-gray-600"><strong>Jam Buka:</strong> Setiap hari, 07.00 — 22.00</p>
        </div>
        <div class="aspect-[4/3] rounded-xl bg-amber-100 flex items-center justify-center">
          <span class="text-[11px] text-amber-600">Google Maps embed</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 text-center" style="background: #78350F; color: #FFFBEB;">
      <h2 style="font-family: 'Playfair Display', serif;" class="text-3xl md:text-4xl font-bold mb-4">Laper? Langsung aja.</h2>
      <p class="text-lg opacity-90 mb-8 max-w-lg mx-auto">Pesan via WhatsApp, langsung diantar. Atau mampir ke warung.</p>
      <a href="https://wa.me/6285188627365" target="_blank" rel="noopener" class="inline-block px-8 py-3 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors">
        Pesan via WhatsApp
      </a>
    </section>

    <!-- FAB -->
    <div class="fixed bottom-5 right-5 z-50">
      <Transition enter-active-class="transition-all duration-300 ease-out" leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4 scale-95" leave-to-class="opacity-0 translate-y-4 scale-95">
        <div v-if="fabOpen" class="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          <p class="text-sm font-semibold text-gray-900 mb-2">Pesan makanan?</p>
          <p class="text-xs text-gray-500 mb-3">Chat langsung untuk pesan atau reservasi.</p>
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

    <TemplateFooter brand-name="Warung Nasi Berkah" :links="[{ label: 'Menu', href: '#menu' }, { label: 'Lokasi', href: '#lokasi' }]" accent="#D97706" />
  </div>
</template>
