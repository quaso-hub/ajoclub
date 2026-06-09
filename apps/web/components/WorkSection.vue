<script setup lang="ts">
const projects = [
  { title: 'FinTrack Dashboard', category: 'SaaS', description: 'Real-time financial analytics with live data streaming and multi-tenant architecture.', tech: ['Nuxt.js', 'PostgreSQL', 'WebSocket'], gradient: 'from-rose-500 to-pink-600' },
  { title: 'FreshBite', category: 'Mobile', description: 'Meal delivery app with real-time order tracking and push notifications.', tech: ['Capacitor', 'Supabase', 'Tailwind'], gradient: 'from-rose-600 to-red-600' },
  { title: 'NovaCorp', category: 'Corporate', description: 'Corporate website with interactive 3D product showcase and CMS.', tech: ['Nuxt.js', 'Three.js', 'Prisma'], gradient: 'from-pink-500 to-rose-600' },
  { title: 'QuickForm', category: 'PWA', description: 'Offline-first form builder. Installable on any device.', tech: ['PWA', 'IndexedDB', 'Nuxt'], gradient: 'from-red-500 to-rose-500' },
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
        <UCard
          v-for="(project, i) in projects"
          :key="i"
          class="group overflow-hidden work-card"
          :ui="{ root: 'transition-all duration-300 hover:ring-(--ui-primary)/30' }"
        >
          <div class="h-48 md:h-64 bg-gradient-to-br flex items-center justify-center relative -mx-6 -mt-6 mb-6" :class="project.gradient">
            <span class="relative text-6xl font-bold text-white/10">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div>
            <UBadge variant="soft" color="primary" class="mb-3">{{ project.category }}</UBadge>
            <h3 class="text-xl font-semibold mb-3">{{ project.title }}</h3>
            <p class="text-(--ui-text-muted) mb-6 text-sm leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="tag in project.tech" :key="tag" variant="outline" color="neutral">{{ tag }}</UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>
