<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const canvasContainer = ref<HTMLElement | null>(null)
const heroContent = ref<HTMLElement | null>(null)
const { init, destroy } = useThreeScene(canvasContainer)
const { scrollTo } = useScrollTo()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  init()

  // Hero content fade out on scroll
  if (heroContent.value) {
    gsap.to(heroContent.value, {
      opacity: 0,
      y: -80,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: heroContent.value,
        start: 'top top',
        end: '+=400',
        scrub: true,
      },
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
  destroy()
})
</script>

<template>
  <section class="relative h-screen flex items-center overflow-hidden bg-(--ui-bg)">
    <div ref="canvasContainer" class="absolute inset-0 z-0" />
    <div class="absolute inset-0 bg-gradient-to-b from-(--ui-bg)/30 via-transparent to-(--ui-bg) z-[1]" />

    <div ref="heroContent" class="relative z-10 w-full max-w-7xl mx-auto px-6">
      <div class="max-w-3xl">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-6 hero-text">
          Digital Agency
        </p>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 hero-text">
          We build<br />
          <span class="text-(--ui-primary)">digital</span><br />
          experiences.
        </h1>
        <p class="text-lg md:text-xl text-(--ui-text-muted) max-w-xl mb-12 hero-text">
          Landing pages, SaaS apps, and mobile experiences. One team, one stack, zero compromises.
        </p>
        <div class="flex flex-wrap gap-4 hero-text">
          <UButton size="xl" @click="scrollTo('#services')">
            See our work
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" />
            </template>
          </UButton>
          <UButton size="xl" variant="outline" color="neutral" @click="scrollTo('#contact')">
            Get in touch
          </UButton>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
      <div class="w-6 h-10 border-2 border-(--ui-border) rounded-full flex justify-center">
        <div class="w-1 h-3 bg-(--ui-text-muted) rounded-full mt-2 animate-bounce" />
      </div>
    </div>
  </section>
</template>
