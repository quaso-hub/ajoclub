<script setup lang="ts">
/**
 * portfolio-3.vue — INDEKS (Brutalist)
 * Yogyakarta. 2021. No pitch decks.
 *
 * 8 sections: Hero, Studi Kasus, Layanan, Manifesto, Klien, Tim, Kontak, Footer.
 * Inter Black 900 H1, Space Mono body. Force light. Pure red accent #FF0000.
 * Rotating tetrahedron wireframe 3D. Flat manifest grid. Glitch hover.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('portfolio-3')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme
useScrollReveal('portfolio-3')

const ACCENT = '#FF0000'

// ============================================================
// STATE
// ============================================================
const isLoaded = ref(false)
const currentYear = new Date().getFullYear()

// ============================================================
// CASE STUDIES — 8 Indonesian brands, brutalist
// ============================================================
const cases = [
  {
    num: '01',
    name: '.Feast',
    project: 'Turun Tangan',
    year: 2024,
    tags: ['Brand', 'Web'],
    desc: 'Website tur band rock. 47 kota. Jadwal, tiket, langsung.',
    metric: '120K tiket terjual',
  },
  {
    num: '02',
    name: 'Hindia',
    project: 'Menari Dengan Bayangan',
    year: 2024,
    tags: ['Web', 'Motion'],
    desc: 'Visual album interaktif. Scroll = mendengarkan.',
    metric: '2.1M page views',
  },
  {
    num: '03',
    name: 'Sal Priadi',
    project: 'Percakapan Publik',
    year: 2023,
    tags: ['Brand', 'Editorial'],
    desc: 'Identitas seri podcast. Tipografi besar, warna jujur.',
    metric: '8 episode, 340K pendengar',
  },
  {
    num: '04',
    name: 'Pamungkas',
    project: 'Solar',
    year: 2023,
    tags: ['Web', 'Motion'],
    desc: 'Landing page album. Video, lirik bergerak, pre-order.',
    metric: '18K pre-order dalam 2 minggu',
  },
  {
    num: '05',
    name: 'Studio Antelope',
    project: 'Arsip Visual',
    year: 2024,
    tags: ['Brand', 'Web'],
    desc: 'Katalog film dokumenter. Filter tahun, genre, durasi.',
    metric: '200+ film terarsip',
  },
  {
    num: '06',
    name: 'Kedai Kopinet',
    project: 'Menu Tanpa Omong Kosong',
    year: 2023,
    tags: ['Brand', 'Editorial'],
    desc: 'Redesign menu kopi. Harga jelas, foto jujur.',
    metric: '+31% penjualan bulan pertama',
  },
  {
    num: '07',
    name: 'Hellprint',
    project: 'Poster Archive',
    year: 2022,
    tags: ['Web', 'Editorial'],
    desc: 'Database poster gig Indonesia. Cari kota, band, tahun.',
    metric: '5.000+ poster terindeks',
  },
  {
    num: '08',
    name: 'Kolektif Komunal',
    project: 'Ruang Kerja Bersama',
    year: 2022,
    tags: ['Brand', 'Web'],
    desc: 'Booking co-working Yogyakarta. Langsung, tanpa formulir.',
    metric: '85% occupancy rate',
  },
]

const caseTags = computed(() => {
  const all = cases.flatMap(c => c.tags)
  return ['Semua', ...new Set(all)]
})
const activeFilter = ref('Semua')
const filteredCases = computed(() =>
  activeFilter.value === 'Semua'
    ? cases
    : cases.filter(c => c.tags.includes(activeFilter.value)),
)

// ============================================================
// SERVICES — 4 items
// ============================================================
const services = [
  {
    num: '01',
    title: 'Identitas Visual',
    desc: 'Logo, warna, tipografi. Bukan hiasan. Fungsi.',
  },
  {
    num: '02',
    title: 'Desain Web',
    desc: 'Cepat, langsung, tanpa template.',
  },
  {
    num: '03',
    title: 'Editorial',
    desc: 'Buku, zine, katalog. Grid jujur. Cetak atau digital.',
  },
  {
    num: '04',
    title: 'Pengembangan Web',
    desc: 'Kode bersih, performa tinggi. Nuxt, Vue, Supabase.',
  },
]

// ============================================================
// MANIFESTO — 2 paragraphs
// ============================================================
const manifesto = [
  'Kami membuat pekerjaan yang berbicara sendiri. Jika kamu perlu 20 slide untuk menjelaskan desain, desainnya belum selesai.',
  'Kami tidak bekerja untuk semua orang. Kami bekerja untuk yang tahu apa yang mereka mau. Yang aman? Cari studio lain.',
]

// ============================================================
// CLIENTS — flat list
// ============================================================
const clients = [
  '.Feast', 'Hindia', 'Sal Priadi', 'Pamungkas',
  'Studio Antelope', 'Kedai Kopinet', 'Hellprint', 'Kolektif Komunal',
  'Rumah Sakit', 'Taman Ismail Marzuki', 'Jogja Records', 'Synchronize Fest',
]

// ============================================================
// TEAM — 4 founders
// ============================================================
const team = [
  {
    name: 'Hana Kartika',
    role: 'Pendiri / Tipografi',
    bio: 'Mantan dosen ISI Yogyakarta. Spesialis huruf dan tata letak. Satu huruf yang benar lebih kuat dari seribu elemen.',
  },
  {
    name: 'Reza Aditya',
    role: 'Pendiri / Kode',
    bio: 'Full-stack developer. Membangun sistem, bukan halaman. Vue, Nuxt, Supabase.',
  },
  {
    name: 'Gilang Pratama',
    role: 'Suara & Audio',
    bio: 'Sound designer. Sonik identitas untuk brand dan ruang. 3 museum, 12 band.',
  },
  {
    name: 'Sekar Wangi',
    role: 'Editorial',
    bio: 'Penulis dan editor. Naskah, buku, konten digital. Setiap kata punya alasan.',
  },
]

// ============================================================
// CONTACT
// ============================================================
const waUrl = computed(() =>
  `https://wa.me/6285188627365?text=${encodeURIComponent('Halo INDEKS, saya ingin bicara tentang proyek.')}`,
)

// ============================================================
// 3D CANVAS — Rotating Tetrahedron
// ============================================================
const canvasHost = ref<HTMLElement | null>(null)
const canvasReady = ref(false)
const canvasReducedMotion = ref(false)

let renderer: any = null
let scene: any = null
let camera: any = null
let tetra: any = null
let wireOuter: any = null
let frame = 0
let pointer = { x: 0, y: 0 }
let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let canvasVisible = ref(true)

function buildTetraScene(THREE: any) {
  if (!canvasHost.value) return
  const rect = canvasHost.value.getBoundingClientRect()
  const w = rect.width || window.innerWidth
  const h = rect.height || window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
  camera.position.set(0, 0, 8)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(w, h)
  canvasHost.value.appendChild(renderer.domElement)

  const accent = new THREE.Color(ACCENT)

  // Main tetrahedron — solid
  const geo = new THREE.TetrahedronGeometry(2.2, 0)
  const mat = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.3,
    roughness: 0.5,
    emissive: accent,
    emissiveIntensity: 0.15,
  })
  tetra = new THREE.Mesh(geo, mat)
  scene.add(tetra)

  // Outer wireframe icosahedron
  const wireGeo = new THREE.IcosahedronGeometry(3.2, 1)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  })
  wireOuter = new THREE.Mesh(wireGeo, wireMat)
  scene.add(wireOuter)

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const key = new THREE.PointLight(accent, 25, 20)
  key.position.set(4, 4, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0x000000, 8, 16)
  rim.position.set(-4, -2, 4)
  scene.add(rim)

  canvasReady.value = true
  animateTetra()
}

function animateTetra() {
  if (!renderer || !scene || !camera || !tetra) return
  if (!canvasVisible.value) {
    frame = requestAnimationFrame(animateTetra)
    return
  }
  frame = requestAnimationFrame(animateTetra)

  const t = performance.now() * 0.001

  // Slow rotation + mouse follow
  tetra.rotation.x += ((pointer.y * 0.3) - tetra.rotation.x) * 0.03
  tetra.rotation.y += ((pointer.x * 0.4) - tetra.rotation.y) * 0.03
  tetra.rotation.z = Math.sin(t * 0.5) * 0.1

  // Wireframe counter-rotation
  if (wireOuter) {
    wireOuter.rotation.x -= 0.002
    wireOuter.rotation.y += 0.003
  }

  camera.lookAt(0, 0, 0)

  try {
    renderer.render(scene, camera)
  } catch {
    // silently fail
  }
}

function destroyTetra() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  if (ro) { ro.disconnect(); ro = null }
  if (io) { io.disconnect(); io = null }
  if (renderer) {
    if (renderer.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    renderer.dispose()
  }
  renderer = null
  scene = null
  camera = null
  tetra = null
  wireOuter = null
}

// ============================================================
// GLITCH HOVER STATE
// ============================================================
const glitchTarget = ref<string | null>(null)
let glitchTimeout: any = null

function startGlitch(num: string) {
  glitchTarget.value = num
  clearTimeout(glitchTimeout)
  glitchTimeout = setTimeout(() => { glitchTarget.value = null }, 300)
}

// ============================================================
// LIFECYCLE
// ============================================================
let pointerHandler: ((e: PointerEvent) => void) | null = null

onMounted(async () => {
  setTimeout(() => { isLoaded.value = true }, 300)

  canvasReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (canvasReducedMotion.value) return

  const THREE = await import('three')
  requestAnimationFrame(() => {
    if (!canvasHost.value) return
    buildTetraScene(THREE)

    pointerHandler = (e: PointerEvent) => {
      pointer = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener('pointermove', pointerHandler, { passive: true })

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => { canvasVisible.value = entries[0]?.isIntersecting ?? true },
        { rootMargin: '50px' },
      )
      io.observe(canvasHost.value)
    }
  })
})

onBeforeUnmount(() => {
  if (pointerHandler) window.removeEventListener('pointermove', pointerHandler)
  destroyTetra()
})
</script>

<template>
  <div
    :style="{
      ...styles,
      '--idx-accent': ACCENT,
      '--idx-bg': '#FAFAFA',
      '--idx-fg': '#0A0A0A',
      '--idx-muted': '#4D4D4D',
      '--idx-border': '#E5E5E5',
      '--idx-surface': '#F5F5F5',
      '--idx-mono': `'Space Mono', monospace`,
      '--idx-display': `'Inter', sans-serif`,
    } as any"
    class="min-h-screen antialiased"
    style="background: var(--idx-bg); color: var(--idx-fg); font-family: var(--idx-mono); font-size: 14px; line-height: 1.5;"
  >
    <TemplateBack :accent="ACCENT" />

    <!-- ============================================================ -->
    <!-- NAV -->
    <!-- ============================================================ -->
    <TmplNavbar
      brand="INDEKS"
      :accent="ACCENT"
      bg="#FAFAFA"
      text="#0A0A0A"
      style="solid"
      :force-mode="'light'"
      :show-theme-toggle="false"
      :links="[
        { label: 'Karya', href: '#karya' },
        { label: 'Layanan', href: '#layanan' },
        { label: 'Manifesto', href: '#manifesto' },
        { label: 'Tim', href: '#tim' },
        { label: 'Kontak', href: '#kontak' },
      ]"
    />

    <!-- ============================================================ -->
    <!-- 1. HERO — Massive Inter Black -->
    <!-- ============================================================ -->
    <section id="top" class="relative overflow-hidden" style="min-height: 100svh;">
      <!-- 3D canvas behind text -->
      <div ref="canvasHost" class="absolute inset-0 z-0" style="pointer-events: none;" />

      <div class="relative z-10 w-full" style="padding: 8rem 2rem 5rem;">
        <template v-if="!isLoaded">
          <div style="height: 1.5rem; width: 10rem; background: var(--idx-border); margin-bottom: 2rem;" />
          <div style="height: 5rem; width: 80%; background: var(--idx-border); margin-bottom: 1rem;" />
          <div style="height: 5rem; width: 60%; background: var(--idx-border); margin-bottom: 2rem;" />
          <div style="height: 1rem; width: 50%; background: var(--idx-border);" />
        </template>

        <template v-else>
          <p :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent); margin-bottom: 2rem;">
            Yogyakarta, Indonesia &middot; 2021
          </p>

          <h1 :style="{ ...h1Style, color: 'var(--idx-fg)', fontFamily: 'var(--idx-display)', fontWeight: 900 }" style="margin-bottom: 1.5rem;">
            INI BUKAN<br />PORTOFOLIO.<br />INI MANIFESTO.
          </h1>

          <p :style="monoStyle" style="font-size: 14px; max-width: 480px; color: var(--idx-muted); margin-bottom: 2.5rem; line-height: 1.6;">
            47 proyek. 12 klien. 0 pitch deck.
          </p>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a
              href="#karya"
              style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--idx-accent); color: #fff; font-family: var(--idx-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; border: none; cursor: pointer;"
              @click.prevent="document.querySelector('#karya')?.scrollIntoView({ behavior: 'smooth' })"
            >
              Lihat Karya &darr;
            </a>
            <a
              :href="waUrl"
              target="_blank"
              rel="noopener"
              style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: transparent; color: var(--idx-fg); font-family: var(--idx-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; border: 2px solid var(--idx-fg); cursor: pointer;"
            >
              Hubungi &rarr;
            </a>
          </div>
        </template>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 2. STUDI KASUS — 8 cards, flat grid -->
    <!-- ============================================================ -->
    <section id="karya" style="border-top: 2px solid var(--idx-fg);" data-reveal="fade-up">
      <div style="padding: 5rem 2rem;">
        <!-- Section header -->
        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;" data-reveal="fade-up">
          <div>
            <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">01</span>
            <h2 :style="h2Style" style="margin-top: 0.5rem; font-family: var(--idx-display); font-weight: 900;">Studi Kasus</h2>
          </div>
          <!-- Filter -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button
              v-for="tag in caseTags"
              :key="tag"
              :style="{
                fontFamily: 'var(--idx-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.4rem 0.8rem',
                border: activeFilter === tag ? '2px solid var(--idx-accent)' : '1px solid var(--idx-border)',
                background: activeFilter === tag ? 'var(--idx-accent)' : 'transparent',
                color: activeFilter === tag ? '#fff' : 'var(--idx-muted)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }"
              @click="activeFilter = tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Case grid — 2-col desktop, 1-col mobile -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 480px), 1fr)); gap: 0;" data-reveal="stagger-children">
          <article
            v-for="c in filteredCases"
            :key="c.num"
            :style="{
              padding: '2rem',
              borderTop: '1px solid var(--idx-border)',
              cursor: 'pointer',
              transition: 'background 150ms ease',
              position: 'relative',
              overflow: 'hidden',
            }"
            class="case-card"
            @mouseenter="startGlitch(c.num)"
          >
            <!-- Glitch overlay -->
            <div
              v-if="glitchTarget === c.num"
              class="glitch-overlay"
              style="position: absolute; inset: 0; background: var(--idx-accent); opacity: 0.03; pointer-events: none;"
            />

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <span :style="monoStyle" style="font-size: 48px; font-weight: 700; line-height: 1; color: var(--idx-border);">{{ c.num }}</span>
              <span :style="monoStyle" style="font-size: 12px; color: var(--idx-muted);">{{ c.year }}</span>
            </div>

            <p :style="monoStyle" style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--idx-accent); margin-bottom: 0.5rem;">
              {{ c.name }}
            </p>

            <h3 style="font-family: var(--idx-display); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 0.75rem;">
              {{ c.project }}
            </h3>

            <p :style="monoStyle" style="font-size: 13px; color: var(--idx-muted); margin-bottom: 1rem; line-height: 1.6;">
              {{ c.desc }}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 0.5rem;">
                <span
                  v-for="tag in c.tags"
                  :key="tag"
                  :style="monoStyle"
                  style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.2rem 0.5rem; border: 1px solid var(--idx-border); color: var(--idx-muted);"
                >
                  {{ tag }}
                </span>
              </div>
              <span :style="monoStyle" style="font-size: 12px; font-weight: 700; color: var(--idx-accent);">
                {{ c.metric }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 3. LAYANAN — 4 items -->
    <!-- ============================================================ -->
    <section id="layanan" style="border-top: 2px solid var(--idx-fg);" data-reveal="fade-up">
      <div style="padding: 5rem 2rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">02</span>
        <h2 :style="h2Style" style="margin-top: 0.5rem; margin-bottom: 3rem; font-family: var(--idx-display); font-weight: 900;">Layanan</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 0;" data-reveal="stagger-children">
          <div
            v-for="s in services"
            :key="s.num"
            style="padding: 2rem; border: 1px solid var(--idx-border); margin: -0.5px;"
          >
            <span :style="monoStyle" style="font-size: 36px; font-weight: 700; line-height: 1; color: var(--idx-accent); display: block; margin-bottom: 1rem;">
              {{ s.num }}
            </span>

            <h3 style="font-family: var(--idx-display); font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.75rem;">
              {{ s.title }}
            </h3>

            <p :style="monoStyle" style="font-size: 13px; color: var(--idx-muted); line-height: 1.6;">
              {{ s.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 4. MANIFESTO — 4 paragraphs -->
    <!-- ============================================================ -->
    <section id="manifesto" style="border-top: 2px solid var(--idx-fg); background: var(--idx-fg); color: var(--idx-bg);" data-reveal="fade-up">
      <div style="padding: 5rem 2rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">03</span>
        <h2 :style="h2Style" style="margin-top: 0.5rem; margin-bottom: 3rem; font-family: var(--idx-display); font-weight: 900;">Manifesto</h2>

        <div v-for="(p, i) in manifesto" :key="i" style="margin-bottom: 3rem;">
          <span :style="monoStyle" style="font-size: 64px; font-weight: 700; line-height: 1; color: var(--idx-accent); opacity: 0.3; display: block; margin-bottom: 1rem;">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <p :style="monoStyle" style="font-size: 14px; line-height: 1.7; opacity: 0.9;">
            {{ p }}
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 5. KLIEN — flat list -->
    <!-- ============================================================ -->
    <section style="border-top: 2px solid var(--idx-fg);" data-reveal="fade-up">
      <div style="padding: 5rem 2rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">04</span>
        <h2 :style="h2Style" style="margin-top: 0.5rem; margin-bottom: 3rem; font-family: var(--idx-display); font-weight: 900;">Klien</h2>

        <div style="display: flex; flex-wrap: wrap; gap: 0;">
          <span
            v-for="(c, i) in clients"
            :key="i"
            :style="monoStyle"
            style="font-size: 14px; padding: 1rem 1.5rem; border: 1px solid var(--idx-border); color: var(--idx-muted); transition: color 150ms ease, border-color 150ms ease; cursor: default;"
            class="client-item"
          >
            {{ c }}
          </span>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 6. TIM — 4 founders -->
    <!-- ============================================================ -->
    <section id="tim" style="border-top: 2px solid var(--idx-fg);" data-reveal="fade-up">
      <div style="padding: 5rem 2rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">05</span>
        <h2 :style="h2Style" style="margin-top: 0.5rem; margin-bottom: 3rem; font-family: var(--idx-display); font-weight: 900;">Tim</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 0;" data-reveal="stagger-children">
          <div
            v-for="(m, i) in team"
            :key="i"
            style="padding: 2rem; border: 1px solid var(--idx-border); margin: -0.5px;"
          >
            <span :style="monoStyle" style="font-size: 48px; font-weight: 700; line-height: 1; color: var(--idx-border); display: block; margin-bottom: 1.5rem;">
              {{ String(i + 1).padStart(2, '0') }}
            </span>

            <h3 style="font-family: var(--idx-display); font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.25rem;">
              {{ m.name }}
            </h3>

            <p :style="monoStyle" style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--idx-accent); margin-bottom: 1rem;">
              {{ m.role }}
            </p>

            <p :style="monoStyle" style="font-size: 13px; color: var(--idx-muted); line-height: 1.6;">
              {{ m.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 7. KONTAK -->
    <!-- ============================================================ -->
    <section id="kontak" style="border-top: 2px solid var(--idx-fg);" data-reveal="scale">
      <div style="padding: 5rem 2rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--idx-accent);">06</span>
        <h2 :style="h2Style" style="margin-top: 0.5rem; margin-bottom: 2rem; font-family: var(--idx-display); font-weight: 900;">Kontak</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
          <div>
            <p :style="monoStyle" style="font-size: 14px; line-height: 1.8;">
              hello@indeks.id<br />
              +62 274 555 1234
            </p>
            <a
              :href="waUrl"
              target="_blank"
              rel="noopener"
              style="display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: var(--idx-accent); color: #fff; font-family: var(--idx-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none;"
            >
              Chat WhatsApp &rarr;
            </a>
          </div>
          <div>
            <p :style="monoStyle" style="font-size: 14px; line-height: 1.8;">
              Jl. Malioboro No. 42<br />
              Yogyakarta 55213<br />
              Indonesia
            </p>
            <p :style="monoStyle" style="font-size: 12px; color: var(--idx-muted); margin-top: 1rem;">
              Senin-Jumat, 09.00-18.00 WIB
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 8. FOOTER -->
    <!-- ============================================================ -->
    <footer style="border-top: 2px solid var(--idx-fg); padding: 2rem 2rem;" data-reveal="fade-up">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--idx-muted);">
          &copy; {{ currentYear }} INDEKS &middot; Yogyakarta
        </span>
        <span :style="monoStyle" style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--idx-muted);">
          Template by AjoClub
        </span>
      </div>
    </footer>

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="portfolio"
    />
  </div>
</template>

<style scoped>
/* Brutalist: zero border radius everywhere */
* { border-radius: 0 !important; }

/* Glitch hover effect on case cards */
.case-card:hover {
  background: color-mix(in srgb, var(--idx-accent) 4%, transparent);
}

.case-card:hover h3 {
  color: var(--idx-accent);
  transition: color 150ms ease;
}

/* Glitch animation */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 2px); }
  100% { transform: translate(0); }
}

.glitch-overlay {
  animation: glitch 100ms steps(2) infinite;
}

/* Client hover */
.client-item:hover {
  color: var(--idx-accent) !important;
  border-color: var(--idx-accent) !important;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  section {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
