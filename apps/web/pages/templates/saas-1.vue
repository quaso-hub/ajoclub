<script setup lang="ts">
/**
 * saas-1.vue — Atur
 * Anti-SaaS Editorial SaaS. Magazine layout. Awwwards target.
 *
 * 7 spreads: Cover → Lede → Pull-quote → Daftar Isi → Kolom → Ilustrasi → Kolofon
 * 7 working interactions
 * Subtle 3D: line in cover, 600-particle cloud in Ilustrasi
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('saas-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const seats = ref(5)
const billing = ref<'monthly' | 'yearly'>('monthly')
const plan = ref<'studio' | 'agensi' | 'studio-pro'>('agensi')
const openFaq = ref<number | null>(0)
const activeSpread = ref(1)
const heroLoaded = ref(false)
const isDark = ref(false)
const isReducedMotion = ref(false)
const demoModalOpen = ref(false)
const demoDate = ref('')
const demoTime = ref('14:00')
const demoName = ref('')
const demoStudio = ref('')
const toastMessage = ref('')
let toastTimer: number | null = null
let spreadObserver: IntersectionObserver | null = null

// Pricing
const PRICING = {
  studio: { base: 99000, perSeat: 0, label: 'Atur Studio', audience: 'Untuk: studio 1-3 orang' },
  agensi: { base: 249000, perSeat: 25000, label: 'Atur Agensi', audience: 'Untuk: agensi 4-15 orang' },
  'studio-pro': { base: 499000, perSeat: 40000, label: 'Atur Studio Pro', audience: 'Untuk: studio 15+ orang' },
}

const monthlyTotal = computed(() => {
  const p = PRICING[plan.value]
  return (p.base + p.perSeat * (seats.value - 1)) * (billing.value === 'yearly' ? 10 : 1)
})
const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
const selectedPlan = computed(() => PRICING[plan.value])

// FAQ
const faqs = [
  { q: 'Apa Atur itu?', a: 'SaaS yang membantu tim kecil mengelola proyek, faktur, dan klien dalam satu tempat. Seperti majalah, bukan dashboard.' },
  { q: 'Untuk siapa?', a: 'Studio kreatif dan agensi kecil di Indonesia, 1 sampai 15 orang.' },
  { q: 'Harga berapa?', a: 'Mulai Rp 99.000/bulan. Agensi Rp 249.000. Studio Pro Rp 499.000. Trial 14 hari, tanpa kartu kredit.' },
  { q: 'Bisa integrasi dengan apa?', a: 'WhatsApp, Google Calendar, QRIS, BI-FAST, dan bank lokal. Paket Studio Pro punya API dan webhook.' },
  { q: 'Data aman?', a: 'Server di Jakarta, enkripsi TLS 1.3, backup harian. Tidak dijual atau dipakai training AI.' },
  { q: 'Kalau saya non-teknis?', a: 'Setup 7 menit, antarmuka Bahasa Indonesia, dukungan WhatsApp hari kerja.' },
]

// Daftar Isi (TOC) — 6 articles
const toc = [
  { num: '01', code: 'SAMBUNG', title: 'Brief, faktur, dan klien dalam satu tempat.', product: 'Atur Workspace' },
  { num: '02', code: 'HITUNG', title: 'Jam kerja, tagihan, dan invoice otomatis ke WhatsApp.', product: 'Atur Waktu' },
  { num: '03', code: 'KIRIM', title: 'Proposal dan kontrak tanpa bolak-balik email.', product: 'Atur Proposal' },
  { num: '04', code: 'BAYAR', title: 'Terima pembayaran via QRIS, BI-FAST, atau transfer bank.', product: 'Atur Pembayaran' },
  { num: '05', code: 'LAPOR', title: 'Laporan keuangan studio tanpa bertanya ke akuntan.', product: 'Atur Laporan' },
  { num: '06', code: 'BICARA', title: 'Chat tim, langsung di samping setiap proyek.', product: 'Atur Pesan' },
]

// Klien marquee
const klien = [
  { name: 'Studio Tujuh', city: 'Jakarta', note: 'brief + faktur + portal klien' },
  { name: 'Sasana Visual', city: 'Bandung', note: '12 proyek aktif' },
  { name: 'Bilik Kreasi', city: 'Yogyakarta', note: 'full-cycle production studio' },
  { name: 'Lumina Works', city: 'Surabaya', note: 'desain + interior' },
  { name: 'Arsitek Lokal', city: 'Bandung', note: 'arsitektur + interior' },
  { name: 'Aksara Co.', city: 'Jakarta', note: 'penerbitan + jurnal' },
  { name: 'Kolektif Dua', city: 'Yogyakarta', note: 'branding studio' },
  { name: 'Rumah Reka', city: 'Surabaya', note: 'desain produk' },
  { name: 'Studio Patah', city: 'Jakarta', note: 'film pendek' },
  { name: 'Tiga Bingkai', city: 'Bandung', note: 'video + motion' },
]

// WhatsApp helpers
const { buildUrl } = useWhatsApp()
function buildDemoMessage() {
  return `Halo Atur, saya ${demoName.value || '[nama]'} dari ${demoStudio.value || '[studio]'} mau jadwalkan demo hari ${demoDate.value || '[tanggal]'} jam ${demoTime.value} WIB. Thanks!`
}
function openDemoModal() { demoModalOpen.value = true }
function closeDemoModal() { demoModalOpen.value = false }
function sendDemo() {
  if (!demoDate.value || !demoName.value) {
    showToast('Tanggal dan nama dulu ya')
    return
  }
  window.open(buildUrl(buildDemoMessage()), '_blank', 'noopener,noreferrer')
  closeDemoModal()
}
function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toastMessage.value = '' }, 1800)
}

const referralCode = 'ATUR-X7K2'
async function copyReferral() {
  try {
    await navigator.clipboard.writeText(referralCode)
    showToast('Disalin! Bagikan ke teman.')
  }
  catch {
    showToast(`Salin manual: ${referralCode}`)
  }
}

// ============================================================
// 3D LINE — "the drawing line" in cover
// ============================================================
const lineCanvasRef = ref<HTMLCanvasElement | null>(null)
const lineProgress = ref(0)
const lineReverse = ref(0)
let lineGL: WebGLRenderingContext | null = null
let lineProg: WebGLProgram | null = null
let lineBuf: WebGLBuffer | null = null
let lineAnimId = 0
let lineStartTime = 0

onMounted(() => {
  setTimeout(() => { heroLoaded.value = true }, 100)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  initLine3D()
  initSpreadObserver()
  initTheme()
  if (isReducedMotion.value) {
    lineProgress.value = 1
  }
})

onBeforeUnmount(() => {
  if (lineAnimId) cancelAnimationFrame(lineAnimId)
  if (cloudAnimId) cancelAnimationFrame(cloudAnimId)
  if (spreadObserver) spreadObserver.disconnect()
})

function initLine3D() {
  const canvas = lineCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    lineGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!lineGL) return

  const aspect = rect.width / rect.height

  const vs = `
    attribute vec2 aPos;
    attribute float aDir;
    uniform float uDraw;
    uniform float uReverse;
    uniform float uAspect;
    void main() {
      float drawCutoff = uDraw - aDir;
      float reverseCutoff = aDir - (1.0 - uReverse);
      if (drawCutoff < 0.0 || reverseCutoff > 0.0) {
        gl_Position = vec2(2.0, 2.0);
        return;
      }
      vec2 p = aPos;
      p.x /= uAspect;
      gl_Position = vec4(p, 0.0, 1.0);
    }
  `
  const fs = `
    precision mediump float;
    uniform vec3 uColor;
    void main() {
      gl_FragColor = vec4(uColor, 1.0);
    }
  `
  const vert = lineGL.createShader(lineGL.VERTEX_SHADER)!
  lineGL.shaderSource(vert, vs)
  lineGL.compileShader(vert)
  const frag = lineGL.createShader(lineGL.FRAGMENT_SHADER)!
  lineGL.shaderSource(frag, fs)
  lineGL.compileShader(frag)
  lineProg = lineGL.createProgram()!
  lineGL.attachShader(lineProg, vert)
  lineGL.attachShader(lineProg, frag)
  lineGL.linkProgram(lineProg)

  const segments = 200
  const data: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = t * 2 - 1
    const y = -0.3 + Math.sin(t * Math.PI * 1.5) * 0.25 - t * 0.05
    data.push(x, y, t)
  }
  lineBuf = lineGL.createBuffer()
  lineGL.bindBuffer(lineGL.ARRAY_BUFFER, lineBuf)
  lineGL.bufferData(lineGL.ARRAY_BUFFER, new Float32Array(data), lineGL.STATIC_DRAW)

  lineGL.useProgram(lineProg)
  lineGL.uniform3f(lineGL.getUniformLocation(lineProg, 'uColor'), 0.48, 0.16, 0.28)

  lineStartTime = performance.now()
  function tick() {
    if (!lineGL || !lineProg || !lineBuf || !lineCanvasRef.value) return
    lineAnimId = requestAnimationFrame(tick)
    const elapsed = (performance.now() - lineStartTime) / 1000
    if (elapsed < 1.6) {
      lineProgress.value = elapsed / 1.6
      lineReverse.value = 0
    }
    else {
      lineProgress.value = 1
      lineReverse.value = Math.min(1, Math.max(0, (elapsed - 3.2) / 2))
    }
    lineGL.viewport(0, 0, lineGL.drawingBufferWidth, lineGL.drawingBufferHeight)
    lineGL.clearColor(0, 0, 0, 0)
    lineGL.clear(lineGL.COLOR_BUFFER_BIT)
    lineGL.useProgram(lineProg)
    lineGL.bindBuffer(lineGL.ARRAY_BUFFER, lineBuf)
    lineGL.enableVertexAttribArray(lineGL.getAttribLocation(lineProg, 'aPos'))
    lineGL.vertexAttribPointer(lineGL.getAttribLocation(lineProg, 'aPos'), 2, lineGL.FLOAT, false, 12, 0)
    lineGL.enableVertexAttribArray(lineGL.getAttribLocation(lineProg, 'aDir'))
    lineGL.vertexAttribPointer(lineGL.getAttribLocation(lineProg, 'aDir'), 1, lineGL.FLOAT, false, 12, 8)
    lineGL.uniform1f(lineGL.getUniformLocation(lineProg, 'uDraw'), lineProgress.value)
    lineGL.uniform1f(lineGL.getUniformLocation(lineProg, 'uReverse'), lineReverse.value)
    lineGL.uniform1f(lineGL.getUniformLocation(lineProg, 'uAspect'), aspect)
    lineGL.drawArrays(lineGL.LINE_STRIP, 0, 201)
  }
  tick()
}

// ============================================================
// 3D CLOUD — 600 particles for Ilustrasi spread
// ============================================================
const cloudCanvasRef = ref<HTMLCanvasElement | null>(null)
const cloudProgress = ref(0)
let cloudAnimId = 0
let cloudGL: WebGLRenderingContext | null = null
let cloudProg: WebGLProgram | null = null
let cloudBuf: WebGLBuffer | null = null
let cloudStartTime = 0
let cloudMouseX = 0
let cloudMouseY = 0
let cloudInView = false

onMounted(() => {
  setTimeout(initCloud3D, 80)
  window.addEventListener('mousemove', (e) => {
    cloudMouseX = (e.clientX / window.innerWidth) * 2 - 1
    cloudMouseY = -((e.clientY / window.innerHeight) * 2 - 1)
  })
})

function initCloud3D() {
  const canvas = cloudCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    cloudGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!cloudGL) return

  const aspect = rect.width / rect.height

  const vs = `
    attribute vec2 aPos;
    attribute float aDir;
    attribute float aTarget;
    attribute float aRandom;
    uniform float uProgress;
    uniform float uTime;
    uniform float uMouseX;
    uniform float uMouseY;
    uniform float uAspect;
    void main() {
      vec2 origin = aPos;
      origin.x /= uAspect;
      // Target is on a sphere — project aDir/aTarget to a circle
      float ang = aDir * 6.2831853;
      float radius = 0.4 + aTarget * 0.1;
      vec2 target = vec2(cos(ang), sin(ang)) * radius;
      target.x /= uAspect;
      vec2 p = mix(origin, target, uProgress);
      // Subtle mouse parallax
      p.x += uMouseX * 0.02;
      p.y += uMouseY * 0.02;
      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = 1.5 + aRandom * 1.5;
    }
  `
  const fs = `
    precision mediump float;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d) * 0.7;
      vec3 col = mix(uColorA, uColorB, gl_PointCoord.x);
      gl_FragColor = vec4(col, a);
    }
  `
  const vert = cloudGL.createShader(cloudGL.VERTEX_SHADER)!
  cloudGL.shaderSource(vert, vs)
  cloudGL.compileShader(vert)
  const frag = cloudGL.createShader(cloudGL.FRAGMENT_SHADER)!
  cloudGL.shaderSource(frag, fs)
  cloudGL.compileShader(frag)
  cloudProg = cloudGL.createProgram()!
  cloudGL.attachShader(cloudProg, vert)
  cloudGL.attachShader(cloudProg, frag)
  cloudGL.linkProgram(cloudProg)

  const count = isReducedMotion.value ? 240 : 600
  const data: number[] = []
  for (let i = 0; i < count; i++) {
    const t = i / count
    const ox = t * 2 - 1
    const oy = 0.55 + (Math.random() - 0.5) * 0.08
    const ang = t
    const radius = 0.4 + Math.random() * 0.1
    const tx = Math.cos(ang * Math.PI * 2) * radius
    const ty = Math.sin(ang * Math.PI * 2) * radius
    data.push(ox, oy, t, ang, tx, ty, Math.random())
  }
  cloudBuf = cloudGL.createBuffer()
  cloudGL.bindBuffer(cloudGL.ARRAY_BUFFER, cloudBuf)
  cloudGL.bufferData(cloudGL.ARRAY_BUFFER, new Float32Array(data), cloudGL.STATIC_DRAW)

  cloudGL.useProgram(cloudProg)
  // Aubergine to terracotta
  cloudGL.uniform3f(cloudGL.getUniformLocation(cloudProg, 'uColorA'), 0.48, 0.16, 0.28)
  cloudGL.uniform3f(cloudGL.getUniformLocation(cloudProg, 'uColorB'), 0.66, 0.32, 0.18)

  cloudStartTime = performance.now()

  // Cloud only animates when in view
  const io = new IntersectionObserver(
    (entries) => { cloudInView = entries[0]?.isIntersecting ?? false },
    { threshold: 0.1 },
  )
  io.observe(canvas)

  function tick() {
    if (!cloudGL || !cloudProg || !cloudBuf || !cloudCanvasRef.value) return
    cloudAnimId = requestAnimationFrame(tick)
    if (!cloudInView) return
    const elapsed = (performance.now() - cloudStartTime) / 1000
    // Slow orbit
    const t = (elapsed * 0.05) % 1
    // Progress: 0 (line) -> 1 (sphere) as a smooth wave
    cloudProgress.value = 0.5 + 0.5 * Math.sin(elapsed * 0.2)
    cloudGL.viewport(0, 0, cloudGL.drawingBufferWidth, cloudGL.drawingBufferHeight)
    cloudGL.clearColor(0, 0, 0, 0)
    cloudGL.clear(cloudGL.COLOR_BUFFER_BIT)
    cloudGL.useProgram(cloudProg)
    cloudGL.bindBuffer(cloudGL.ARRAY_BUFFER, cloudBuf)
    cloudGL.enableVertexAttribArray(cloudGL.getAttribLocation(cloudProg, 'aPos'))
    cloudGL.vertexAttribPointer(cloudGL.getAttribLocation(cloudProg, 'aPos'), 2, cloudGL.FLOAT, false, 28, 0)
    cloudGL.enableVertexAttribArray(cloudGL.getAttribLocation(cloudProg, 'aDir'))
    cloudGL.vertexAttribPointer(cloudGL.getAttribLocation(cloudProg, 'aDir'), 1, cloudGL.FLOAT, false, 28, 8)
    cloudGL.enableVertexAttribArray(cloudGL.getAttribLocation(cloudProg, 'aTarget'))
    cloudGL.vertexAttribPointer(cloudGL.getAttribLocation(cloudProg, 'aTarget'), 1, cloudGL.FLOAT, false, 28, 12)
    cloudGL.enableVertexAttribArray(cloudGL.getAttribLocation(cloudProg, 'aRandom'))
    cloudGL.vertexAttribPointer(cloudGL.getAttribLocation(cloudProg, 'aRandom'), 1, cloudGL.FLOAT, false, 28, 24)
    cloudGL.uniform1f(cloudGL.getUniformLocation(cloudProg, 'uProgress'), cloudProgress.value)
    cloudGL.uniform1f(cloudGL.getUniformLocation(cloudProg, 'uTime'), elapsed)
    cloudGL.uniform1f(cloudGL.getUniformLocation(cloudProg, 'uMouseX'), cloudMouseX)
    cloudGL.uniform1f(cloudGL.getUniformLocation(cloudProg, 'uMouseY'), cloudMouseY)
    cloudGL.uniform1f(cloudGL.getUniformLocation(cloudProg, 'uAspect'), aspect)
    cloudGL.drawArrays(cloudGL.POINTS, 0, count)
  }
  tick()
}

// ============================================================
// SPREAD OBSERVER — track which spread is in view
// ============================================================
function initSpreadObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  spreadObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const n = Number((e.target as HTMLElement).dataset.spread)
          if (!Number.isNaN(n)) activeSpread.value = n
        }
      }
    },
    { rootMargin: '-30% 0px -50% 0px', threshold: 0 },
  )
  document.querySelectorAll('[data-spread]').forEach((el) => spreadObserver?.observe(el))
}

// ============================================================
// THEME TOGGLE
// ============================================================
function initTheme() {
  try {
    const saved = localStorage.getItem('atur-theme')
    if (saved === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }
  catch { /* ignore */ }
}
function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    try { localStorage.setItem('atur-theme', 'dark') } catch { /* ignore */ }
  }
  else {
    document.documentElement.classList.remove('dark')
    try { localStorage.setItem('atur-theme', 'light') } catch { /* ignore */ }
  }
}

