<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'ForumID 2026',
  htmlAttrs: { lang: 'id' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ],
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const speakers = [
  { name: 'Dwi Handayani', role: 'VP of Product', company: 'Bukalapak' },
  { name: 'Reza Rahadian', role: 'Head of Design', company: 'Traveloka' },
  { name: 'Fajar Nugraha', role: 'CEO', company: 'Sirclo' },
]

const agenda = [
  { time: '09:00', topic: 'Registrasi & Sarapan' },
  { time: '10:00', topic: 'Keynote: Produk Digital Indonesia 2026' },
  { time: '11:00', topic: 'Panel: Scale-up dari 0 ke 1 Juta User' },
  { time: '13:00', topic: 'Makan Siang & Networking' },
  { time: '14:00', topic: 'Workshop: Product Discovery yang Benar' },
  { time: '16:00', topic: 'Closing & Foto Bersama' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template ForumID. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #111827; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <nav class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b border-gray-200/60" style="background: rgba(255,255,255,0.85);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="text-sm font-bold">ForumID</span>
        <div class="hidden md:flex items-center gap-7 text-[13px] text-gray-600">
          <a href="#speaker" class="hover:text-gray-900 transition-colors">Speaker</a>
          <a href="#agenda" class="hover:text-gray-900 transition-colors">Agenda</a>
          <a href="#daftar" class="hover:text-gray-900 transition-colors">Daftar</a>
        </div>
        <a href="#daftar" class="text-[12px] px-4 py-1.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">Daftar — Rp 250.000</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <template v-if="!isLoaded">
          <div class="h-4 w-40 bg-orange-200 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-12 w-full bg-gray-200 rounded mb-4 animate-pulse" />
          <div class="h-12 w-3/4 bg-gray-200 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-5 w-full bg-gray-200 rounded mb-8 mx-auto animate-pulse" />
          <div class="flex justify-center gap-3">
            <div class="h-12 w-40 bg-orange-200 rounded-lg animate-pulse" />
            <div class="h-12 w-36 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </template>

        <template v-else>
          <p class="text-[11px] tracking-[0.3em] uppercase text-orange-600 mb-6">Konferensi Produk Digital</p>
          <h1 class="text-5xl md:text-7xl font-bold leading-[0.95] tracking-[-0.03em] mb-6 text-gray-900">
            ForumID<br /><span class="text-orange-600">2026</span>
          </h1>
          <p class="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
            Konferensi untuk product manager, designer, dan founder di Indonesia. Belajar dari mereka yang sudah scale.
          </p>

          <div class="flex items-center justify-center gap-6 text-[13px] text-gray-500 mb-10">
            <span>22 Maret 2026</span>
            <span>Jakarta Convention Center</span>
            <span>300 peserta</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#daftar" class="px-6 py-3 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
              Daftar — Rp 250.000
            </a>
            <a href="#agenda" class="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Lihat Agenda
            </a>
          </div>
        </template>
      </div>
    </section>

    <!-- Speakers -->
    <section id="speaker" class="py-24 border-t border-gray-200/60" style="background: #FAFAFA;">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.3em] uppercase text-orange-600 mb-3">Speaker</p>
        <h2 class="text-3xl font-bold mb-12 text-gray-900">Belajar dari yang sudah jalan.</h2>

        <div class="grid md:grid-cols-3 gap-6">
          <article v-for="s in speakers" :key="s.name" class="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div class="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <span class="text-[9px] text-gray-400">Foto</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ s.name }}</h3>
            <p class="text-sm text-gray-600">{{ s.role }}</p>
            <p class="text-[12px] text-orange-600 font-medium mt-1">{{ s.company }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Agenda -->
    <section id="agenda" class="py-24 border-t border-gray-200/60">
      <div class="max-w-3xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.3em] uppercase text-orange-600 mb-3">Agenda</p>
        <h2 class="text-3xl font-bold mb-12 text-gray-900">Satu hari, padat ilmu.</h2>

        <div class="space-y-0">
          <div v-for="item in agenda" :key="item.time" class="grid grid-cols-[60px_1fr] gap-6 py-4 border-b border-gray-100">
            <p class="text-[13px] text-orange-600 font-mono pt-0.5">{{ item.time }}</p>
            <p class="text-base font-medium text-gray-900">{{ item.topic }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="daftar" class="py-24 text-center border-t border-gray-200/60" style="background: #7C2D12;">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Daftar sekarang.</h2>
      <p class="text-lg opacity-90 mb-8 max-w-lg mx-auto text-white">Termasuk makan siang, kopi, dan akses recording.</p>
      <a href="#" class="inline-block px-8 py-3 bg-white text-orange-800 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
        Daftar — Rp 250.000
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

    <TemplateFooter brand-name="ForumID" :links="[{ label: 'Speaker', href: '#speaker' }, { label: 'Agenda', href: '#agenda' }, { label: 'Daftar', href: '#daftar' }]" accent="#EA580C" />
  </div>
</template>
