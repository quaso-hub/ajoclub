<script setup lang="ts">
const route = useRoute()
const type = route.params.type as string

const templates: Record<string, {
  title: string
  subtitle: string
  description: string
  gradient: string
  accent: string
  features: string[]
  testimonial: { name: string; role: string; quote: string }
}> = {
  'company-profile': {
    title: 'Company Profile',
    subtitle: 'Kehadiran digital yang profesional',
    description: 'Website perusahaan yang bersih, cepat, dan terpercaya. Dirancang untuk membangun kredibilitas dan menarik klien baru.',
    gradient: 'from-blue-600 to-indigo-700',
    accent: 'blue',
    features: ['Loading < 2 detik', 'Mobile-friendly', 'SEO optimized', 'Mudah diupdate sendiri'],
    testimonial: { name: 'Budi Santoso', role: 'CEO, PT Maju Bersama', quote: 'Website baru kami langsung terlihat beda. Klien bilang kami terlihat lebih profesional.' },
  },
  'landing-page': {
    title: 'Landing Page',
    subtitle: 'Ubah visitor jadi pelanggan',
    description: 'Halaman yang dirancang khusus untuk konversi. Setiap elemen punya tujuan: membuat visitor mengambil tindakan.',
    gradient: 'from-rose-500 to-orange-500',
    accent: 'rose',
    features: ['A/B testing ready', 'Fast loading', 'Mobile-first', 'Integrasi analytics'],
    testimonial: { name: 'Sari Dewi', role: 'Founder, TokoBunga.id', quote: 'Dalam 2 minggu setelah launch, leads naik 3x. Landing page-nya memang works.' },
  },
  'wedding': {
    title: 'Wedding Page',
    subtitle: 'Undangan digital yang berkesan',
    description: 'Halaman pernikahan elegan dengan RSVP online, galeri foto, dan cerita cinta Anda. Bisa dibagikan ke semua tamu.',
    gradient: 'from-pink-400 to-rose-500',
    accent: 'pink',
    features: ['RSVP online', 'Galeri foto', 'Peta lokasi', 'Countdown timer'],
    testimonial: { name: 'Rina & Andi', role: 'Pasangan', quote: 'Tamu pada bilang undangannya unik dan gampang dipakai. RSVP-nya juga praktis banget.' },
  },
  'saas': {
    title: 'SaaS Dashboard',
    subtitle: 'Aplikasi web yang powerful',
    description: 'Dashboard real-time dengan grafik, filter, dan data yang selalu update. Cocok untuk platform yang butuh tampilan data yang jelas.',
    gradient: 'from-violet-500 to-purple-600',
    accent: 'violet',
    features: ['Real-time data', 'Chart interaktif', 'Export PDF/CSV', 'Role-based access'],
    testimonial: { name: 'Dimas Pratama', role: 'CTO, DataKu', quote: 'Dashboard-nya cepat dan intuitif. Tim kami langsung bisa pakai tanpa training.' },
  },
  'restaurant': {
    title: 'Restaurant',
    subtitle: 'Menu yang menggugah selera',
    description: 'Website restoran dengan menu interaktif, reservasi online, dan integrasi delivery. Bikin pelanggan lapar sebelum sampai.',
    gradient: 'from-amber-500 to-orange-600',
    accent: 'amber',
    features: ['Menu interaktif', 'Reservasi online', 'Integrasi Grab/GoFood', 'Review & rating'],
    testimonial: { name: 'Chef Anton', role: 'Owner, Warung Nusantara', quote: 'Reservasi online bikin kami gampang manage booking. Tidak ada lagi double booking.' },
  },
  'portfolio': {
    title: 'Portfolio',
    subtitle: 'Pamerkan karya terbaik Anda',
    description: 'Galeri interaktif yang menunjukkan keahlian Anda. Cocok untuk desainer, fotografer, arsitek, dan kreator.',
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
    features: ['Galeri interaktif', 'Filter by kategori', 'Lightbox preview', 'Contact form'],
    testimonial: { name: 'Maya Kusuma', role: 'Fotografer', quote: 'Portfolio baru saya langsung menarik perhatian klien. Mereka bisa lihat karya saya dengan mudah.' },
  },
  'event': {
    title: 'Event / Brochure',
    subtitle: 'Informasi yang mudah diakses',
    description: 'Halaman event dengan jadwal, pembicara, lokasi, dan registrasi. Cocok untuk konferensi, workshop, dan peluncuran produk.',
    gradient: 'from-cyan-500 to-blue-600',
    accent: 'cyan',
    features: ['Jadwal acara', 'Registrasi online', 'Peta lokasi', 'Notifikasi pengingat'],
    testimonial: { name: 'Tim Event', role: 'TechConf 2026', quote: 'Registrasi online mengurangi kerja manual 80%. Peserta juga lebih mudah daftar.' },
  },
  'celebration': {
    title: 'Hajatan / Celebration',
    subtitle: 'Rayakan momen spesial',
    description: 'Halaman untuk wisuda, ulang tahun, aqiqah, dan momen spesial lainnya. Bisa dibagikan ke keluarga dan teman.',
    gradient: 'from-yellow-500 to-amber-600',
    accent: 'yellow',
    features: ['Countdown timer', 'Galeri foto', 'Ucapan online', 'Share ke WhatsApp'],
    testimonial: { name: 'Keluarga Ahmad', role: 'Wisuda', quote: 'Keluarga besar pada senang bisa lihat foto dan kasih ucapan online. Praktis banget.' },
  },
}