// Today + min date for demo picker
const today = new Date()
const minDate = today.toISOString().slice(0, 10)
</script>

<template>
  <div class="atur" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <!-- Navbar (minimal) -->
    <TmplNavbar
      brand="Atur"
      :links="[
        { label: '01 / Sampul', href: '#sampul' },
        { label: '02 / Daftar Isi', href: '#daftar-isi' },
        { label: '03 / Kolom', href: '#kolom' },
        { label: '04 / Ilustrasi', href: '#ilustrasi' },
        { label: '05 / Kolofon', href: '#kolofon' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="true"
      @theme-toggle="toggleTheme"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- SPREAD 1 — SAMPUL (Cover)      -->
      <!-- ============================== -->
      <section id="sampul" class="atur-sampul" data-spread="1" :style="{ minHeight: '100dvh' }">
        <div class="atur-sampul__grid">

          <!-- Main column -->
          <div class="atur-sampul__main">
            <p class="atur-eyebrow" :style="monoStyle">UNTUK STUDIO & AGENSI KREATIF</p>

            <h1 :style="h1Style" class="atur-h1 text-balance">
              <span class="atur-h1__line atur-h1__line--italic">Atur setiap proyek,</span>
              <span class="atur-h1__line atur-h1__line--regular" :style="{ color: 'var(--atur-terracotta, #B86438)' }">dari ide sampai akhir.</span>
              <span class="atur-h1__line atur-h1__line--italic">Tanpa spreadsheet.</span>
            </h1>

            <p class="atur-lede">
              SaaS untuk tim kecil yang muak dengan spreadsheet. Setup 7 menit. Bahasa Indonesia. Dukungan WhatsApp.
            </p>

            <div class="atur-cta">
              <a href="#kolom" class="atur-btn atur-btn--primary">
                Lihat cara kerjanya
                <UIcon name="i-lucide-arrow-down" class="w-4 h-4" />
              </a>
              <button type="button" class="atur-btn atur-btn--ghost" @click="openDemoModal">
                Jadwalkan via WhatsApp
              </button>
            </div>

            <p class="atur-byline" :style="monoStyle">
              14 JUNI 2026 &nbsp;·&nbsp; ATUR STUDIO &nbsp;·&nbsp; 5 MENIT BACA
            </p>
          </div>

          <!-- Margin (the editorial signature) -->
          <aside class="atur-sampul__margin" :style="monoStyle">
            <span class="atur-sampul__page">01 / SAMPUL</span>
            <canvas ref="lineCanvasRef" class="atur-sampul__line" />
            <span class="atur-sampul__meta">Ciptaan tim Atur Studio, Jakarta</span>
          </aside>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 2 — LEDE (no visuals)  -->
      <!-- ============================== -->
      <section class="atur-lede-section" data-spread="2">
        <div class="atur-lede-wrap">
          <p class="atur-lede-large">
            Kami membuat Atur karena kami juga bagian dari tim kecil &mdash; dan muak dengan software korporasi 500 orang. Trial 14 hari, tanpa kartu kredit.
          </p>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 3 — PULL-QUOTE          -->
      <!-- ============================== -->
      <section class="atur-pullquote-section" data-spread="3">
        <blockquote class="atur-pullquote" :style="h1Style">
          &ldquo;Aplikasi yang baik adalah aplikasi yang tidak kamu sadari sedang kamu pakai.&rdquo;
        </blockquote>
        <p class="atur-pullquote-attr" :style="monoStyle">
          &mdash; ATUR STUDIO, PANDANGAN REDAKSI
        </p>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 4 — DAFTAR ISI (TOC)     -->
      <!-- ============================== -->
      <section id="daftar-isi" class="atur-toc-section" data-spread="4">
        <div class="atur-section-head">
          <p class="atur-eyebrow" :style="monoStyle">04 / DAFTAR ISI</p>
          <h2 :style="h2Style" class="text-balance">
            Apa yang ada di Atur: <em>enam modul</em>, satu aplikasi.
          </h2>
          <p class="atur-section-sub">
            Enam modul berdiri sendiri. Beli satu, tambah yang lain saat tim tumbuh.
          </p>
        </div>

        <ol class="atur-toc">
          <li v-for="(item, i) in toc" :key="item.num" class="atur-toc__item">
            <span class="atur-toc__num" :style="monoStyle">{{ item.num }}</span>
            <div class="atur-toc__body">
              <p class="atur-toc__code" :style="monoStyle">{{ item.code }} &middot; {{ item.product }}</p>
              <p class="atur-toc__title">{{ item.title }}</p>
            </div>
            <span class="atur-toc__arrow" aria-hidden="true">→</span>
          </li>
        </ol>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 5 — KOLOM (Pricing)     -->
      <!-- ============================== -->
      <section id="kolom" class="atur-kolom-section" data-spread="5">
        <div class="atur-section-head">
          <p class="atur-eyebrow" :style="monoStyle">05 / KOLOM &middot; HARGA</p>
          <h2 :style="h2Style" class="text-balance">
            Tiga paket, <em>tanpa tier gratis</em>. Gratis bukan strategi.
          </h2>
          <p class="atur-section-sub">
            Trial 14 hari. Geser slider untuk hitung harga tim kamu.
          </p>
        </div>

        <!-- Calculator -->
        <div class="atur-calc">
          <div class="atur-calc__row">
            <label class="atur-calc__label">
              <span :style="monoStyle">Paket</span>
              <select v-model="plan" class="atur-calc__select">
                <option value="studio">Atur Studio &mdash; 1-3 orang</option>
                <option value="agensi">Atur Agensi &mdash; 4-15 orang</option>
                <option value="studio-pro">Atur Studio Pro &mdash; 15+ orang</option>
              </select>
            </label>
            <label class="atur-calc__label">
              <span :style="monoStyle">Jumlah orang &nbsp; <strong>{{ seats }}</strong></span>
              <input v-model.number="seats" type="range" min="1" max="50" step="1" class="atur-calc__slider" />
            </label>
            <div class="atur-calc__label">
              <span :style="monoStyle">Tagihan</span>
              <div class="atur-calc__billing">
                <button type="button" :class="{ active: billing === 'monthly' }" @click="billing = 'monthly'">Bulanan</button>
                <button type="button" :class="{ active: billing === 'yearly' }" @click="billing = 'yearly'">
                  Tahunan <span :style="monoStyle" class="atur-calc__save">hemat 17%</span>
                </button>
              </div>
            </div>
          </div>

          <div class="atur-calc__total">
            <p class="atur-calc__total-label" :style="monoStyle">Total per {{ billing === 'yearly' ? 'tahun' : 'bulan' }}</p>
            <p class="atur-calc__total-value" :style="h1Style">
              {{ fmtRp(monthlyTotal) }}
            </p>
            <p class="atur-calc__total-note">
              {{ selectedPlan.label }} &middot; {{ selectedPlan.audience }}
            </p>
          </div>
        </div>

        <!-- Tier cards -->
        <ul class="atur-tiers">
          <li
            v-for="(p, key) in PRICING"
            :key="key"
            class="atur-tier"
            :class="{ 'atur-tier--featured': key === 'agensi', 'atur-tier--active': plan === key }"
            @click="plan = key as 'studio' | 'agensi' | 'studio-pro'"
          >
            <span v-if="key === 'agensi'" class="atur-tier__ribbon" :style="monoStyle">PALING DIPILIH</span>
            <p class="atur-tier__name" :style="monoStyle">{{ key.toUpperCase() }}</p>
            <p class="atur-tier__price">
              <span :style="h1Style">{{ fmtRp(p.base) }}</span>
              <span :style="monoStyle">/bulan</span>
            </p>
            <p class="atur-tier__audience">{{ p.audience }}</p>
            <ul class="atur-tier__features">
              <li v-for="(f, i) in (key === 'studio' ? ['1 akun admin', '5 GB simpan', 'Brief + timeline tanpa batas', 'Invoice otomatis ke WhatsApp', 'Dukungan email (Senin-Jumat)'] : key === 'agensi' ? ['Semua fitur Studio', '5 akun (tambah Rp 25.000/orang/bln)', '50 GB simpan', 'Portal klien (mereka lihat progres)', 'Multi-mata uang (Rp, USD, SGD)', 'Faktur berulang otomatis', 'Dukungan WhatsApp (Senin-Sabtu)'] : ['Semua fitur Agensi', 'Akun tanpa batas', '500 GB simpan', 'API & webhook', 'SSO (Single Sign-On)', 'e-Faktur (pajak Indonesia)', 'Manajer akun khusus'])" :key="i">
                <UIcon name="i-lucide-check" class="w-3 h-3" />
                {{ f }}
              </li>
            </ul>
            <button type="button" class="atur-tier__cta" :class="{ 'atur-tier__cta--primary': key === 'agensi' }">
              Mulai dengan {{ p.label }}
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </button>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 6 — ILUSTRASI (3D cloud) -->
      <!-- ============================== -->
      <section id="ilustrasi" class="atur-ilustrasi-section" data-spread="6">
        <div class="atur-ilustrasi__inner">
          <p class="atur-eyebrow atur-eyebrow--light" :style="monoStyle">06 / ILUSTRASI</p>
          <p class="atur-ilustrasi__caption" :style="h2Style">
            &ldquo;Kalau brief klien, faktur, dan chat bisa diakses dalam satu layar,<br>mengapa aplikasi <em>lain</em> tidak begitu?&rdquo;
          </p>
          <canvas ref="cloudCanvasRef" class="atur-ilustrasi__cloud" />
          <p class="atur-ilustrasi__meta" :style="monoStyle">
            600 partikel. Setiap satu adalah data, bergerak pelan, mengikuti mouse.
          </p>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SPREAD 7 — KOLOFON (FAQ + colophon) -->
      <!-- ============================== -->
      <section id="kolofon" class="atur-kolofon-section" data-spread="7">
        <div class="atur-section-head">
          <p class="atur-eyebrow" :style="monoStyle">07 / KOLOFON</p>
          <h2 :style="h2Style" class="text-balance">
            Pertanyaan sebelum <em>daftar</em>.
          </h2>
        </div>

        <ul class="atur-faq">
          <li
            v-for="(item, i) in faqs"
            :key="i"
            class="atur-faq__item"
            :class="{ 'atur-faq__item--open': openFaq === i }"
          >
            <h3 class="atur-faq__h">
              <button
                type="button"
                class="atur-faq__btn"
                :aria-expanded="openFaq === i"
                :aria-controls="`faq-${i}`"
                @click="openFaq = openFaq === i ? null : i"
              >
                <span class="atur-faq__num" :style="monoStyle">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="atur-faq__q">{{ item.q }}</span>
                <UIcon
                  :name="openFaq === i ? 'i-lucide-minus' : 'i-lucide-plus'"
                  class="atur-faq__icon w-4 h-4"
                />
              </button>
            </h3>
            <Transition
              enter-active-class="transition-all duration-300 ease-out overflow-hidden"
              leave-active-class="transition-all duration-200 ease-in overflow-hidden"
              enter-from-class="opacity-0 max-h-0"
              leave-to-class="opacity-0 max-h-0"
            >
              <p v-if="openFaq === i" :id="`faq-${i}`" class="atur-faq__a" :style="h2Style">
                {{ item.a }}
              </p>
            </Transition>
          </li>
        </ul>

        <!-- About / philosophy -->
        <div class="atur-about">
          <p class="atur-about__text" :style="h2Style">
            Atur Studio, Jakarta. Tim kecil yang membuat SaaS untuk tim kecil. Trial 14 hari &mdash; kalau kamu muak dengan spreadsheet, <em>Atur untuk kamu.</em>
          </p>
        </div>

        <!-- Klien marquee -->
        <div class="atur-marquee-section">
          <p class="atur-eyebrow atur-eyebrow--center" :style="monoStyle">Dipakai oleh</p>
          <div class="atur-marquee">
            <div class="atur-marquee__track">
              <div v-for="(k, i) in [...klien, ...klien]" :key="i" class="atur-marquee__item">
                <p class="atur-marquee__name">{{ k.name }}</p>
                <p :style="monoStyle" class="atur-marquee__city">{{ k.city }}</p>
                <p class="atur-marquee__note">{{ k.note }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Referral -->
        <div class="atur-referral">
          <p class="atur-referral__text">
            Sudah pakai Atur? Ajak teman, dapat satu bulan gratis.
          </p>
          <button type="button" class="atur-referral__code" :style="monoStyle" @click="copyReferral">
            {{ referralCode }}
            <UIcon name="i-lucide-copy" class="w-4 h-4" />
          </button>
        </div>

        <!-- Colophon footer (editorial signature) -->
        <footer class="atur-colophon">
          <p :style="monoStyle">
            &copy; 2026 &nbsp;·&nbsp; ATUR STUDIO &nbsp;·&nbsp; DIBUAT DI JAKARTA, UNTUK UMKM INDONESIA &nbsp;·&nbsp; VERSI 0.4.2
          </p>
          <p :style="monoStyle" class="atur-colophon__cookie">
            Cookie: satu untuk menyimpan preferensi tema. Tidak ada tracking. Tidak dijual.
          </p>
        </footer>
      </section>
    </main>

    <!-- Demo modal (WhatsApp) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="demoModalOpen" class="atur-modal-backdrop" @click="closeDemoModal" />
      </Transition>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="demoModalOpen" class="atur-modal" role="dialog" aria-label="Jadwalkan demo Atur">
          <button type="button" class="atur-modal__close" @click="closeDemoModal" aria-label="Tutup">
            <UIcon name="i-lucide-x" class="w-4 h-4" />
          </button>
          <h3 :style="h2Style">Jadwalkan demo 30 menit</h3>
          <p class="atur-modal__sub">Lewat Zoom, pakai data bisnis kamu. Tidak perlu install.</p>

          <form class="atur-modal__form" @submit.prevent="sendDemo">
            <label>
              <span :style="monoStyle">Tanggal</span>
              <input v-model="demoDate" type="date" :min="minDate" required />
            </label>
            <label>
              <span :style="monoStyle">Jam (WIB)</span>
              <select v-model="demoTime">
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
                <option value="16:00">16:00</option>
              </select>
            </label>
            <label>
              <span :style="monoStyle">Nama kamu</span>
              <input v-model="demoName" type="text" placeholder="Misal: Putri" required />
            </label>
            <label>
              <span :style="monoStyle">Studio / agensi</span>
              <input v-model="demoStudio" type="text" placeholder="Misal: Sasana Visual, Bandung" />
            </label>
            <button type="submit" class="atur-modal__submit">
              Buka WhatsApp dengan pesan
              <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4" />
            </button>
          </form>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toastMessage" class="atur-toast" :style="monoStyle">
        {{ toastMessage }}
      </div>
    </Transition>

    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="SaaS"
    />
  </div>
</template>

<style scoped>
.atur {
  min-height: 100dvh;
  position: relative;
}

/* === Global typography (tnum for numbers) === */
.atur .tnum,
.atur [style*="tabular-nums"] {
  font-feature-settings: "tnum" 1, "lnum" 1, "ss01" 1;
}

/* === Cover — SAMPUL === */
.atur-sampul {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8rem 1.5rem 4rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.atur-sampul__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
}
@media (min-width: 1024px) {
  .atur-sampul__grid {
    grid-template-columns: minmax(0, 1fr) 200px;
    gap: 4rem;
  }
}
.atur-sampul__main {
  max-width: 60ch;
  position: relative;
  z-index: 2;
}
.atur-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 15%, transparent);
}
.atur-eyebrow--center { display: block; text-align: center; }
.atur-eyebrow--light {
  color: var(--tmpl-surface);
  border-bottom-color: color-mix(in oklch, var(--tmpl-surface) 25%, transparent);
}
.atur-h1 {
  font-size: var(--tmpl-h1);
  line-height: 0.95;
  letter-spacing: -0.025em;
  font-weight: 400;
  font-variation-settings: "opsz" 96;
  margin: 0 0 2rem;
}
.atur-h1__line {
  display: block;
}
.atur-h1__line--italic {
  font-style: italic;
}
.atur-h1__line--regular {
  font-style: normal;
}
.atur-lede {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.55;
  max-width: 50ch;
  opacity: 0.78;
  margin: 0 0 2rem;
}
.atur-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}
.atur-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: background-color 200ms ease, transform 200ms ease, border-color 200ms ease;
}
.atur-btn--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.atur-btn--primary:hover {
  transform: translateY(-1px);
}
.atur-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: color-mix(in oklch, currentColor 25%, transparent);
}
.atur-btn--ghost:hover {
  background: color-mix(in oklch, currentColor 5%, transparent);
  border-color: color-mix(in oklch, currentColor 40%, transparent);
}
.atur-byline {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  font-family: var(--font-mono);
}

