<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Dipercaya 50.000+ Bisnis — Paper.id',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const testimonials = [
  { name: 'Andi', role: 'Pemilik toko', city: 'Surabaya', quote: 'Sejak pakai Paper.id, omzet naik 30% karena nggak ada lagi stok yang hilang.' },
  { name: 'Sari', role: 'Owner kafe', city: 'Bandung', quote: 'Awalnya ragu, sekarang nggak bisa bayangin nggak pakai. Laporan langsung jadi.' },
  { name: 'Budi', role: 'Kontraktor', city: 'Jakarta', quote: 'Invoice terkirim tepat waktu. Client bayar lebih cepat.' },
]

const stats = [
  { value: '50.000+', label: 'Bisnis aktif' },
  { value: '4.8/5', label: 'Rating Google Play' },
  { value: 'Rp 2.1T', label: 'Transaksi diproses' },
  { value: '7 hari', label: 'Support aktif' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Paper.id. Bisa jelaskan fitur dan harga?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFBEB; color: #1C1917; font-family: 'Sora', 'DM Sans', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-amber-200/60" style="background: rgba(255,251,235,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold text-amber-900">Paper.id</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-amber-800/70">
          <a href="#testimoni" class="hover:text-amber-900 transition-colors">Testimoni</a>
          <a href="#fitur" class="hover:text-amber-900 transition-colors">Fitur</a>
          <a href="#harga" class="hover:text-amber-900 transition-colors">Harga</a>
        </div>
        <a href="#daftar" class="text-[13px] px-4 py-1.5 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors">Mulai Gratis</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 pb-24">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-6 w-32 bg-amber-200 rounded-full mb-8 mx-auto animate-pulse" />
          <div class="h-16 w-full bg-amber-200 rounded mb-6 animate-pulse" />
          <div class="h-5 w-3/4 bg-amber-200 rounded mb-10 mx-auto animate-pulse" />
          <div class="flex justify-center gap-3 mb-16">
            <div class="h-12 w-40 bg-amber-200 rounded-lg animate-pulse" />
            <div class="h-12 w-36 bg-amber-200 rounded-lg animate-pulse" />
          </div>
          <div class="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div v-for="i in 4" :key="i" class="h-16 bg-amber-200 rounded-lg animate-pulse" />
          </div>
        </template>

        <template v-else>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-8 text-[12px] text-amber-800 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Baru: Integrasi QRIS
          </div>

          <h1 class="text-5xl md:text-7xl font-bold leading-[0.95] tracking-[-0.03em] mb-6 text-gray-900">
            Dipercaya <span class="text-amber-600">50.000+</span><br />bisnis di Indonesia.
          </h1>
          <p class="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
            Dari warung kopi sampai restoran chain — mereka pakai Paper.id untuk kelola bisnis setiap hari.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <a href="#daftar" class="px-6 py-3 bg-blue-800 text-white rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors">
              Mulai Gratis
            </a>
            <a href="#studi-kasus" class="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
              Lihat Studi Kasus
            </a>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="text-2xl md:text-3xl font-bold text-amber-600">{{ stat.value }}</p>
              <p class="text-[12px] text-gray-500 mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimoni" class="py-24" style="background: #FFFFFF;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[12px] text-amber-600 font-semibold tracking-wide uppercase mb-3 text-center">Testimoni</p>
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Kata mereka yang sudah pakai.</h2>

        <div class="grid md:grid-cols-3 gap-4">
          <article v-for="t in testimonials" :key="t.name" class="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p class="text-base text-gray-800 leading-relaxed mb-6 italic">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <span class="text-sm font-bold text-amber-800">{{ t.name[0] }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ t.name }}</p>
                <p class="text-[12px] text-gray-500">{{ t.role }}, {{ t.city }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="fitur" class="py-24 border-t border-amber-200/60">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[12px] text-amber-600 font-semibold tracking-wide uppercase mb-3 text-center">Fitur</p>
        <h2 class="text-3xl font-bold text-center mb-16 text-gray-900">Invoice, pembayaran, dan laporan.</h2>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-semibold mb-2 text-gray-900">Invoice otomatis</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Buat invoice dalam 30 detik. Terima pembayaran via transfer bank, QRIS, kartu kredit.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-semibold mb-2 text-gray-900">Laporan keuangan</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Profit & loss, cash flow, piutang — semua terhitung otomatis. Siap pajak.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-semibold mb-2 text-gray-900">Multi-user</h3>
            <p class="text-sm text-gray-600 leading-relaxed">Kasir, admin, owner — masing-masing punya akses sesuai perannya.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 text-center" style="background: #78350F; color: #FFFFFF;">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Bergabung dengan 50.000+ bisnis.</h2>
      <p class="text-lg opacity-90 mb-8 max-w-lg mx-auto">Gratis selamanya untuk bisnis kecil. Upgrade kapan saja.</p>
      <a href="#daftar" class="inline-block px-8 py-3 bg-white text-amber-900 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
        Mulai Gratis
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

    <TemplateFooter brand-name="Paper.id" :links="[{ label: 'Testimoni', href: '#testimoni' }, { label: 'Fitur', href: '#fitur' }, { label: 'Harga', href: '#harga' }]" accent="#F59E0B" />
  </div>
</template>
