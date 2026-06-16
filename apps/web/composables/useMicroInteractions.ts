/**
 * useMicroInteractions()
 *
 * Imperative micro-interactions that go beyond CSS — needs JS:
 *  - Ripple on click (Material-style fluid feedback for primary buttons)
 *  - Magnet: button subtly pulls toward cursor when nearby
 *  - Parallax tilt: 3D rotation tracking mouse position (CSS .micro-tilt
 *    handles the case where mouse is anywhere inside; this adds per-pixel
 *    smoothness for high-end surfaces)
 *
 * Pure utility: returns nothing stateful. All effects are scoped to elements
 * matched by [data-micro="ripple|magnet|tilt"] attribute.
 *
 * Respects prefers-reduced-motion: returns early, no listeners attached.
 *
 * Usage:
 *   <script setup lang="ts">
 *   useMicroInteractions()
 *   </script>
 *   <button data-micro="ripple">Click me</button>
 *   <a data-micro="magnet">Hover me</a>
 *   <div data-micro="tilt">3D card</div>
 */
export function useMicroInteractions() {
  const isReducedMotion = ref(false)

  onMounted(() => {
    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion.value) return

    // Only handle fine pointers (mouse / trackpad) — touch is too coarse
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const cleanups: Array<() => void> = []

    document.querySelectorAll<HTMLElement>('[data-micro="ripple"]').forEach((el) => {
      cleanups.push(attachRipple(el))
    })

    document.querySelectorAll<HTMLElement>('[data-micro="magnet"]').forEach((el) => {
      cleanups.push(attachMagnet(el))
    })

    document.querySelectorAll<HTMLElement>('[data-micro="tilt"]').forEach((el) => {
      cleanups.push(attachTilt(el))
    })

    onBeforeUnmount(() => {
      cleanups.forEach((fn) => fn())
    })
  })

  return { isReducedMotion }
}

/* ---------- Ripple ---------- */
function attachRipple(el: HTMLElement) {
  if (el.dataset.microRippleInit) return () => {}
  el.dataset.microRippleInit = '1'

  // Make sure host can host an absolutely-positioned child
  const computed = window.getComputedStyle(el)
  if (computed.position === 'static') el.style.position = 'relative'
  el.style.overflow = 'hidden'
  el.style.isolation = 'isolate'

  const onPointerDown = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.1
    const ripple = document.createElement('span')

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      border-radius: 999px;
      background: color-mix(in srgb, currentColor 16%, transparent);
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      transition: transform 540ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 540ms ease;
      z-index: 0;
    `
    el.appendChild(ripple)

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)'
      ripple.style.opacity = '0'
    })

    setTimeout(() => ripple.remove(), 600)
  }

  el.addEventListener('pointerdown', onPointerDown)
  return () => el.removeEventListener('pointerdown', onPointerDown)
}

/* ---------- Magnet ---------- */
function attachMagnet(el: HTMLElement) {
  if (el.dataset.microMagnetInit) return () => {}
  el.dataset.microMagnetInit = '1'
  el.style.transition = 'transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1)'

  const STRENGTH = 0.18 // 18% pull — subtle, not cartoonish
  const RADIUS = 80 // px from center where pull is active

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const distance = Math.hypot(dx, dy)

    if (distance > RADIUS) {
      el.style.transform = 'translate(0, 0)'
      return
    }

    const falloff = 1 - distance / RADIUS
    el.style.transform = `translate(${(dx * STRENGTH * falloff).toFixed(1)}px, ${(dy * STRENGTH * falloff).toFixed(1)}px)`
  }

  const onLeave = () => {
    el.style.transform = 'translate(0, 0)'
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  el.addEventListener('pointerleave', onLeave)
  return () => {
    window.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}

/* ---------- Tilt ---------- */
function attachTilt(el: HTMLElement) {
  if (el.dataset.microTiltInit) return () => {}
  el.dataset.microTiltInit = '1'

  el.style.transition = 'transform 80ms linear'
  el.style.transformStyle = 'preserve-3d'
  el.style.willChange = 'transform'

  const MAX_DEG = 6
  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-y * 2 * MAX_DEG).toFixed(2)}deg) rotateY(${(x * 2 * MAX_DEG).toFixed(2)}deg)`
  }

  const onLeave = () => {
    el.style.transition = 'transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1)'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}
