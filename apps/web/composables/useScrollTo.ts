export function useScrollTo() {
  const { $lenis } = useNuxtApp()

  function scrollTo(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
    if ($lenis) {
      $lenis.scrollTo(target, {
        offset: options?.offset || 0,
        duration: options?.duration || 1.2,
      })
    }
    else {
      // Fallback for SSR or if Lenis not loaded
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { scrollTo }
}
