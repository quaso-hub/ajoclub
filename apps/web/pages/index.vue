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
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
      })
    })

    // Section titles: slide up on scroll
    gsap.utils.toArray('.service-title, .work-title, .about-title, .contact-title, .showcase-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
      })
    })

    // Cards: stagger batch
    ScrollTrigger.batch('.service-card, .showcase-card, .work-card, .stat-card, .principle-card', {
      onEnter: (batch) => gsap.from(batch, { y: 60, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }),
      start: 'top 85%',
      once: true,
    })

    // Contact form: slide up
    gsap.from('.contact-form', {
      y: 40,
      opacity: 0,
      duration: 0.8,
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
