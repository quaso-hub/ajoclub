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

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-zinc-950 text-white noise-overlay">
    <ClientOnly>
      <ExperienceCanvas
        preset="shader-portal"
        accent="#38bdf8"
        intensity="immersive"
        label="AjoClub immersive digital experience"
        class="absolute inset-0 z-0"
      />
    </ClientOnly>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(244,63,94,0.16),transparent_32%),linear-gradient(to_bottom,rgba(9,9,11,0.10),#09090b_92%)] z-[1]" />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent z-[2]" />

    <div ref="heroContent" class="relative z-10 w-full max-w-7xl mx-auto px-6">
      <div class="max-w-4xl pt-20">
        <p class="text-sky-300 text-sm font-mono tracking-widest uppercase mb-6 hero-text">
          AjoClub / Digital Agency
        </p>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] mb-8 hero-text text-balance">
          Kami bikin website yang selesai, bukan yang setengah jadi.
        </h1>
        <p class="text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 hero-text">
          Landing page, company profile, SaaS, atau portofolio. Dari diskusi pertama sampai online, satu tim yang sama.
        </p>
        <div class="grid sm:grid-cols-3 gap-3 max-w-2xl mb-12 hero-text">
          <div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <p class="text-xs text-zinc-400 uppercase tracking-wider">Stack</p>
            <p class="font-semibold">Nuxt 3 + TypeScript</p>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <p class="text-xs text-zinc-400 uppercase tracking-wider">Tim</p>
            <p class="font-semibold">4 orang, 1 proyek</p>
          </div>
          <div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <p class="text-xs text-zinc-400 uppercase tracking-wider">Kontak</p>
            <p class="font-semibold">WhatsApp langsung</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 hero-text">
          <UButton size="xl" @click="scrollTo('#showcase')">
            Lihat template
            <template #trailing>
              <UIcon name="i-lucide-arrow-right" />
            </template>
          </UButton>
          <UButton size="xl" variant="outline" color="neutral" @click="scrollTo('#contact')">
            Chat WhatsApp
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
