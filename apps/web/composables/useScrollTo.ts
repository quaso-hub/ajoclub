export function useScrollTo() {
  const { $lenis } = useNuxtApp()

  function scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
    const el = typeof target === 'string' ? document.querySelector(target) as HTMLElement | null : target

    if ($lenis) {
      $lenis.scrollTo(el || target, {
        offset: options?.offset || 0,
        duration: options?.duration || 1.2,
      })
      window.setTimeout(() => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 1400)
    }
    else {
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { scrollTo }
}
