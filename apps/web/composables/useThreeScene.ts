import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// Chromatic aberration shader (Active Theory style)
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.002 },
    angle: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float angle;
    varying vec2 vUv;
    void main() {
      vec2 offset = amount * vec2(cos(angle), sin(angle));
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `,
}

// Film grain shader (subtle texture)
const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    intensity: { value: 0.03 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float grain = rand(vUv + time) * intensity;
      color.rgb += grain - intensity * 0.5;
      gl_FragColor = color;
    }
  `,
}

export function useThreeScene(containerRef: Ref<HTMLElement | null>) {
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let composer: EffectComposer
  let animationId: number
  let particles: THREE.Points
  let chromaPass: ShaderPass
  let grainPass: ShaderPass
  let mouse = { x: 0, y: 0 }
  let targetRotation = { x: 0, y: 0 }
  let scrollProgress = 0

  function init() {
    if (!containerRef.value) return

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 1000)
    camera.position.z = 30

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    containerRef.value.appendChild(renderer.domElement)

    // Post-processing: bloom for premium glow
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.value.clientWidth, containerRef.value.clientHeight),
      0.8,  // strength
      0.4,  // radius
      0.85, // threshold
    )
    composer.addPass(bloomPass)

    // Chromatic aberration (subtle RGB split, mouse-responsive)
    chromaPass = new ShaderPass(ChromaticAberrationShader)
    chromaPass.uniforms.amount.value = 0.0015
    composer.addPass(chromaPass)

    // Film grain (subtle texture)
    grainPass = new ShaderPass(FilmGrainShader)
    grainPass.uniforms.intensity.value = 0.025
    composer.addPass(grainPass)

    createParticles()
    addLights()
    animate()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)
  }

  function createParticles() {
    const count = 3000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    const palette = [
      new THREE.Color(0xf43f5e), // rose-500
      new THREE.Color(0xfb7185), // rose-400
      new THREE.Color(0xe11d48), // rose-600
      new THREE.Color(0xfda4af), // rose-300
      new THREE.Color(0xffffff), // white sparks
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Sphere distribution with some clustering
      const radius = 12 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      sizes[i] = Math.random() * 3 + 0.5
      seeds[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))
    const p1 = new THREE.PointLight(0xf43f5e, 3, 60)
    p1.position.set(15, 15, 15)
    scene.add(p1)
    const p2 = new THREE.PointLight(0xe11d48, 2, 60)
    p2.position.set(-15, -15, 15)
    scene.add(p2)
    const p3 = new THREE.PointLight(0xfb7185, 1.5, 40)
    p3.position.set(0, 20, -10)
    scene.add(p3)
  }

  function onMouseMove(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  function onScroll() {
    const heroHeight = containerRef.value?.clientHeight || window.innerHeight
    scrollProgress = Math.min(window.scrollY / heroHeight, 1)
  }

  function onResize() {
    if (!containerRef.value) return
    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    composer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }

  function animate() {
    animationId = requestAnimationFrame(animate)

    const time = Date.now() * 0.0003

    // Mouse follow (smooth)
    targetRotation.x += (mouse.y * 0.4 - targetRotation.x) * 0.03
    targetRotation.y += (mouse.x * 0.4 - targetRotation.y) * 0.03

    // Scroll response: camera pulls back, particles spread
    const scrollEase = scrollProgress * scrollProgress // ease-in
    camera.position.z = 30 - scrollEase * 15
    particles.rotation.x += 0.0008
    particles.rotation.y += 0.0015
    particles.rotation.x += (targetRotation.x - particles.rotation.x) * 0.015
    particles.rotation.y += (targetRotation.y - particles.rotation.y) * 0.015

    // Particle wave animation
    const positions = particles.geometry.attributes.position.array as Float32Array
    const seeds = particles.geometry.attributes.seed.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const r = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2)
      const seed = seeds[i / 3]
      // Gentle wave + scroll-driven spread
      positions[i + 1] += Math.sin(time + r * 0.15 + seed * 6.28) * 0.008
      positions[i] += Math.cos(time * 0.7 + r * 0.1) * 0.004
      // Scroll: particles drift outward
      const drift = scrollEase * 0.02 * seed
      positions[i] += Math.sign(positions[i]) * drift
      positions[i + 1] += Math.sign(positions[i + 1]) * drift
    }
    particles.geometry.attributes.position.needsUpdate = true

    // Update post-processing uniforms
    chromaPass.uniforms.angle.value = Math.atan2(mouse.y, mouse.x)
    chromaPass.uniforms.amount.value = 0.001 + Math.abs(mouse.x) * 0.001
    grainPass.uniforms.time.value = time * 10

    composer.render()
  }

  function destroy() {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)

    if (scene) {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
            mats.forEach(m => m.dispose())
          }
        }
      })
    }

    if (particles) {
      particles.geometry.dispose()
      ;(particles.material as THREE.PointsMaterial).dispose()
    }

    composer?.dispose()
    renderer?.dispose()
  }

  return { init, destroy, scrollProgress: computed(() => scrollProgress) }
}
