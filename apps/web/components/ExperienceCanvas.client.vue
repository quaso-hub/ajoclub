<script setup lang="ts">
import * as THREE from 'three'

type ScenePreset = 'orbit-product' | 'shader-portal' | 'case-timeline' | 'particle-morph' | 'cinematic-scroll'
type MotionIntensity = 'calm' | 'balanced' | 'immersive'

const props = withDefaults(defineProps<{
  preset?: ScenePreset
  accent?: string
  intensity?: MotionIntensity
  label?: string
}>(), {
  preset: 'particle-morph',
  accent: '#fb7185',
  intensity: 'balanced',
  label: 'AjoClub 3D scene',
})

const root = ref<HTMLElement | null>(null)
const hasWebGL = ref(true)
const isReducedMotion = ref(false)
const isCanvasReady = ref(false)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let frame = 0
let cleanup: Array<() => void> = []
let primaryGroup: THREE.Group | null = null
let particleMesh: THREE.Points | null = null
let pointer = { x: 0, y: 0 }
let scrollProgress = 0

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  }
  catch {
    return false
  }
}

function qualityProfile() {
  const width = window.innerWidth
  const dpr = window.devicePixelRatio || 1
  if (isReducedMotion.value) return { particles: 240, dpr: 1 }
  if (width < 768) return { particles: 520, dpr: 1 }
  if (dpr > 1.5) return { particles: 900, dpr: 1.35 }
  return { particles: 1300, dpr: 1.5 }
}

function presetGeometry() {
  if (props.preset === 'orbit-product') return new THREE.IcosahedronGeometry(3.4, 2)
  if (props.preset === 'case-timeline') return new THREE.TorusKnotGeometry(2.25, 0.28, 160, 12)
  if (props.preset === 'shader-portal') return new THREE.TorusGeometry(2.8, 0.18, 18, 128)
  if (props.preset === 'cinematic-scroll') return new THREE.OctahedronGeometry(3.1, 2)
  return new THREE.DodecahedronGeometry(3, 2)
}

function buildScene() {
  if (!root.value) return

  const quality = qualityProfile()
  const width = root.value.clientWidth || root.value.parentElement?.clientWidth || window.innerWidth
  const height = root.value.clientHeight || root.value.parentElement?.clientHeight || Math.round(window.innerHeight * 0.7)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
  camera.position.set(0, 0.5, 10)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(quality.dpr)
  renderer.setSize(width, height)
  root.value.appendChild(renderer.domElement)
  isCanvasReady.value = true

  const accent = new THREE.Color(props.accent)
  const material = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.72,
    roughness: 0.24,
    emissive: accent,
    emissiveIntensity: 0.2,
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

  scene.add(primaryGroup)
  scene.add(new THREE.AmbientLight(0xffffff, 0.55))

  const keyLight = new THREE.PointLight(accent, 28, 30)
  keyLight.position.set(5, 5, 7)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight(0xffffff, 8, 24)
  rimLight.position.set(-5, -2, 5)
  scene.add(rimLight)

  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(quality.particles * 3)
  const colors = new Float32Array(quality.particles * 3)
  for (let i = 0; i < quality.particles; i++) {
    const i3 = i * 3
    const radius = 5 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    const color = Math.random() > 0.75 ? new THREE.Color(0xffffff) : accent
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleMesh = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: props.intensity === 'calm' ? 0.024 : 0.034,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  scene.add(particleMesh)
}

function resize() {
  if (!root.value || !renderer || !camera) return
  const width = root.value.clientWidth
  const height = root.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  if (!renderer || !scene || !camera || !primaryGroup || !particleMesh) return
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

  renderer.render(scene, camera)
}

function destroy() {
  if (frame) cancelAnimationFrame(frame)
  cleanup.forEach(fn => fn())
  cleanup = []

  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose()
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
        materials.forEach(material => material.dispose())
      }
    })
  }

  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = null
  scene = null
  camera = null
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  hasWebGL.value = supportsWebGL()
  if (!hasWebGL.value || isReducedMotion.value) return

  nextTick(() => {
    requestAnimationFrame(() => {
      try {
        buildScene()
        resize()
        animate()
      }
      catch {
        hasWebGL.value = false
        isCanvasReady.value = false
      }
    })

    const onPointer = (event: PointerEvent) => {
      pointer = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      }
    }
    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    cleanup.push(
      () => window.removeEventListener('pointermove', onPointer),
      () => window.removeEventListener('scroll', onScroll),
      () => window.removeEventListener('resize', resize),
    )
  })
})

onBeforeUnmount(destroy)
</script>

<template>
  <div ref="root" class="experience-canvas" :aria-label="label" role="img">
    <div v-if="!isCanvasReady || !hasWebGL || isReducedMotion" class="experience-fallback">
      <div class="fallback-orb" :style="{ '--accent': accent }" />
      <div class="fallback-ring" />
    </div>
  </div>
</template>
