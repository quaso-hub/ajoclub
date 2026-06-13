<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroContent = ref<HTMLElement | null>(null)
const { scrollTo } = useScrollTo()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

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

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <section class="relative min-h-[100dvh] flex items-center overflow-hidden bg-(--ui-bg)">
    <!-- THE FIX: parent has explicit min-height: 100dvh, canvas has h-full w-full -->
    <div class="absolute inset-0">
      <ClientOnly>
        <TmplExperienceCanvas
          preset="sphere"
          accent="#38bdf8"
          intensity="immersive"
          label="AjoClub 3D hero"
          class="absolute inset-0"
        />
      </ClientOnly>
    </div>
    <div class="absolute inset-0 bg-gradient-to-b from-(--ui-bg)/5 via-(--ui-bg)/15 to-(--ui-bg) z-[1]" />

    <div ref="heroContent" class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl pt-20">
        <p class="text-sky-500 dark:text-sky-400 text-xs sm:text-sm font-mono tracking-widest uppercase mb-4 sm:mb-6 hero-text">
          AjoClub / Digital Agency
        </p>
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] mb-6 sm:mb-8 hero-text text-balance">
          Kami bikin website<br class="hidden sm:block" />
          <span class="text-(--ui-text-muted)">yang selesai.</span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-(--ui-text-muted) max-w-xl mb-8 sm:mb-10 hero-text leading-relaxed">
          Landing page, company profile, SaaS, atau dashboard. Dari diskusi pertama sampai online — satu tim, satu stack.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 hero-text">
          <UButton size="xl" class="w-full sm:w-auto justify-center" @click="scrollTo('#showcase')">
            Lihat template
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" />
            </template>
          </UButton>
          <UButton size="xl" variant="outline" color="neutral" class="w-full sm:w-auto justify-center" @click="scrollTo('#contact')">
            Chat WhatsApp
          </UButton>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
      <div class="w-6 h-10 border-2 border-(--ui-border) rounded-full flex justify-center">
        <div class="w-1 h-3 bg-(--ui-text-muted) rounded-full mt-2 animate-bounce" />
      </div>
    </div>
  </section>
</template>
