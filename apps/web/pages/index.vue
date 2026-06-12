<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({ layout: false })

useHead({
  title: 'AjoClub - Jasa Bikin Website',
  meta: [
    { name: 'description', content: 'Jasa bikin website: landing page, company profile, SaaS, dashboard. Satu tim, satu stack, dari diskusi sampai online.' },
  ],
})

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  nextTick(() => {
    // Hero text stagger reveal
    gsap.utils.toArray('.hero-text').forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: i * 0.15,
        ease: 'power3.out',
      })
    })

    // Section titles: slide up on scroll
    gsap.utils.toArray('.service-title, .work-title, .about-title, .contact-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
      })
    })

    // Service cards: stagger batch
    ScrollTrigger.batch('.service-card', {
      onEnter: (batch) => gsap.from(batch, { y: 80, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Showcase cards: stagger batch
    ScrollTrigger.batch('.showcase-card', {
      onEnter: (batch) => gsap.from(batch, { y: 80, opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.6, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Showcase title
    gsap.utils.toArray('.showcase-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
      })
    })

    // Work cards: stagger batch with scale
    ScrollTrigger.batch('.work-card', {
      onEnter: (batch) => gsap.from(batch, { y: 80, opacity: 0, scale: 0.95, stagger: 0.12, duration: 0.7, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Stat cards: stagger batch
    ScrollTrigger.batch('.stat-card', {
      onEnter: (batch) => gsap.from(batch, { y: 60, opacity: 0, scale: 0.9, stagger: 0.08, duration: 0.5, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Principle cards: stagger
    ScrollTrigger.batch('.principle-card', {
      onEnter: (batch) => gsap.from(batch, { y: 60, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Contact section: slide up
    gsap.from('.contact-form', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
    })
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<template>
    <div>
    <Navbar />
    <Hero3D />
    <ShowcaseSection />
    <WorkSection />
    <ServicesSection />
    <AboutSection />
    <ContactSection />
    <FooterSection />
    <WhatsAppFAB />
  </div>
</template>
