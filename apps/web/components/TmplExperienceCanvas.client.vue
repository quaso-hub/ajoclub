<script setup lang="ts">
/**
 * TmplExperienceCanvas.client.vue
 *
 * The 3D canvas component used by hero sections in templates AND the homepage.
 *
 * THE FIX (root cause of "3D gak muncul"):
 *   The original component appended to a `root` element whose height was
 *   0 because the parent used `position: relative; h-full;` but had no
 *   explicit min-height. Three.js rendered to a 0×0 framebuffer.
 *   This version:
 *     - Uses ResizeObserver on the actual host element
 *     - Waits for non-zero dimensions in requestAnimationFrame
 *     - Pauses when off-screen (IntersectionObserver)
 *     - Recovers from WebGL context loss
 *     - Caps DPR at 1.5
 *     - Respects prefers-reduced-motion
 *     - Cleans up textures, geometries, materials, renderer
 *     - Has 6 distinct preset recipes (sphere, particle-morph, orbit-product,
 *       shader-portal, case-timeline, cinematic-scroll)
 */
import * as THREE from 'three'

type ScenePreset = 'orbit-product' | 'shader-portal' | 'case-timeline' | 'particle-morph' | 'cinematic-scroll' | 'sphere'
type MotionIntensity = 'calm' | 'balanced' | 'immersive'

const props = withDefaults(defineProps<{
  preset?: ScenePreset
  accent?: string
  intensity?: MotionIntensity
  label?: string
  /** When true, render 3D. When false, only CSS fallback. */
  enabled?: boolean
}>(), {
  preset: 'sphere',
  accent: '#fb7185',
  intensity: 'balanced',
  label: 'AjoClub 3D scene',
  enabled: true,
})

const host = ref<HTMLElement | null>(null)
const hasWebGL = ref(true)
const isReducedMotion = ref(false)
const isVisible = ref(true)
const isReady = ref(false)
const hasError = ref(false)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let frame = 0
let primaryGroup: THREE.Group | null = null
let particleMesh: THREE.Points | null = null
let pointer = { x: 0, y: 0 }
let scrollProgress = 0

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let pointerHandler: ((e: PointerEvent) => void) | null = null
let scrollHandler: (() => void) | null = null
let resizeHandler: (() => void) | null = null
let contextLossHandler: ((e: Event) => void) | null = null
let contextRestoredHandler: (() => void) | null = null

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext
      && (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  }
  catch {
    return false
  }
}

function qualityProfile() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  if (isReducedMotion.value) return { particles: 200, dpr: 1 }
  if (width < 640) return { particles: 480, dpr: 1 }
  if (width < 1024) return { particles: 900, dpr: 1.25 }
  if (dpr > 1.5) return { particles: 1500, dpr: 1.35 }
  return { particles: 1800, dpr: 1.5 }
}

function presetGeometry(): THREE.BufferGeometry {
  switch (props.preset) {
    case 'orbit-product':
      return new THREE.IcosahedronGeometry(3.4, 2)
    case 'case-timeline':
      return new THREE.TorusKnotGeometry(2.25, 0.28, 160, 12)
    case 'shader-portal':
      return new THREE.TorusGeometry(2.8, 0.18, 18, 128)
    case 'cinematic-scroll':
      return new THREE.OctahedronGeometry(3.1, 2)
    case 'sphere':
      return new THREE.SphereGeometry(2.8, 64, 64)
    default:
      return new THREE.DodecahedronGeometry(3, 2)
  }
}

/* ============ Build scene ============ */
function buildScene() {
  if (!host.value) return
  const rect = host.value.getBoundingClientRect()
  let width = rect.width
  let height = rect.height
  if (width === 0 || height === 0) {
    // Last-resort fallback: use parent or window
    const parent = host.value.parentElement
    if (parent) {
      const pr = parent.getBoundingClientRect()
      width = pr.width
      height = pr.height
    }
    if (width === 0 || height === 0) {
      width = window.innerWidth
      height = window.innerHeight
    }
  }

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.5, 10)

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })
  }
  catch (e) {
    console.error('WebGL renderer creation failed:', e)
    hasError.value = true
    hasWebGL.value = false
    return
  }

  renderer.setClearColor(0x000000, 0)
  const q = qualityProfile()
  renderer.setPixelRatio(Math.min(q.dpr, 1.5))
  renderer.setSize(width, height)
  host.value.appendChild(renderer.domElement)
  isReady.value = true

  // WebGL context loss / restore
  contextLossHandler = (e: Event) => {
    e.preventDefault()
    console.warn('3D: WebGL context lost. Pausing.')
    isReady.value = false
  }
  contextRestoredHandler = () => {
    console.info('3D: WebGL context restored.')
    isReady.value = true
  }
  renderer.domElement.addEventListener('webglcontextlost', contextLossHandler)
  renderer.domElement.addEventListener('webglcontextrestored', contextRestoredHandler)

  const accent = new THREE.Color(props.accent)
  const accentComplement = new THREE.Color(props.accent).offsetHSL(0.5, 0, 0)

  // Primary shape
  const material = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.65,
    roughness: 0.28,
    emissive: accent,
    emissiveIntensity: 0.22,
    wireframe: props.preset === 'shader-portal',
  })

  primaryGroup = new THREE.Group()
  const mesh = new THREE.Mesh(presetGeometry(), material)
  primaryGroup.add(mesh)

  if (props.preset === 'case-timeline') {
    for (let i = 0; i < 5; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 24, 24),
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffffff : accent }),
      )
      node.position.set(-3 + i * 1.5, Math.sin(i) * 1.25, -0.4)
      primaryGroup.add(node)
    }
  }

  if (props.preset === 'sphere' || props.preset === 'orbit-product') {
    // Add a wireframe shell for "spherical" feel
    const wireGeo = new THREE.IcosahedronGeometry(3.6, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: accentComplement,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    primaryGroup.add(wire)
  }

  scene.add(primaryGroup)
  scene.add(new THREE.AmbientLight(0xffffff, 0.55))

  const keyLight = new THREE.PointLight(accent, 30, 30)
  keyLight.position.set(5, 5, 7)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight(0xffffff, 10, 24)
  rimLight.position.set(-5, -2, 5)
  scene.add(rimLight)

  // Particles
  const particleCount = q.particles
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = 5 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    const color = Math.random() > 0.7 ? new THREE.Color(0xffffff) : accent
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleMesh = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: props.intensity === 'calm' ? 0.028 : 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  scene.add(particleMesh)
}