const template = computed(() => templates[type])

if (!template.value) {
  throw createError({ statusCode: 404, message: 'Template not found' })
}

useHead({
  title: `${template.value.title} — AjoClub`,
})
</script>

<template>
  <div v-if="template">
    <!-- Back button -->
    <div class="fixed top-4 left-4 z-50">
      <UButton variant="outline" color="neutral" icon="i-lucide-arrow-left" size="sm" to="/#showcase">
        Kembali
      </UButton>
    </div>

    <!-- Hero -->
    <section class="min-h-[70vh] flex items-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br" :class="template.gradient" />
      <div class="absolute inset-0 bg-black/30" />
      <div class="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center text-white">
        <p class="text-sm font-mono tracking-widest uppercase mb-4 opacity-80">{{ template.subtitle }}</p>
        <h1 class="text-5xl md:text-7xl font-bold mb-6">{{ template.title }}</h1>
        <p class="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">{{ template.description }}</p>
        <UButton size="xl" color="primary" @click="$el.closest('div')?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })">
          Lihat fitur
          <template #trailing>
            <UIcon name="i-lucide-arrow-down" />
          </template>
        </UButton>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 bg-(--ui-bg)">
      <UContainer>
        <h2 class="text-3xl font-bold text-center mb-16">Fitur yang Anda Dapat</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feature in template.features" :key="feature" class="glass-card p-6 text-center">
            <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-(--ui-primary) mx-auto mb-4" />
            <p class="font-medium">{{ feature }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Testimonial -->
    <section class="py-24 bg-(--ui-bg)">
      <UContainer>
        <div class="glass-card p-12 max-w-3xl mx-auto text-center">
          <UIcon name="i-lucide-quote" class="w-10 h-10 text-(--ui-primary) mx-auto mb-6 opacity-40" />
          <blockquote class="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
            "{{ template.testimonial.quote }}"
          </blockquote>
          <div>
            <p class="font-semibold">{{ template.testimonial.name }}</p>
            <p class="text-(--ui-text-muted) text-sm">{{ template.testimonial.role }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-(--ui-bg)">
      <UContainer>
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Suka dengan gaya ini?</h2>
          <p class="text-(--ui-text-muted) mb-8 max-w-xl mx-auto">
            Kami bisa bikin yang serupa untuk bisnis Anda. Konsultasi gratis, tidak ada kewajiban.
          </p>
          <UButton size="xl" to="/#contact">
            Konsultasi gratis
          </UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>
