<script setup lang="ts">
const stats = [
  { value: '4', label: 'Team Members', icon: 'i-lucide-users' },
  { value: '1', label: 'Unified Stack', icon: 'i-lucide-layers' },
  { value: '100%', label: 'TypeScript', icon: 'i-lucide-code' },
  { value: '0', label: 'Compromises', icon: 'i-lucide-shield' },
]

const principles = [
  { title: 'One Language, Full Stack', description: 'TypeScript from database to UI. No context switching, no translation layers. Everyone speaks the same language.', icon: 'i-lucide-code-2' },
  { title: 'Build Once, Deploy Everywhere', description: 'Web, mobile, and PWA from a single codebase via Capacitor.js. One team, one codebase, every platform.', icon: 'i-lucide-smartphone' },
  { title: 'Performance by Default', description: 'Static generation for landing pages. SSR for apps. Core Web Vitals from day one. Every millisecond counts.', icon: 'i-lucide-zap' },
]
</script>

<template>
  <section id="about" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--ui-primary)/5 rounded-full blur-[100px]" />

    <UContainer class="relative">
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 about-title">About Us</p>
        <h2 class="text-4xl md:text-5xl font-bold about-title">
          A small team with<br />
          <span class="text-(--ui-text-muted)">big ambitions.</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="glass-card p-6 text-center group hover:scale-[1.03] transition-all duration-300 stat-card"
        >
          <UIcon :name="stat.icon" class="w-6 h-6 text-(--ui-primary) mx-auto mb-3 opacity-60" />
          <div class="text-3xl md:text-4xl font-bold mb-2">{{ stat.value }}</div>
          <div class="text-xs text-(--ui-text-muted) font-mono uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(p, i) in principles" :key="i" class="principle-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
              <UIcon :name="p.icon" class="w-5 h-5 text-(--ui-primary)" />
            </div>
            <span class="text-5xl font-bold text-(--ui-text-muted)/10">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="text-lg font-semibold mb-3">{{ p.title }}</h3>
          <p class="text-(--ui-text-muted) text-sm leading-relaxed">{{ p.description }}</p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
