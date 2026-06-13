<script setup lang="ts">
const services = [
  {
    icon: 'i-lucide-globe',
    title: 'Website',
    description: 'Company profile, landing page, microsite. Dari desain sampai deploy.',
    tags: ['Nuxt 3', 'Tailwind', 'SEO'],
  },
  {
    icon: 'i-lucide-layout-dashboard',
    title: 'SaaS & Dashboard',
    description: 'Aplikasi web untuk operasional: CRUD, role-based access, API.',
    tags: ['Prisma', 'PostgreSQL', 'RBAC'],
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Mobile App',
    description: 'Hybrid app pakai Capacitor.js. Satu codebase, Android + iOS.',
    tags: ['Capacitor', 'Vue', 'PWA'],
  },
  {
    icon: 'i-lucide-terminal',
    title: 'Deploy & Infra',
    description: 'Docker, VPS, domain, SSL, CI/CD. Setup dari nol sampai online.',
    tags: ['Docker', 'Nginx', 'CI/CD'],
  },
]
</script>

<template>
  <section id="services" class="py-20 sm:py-32 bg-(--ui-bg)">
    <UContainer>
      <div class="mb-12 sm:mb-20">
        <p class="text-(--ui-primary) text-xs sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4 service-title">
          Layanan
        </p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold service-title leading-tight">
          Apa yang kami kerjakan.
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="glass-card p-6 sm:p-8 group hover:-translate-y-1 transition-all duration-300 service-card cursor-pointer"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-(--ui-primary)/20 transition-colors">
            <UIcon :name="service.icon" class="w-5 h-5 sm:w-6 sm:h-6 text-(--ui-primary)" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{{ service.title }}</h3>
          <p class="text-(--ui-text-muted) text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{{ service.description }}</p>
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            <UBadge v-for="tag in service.tags" :key="tag" variant="soft" color="primary" size="sm">
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