/* Margin — the editorial signature */
.atur-sampul__margin {
  position: relative;
  border-left: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  padding-left: 1.5rem;
  display: none;
  flex-direction: column;
  gap: 1rem;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.7;
}
@media (min-width: 1024px) {
  .atur-sampul__margin {
    display: flex;
  }
}
.atur-sampul__page {
  font-weight: 600;
}
.atur-sampul__line {
  width: 100%;
  height: 80px;
  display: block;
}
.atur-sampul__meta {
  font-size: 9px;
  opacity: 0.6;
}

/* === Lede — SPREAD 2 === */
.atur-lede-section {
  padding: 8rem 1.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.atur-lede-wrap {
  max-width: 36rem;
  margin: 0 auto;
  text-align: left;
}
.atur-lede-large {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.45;
  letter-spacing: -0.015em;
  margin: 0;
}

/* === Pull-quote — SPREAD 3 === */
.atur-pullquote-section {
  padding: 8rem 1.5rem;
  text-align: center;
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.atur-pullquote {
  max-width: 50rem;
  margin: 0 auto 1.5rem;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--tmpl-accent);
  padding: 0;
  border: 0;
}
.atur-pullquote-attr {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
}

/* === Section heads === */
.atur-section-head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.atur-section-head h2 {
  font-size: var(--tmpl-h2);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0 0 1rem;
}
.atur-section-head h2 em {
  font-style: italic;
  color: var(--tmpl-accent);
}
.atur-section-sub {
  font-size: 1rem;
  opacity: 0.7;
  line-height: 1.55;
  margin: 0;
}

/* === Daftar Isi — SPREAD 4 === */
.atur-toc-section {
  padding: 8rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.atur-toc {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
@media (min-width: 768px) {
  .atur-toc { grid-template-columns: 1fr 1fr; }
}
.atur-toc__item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem 0.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  cursor: default;
  transition: background-color 200ms ease;
}
.atur-toc__item:hover {
  background: color-mix(in oklch, currentColor 3%, transparent);
}
.atur-toc__num {
  font-size: 11px;
  letter-spacing: 0.15em;
  font-weight: 600;
  color: var(--tmpl-accent);
  padding-top: 0.25rem;
  min-width: 2rem;
}
.atur-toc__body {
  flex: 1;
  min-width: 0;
}
.atur-toc__code {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.4rem;
  font-weight: 600;
}
.atur-toc__title {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
  margin: 0;
}
.atur-toc__arrow {
  color: var(--tmpl-accent);
  font-size: 18px;
  padding-top: 0.25rem;
  flex-shrink: 0;
}

/* === Kolom — SPREAD 5 (Pricing) === */
.atur-kolom-section {
  padding: 8rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.atur-calc {
  background: var(--tmpl-surface);
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  padding: 2rem;
  margin: 0 auto 3rem;
  max-width: 56rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .atur-calc {
    grid-template-columns: 2fr 1fr;
  }
}
.atur-calc__row {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.atur-calc__label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.atur-calc__label > span {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
}
.atur-calc__label > span strong {
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
  opacity: 1;
  font-weight: 700;
  color: var(--tmpl-accent);
  font-family: var(--font-mono);
}
.atur-calc__select,
.atur-calc__billing button + button {
  font: inherit;
  font-size: 14px;
}
.atur-calc__select {
  padding: 0.625rem 0.75rem;
  background: var(--tmpl-bg);
  color: var(--tmpl-fg);
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 6px;
  font-family: inherit;
  cursor: pointer;
}
.atur-calc__slider {
  width: 100%;
  accent-color: var(--tmpl-accent);
  height: 4px;
}
.atur-calc__billing {
  display: inline-flex;
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 6px;
  padding: 2px;
  align-self: flex-start;
}
.atur-calc__billing button {
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
}
.atur-calc__billing button.active {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.atur-calc__save {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  background: color-mix(in oklch, currentColor 12%, transparent);
}
.atur-calc__billing button.active .atur-calc__save {
  background: color-mix(in oklch, var(--tmpl-bg) 20%, transparent);
}
.atur-calc__total {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 0 0 1.5rem;
  border-left: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
@media (max-width: 767px) {
  .atur-calc__total {
    padding: 1.5rem 0 0;
    border-left: 0;
    border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  }
}
.atur-calc__total-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.5rem;
}
.atur-calc__total-value {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.025em;
  line-height: 1;
  margin: 0 0 0.5rem;
  color: var(--tmpl-fg);
  font-variant-numeric: tabular-nums;
}
.atur-calc__total-note {
  font-size: 12px;
  opacity: 0.65;
  margin: 0;
}

/* Tier cards */
.atur-tiers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .atur-tiers { grid-template-columns: repeat(3, 1fr); }
}
.atur-tier {
  position: relative;
  padding: 1.75rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  background: var(--tmpl-surface);
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  flex-direction: column;
}
.atur-tier:hover {
  border-color: color-mix(in oklch, currentColor 25%, transparent);
  transform: translateY(-2px);
}
.atur-tier--featured {
  border-color: var(--tmpl-accent);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--tmpl-accent) 18%, transparent);
}
.atur-tier--active {
  border-color: var(--tmpl-accent);
}
.atur-tier__ribbon {
  position: absolute;
  top: -0.65rem;
  left: 1.25rem;
  padding: 0.2rem 0.6rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
  font-size: 9px;
  letter-spacing: 0.15em;
  font-weight: 700;
  border-radius: 999px;
}
.atur-tier__name {
  font-size: 10px;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0.55;
  margin: 0 0 0.5rem;
}
.atur-tier__price {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0 0 0.25rem;
  flex-wrap: wrap;
}
.atur-tier__price > span:first-child {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.02em;
  color: var(--tmpl-fg);
  font-variant-numeric: tabular-nums;
}
.atur-tier__price > span:last-child {
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.6;
}
.atur-tier__audience {
  font-size: 12px;
  opacity: 0.65;
  margin: 0 0 1.25rem;
  line-height: 1.4;
}
.atur-tier__features {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.atur-tier__features li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 12.5px;
  line-height: 1.45;
}
.atur-tier__features li :deep(svg) {
  color: var(--tmpl-accent);
  flex-shrink: 0;
  margin-top: 3px;
}
.atur-tier__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in oklch, currentColor 20%, transparent);
  border-radius: 6px;
  background: transparent;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.atur-tier__cta--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}
