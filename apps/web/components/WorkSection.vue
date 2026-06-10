<script setup lang="ts">
const projects = [
  { title: 'FinTrack Dashboard', category: 'SaaS', description: 'Real-time financial analytics with live data streaming and multi-tenant architecture.', tech: ['Nuxt.js', 'PostgreSQL', 'WebSocket'], gradient: 'from-rose-500/80 to-pink-600/80' },
  { title: 'FreshBite', category: 'Mobile', description: 'Meal delivery app with real-time order tracking and push notifications.', tech: ['Capacitor', 'Supabase', 'Tailwind'], gradient: 'from-rose-600/80 to-red-600/80' },
  { title: 'NovaCorp', category: 'Corporate', description: 'Corporate website with interactive 3D product showcase and CMS.', tech: ['Nuxt.js', 'Three.js', 'Prisma'], gradient: 'from-pink-500/80 to-rose-600/80' },
  { title: 'QuickForm', category: 'PWA', description: 'Offline-first form builder. Installable on any device.', tech: ['PWA', 'IndexedDB', 'Nuxt'], gradient: 'from-red-500/80 to-rose-500/80' },
]
</script>

<template>
  <section id="work" class="py-32 bg-(--ui-bg)">
    <UContainer>
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 work-title">Selected Work</p>
        <h2 class="text-4xl md:text-5xl font-bold work-title">
          Projects that<br />
          <span class="text-(--ui-text-muted)">speak for themselves.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="i"
          class="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 work-card"
        >
          <div class="h-48 md:h-56 bg-gradient-to-br flex items-center justify-center relative" :class="project.gradient">
            <div class="absolute inset-0 bg-black/10" />
            <span class="relative text-7xl font-bold text-white/10">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="p-6">
            <UBadge variant="soft" color="primary" class="mb-3">{{ project.category }}</UBadge>
            <h3 class="text-lg font-semibold mb-2">{{ project.title }}</h3>
            <p class="text-(--ui-text-muted) mb-4 text-sm leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="tag in project.tech" :key="tag" variant="outline" color="neutral" size="sm">{{ tag }}</UBadge>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
