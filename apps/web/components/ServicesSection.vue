<script setup lang="ts">
const services = [
  {
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    title: 'Web Applications',
    description: 'SaaS platforms, dashboards, and dynamic web apps built with Nuxt.js and TypeScript. Server-side rendering, real-time data, and bulletproof auth.',
    tags: ['Nuxt.js', 'TypeScript', 'SSR'],
  },
  {
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'Mobile Apps',
    description: 'Hybrid mobile apps that feel native. One codebase for Android and iOS using Capacitor.js. Camera, GPS, push notifications included.',
    tags: ['Capacitor', 'Android', 'iOS'],
  },
  {
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    title: 'Landing Pages',
    description: 'High-converting landing pages and company profiles. Static generation for instant load times. SEO optimized out of the box.',
    tags: ['SSG', 'SEO', 'Performance'],
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'PWA & Offline',
    description: 'Progressive Web Apps that install on any device. Offline support, push notifications, and app-like experience without the app store.',
    tags: ['PWA', 'Offline', 'Installable'],
  },
]
</script>

<template>
  <section id="services" class="py-32 bg-[var(--background)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-20">
        <p class="text-[var(--primary)] text-sm font-mono tracking-widest uppercase mb-4 service-title">
          What we do
        </p>
        <h2 class="text-4xl md:text-5xl font-bold text-[var(--foreground)] service-title">
          Full-stack capability.
          <br />
          <span class="text-[var(--muted-foreground)]">One team. One language.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(service, i) in services"
          :key="i"
          class="group relative p-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]/30 transition-all duration-500 service-card"
        >
          <div class="w-12 h-12 rounded-[var(--radius)] bg-[var(--primary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)]/20 transition-colors">
            <svg class="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="service.icon" />
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-[var(--foreground)] mb-3">
            {{ service.title }}
          </h3>
          <p class="text-[var(--muted-foreground)] mb-6 leading-relaxed">
            {{ service.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in service.tags"
              :key="tag"
              class="px-3 py-1 text-xs font-mono text-[var(--primary)] bg-[var(--primary)]/10 rounded-[var(--radius)]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
