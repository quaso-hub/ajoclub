<script setup lang="ts">
const stats = [
  { value: '4', label: 'Team Members' },
  { value: '1', label: 'Unified Stack' },
  { value: '100%', label: 'TypeScript' },
  { value: '0', label: 'Compromises' },
]

const principles = [
  { title: 'One Language, Full Stack', description: 'TypeScript from database to UI. No context switching, no translation layers.' },
  { title: 'Build Once, Deploy Everywhere', description: 'Web, mobile, and PWA from a single codebase via Capacitor.js.' },
  { title: 'Performance by Default', description: 'Static generation for landing pages. SSR for apps. Core Web Vitals from day one.' },
]
</script>

<template>
  <section id="about" class="py-32 bg-zinc-950 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[120px]" />

    <div class="max-w-7xl mx-auto px-6 relative">
      <div class="mb-20">
        <p class="text-rose-400 text-sm font-mono tracking-widest uppercase mb-4 about-title">About Us</p>
        <h2 class="text-4xl md:text-5xl font-bold text-zinc-100 about-title">
          A small team with<br />
          <span class="text-zinc-500">big ambitions.</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <div v-for="stat in stats" :key="stat.label" class="text-center p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 stat-card">
          <div class="text-3xl md:text-5xl font-bold text-zinc-100 mb-2">{{ stat.value }}</div>
          <div class="text-xs md:text-sm text-zinc-500 font-mono uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(p, i) in principles" :key="i" class="principle-card">
          <div class="text-6xl font-bold text-zinc-800 mb-4">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="text-lg font-semibold text-zinc-100 mb-3">{{ p.title }}</h3>
          <p class="text-zinc-400 text-sm leading-relaxed">{{ p.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
