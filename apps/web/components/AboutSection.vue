<script setup lang="ts">
const stats = [
  { value: '4', label: 'Tim Inti', icon: 'i-lucide-users' },
  { value: '1', label: 'Stack', icon: 'i-lucide-code' },
  { value: '3+', label: 'Tahun', icon: 'i-lucide-calendar' },
  { value: '24/7', label: 'WhatsApp', icon: 'i-lucide-message-circle' },
]

const principles = [
  { title: 'Kami kerjakan semuanya', description: 'Desain, coding, copywriting, deploy, dan maintenance. Satu tim, bukan lempar-lemparan.', icon: 'i-lucide-check-circle' },
  { title: 'Tidak ada biaya tersembunyi', description: 'Harga disepakati di awal. Kalau ada perubahan scope, kami bicarakan dulu.', icon: 'i-lucide-shield-check' },
  { title: 'Source code milik Anda', description: 'Setelah selesai, source code dan akses server sepenuhnya milik Anda.', icon: 'i-lucide-code' },
]
</script>

<template>
  <section id="about" class="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
    <UContainer class="relative">
      <div class="mb-12 sm:mb-20">
        <p class="text-sky-400 text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4 about-title">Tentang Kami</p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold about-title leading-tight">
          Tim kecil, kerja serius.
        </h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-20">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-xl border border-zinc-800 p-4 sm:p-6 text-center group hover:border-zinc-700 transition-all duration-300 stat-card"
        >
          <UIcon :name="stat.icon" class="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 mx-auto mb-2 sm:mb-3 opacity-70" />
          <div class="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-white">{{ stat.value }}</div>
          <div class="text-[10px] sm:text-xs text-zinc-500 font-mono uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <div v-for="(p, i) in principles" :key="i" class="principle-card">
          <div class="flex items-center gap-3 mb-3 sm:mb-4">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <UIcon :name="p.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </div>
          </div>
          <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white">{{ p.title }}</h3>
          <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed">{{ p.description }}</p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
