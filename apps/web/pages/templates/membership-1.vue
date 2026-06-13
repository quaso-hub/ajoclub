<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Catatan Harian',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Literata:wght@400;500;700&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const posts = [
  { title: 'Kenapa UMKM butuh website sendiri', excerpt: 'Marketplace bagus untuk exposure, tapi nggak punya data pelanggan. Website sendiri = data sendiri.', date: '3 hari lalu', read: '5 menit', paid: false },
  { title: 'Cara bikin landing page yang konversi', excerpt: 'Bukan soal cantik. Bukan soal 3D. Soal: apakah visitor tahu harus ngapain dalam 3 detik?', date: '1 minggu lalu', read: '8 menit', paid: true },
  { title: 'Review 5 website UMKM terbaik bulan ini', excerpt: 'Setiap bulan saya pilih 5 website UMKM Indonesia yang layak dijadikan referensi.', date: '2 minggu lalu', read: '6 menit', paid: false },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Catatan Harian. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #1C1917; font-family: 'Literata', Georgia, serif;">
    <TemplateBack />

    <nav class="border-b border-gray-200/60">
      <div class="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <span style="font-family: 'Literata', serif;" class="text-xl font-bold">Catatan Harian</span>
        <div class="flex items-center gap-5 text-sm" style="font-family: 'Inter', sans-serif;">
          <a href="#artikel" class="text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline">Artikel</a>
          <a href="#tentang" class="text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline">Tentang</a>
          <a href="#langganan" class="bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-orange-700 transition-colors" style="font-family: 'Inter', sans-serif;">Langganan</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="py-20 md:py-32">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-4 w-32 bg-orange-200 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-12 w-full bg-gray-200 rounded mb-4 animate-pulse" />
          <div class="h-5 w-3/4 bg-gray-200 rounded mb-4 mx-auto animate-pulse" />
          <div class="h-4 w-1/2 bg-gray-200 rounded mb-8 mx-auto animate-pulse" />
          <div class="flex gap-2 max-w-md mx-auto">
            <div class="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            <div class="h-10 w-24 bg-orange-200 rounded animate-pulse" />
          </div>
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.2em] uppercase text-orange-600 mb-6" style="font-family: 'Inter', sans-serif;">Oleh Dita Permata</p>
          <h1 class="text-4xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em] mb-6">Catatan Harian</h1>
          <p class="text-xl text-gray-600 leading-[1.6] max-w-xl mx-auto mb-2 italic">
            Tentang bikin website, kelola bisnis online, dan hal-hal yang saya pelajari dari 5 tahun freelance.
          </p>
          <p class="text-[13px] text-gray-500 mt-8" style="font-family: 'Inter', sans-serif;">2.400 pembaca · Setiap Selasa & Kamis</p>
          <form class="mt-10 max-w-md mx-auto flex flex-col sm:flex-row gap-2" style="font-family: 'Inter', sans-serif;">
            <input type="email" placeholder="email@kamu.com" class="flex-1 px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500" />
            <button type="submit" class="bg-orange-600 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-orange-700 transition-colors">Langganan</button>
          </form>
          <p class="text-[11px] text-gray-400 mt-3" style="font-family: 'Inter', sans-serif;">Gratis. Nggak spam. Unsubscribe kapan saja.</p>
        </template>
      </div>
    </section>

    <!-- Tentang -->
    <section id="tentang" class="py-20 border-t border-gray-200/60">
      <div class="max-w-2xl mx-auto px-6 grid md:grid-cols-[100px_1fr] gap-6 items-start">
        <div class="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <span class="text-[10px] text-orange-600" style="font-family: 'Inter', sans-serif;">Foto</span>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-2" style="font-family: 'Inter', sans-serif;">Tentang penulis</p>
          <p class="text-lg leading-[1.7]">
            Dita Permata. Freelance web designer dari Bandung. Sudah bikin 40+ website untuk UMKM di Indonesia. Saya tulis tentang apa yang saya pelajari dari klien, dari kesalahan, dan dari komunitas.
          </p>
        </div>
      </div>
    </section>

    <!-- Artikel -->
    <section id="artikel" class="py-20 border-t border-gray-200/60" style="background: #FAFAFA;">
      <div class="max-w-2xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-orange-600 mb-3" style="font-family: 'Inter', sans-serif;">Artikel Terbaru</p>
        <h2 class="text-2xl md:text-3xl font-bold mb-12">Yang baru ditulis.</h2>
        <div class="divide-y divide-gray-200">
          <article v-for="post in posts" :key="post.title" class="py-6 group cursor-pointer">
            <div class="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-gray-500 mb-2" style="font-family: 'Inter', sans-serif;">
              <span>{{ post.date }}</span><span>·</span><span>{{ post.read }}</span>
              <span v-if="post.paid" class="text-orange-600">· Premium</span>
            </div>
            <h3 class="text-xl md:text-2xl font-bold leading-[1.2] mb-2 group-hover:text-orange-600 transition-colors">{{ post.title }}</h3>
            <p class="text-base text-gray-600 leading-[1.6]">{{ post.excerpt }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Langganan -->
    <section id="langganan" class="py-20 border-t border-gray-200/60 text-center" style="background: #1C1917; color: #FFFFFF;">
      <p class="text-[11px] tracking-[0.2em] uppercase text-orange-400 mb-3" style="font-family: 'Inter', sans-serif;">Langganan</p>
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Dua email seminggu. Worth it.</h2>
      <p class="text-base text-white/60 mb-8 max-w-md mx-auto">Tips praktis soal website dan bisnis online. Langsung dari pengalaman.</p>
      <form class="max-w-md mx-auto flex flex-col sm:flex-row gap-2 px-6" style="font-family: 'Inter', sans-serif;">
        <input type="email" placeholder="email@kamu.com" class="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500" />
        <button type="submit" class="bg-orange-600 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-orange-700 transition-colors">Langganan</button>
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

    <TemplateFooter brand-name="Catatan Harian" :links="[{ label: 'Artikel', href: '#artikel' }, { label: 'Tentang', href: '#tentang' }, { label: 'Langganan', href: '#langganan' }]" accent="#EA580C" />
  </div>
</template>
