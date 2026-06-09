<script setup lang="ts">
const canvasContainer = ref<HTMLElement | null>(null)
const { init, destroy } = useThreeScene(canvasContainer)

onMounted(() => {
  nextTick(() => {
    init()
  })
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-[var(--background)]">
    <div ref="canvasContainer" class="absolute inset-0 z-0" />

    <div class="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)] z-[1]" />

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
      <div class="max-w-3xl">
        <p class="text-[var(--primary)] text-sm font-mono tracking-widest uppercase mb-6 hero-text">
          Digital Agency
        </p>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--foreground)] leading-[0.95] mb-8 hero-text">
          We build
          <br />
          <span class="text-[var(--primary)]">
            digital
          </span>
          <br />
          experiences.
        </h1>
        <p class="text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mb-12 hero-text">
          Landing pages, SaaS apps, and mobile experiences. One team, one stack, zero compromises.
        </p>
        <div class="flex flex-wrap gap-4 hero-text">
          <button
            class="group px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-[var(--radius)] hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            @click="document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })"
          >
            See our work
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            class="px-8 py-4 border border-[var(--border)] text-[var(--foreground)] rounded-[var(--radius)] hover:bg-[var(--accent)] transition-all duration-300"
            @click="document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })"
          >
            Get in touch
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
      <div class="w-6 h-10 border-2 border-[var(--muted-foreground)]/30 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-[var(--muted-foreground)]/60 rounded-full mt-2 animate-bounce" />
      </div>
    </div>
  </section>
</template>
