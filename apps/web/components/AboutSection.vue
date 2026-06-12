<script setup lang="ts">
const stats = [
  { value: '4', label: 'Tim Inti', icon: 'i-lucide-users' },
  { value: '1', label: 'Stack', icon: 'i-lucide-code' },
  { value: '3+', label: 'Tahun Pengalaman', icon: 'i-lucide-calendar' },
  { value: '24/7', label: 'WhatsApp Aktif', icon: 'i-lucide-message-circle' },
]

const principles = [
  { title: 'Kami kerjakan semuanya', description: 'Desain, coding, copywriting, deploy, dan maintenance. Satu tim, bukan lempar-lemparan.', icon: 'i-lucide-check-circle' },
  { title: 'Tidak ada biaya tersembunyi', description: 'Harga disepakati di awal. Kalau ada perubahan scope, kami bicarakan dulu.', icon: 'i-lucide-shield-check' },
  { title: 'Source code milik Anda', description: 'Setelah selesai, source code dan akses server sepenuhnya milik Anda.', icon: 'i-lucide-code' },
]
</script>

<template>
  <section id="about" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--ui-primary)/5 rounded-full blur-[100px]" />

    <UContainer class="relative">
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 about-title">Tentang Kami</p>
        <h2 class="text-4xl md:text-5xl font-bold about-title">
          Tim kecil, kerja serius.<br />
          <span class="text-(--ui-text-muted)">Dari diskusi sampai deploy, satu tim.</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="glass-card p-6 text-center group hover:-translate-y-1 transition-all duration-300 stat-card"
        >
          <UIcon :name="stat.icon" class="w-6 h-6 text-(--ui-primary) mx-auto mb-3 opacity-70" />
          <div class="text-2xl md:text-3xl font-bold mb-2">{{ stat.value }}</div>
          <div class="text-xs text-(--ui-text-muted) font-mono uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(p, i) in principles" :key="i" class="principle-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
              <UIcon :name="p.icon" class="w-5 h-5 text-(--ui-primary)" />
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-3">{{ p.title }}</h3>
          <p class="text-(--ui-text-muted) text-sm leading-relaxed">{{ p.description }}</p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
