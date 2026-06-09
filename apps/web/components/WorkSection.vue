<script setup lang="ts">
const projects = [
  {
    title: 'FinTrack Dashboard',
    category: 'SaaS Application',
    description: 'Real-time financial analytics platform with live data streaming, custom charts, and multi-tenant architecture.',
    tech: ['Nuxt.js', 'PostgreSQL', 'WebSocket'],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'FreshBite',
    category: 'Mobile App',
    description: 'Meal delivery app with real-time order tracking, GPS integration, and push notifications. Built once, deployed to Android and iOS.',
    tech: ['Capacitor', 'Supabase', 'Tailwind'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'NovaCorp',
    category: 'Company Profile',
    description: 'Corporate website with interactive 3D product showcase, multi-language support, and CMS integration.',
    tech: ['Nuxt.js', 'Three.js', 'Prisma'],
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: 'QuickForm',
    category: 'PWA',
    description: 'Offline-first form builder that works on any device. Installable progressive web app with local data sync.',
    tech: ['PWA', 'IndexedDB', 'Nuxt'],
    color: 'from-orange-500 to-red-600',
  },
]
</script>

<template>
  <section id="work" class="py-32 bg-black">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-20">
        <p class="text-cyan-400 text-sm font-mono tracking-widest uppercase mb-4 work-title">
          Selected Work
        </p>
        <h2 class="text-4xl md:text-5xl font-bold text-white work-title">
          Projects that
          <br />
          <span class="text-white/40">speak for themselves.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="i"
          class="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 work-card"
        >
          <div
            class="h-48 md:h-64 bg-gradient-to-br flex items-center justify-center relative"
            :class="project.color"
          >
            <div class="absolute inset-0 bg-black/20" />
            <span class="relative text-6xl font-bold text-white/10">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
          </div>

          <div class="p-8 bg-white/[0.02]">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {{ project.category }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">
              {{ project.title }}
            </h3>
            <p class="text-white/50 mb-6 text-sm leading-relaxed">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tech"
                :key="tag"
                class="px-3 py-1 text-xs font-mono text-white/40 bg-white/5 rounded-full"
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
