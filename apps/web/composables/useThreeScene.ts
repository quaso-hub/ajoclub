import * as THREE from 'three'

export function useThreeScene(containerRef: Ref<HTMLElement | null>) {
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let animationId: number
  let particles: THREE.Points
  let mouse = { x: 0, y: 0 }
  let targetRotation = { x: 0, y: 0 }

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

    createParticles()
    addLights()
    animate()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
  }

  function createParticles() {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const palette = [
      new THREE.Color(0xf43f5e), // rose-500
      new THREE.Color(0xfb7185), // rose-400
      new THREE.Color(0xe11d48), // rose-600
      new THREE.Color(0xfda4af), // rose-300
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 15 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    const p1 = new THREE.PointLight(0xf43f5e, 2, 50)
    p1.position.set(10, 10, 10)
    scene.add(p1)
    const p2 = new THREE.PointLight(0xe11d48, 2, 50)
    p2.position.set(-10, -10, 10)
    scene.add(p2)
  }

  function onMouseMove(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  function onResize() {
    if (!containerRef.value) return
    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }

  function animate() {
    animationId = requestAnimationFrame(animate)

    targetRotation.x += (mouse.y * 0.3 - targetRotation.x) * 0.05
    targetRotation.y += (mouse.x * 0.3 - targetRotation.y) * 0.05

    particles.rotation.x += 0.001
    particles.rotation.y += 0.002
    particles.rotation.x += (targetRotation.x - particles.rotation.x) * 0.02
    particles.rotation.y += (targetRotation.y - particles.rotation.y) * 0.02

    const pos = particles.geometry.attributes.position.array as Float32Array
    const t = Date.now() * 0.0003
    for (let i = 0; i < pos.length; i += 3) {
      const r = Math.sqrt(pos[i] ** 2 + pos[i + 1] ** 2 + pos[i + 2] ** 2)
      pos[i + 1] += Math.sin(t + r * 0.1) * 0.01
    }
    particles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  function destroy() {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)

    // Dispose all scene children
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

    renderer?.dispose()
  }

  return { init, destroy }
}
