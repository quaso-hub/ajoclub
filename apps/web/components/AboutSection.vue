<script setup lang="ts">
const stats = [
  { value: '4', label: 'Team Members' },
  { value: '1', label: 'Unified Stack' },
  { value: '100%', label: 'TypeScript' },
  { value: '0', label: 'Compromises' },
]

const principles = [
  {
    title: 'One Language, Full Stack',
    description: 'TypeScript from database to UI. No context switching, no translation layers. Our team moves fast because everyone speaks the same language.',
  },
  {
    title: 'Build Once, Deploy Everywhere',
    description: 'Web, mobile, and PWA from a single codebase. Capacitor wraps our Nuxt apps into native mobile experiences without maintaining separate codebases.',
  },
  {
    title: 'Performance by Default',
    description: 'Static generation for landing pages. Server-side rendering for apps. Every millisecond counts. We optimize for Core Web Vitals from day one.',
  },
]
</script>

<template>
  <section id="about" class="py-32 bg-black relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[120px]" />

    <div class="max-w-7xl mx-auto px-6 relative">
      <div class="mb-20">
        <p class="text-cyan-400 text-sm font-mono tracking-widest uppercase mb-4 about-title">
          About Us
        </p>
        <h2 class="text-4xl md:text-5xl font-bold text-white about-title">
          A small team with
          <br />
          <span class="text-white/40">big ambitions.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-4 gap-6 mb-20">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] stat-card"
        >
          <div class="text-4xl md:text-5xl font-bold text-white mb-2">
            {{ stat.value }}
          </div>
          <div class="text-sm text-white/40 font-mono uppercase tracking-wider">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(principle, i) in principles"
          :key="i"
          class="principle-card"
        >
          <div class="text-6xl font-bold text-white/5 mb-4">
            {{ String(i + 1).padStart(2, '0') }}
          </div>
          <h3 class="text-lg font-semibold text-white mb-3">
            {{ principle.title }}
          </h3>
          <p class="text-white/40 text-sm leading-relaxed">
            {{ principle.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
