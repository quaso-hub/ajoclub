import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useGsapScroll() {
  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
  })

  function fadeUp(selector: string, options?: gsap.TweenVars) {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
        ...options,
      })
    })
  }

  function staggerReveal(selector: string, stagger = 0.1) {
    const elements = gsap.utils.toArray(selector)
    gsap.from(elements as HTMLElement[], {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0] as HTMLElement,
        start: 'top 85%',
      },
    })
  }

  function parallax(selector: string, speed = 50) {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.to(el as HTMLElement, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
  }

  function scaleReveal(selector: string) {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.from(el as HTMLElement, {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 80%',
        },
      })
    })
  }

  function horizontalReveal(selector: string, direction: 'left' | 'right' = 'left') {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.from(el as HTMLElement, {
        x: direction === 'left' ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 80%',
        },
      })
    })
  }

  function textReveal(selector: string) {
    gsap.utils.toArray(selector).forEach((el) => {
      const htmlEl = el as HTMLElement
      const text = htmlEl.textContent || ''
      htmlEl.innerHTML = ''
      text.split('').forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(40px)'
        htmlEl.appendChild(span)
      })

      gsap.to(htmlEl.children, {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: htmlEl,
          start: 'top 85%',
        },
      })
    })
  }

  return {
    fadeUp,
    staggerReveal,
    parallax,
    scaleReveal,
    horizontalReveal,
    textReveal,
  }
}
