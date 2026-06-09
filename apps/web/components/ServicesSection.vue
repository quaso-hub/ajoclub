<script setup lang="ts">
const services = [
  {
    icon: 'i-lucide-monitor',
    title: 'Web Applications',
    description: 'SaaS platforms, dashboards, and dynamic web apps. SSR, real-time data, bulletproof auth.',
    tags: ['Nuxt.js', 'TypeScript', 'SSR'],
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Mobile Apps',
    description: 'Hybrid mobile apps that feel native. One codebase for Android and iOS via Capacitor.',
    tags: ['Capacitor', 'Android', 'iOS'],
  },
  {
    icon: 'i-lucide-layout',
    title: 'Landing Pages',
    description: 'High-converting landing pages and company profiles. Static generation for instant load.',
    tags: ['SSG', 'SEO', 'Performance'],
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'PWA & Offline',
    description: 'Progressive Web Apps that install on any device. Offline support, push notifications.',
    tags: ['PWA', 'Offline', 'Installable'],
  },
]
</script>

<template>
  <section id="services" class="py-32 bg-(--ui-bg)">
    <UContainer>
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 service-title">
          What we do
        </p>
        <h2 class="text-4xl md:text-5xl font-bold service-title">
          Full-stack capability.<br />
          <span class="text-(--ui-text-muted)">One team. One language.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <UCard
          v-for="(service, i) in services"
          :key="i"
          class="group service-card"
          :ui="{
            root: 'transition-all duration-300 hover:ring-(--ui-primary)/30',
            body: 'p-8',
          }"
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
        </UCard>
      </div>
    </UContainer>
  </section>
</template>
