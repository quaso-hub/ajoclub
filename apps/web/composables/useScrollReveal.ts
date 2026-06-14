/**
 * useScrollReveal(slug)
 *
 * Adds GSAP ScrollTrigger-based reveal animations to a template page.
 * Elements with `data-reveal` attribute are animated on scroll.
 *
 * Usage in template:
 *   <h2 data-reveal="fade-up">Title</h2>
 *   <div data-reveal="fade-up" data-reveal-delay="0.1">Content</div>
 *   <div data-reveal="stagger-children">List of items</div>
 *
 * Reveal types:
 *   - "fade-up" — fade in + slide up (default)
 *   - "fade-down" — fade in + slide down
 *   - "fade-left" — fade in + slide from left
 *   - "fade-right" — fade in + slide from right
 *   - "scale" — fade in + scale from 0.9
 *   - "stagger-children" — stagger children with fade-up
 *   - "blur" — fade in + blur to clear
 *   - "slide-up" — slide up without fade (for sticky elements)
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollReveal(slug?: string) {
  const isReducedMotion = ref(false)

  onMounted(() => {
    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion.value) return

    gsap.registerPlugin(ScrollTrigger)

    // Wait for next tick to ensure DOM is ready
    nextTick(() => {
      initRevealAnimations()
    })
  })

  onBeforeUnmount(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill())
  })

  function initRevealAnimations() {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!elements.length) return

    elements.forEach((el) => {
      const type = el.getAttribute('data-reveal') || 'fade-up'
      const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0')
      const duration = parseFloat(el.getAttribute('data-reveal-duration') || '0.8')
      const ease = el.getAttribute('data-reveal-ease') || 'power3.out'

      const config: gsap.TweenVars = {
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      }

      switch (type) {
        case 'fade-up':
          gsap.from(el, {
            opacity: 0,
            y: 40,
            ...config,
          })
          break

        case 'fade-down':
          gsap.from(el, {
            opacity: 0,
            y: -40,
            ...config,
          })
          break

        case 'fade-left':
          gsap.from(el, {
            opacity: 0,
            x: -40,
            ...config,
          })
          break

        case 'fade-right':
          gsap.from(el, {
            opacity: 0,
            x: 40,
            ...config,
          })
          break

        case 'scale':
          gsap.from(el, {
            opacity: 0,
            scale: 0.9,
            ...config,
          })
          break

        case 'stagger-children': {
          const children = el.children
          if (children.length) {
            gsap.from(children, {
              opacity: 0,
              y: 30,
              duration,
              ease,
              stagger: 0.08,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            })
          }
          break
        }

        case 'blur':
          gsap.from(el, {
            opacity: 0,
            filter: 'blur(8px)',
            ...config,
          })
          break

        case 'slide-up':
          gsap.from(el, {
            y: 60,
            ...config,
          })
          break

        default:
          gsap.from(el, {
            opacity: 0,
            y: 40,
            ...config,
          })
      }
    })
  }

  return {
    isReducedMotion,
  }
}