.atur-tier__cta:hover {
  transform: translateY(-1px);
}

/* === Ilustrasi — SPREAD 6 === */
.atur-ilustrasi-section {
  position: relative;
  min-height: 100dvh;
  background: linear-gradient(180deg, var(--tmpl-fg) 0%, oklch(0.15 0.02 8) 100%);
  color: var(--tmpl-surface);
  display: flex;
  align-items: center;
  padding: 6rem 1.5rem;
  overflow: hidden;
}
.atur-ilustrasi__inner {
  max-width: 50rem;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}
.atur-ilustrasi__caption {
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin: 0 0 2.5rem;
  color: var(--tmpl-surface);
}
.atur-ilustrasi__caption em {
  font-style: italic;
  color: var(--tmpl-surface);
  opacity: 0.7;
}
.atur-ilustrasi__cloud {
  display: block;
  width: 100%;
  height: 320px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.atur-ilustrasi__meta {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 1.5rem 0 0;
}

/* === Kolofon — SPREAD 7 === */
.atur-kolofon-section {
  padding: 8rem 1.5rem 0;
  max-width: 56rem;
  margin: 0 auto;
}
.atur-faq {
  list-style: none;
  margin: 0 0 5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
.atur-faq__item {
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
.atur-faq__btn {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem 0.5rem;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.atur-faq__num {
  font-size: 10px;
  letter-spacing: 0.18em;
  font-weight: 600;
  opacity: 0.5;
  min-width: 1.75rem;
  padding-top: 0.4rem;
}
.atur-faq__q {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.4;
}
.atur-faq__icon {
  flex-shrink: 0;
  margin-top: 0.25rem;
  color: var(--tmpl-accent);
}
.atur-faq__a {
  padding: 0 0.5rem 1.5rem 2.75rem;
  font-size: 1.0625rem;
  font-weight: 400;
  font-style: italic;
  line-height: 1.55;
  letter-spacing: -0.01em;
  margin: 0;
  opacity: 0.85;
}
.atur-about {
  padding: 4rem 0;
  text-align: center;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  margin: 0 0 4rem;
}
.atur-about__text {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: -0.015em;
  max-width: 40rem;
  margin: 0 auto;
  font-style: italic;
}
.atur-about__text em {
  color: var(--tmpl-accent);
  font-weight: 500;
  font-style: italic;
}

/* === Klien marquee === */
.atur-marquee-section {
  margin: 0 -1.5rem 4rem;
  padding: 2rem 0 0;
}
.atur-marquee {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.atur-marquee__track {
  display: flex;
  gap: 2.5rem;
  width: max-content;
  animation: atur-marquee 40s linear infinite;
  padding: 1rem 1.5rem;
}
.atur-marquee:hover .atur-marquee__track {
  animation-play-state: paused;
}
.atur-marquee__item {
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
  border: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  border-radius: 8px;
  min-width: 220px;
  transition: border-color 200ms ease;
}
.atur-marquee__item:hover {
  border-color: color-mix(in oklch, var(--tmpl-accent) 35%, transparent);
}
.atur-marquee__name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 0.25rem;
  letter-spacing: -0.01em;
}
.atur-marquee__city {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.25rem;
}
.atur-marquee__note {
  font-size: 11px;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}
@keyframes atur-marquee {
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .atur-marquee__track { animation: none; flex-wrap: wrap; }
}

/* === Referral === */
.atur-referral {
  text-align: center;
  padding: 3rem 1.5rem;
  border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  margin: 0 -1.5rem 0;
}
.atur-referral__text {
  font-size: 14px;
  opacity: 0.75;
  margin: 0 0 1rem;
}
.atur-referral__code {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.25rem;
  background: var(--tmpl-surface);
  color: var(--tmpl-fg);
  border: 1px solid color-mix(in oklch, currentColor 18%, transparent);
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 0.1em;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 200ms ease;
}
.atur-referral__code:hover {
  border-color: var(--tmpl-accent);
  background: var(--tmpl-bg);
}

/* === Colophon === */
.atur-colophon {
  padding: 2.5rem 0 6rem;
  text-align: center;
}
.atur-colophon p {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0 0 0.5rem;
}
.atur-colophon__cookie {
  font-size: 9px !important;
  opacity: 0.35 !important;
  letter-spacing: 0.14em !important;
}

/* === Demo modal === */
.atur-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.atur-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 95;
  transform: translate(-50%, -50%);
  width: min(480px, calc(100vw - 2rem));
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background: var(--tmpl-bg);
  color: var(--tmpl-fg);
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 10px;
  padding: 2rem;
}
.atur-modal__close {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
}
.atur-modal__close:hover {
  background: color-mix(in oklch, currentColor 5%, transparent);
}
.atur-modal h3 {
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.015em;
  margin: 0 0 0.5rem;
}
.atur-modal__sub {
  font-size: 13px;
  opacity: 0.7;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}
.atur-modal__form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.atur-modal__form label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.atur-modal__form label > span {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
}
.atur-modal__form input,
.atur-modal__form select {
  padding: 0.65rem 0.75rem;
  background: var(--tmpl-surface);
  color: var(--tmpl-fg);
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
}
.atur-modal__form input:focus,
.atur-modal__form select:focus {
  outline: 0;
  border-color: var(--tmpl-accent);
}
.atur-modal__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  height: 44px;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border: 0;
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.atur-modal__submit:hover {
  opacity: 0.9;
}

/* === Toast === */
.atur-toast {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.6rem 1.25rem;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}
</style>