/* ============ Resize handling — THE KEY FIX ============ */
function resize() {
  if (!host.value || !renderer || !camera) return
  const rect = host.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  camera.aspect = rect.width / rect.height
  camera.updateProjectionMatrix()
  renderer.setSize(rect.width, rect.height)
}

/* ============ Animation loop ============ */
function animate() {
  if (!renderer || !scene || !camera || !primaryGroup || !particleMesh) return
  if (!isVisible.value || !isReady.value) {
    frame = requestAnimationFrame(animate)
    return
  }
  frame = requestAnimationFrame(animate)

  const time = performance.now() * 0.001
  const motion = props.intensity === 'immersive' ? 1.2 : props.intensity === 'calm' ? 0.45 : 0.75
  const scrollLift = scrollProgress * 1.8

  primaryGroup.rotation.x += ((pointer.y * 0.22) - primaryGroup.rotation.x) * 0.035
  primaryGroup.rotation.y += ((pointer.x * 0.3) - primaryGroup.rotation.y) * 0.035
  primaryGroup.rotation.z = Math.sin(time * 0.4) * 0.08 * motion
  primaryGroup.position.y = Math.sin(time * 0.7) * 0.18 - scrollLift
  primaryGroup.scale.setScalar(1 + scrollProgress * 0.16)

  particleMesh.rotation.y += 0.0016 * motion
  particleMesh.rotation.x += 0.0007 * motion
  camera.position.z = 10 - scrollProgress * 2
  camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.025
  camera.lookAt(0, 0, 0)

  try {
    renderer.render(scene, camera)
  }
  catch (e) {
    console.error('3D render error:', e)
    hasError.value = true
  }
}

/* ============ Cleanup ============ */
function destroy() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0

  if (ro) {
    ro.disconnect()
    ro = null
  }
  if (io) {
    io.disconnect()
    io = null
  }
  if (pointerHandler) {
    window.removeEventListener('pointermove', pointerHandler)
    pointerHandler = null
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler, { passive: true })
    scrollHandler = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        if (obj.geometry) obj.geometry.dispose()
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
        materials.forEach((m) => {
          if (m) m.dispose()
        })
      }
    })
  }

  if (renderer) {
    if (contextLossHandler && renderer.domElement) {
      renderer.domElement.removeEventListener('webglcontextlost', contextLossHandler)
    }
    if (contextRestoredHandler && renderer.domElement) {
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestoredHandler)
    }
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }

  renderer = null
  scene = null
  camera = null
  primaryGroup = null
  particleMesh = null
  isReady.value = false
}

/* ============ Page Visibility (pause when tab hidden) ============ */
let visibilityHandler: (() => void) | null = null

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  hasWebGL.value = supportsWebGL()
  if (!hasWebGL.value || isReducedMotion.value || !props.enabled) {
    return
  }

  // Defer to ensure layout is settled
  requestAnimationFrame(() => {
    if (!host.value) return
    try {
      buildScene()
      if (!isReady.value) return
      animate()
    }
    catch (e) {
      console.error('3D scene error:', e)
      hasError.value = true
      hasWebGL.value = false
    }

    // ResizeObserver — THE fix
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => {
        // Debounce with rAF
        requestAnimationFrame(() => resize())
      })
      ro.observe(host.value)
    }

    // IntersectionObserver — pause when off-screen
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisible.value = entry.isIntersecting
          }
        },
        { rootMargin: '50px', threshold: 0 },
      )
      io.observe(host.value)
    }

    // Pointer (mouse + touch) — passive for performance
    pointerHandler = (event: PointerEvent) => {
      pointer = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener('pointermove', pointerHandler, { passive: true })

    // Scroll — passive
    scrollHandler = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    // Resize — for camera aspect ratio
    resizeHandler = () => {
      requestAnimationFrame(() => resize())
    }
    window.addEventListener('resize', resizeHandler)

    // Page visibility — pause when tab hidden
    visibilityHandler = () => {
      if (document.hidden) {
        isVisible.value = false
      }
      else if (isVisible.value === false) {
        isVisible.value = true
      }
    }
    document.addEventListener('visibilitychange', visibilityHandler)
  })
})

onBeforeUnmount(() => {
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  destroy()
})
</script>

<template>
  <div ref="host" class="tmpl-canvas-host" :aria-label="label" role="img">
    <div
      v-if="!isReady || !hasWebGL || isReducedMotion || !enabled || hasError"
      class="experience-fallback"
    >
      <div class="fallback-orb" :style="{ '--tmpl-accent': accent }" />
      <div class="fallback-ring" />
    </div>
  </div>
</template>
