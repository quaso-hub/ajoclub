<script setup lang="ts">
const services = [
  {
    icon: 'i-lucide-globe',
    title: 'Website yang Loading-nya Secepat Kilat',
    description: 'Bukan cuma cantik, tapi juga cepat. Visitor tidak suka menunggu — kami pastikan website Anda loading di bawah 2 detik.',
    tags: ['Landing Page', 'Company Profile', 'E-commerce'],
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Bisa Dipakai di HP, Tablet, dan Laptop',
    description: 'Desain yang menyesuaikan layar. Tidak ada lagi teks kecil, tombol susah ditekan, atau layout berantakan di mobile.',
    tags: ['Responsive', 'Mobile-First', 'Touch-Friendly'],
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Aman dan Mudah Diupdate',
    description: 'Anda bisa ganti teks dan gambar sendiri tanpa perlu programmer. Sistem kami aman dan tidak gampang diretas.',
    tags: ['CMS', 'SSL', 'Backup'],
  },
  {
    icon: 'i-lucide-zap',
    title: 'Siap dalam Hitungan Minggu, Bukan Bulan',
    description: 'Kami tidak suka proses yang berbelit. Brief → desain → revisi → launch. Selesai dalam 2-4 minggu untuk project standar.',
    tags: ['Fast Delivery', 'Clear Process', 'No Surprises'],
  },
]
</script>

<template>
  <section id="services" class="py-32 bg-(--ui-bg) relative">
    <UContainer>
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 service-title">
          Apa yang Kami Lakukan
        </p>
        <h2 class="text-4xl md:text-5xl font-bold service-title">
          Website yang bekerja untuk Anda,<br />
          <span class="text-(--ui-text-muted)">bukan sebaliknya.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="glass-card p-8 group hover:scale-[1.02] transition-all duration-300 service-card"
        >
          <div class="w-12 h-12 rounded-xl bg-(--ui-primary)/10 flex items-center justify-center mb-6 group-hover:bg-(--ui-primary)/20 transition-colors">
            <UIcon :name="service.icon" class="w-6 h-6 text-(--ui-primary)" />
          </div>
          <h3 class="text-xl font-semibold mb-3">{{ service.title }}</h3>
          <p class="text-(--ui-text-muted) mb-6 leading-relaxed">{{ service.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in service.tags" :key="tag" variant="soft" color="primary">
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
