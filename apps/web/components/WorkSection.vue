<script setup lang="ts">
const projects = [
  {
    title: 'FinTrack Dashboard',
    category: 'SaaS Application',
    description: 'Real-time financial analytics platform with live data streaming, custom charts, and multi-tenant architecture.',
    tech: ['Nuxt.js', 'PostgreSQL', 'WebSocket'],
    color: 'from-[var(--primary)] to-[var(--accent)]',
  },
  {
    title: 'FreshBite',
    category: 'Mobile App',
    description: 'Meal delivery app with real-time order tracking, GPS integration, and push notifications. Built once, deployed to Android and iOS.',
    tech: ['Capacitor', 'Supabase', 'Tailwind'],
    color: 'from-[var(--primary)] to-[var(--secondary)]',
  },
  {
    title: 'NovaCorp',
    category: 'Company Profile',
    description: 'Corporate website with interactive 3D product showcase, multi-language support, and CMS integration.',
    tech: ['Nuxt.js', 'Three.js', 'Prisma'],
    color: 'from-[var(--secondary)] to-[var(--accent)]',
  },
  {
    title: 'QuickForm',
    category: 'PWA',
    description: 'Offline-first form builder that works on any device. Installable progressive web app with local data sync.',
    tech: ['PWA', 'IndexedDB', 'Nuxt'],
    color: 'from-[var(--accent)] to-[var(--primary)]',
  },
]
</script>

<template>
  <section id="work" class="py-32 bg-[var(--background)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-20">
        <p class="text-[var(--primary)] text-sm font-mono tracking-widest uppercase mb-4 work-title">
          Selected Work
        </p>
        <h2 class="text-4xl md:text-5xl font-bold text-[var(--foreground)] work-title">
          Projects that
          <br />
          <span class="text-[var(--muted-foreground)]">speak for themselves.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="i"
          class="group relative rounded-[var(--radius)] overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-500 work-card"
        >
          <div
            class="h-48 md:h-64 bg-gradient-to-br flex items-center justify-center relative"
            :class="project.color"
          >
            <div class="absolute inset-0 bg-[var(--background)]/20" />
            <span class="relative text-6xl font-bold text-[var(--foreground)]/10">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="p-8 bg-[var(--card)]">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">
                {{ project.category }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-[var(--foreground)] mb-3">
              {{ project.title }}
            </h3>
            <p class="text-[var(--muted-foreground)] mb-6 text-sm leading-relaxed">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tech"
                :key="tag"
                class="px-3 py-1 text-xs font-mono text-[var(--muted-foreground)] bg-[var(--muted)] rounded-[var(--radius)]"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
