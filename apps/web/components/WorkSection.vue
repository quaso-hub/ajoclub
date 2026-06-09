<script setup lang="ts">
const projects = [
  { title: 'FinTrack Dashboard', category: 'SaaS', description: 'Real-time financial analytics with live data streaming and multi-tenant architecture.', tech: ['Nuxt.js', 'PostgreSQL', 'WebSocket'], gradient: 'from-rose-500 to-pink-600' },
  { title: 'FreshBite', category: 'Mobile', description: 'Meal delivery app with real-time order tracking and push notifications.', tech: ['Capacitor', 'Supabase', 'Tailwind'], gradient: 'from-rose-600 to-red-600' },
  { title: 'NovaCorp', category: 'Corporate', description: 'Corporate website with interactive 3D product showcase and CMS.', tech: ['Nuxt.js', 'Three.js', 'Prisma'], gradient: 'from-pink-500 to-rose-600' },
  { title: 'QuickForm', category: 'PWA', description: 'Offline-first form builder. Installable on any device.', tech: ['PWA', 'IndexedDB', 'Nuxt'], gradient: 'from-red-500 to-rose-500' },
]
</script>

<template>
  <section id="work" class="py-32 bg-zinc-950">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-20">
        <p class="text-rose-400 text-sm font-mono tracking-widest uppercase mb-4 work-title">Selected Work</p>
        <h2 class="text-4xl md:text-5xl font-bold text-zinc-100 work-title">
          Projects that<br />
          <span class="text-zinc-500">speak for themselves.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="i"
          class="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition-all duration-500 work-card"
        >
          <div class="h-48 md:h-64 bg-gradient-to-br flex items-center justify-center relative" :class="project.gradient">
            <span class="relative text-6xl font-bold text-white/10">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="p-8 bg-zinc-900/80">
            <span class="text-xs font-mono text-rose-400 uppercase tracking-wider">{{ project.category }}</span>
            <h3 class="text-xl font-semibold text-zinc-100 mt-2 mb-3">{{ project.title }}</h3>
            <p class="text-zinc-400 mb-6 text-sm leading-relaxed">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in project.tech" :key="tag" class="px-3 py-1 text-xs font-mono text-zinc-400 bg-zinc-800 rounded-full">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
