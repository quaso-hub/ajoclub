<script setup lang="ts">
const canvasContainer = ref<HTMLElement | null>(null)
const { init, destroy } = useThreeScene(canvasContainer)

onMounted(() => nextTick(() => init()))
onUnmounted(() => destroy())
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
    <div ref="canvasContainer" class="absolute inset-0 z-0" />
    <div class="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950 z-[1]" />

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
      <div class="max-w-3xl">
        <p class="text-rose-400 text-sm font-mono tracking-widest uppercase mb-6 hero-text">Digital Agency</p>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-zinc-100 leading-[0.95] mb-8 hero-text">
          We build<br />
          <span class="text-rose-400">digital</span><br />
          experiences.
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 hero-text">
          Landing pages, SaaS apps, and mobile experiences. One team, one stack, zero compromises.
        </p>
        <div class="flex flex-wrap gap-4 hero-text">
          <button
            class="group px-8 py-4 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
            @click="document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })"
          >
            See our work
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            class="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            @click="document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })"
          >
            Get in touch
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
      <div class="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-zinc-400 rounded-full mt-2 animate-bounce" />
      </div>
    </div>
  </section>
</template>
