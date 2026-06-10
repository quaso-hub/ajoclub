<script setup lang="ts">
const stats = [
  { value: '<24jam', label: 'Waktu Respon', icon: 'i-lucide-clock' },
  { value: '2-4mgg', label: 'Rata-rata Selesai', icon: 'i-lucide-calendar-check' },
  { value: '100%', label: 'Klien Puas', icon: 'i-lucide-heart' },
  { value: 'Gratis', label: 'Revisi Desain', icon: 'i-lucide-refresh-cw' },
]

const principles = [
  { title: 'Kami Jelaskan dengan Bahasa Manusia', description: 'Tidak ada jargon teknis yang membingungkan. Kami jelaskan semuanya dengan cara yang Anda pahami.', icon: 'i-lucide-message-circle' },
  { title: 'Anda Pemilik Kodenya, Selamanya', description: 'Tidak ada lock-in. Kode dan data adalah milik Anda. Kapan pun mau pindah, ambil semuanya.', icon: 'i-lucide-key' },
  { title: 'Kami Tidak Hilang Setelah Launch', description: 'Support berlanjut setelah website live. Ada pertanyaan? Kami balas dalam hitungan jam, bukan hari.', icon: 'i-lucide-headphones' },
]
</script>

<template>
  <section id="about" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--ui-primary)/5 rounded-full blur-[100px]" />

    <UContainer class="relative">
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 about-title">Tentang Kami</p>
        <h2 class="text-4xl md:text-5xl font-bold about-title">
          Tim kecil, hasil besar.<br />
          <span class="text-(--ui-text-muted)">Kami serius dengan setiap project.</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="glass-card p-6 text-center group hover:scale-[1.03] transition-all duration-300 stat-card"
        >
          <UIcon :name="stat.icon" class="w-6 h-6 text-(--ui-primary) mx-auto mb-3 opacity-60" />
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
