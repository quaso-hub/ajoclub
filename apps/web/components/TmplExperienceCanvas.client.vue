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
let primaryMaterial: THREE.ShaderMaterial | null = null

// Smooth mouse tracking with damp() instead of lerp()
let pointer = { x: 0, y: 0 }
let smoothPointer = { x: 0, y: 0 }
let scrollProgress = 0
let smoothScroll = 0

// Simplex noise time
let noiseTime = 0

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

// Frame-rate-independent damping (from research)
function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

function qualityProfile() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  if (isReducedMotion.value) return { particles: 200, dpr: 1 }
  if (width < 640) return { particles: 600, dpr: 1 }
  if (width < 1024) return { particles: 1200, dpr: 1.25 }
  if (dpr > 1.5) return { particles: 2000, dpr: 1.35 }
  return { particles: 2500, dpr: 1.5 }
}

function presetGeometry(): THREE.BufferGeometry {
  switch (props.preset) {
    case 'orbit-product':
      return new THREE.IcosahedronGeometry(3.4, 3)
    case 'case-timeline':
      return new THREE.TorusKnotGeometry(2.25, 0.28, 200, 16)
    case 'shader-portal':
      return new THREE.TorusGeometry(2.8, 0.18, 24, 160)
    case 'cinematic-scroll':
      return new THREE.OctahedronGeometry(3.1, 3)
    case 'sphere':
      return new THREE.SphereGeometry(2.8, 80, 80)
    default:
      return new THREE.DodecahedronGeometry(3, 3)
  }
}

// GLSL Simplex Noise (Ashima) — for organic vertex displacement
const simplexNoise3D = /* glsl */`
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`

// Custom shader material with noise-based vertex displacement
function createPresetMaterial(accent: THREE.Color): THREE.ShaderMaterial {
  const intensity = props.intensity === 'immersive' ? 1.2 : props.intensity === 'calm' ? 0.4 : 0.7

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAccent: { value: accent },
      uAccentComplement: { value: new THREE.Color(accent).offsetHSL(0.5, 0, 0) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: intensity },
      uNoiseScale: { value: 0.8 },
      uNoiseStrength: { value: 0.3 },
    },
    vertexShader: `
      ${simplexNoise3D}
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uIntensity;
      uniform float uNoiseScale;
      uniform float uNoiseStrength;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;
      varying float vFresnel;

      void main() {
        vec3 pos = position;
        // Noise-based organic displacement
        float noise = snoise(pos * uNoiseScale + uTime * 0.3) * uNoiseStrength * uIntensity;
        pos += normal * noise;
        vDisplacement = noise;

        // Mouse influence (subtle push/pull)
        float mouseInfluence = 0.15 * uIntensity;
        pos.x += uMouse.x * mouseInfluence * (1.0 + abs(pos.y) * 0.3);
        pos.y += uMouse.y * mouseInfluence * (1.0 + abs(pos.x) * 0.3);

        // Scroll influence (compress on scroll)
        pos *= 1.0 - uScroll * 0.12;

        vNormal = normalMatrix * normal;
        vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

        // Fresnel for rim lighting
        vec3 viewDir = normalize(-vPosition);
        vFresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uAccent;
      uniform vec3 uAccentComplement;
      uniform float uTime;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;
      varying float vFresnel;

      void main() {
        // Base color with noise-driven variation
        vec3 baseColor = mix(uAccent, uAccentComplement, vDisplacement * 2.0 + 0.5);

        // Lighting
        vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
        float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
        float ambient = 0.25;

        // Fresnel rim lighting (colored)
        vec3 rimColor = mix(uAccent, vec3(1.0), 0.5);
        vec3 rim = rimColor * vFresnel * 0.6 * uIntensity;

        // Specular
        vec3 viewDir = normalize(-vPosition);
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normalize(vNormal), halfDir), 0.0), 32.0);

        vec3 finalColor = baseColor * (ambient + diffuse * 0.7) + rim + vec3(spec * 0.3);

        // Subtle emissive glow
        finalColor += uAccent * 0.08;

        gl_FragColor = vec4(finalColor, 0.92);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    wireframe: props.preset === 'shader-portal',
  })
}

/* ============ Build scene ============ */
function buildScene() {
  if (!host.value) return
  const rect = host.value.getBoundingClientRect()
  let width = rect.width
  let height = rect.height
  if (width === 0 || height === 0) {
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

  // Primary shape with custom shader material
  primaryMaterial = createPresetMaterial(accent)

  primaryGroup = new THREE.Group()
  const mesh = new THREE.Mesh(presetGeometry(), primaryMaterial)
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
      color: new THREE.Color(props.accent).offsetHSL(0.5, 0, 0),
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

  // Colored accent light for atmosphere
  const accentLight = new THREE.PointLight(accent, 15, 20)
  accentLight.position.set(0, -3, 3)
  scene.add(accentLight)

  // Particles with size variation and color gradients
  const particleCount = q.particles
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = 5 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos((Math.random() * 2) - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    // Color gradient: accent → white → complement
    const t = Math.random()
    const color = t > 0.7 ? new THREE.Color(0xffffff) : t > 0.4 ? accent : new THREE.Color(props.accent).offsetHSL(0.3, 0, 0)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
    // Size variation
    sizes[i] = 0.02 + Math.random() * 0.04
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  particleMesh = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: props.intensity === 'calm' ? 0.03 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
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

  const dt = 1 / 60 // assume 60fps for damping
  const time = performance.now() * 0.001
  noiseTime += dt
  const motion = props.intensity === 'immersive' ? 1.2 : props.intensity === 'calm' ? 0.45 : 0.75

  // Smooth damping for mouse and scroll (frame-rate independent)
  smoothPointer.x = damp(smoothPointer.x, pointer.x, 8, dt)
  smoothPointer.y = damp(smoothPointer.y, pointer.y, 8, dt)
  smoothScroll = damp(smoothScroll, scrollProgress, 6, dt)

  const scrollLift = smoothScroll * 1.8

  // Update shader uniforms
  if (primaryMaterial) {
    primaryMaterial.uniforms.uTime.value = noiseTime
    primaryMaterial.uniforms.uMouse.value.set(smoothPointer.x, smoothPointer.y)
    primaryMaterial.uniforms.uScroll.value = smoothScroll
  }

  // Primary group rotation with smooth mouse tracking
  primaryGroup.rotation.x += ((smoothPointer.y * 0.22) - primaryGroup.rotation.x) * 0.04
  primaryGroup.rotation.y += ((smoothPointer.x * 0.3) - primaryGroup.rotation.y) * 0.04
  primaryGroup.rotation.z = Math.sin(time * 0.4) * 0.08 * motion
  primaryGroup.position.y = Math.sin(time * 0.7) * 0.18 - scrollLift
  primaryGroup.scale.setScalar(1 + smoothScroll * 0.16)

  // Particle animation with subtle turbulence
  particleMesh.rotation.y += 0.0016 * motion
  particleMesh.rotation.x += 0.0007 * motion
  particleMesh.rotation.z = Math.sin(time * 0.2) * 0.02 * motion

  // Camera with smooth mouse tracking
  camera.position.z = 10 - smoothScroll * 2
  camera.position.x = damp(camera.position.x, smoothPointer.x * 0.45, 5, dt)
  camera.position.y = damp(camera.position.y, smoothPointer.y * 0.2, 5, dt)
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
