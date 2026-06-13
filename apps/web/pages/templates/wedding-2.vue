<script setup lang="ts">
definePageMeta({ layout: false })
useHead({
  title: 'Dita & Budi',
  htmlAttrs: { lang: 'id' },
})

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 500) })

const events = [
  { time: '09:00', label: 'Akad Nikah', location: 'KUA Kecamatan Cibeunying, Bandung' },
  { time: '12:00', label: 'Resepsi', location: 'Teras Cikapundung, Bandung' },
]

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan template undangan Dita & Budi. Bisa diskusi?')
</script>

<template>
  <div class="min-h-screen antialiased" style="background: #FFFFFF; color: #111827; font-family: 'Inter', system-ui, sans-serif;">
    <TemplateBack />

    <!-- Hero -->
    <section class="min-h-[100dvh] flex items-center justify-center">
      <div class="text-center px-6">
        <template v-if="!isLoaded">
          <div class="h-4 w-24 bg-gray-200 rounded mb-8 mx-auto animate-pulse" />
          <div class="h-16 w-full bg-gray-200 rounded mb-4 animate-pulse" />
          <div class="h-16 w-3/4 bg-gray-200 rounded mb-8 mx-auto animate-pulse" />
          <div class="flex gap-4 justify-center">
            <div class="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div class="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </template>

        <template v-else>
          <p class="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8">Bismillah</p>
          <h1 class="text-6xl md:text-8xl font-extralight leading-[0.9] tracking-[-0.02em] mb-8">
            Dita<br /><span class="text-gray-300">&amp;</span><br />Budi
          </h1>
          <div class="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-500 space-y-1">
            <p>Sabtu · 15 · Agustus · 2026</p>
            <p>Bandung</p>
          </div>
          <div class="mt-12 flex flex-col items-center gap-2">
            <a href="#acara" class="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-800 transition-colors">Detail Acara</a>
            <a href="#rsvp" class="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-800 transition-colors">Konfirmasi</a>
          </div>
        </template>
      </div>
    </section>

    <!-- Acara -->
    <section id="acara" class="py-24 border-t border-gray-100">
      <div class="max-w-sm mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8">Detail Acara</p>
        <div class="space-y-10">
          <article v-for="e in events" :key="e.label">
            <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-2">{{ e.time }}</p>
            <h3 class="text-xl font-light mb-2">{{ e.label }}</h3>
            <p class="text-sm text-gray-500">{{ e.location }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Dress code -->
    <section class="py-16 border-t border-gray-100" style="background: #FAFAFA;">
      <div class="max-w-sm mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-4">Dress Code</p>
        <h3 class="text-xl font-light mb-3">Hitam.</h3>
        <p class="text-sm text-gray-500">Pakai apa saja yang bikin kamu nyaman, warna hitam.</p>
      </div>
    </section>

    <!-- RSVP -->
    <section id="rsvp" class="py-24 border-t border-gray-100">
      <div class="max-w-sm mx-auto px-6 text-center">
        <p class="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-4">Konfirmasi</p>
        <h3 class="text-xl font-light mb-6">Bisa hadir?</h3>
        <form class="space-y-3 text-left">
          <input type="text" placeholder="Nama" class="w-full px-4 py-3 border border-gray-200 bg-transparent rounded text-sm focus:outline-none focus:border-gray-400" />
          <select class="w-full px-4 py-3 border border-gray-200 bg-transparent rounded text-sm"><option>Hadir</option><option>Tidak bisa</option></select>
          <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors">Kirim</button>
        </form>
      </div>
    </section>

    <footer class="py-8 text-center border-t border-gray-100">
      <p class="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400">D &amp; B · 15.08.2026 · Template by AjoClub</p>
    </footer>

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
  </div>
</template>
