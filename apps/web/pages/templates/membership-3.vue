<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Raka Writes',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const posts = [
  { title: 'Minggu ke-12: akhirnya profitable', excerpt: 'Revenue pertama dari SaaS yang saya bikin sendiri. Bukan banyak, tapi proof of concept.', date: '3 hari lalu', read: '4 menit' },
  { title: 'Kenapa saya pilih Nuxt, bukan Next', excerpt: 'Bukan soal mana yang lebih bagus. Soal mana yang lebih cocok untuk tim 1 orang.', date: '1 minggu lalu', read: '7 menit' },
  { title: 'Gagal pertama: bikin produk yang nggak ada yang mau', excerpt: '6 bulan bikin, 0 user. Ini ceritanya.', date: '2 minggu lalu', read: '10 menit' },
]
const supporters = ['Andi S.', 'Rina W.', 'Budi P.', 'Dita K.', 'Fajar N.', 'Lina M.']

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Raka Writes. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0A0A0A; color: #FFFFFF; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="border-b border-white/10">
      <div class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-semibold">Raka Writes</span>
        <div class="flex items-center gap-4 text-[13px] text-white/60">
          <a href="#tulisan" class="hover:text-white transition-colors hidden sm:inline">Tulisan</a>
          <a href="#dukung" class="hover:text-white transition-colors hidden sm:inline">Dukung</a>
          <a href="#dukung" class="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">Dukung Saya</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="py-20 md:py-32">
      <div class="max-w-2xl mx-auto px-6">
        <template v-if="!isLoaded">
          <div class="flex items-center gap-5 mb-10">
            <div class="w-20 h-20 rounded-full bg-red-500/10 animate-pulse" />
            <div class="flex-1">
              <div class="h-8 w-48 bg-white/10 rounded mb-2 animate-pulse" />
              <div class="h-4 w-36 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div class="h-5 w-full bg-white/10 rounded mb-2 animate-pulse" />
          <div class="h-5 w-3/4 bg-white/10 rounded mb-8 animate-pulse" />
          <div class="flex gap-6">
            <div class="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div class="h-4 w-20 bg-white/10 rounded animate-pulse" />
            <div class="h-4 w-28 bg-white/10 rounded animate-pulse" />
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-5 mb-10">
            <div class="w-20 h-20 rounded-full flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, #EF4444, #F97316);">
              <span class="text-[9px] text-white/70">Avatar</span>
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-semibold leading-tight mb-2">Raka Pratama</h1>
              <p class="text-base text-white/60">Bangun SaaS sendiri dari Bandung.</p>
            </div>
          </div>
          <p class="text-lg text-white/70 leading-[1.7] mb-8">
            Saya tulis tentang bikin produk digital sendiri. Menang, kalah, dan yang di antaranya. Tiga post seminggu.
          </p>
          <div class="flex items-center gap-6 text-sm text-white/50">
            <span>247 dukungan</span><span>·</span><span>89 tulisan</span><span>·</span><span>Sejak Januari 2025</span>
          </div>
        </template>
      </div>
    </section>

    <!-- Tulisan -->
    <section id="tulisan" class="py-16 border-t border-white/10">
      <div class="max-w-2xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-red-400 mb-8">Tulisan Terbaru</p>
        <div class="space-y-8">
          <article v-for="post in posts" :key="post.title" class="group cursor-pointer">
            <div class="flex items-center gap-3 text-[11px] text-white/40 mb-2">
              <span>{{ post.date }}</span><span>·</span><span>{{ post.read }}</span>
            </div>
            <h3 class="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">{{ post.title }}</h3>
            <p class="text-base text-white/60 leading-relaxed">{{ post.excerpt }}</p>
          </article>
        </div>
        <button class="w-full mt-10 py-3 border border-white/15 rounded-lg text-sm text-white/70 hover:bg-white/5 transition-colors">Load more</button>
      </div>
    </section>

    <!-- Dukung -->
    <section id="dukung" class="py-20 border-t border-white/10" style="background: #111111;">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <p class="text-[11px] tracking-[0.2em] uppercase text-red-400 mb-6">Dukung</p>
        <h2 class="text-3xl md:text-4xl font-semibold mb-4">Traktir kopi.</h2>
        <p class="text-base text-white/60 mb-8">Setiap kopi bikin saya bisa nulis satu post lagi.</p>
        <div class="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button class="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">1 kopi — Rp 25.000</button>
          <button class="px-5 py-2.5 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition-colors">5 kopi — Rp 125.000</button>
          <button class="px-5 py-2.5 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition-colors">10 kopi — Rp 250.000</button>
        </div>
        <div>
          <p class="text-[11px] text-white/40 mb-3">Dukungan terbaru</p>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <span v-for="s in supporters" :key="s" class="px-3 py-1 bg-white/5 rounded-full text-[11px] text-white/60">{{ s }}</span>
          </div>
        </div>
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

    <TemplateFooter brand-name="Raka Writes" :links="[{ label: 'Tulisan', href: '#tulisan' }, { label: 'Dukung', href: '#dukung' }]" accent="#EF4444" />
  </div>
</template>
