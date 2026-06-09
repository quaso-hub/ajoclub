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
  <section id="about" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-(--ui-primary)/5 rounded-full blur-[120px]" />

    <UContainer class="relative">
      <div class="mb-20">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 about-title">About Us</p>
        <h2 class="text-4xl md:text-5xl font-bold about-title">
          A small team with<br />
          <span class="text-(--ui-text-muted)">big ambitions.</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <UCard v-for="stat in stats" :key="stat.label" class="text-center stat-card" :ui="{ body: 'p-6' }">
          <div class="text-3xl md:text-5xl font-bold mb-2">{{ stat.value }}</div>
          <div class="text-xs md:text-sm text-(--ui-text-muted) font-mono uppercase tracking-wider">{{ stat.label }}</div>
        </UCard>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(p, i) in principles" :key="i" class="principle-card">
          <div class="text-6xl font-bold text-(--ui-text-muted)/20 mb-4">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="text-lg font-semibold mb-3">{{ p.title }}</h3>
          <p class="text-(--ui-text-muted) text-sm leading-relaxed">{{ p.description }}</p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
