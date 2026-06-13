<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Sinau Koding',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 600) })

const spaces = [
  { name: '#belajar-bersama', desc: 'Tempat nanya hal dasar. Nggak ada pertanyaan bodoh.', members: 1240, posts: 34 },
  { name: '#code-review', desc: 'Upload code, dapat feedback dari senior.', members: 890, posts: 12 },
  { name: '#loker-dev', desc: 'Lowongan developer remote & onsite Indonesia.', members: 2100, posts: 8 },
  { name: '#showcase', desc: 'Pamerin project yang sudah jadi.', members: 670, posts: 5 },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template Sinau Koding. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #0A0A0A; color: #F8FAFC; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-white/5" style="background: rgba(10,10,10,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span style="font-family: 'JetBrains Mono', monospace;" class="text-sm font-bold text-purple-400">Sinau Koding</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#channel" class="hover:text-white transition-colors">Channel</a>
          <a href="#event" class="hover:text-white transition-colors">Event</a>
          <a href="#harga" class="hover:text-white transition-colors">Harga</a>
        </div>
        <a href="#join" class="text-[12px] px-4 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Gabung Komunitas</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-6 w-40 bg-purple-500/10 rounded-full mb-8 mx-auto animate-pulse" />
          <div class="h-14 w-full bg-white/10 rounded mb-4 animate-pulse" />
          <div class="h-14 w-3/4 bg-white/10 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-5 w-full bg-white/10 rounded mb-8 mx-auto animate-pulse" />
          <div class="flex justify-center gap-3">
            <div class="h-12 w-40 bg-purple-500/10 rounded-lg animate-pulse" />
            <div class="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </template>

        <template v-else>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 text-[12px] text-purple-400" style="font-family: 'JetBrains Mono', monospace;">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            3.400+ anggota aktif
          </div>

          <h1 class="text-4xl md:text-6xl font-bold leading-[0.95] tracking-[-0.03em] mb-6">
            Komunitas developer<br /><span class="text-purple-400">Indonesia.</span>
          </h1>
          <p class="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-8">
            Belajar bareng, code review, cari kerja, dan showcase project. Semua gratis.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#join" class="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
              Gabung Gratis
            </a>
            <a href="#channel" class="px-6 py-3 border border-white/20 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
              Lihat Channel
            </a>
          </div>
        </template>
      </div>
    </section>

    <!-- Channels -->
    <section id="channel" class="py-20 border-t border-white/5" style="background: #111111;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-purple-400 mb-3" style="font-family: 'JetBrains Mono', monospace;">CHANNEL</p>
        <h2 class="text-3xl font-bold mb-12">Tempat ngobrol.</h2>

        <div class="grid md:grid-cols-2 gap-4">
          <article v-for="space in spaces" :key="space.name" class="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors cursor-pointer">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-base font-semibold" style="font-family: 'JetBrains Mono', monospace;">{{ space.name }}</h3>
              <span class="text-[11px] font-mono text-white/40">{{ space.members }} anggota</span>
            </div>
            <p class="text-sm text-white/60 leading-relaxed mb-3">{{ space.desc }}</p>
            <p class="text-[11px] text-white/30">{{ space.posts }} post hari ini</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Event -->
    <section id="event" class="py-20 border-t border-white/5">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-purple-400 mb-3" style="font-family: 'JetBrains Mono', monospace;">EVENT</p>
        <h2 class="text-3xl font-bold mb-12">Minggu ini.</h2>

        <div class="space-y-4">
          <article class="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-semibold mb-1">Sharing Session: Dari Bootcamp ke Kerja</h3>
              <p class="text-sm text-white/60">Budi Santoso · Kamis 20.00 WIB · Zoom</p>
            </div>
            <button class="border border-purple-500 text-purple-400 px-4 py-1.5 rounded text-sm font-medium hover:bg-purple-500/10 transition-colors shrink-0">RSVP · 89</button>
          </article>
          <article class="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-semibold mb-1">Code Review Night</h3>
              <p class="text-sm text-white/60">Komunitas · Jumat 19.00 WIB · Discord</p>
            </div>
            <button class="border border-purple-500 text-purple-400 px-4 py-1.5 rounded text-sm font-medium hover:bg-purple-500/10 transition-colors shrink-0">RSVP · 156</button>
          </article>
        </div>
      </div>
    </section>

    <!-- Harga -->
    <section id="harga" class="py-20 border-t border-white/5" style="background: #111111;">
      <div class="max-w-3xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-purple-400 text-center mb-4" style="font-family: 'JetBrains Mono', monospace;">HARGA</p>
        <h2 class="text-3xl font-semibold text-center mb-12">Gratis untuk semua.</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <p class="text-sm text-white/60 mb-2">Gratis</p>
            <p class="text-3xl font-semibold mb-3">Rp 0</p>
            <p class="text-sm text-white/60 mb-6">Semua channel, event, dan code review.</p>
            <button class="w-full py-2 border border-white/20 rounded text-sm font-medium hover:bg-white/5 transition-colors">Gabung Gratis</button>
          </div>
          <div class="bg-white/5 border-2 border-purple-600 rounded-xl p-6 relative">
            <span class="absolute -top-2.5 left-6 px-2 py-0.5 text-[10px] bg-purple-600 text-white font-bold rounded">MENTORING</span>
            <p class="text-sm text-white/60 mb-2">Pro</p>
            <p class="text-3xl font-semibold mb-3">Rp 299.000<span class="text-sm text-white/40 font-normal">/bulan</span></p>
            <p class="text-sm text-white/60 mb-6">1-on-1 mentoring, portfolio review, job referral.</p>
            <button class="w-full py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors">Mulai Pro</button>
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

    <TemplateFooter brand-name="Sinau Koding" :links="[{ label: 'Channel', href: '#channel' }, { label: 'Event', href: '#event' }, { label: 'Harga', href: '#harga' }]" accent="#A855F7" />
  </div>
</template>
