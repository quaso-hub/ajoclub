<script setup lang="ts">
const services = [
  {
    icon: 'i-lucide-globe',
    title: 'Website company profile',
    description: 'Company profile, landing page, atau microsite. Dari desain sampai deploy, termasuk copywriting dan SEO dasar.',
    tags: ['Nuxt 3', 'Tailwind', 'SEO'],
  },
  {
    icon: 'i-lucide-layout-dashboard',
    title: 'SaaS & dashboard',
    description: 'Aplikasi web untuk operasional internal: CRUD, role-based access, API, dan database.',
    tags: ['Prisma', 'PostgreSQL', 'RBAC'],
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Mobile app (hybrid)',
    description: 'Aplikasi mobile pakai Capacitor.js. Satu codebase untuk Android dan iOS.',
    tags: ['Capacitor', 'Vue', 'PWA'],
  },
  {
    icon: 'i-lucide-terminal',
    title: 'Deploy & infra',
    description: 'Docker, VPS, domain, SSL, CI/CD. Kami setup dari nol sampai online.',
    tags: ['Docker', 'Nginx', 'GitHub Actions'],
  },
]
</script>

<template>
  <section id="services" class="py-32 bg-(--ui-bg) relative">
    <UContainer>
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 service-title">
          Layanan
        </p>
        <h2 class="text-4xl md:text-5xl font-bold service-title">
          Apa yang kami kerjakan<br />
          <span class="text-(--ui-text-muted)">dari awal sampai online.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="glass-card p-8 group hover:-translate-y-1 transition-all duration-300 service-card"
        >
          <div class="w-12 h-12 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center mb-6 group-hover:bg-(--ui-primary)/20 transition-colors">
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
