<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({
  layout: false,
})

useHead({
  title: 'AjoClub — Digital Agency',
  meta: [
    { name: 'description', content: 'We build landing pages, SaaS apps, and mobile experiences. One team, one stack, zero compromises.' },
    { property: 'og:title', content: 'AjoClub — Digital Agency' },
    { property: 'og:description', content: 'Landing pages, SaaS apps, and mobile experiences. One team, one stack, zero compromises.' },
  ],
})

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  nextTick(() => {
    gsap.utils.toArray('.hero-text').forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: i * 0.15,
        ease: 'power3.out',
      })
    })

    gsap.utils.toArray('.service-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
        },
      })
    })

    ScrollTrigger.batch('.service-card', {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 80,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        })
      },
      start: 'top 85%',
      once: true,
    })

    gsap.utils.toArray('.work-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
        },
      })
    })

    ScrollTrigger.batch('.work-card', {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 80,
          opacity: 0,
          scale: 0.95,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        })
      },
      start: 'top 85%',
      once: true,
    })

    gsap.utils.toArray('.about-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
        },
      })
    })

    ScrollTrigger.batch('.stat-card', {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 60,
          opacity: 0,
          scale: 0.9,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
        })
      },
      start: 'top 85%',
      once: true,
    })

    ScrollTrigger.batch('.principle-card', {
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        })
      },
      start: 'top 85%',
      once: true,
    })

    gsap.utils.toArray('.contact-title').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
        },
      })
    })

    gsap.from('.contact-info', {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 85%',
      },
    })

    gsap.from('.contact-form', {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 85%',
      },
    })
  })
})
</script>

<template>
  <div>
    <Navbar />
    <Hero3D />
    <ServicesSection />
    <WorkSection />
    <AboutSection />
    <ContactSection />
    <FooterSection />
  </div>
</template>
