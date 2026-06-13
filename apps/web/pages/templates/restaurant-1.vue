<script setup lang="ts">
/**
 * restaurant-1.vue — Sasana
 * Fine dining editorial. Noma/EMP style. White space, Cormorant italic, scroll photo essay.
 *
 * 8 sections: Hero, Cerita, Menu, Reservasi, Acara, Lokasi, Press, Footer
 * 6+ working interactions: menu filter, reservation WhatsApp, event CTAs, hours ticker, map, scroll-spy
 * 3D: 6 ambient forest-green particles (raw WebGL canvas)
 */
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('restaurant-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeSection = ref('hero')
const menuFilter = ref('Semua')
const hoursOpen = ref(false)
const hoursLabel = ref('')
const reservationSuccess = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
let hoursInterval: number | null = null

// ============================================================
// MENU DATA (8 dishes, 4 categories)
// ============================================================
const menuItems = [
  { id: 1, name: 'Gohu Ikan Maluku', category: 'Pembuka', price: 'Rp 180.000', description: 'Ikan tuna segar dari Ambon, kecombrang, jeruk limau, dan asap singkong. Piring pertama, bukan pembuka formal.' },
  { id: 2, name: 'Sambal Matah Bali', category: 'Pembuka', price: 'Rp 95.000', description: 'Bawang merah, cabai rawit, serai, terasi. Disajikan dengan ikan bilis goreng dan nasi hangat.' },
  { id: 3, name: 'Rendang Sapi Batipu', category: 'Utama', price: 'Rp 380.000', description: 'Daging sapi lokal dimasak delapan jam dengan empat belas rempah. Disajikan dengan nasi padi yang baru dipanen.' },
  { id: 4, name: 'Ikan Bakar Jimbaran', category: 'Utama', price: 'Rp 320.000', description: 'Ikan kakap utuh, dibakar dengan arang kelapa. Sambal matah, plecing, dan nasi kuning.' },
  { id: 5, name: 'Sate Lilit Klungkung', category: 'Utama', price: 'Rp 220.000', description: 'Daging ayam cincang dengan daun sereh dan parutan kelapa. Delapan tusuk, lontong, dan acar.' },
  { id: 6, name: 'Bubur Manado', category: 'Penutup', price: 'Rp 85.000', description: 'Bubur nasi dengan ikan asin, daun kemangi, dan kuah santan. Sederhana, tapi mengenyangkan.' },
  { id: 7, name: 'Pisang Goreng Madu', category: 'Penutup', price: 'Rp 75.000', description: 'Pisang kepok goreng, madu dari Flores, es krim vanilla. Manis yang tidak berlebihan.' },
  { id: 8, name: 'Wedang Jahe Rempah', category: 'Minuman', price: 'Rp 45.000', description: 'Jahe merah, sereh, kayu manis, cengkeh. Diseduh pelan-pelan.' },
]

const categories = ['Semua', 'Pembuka', 'Utama', 'Penutup', 'Minuman']

const filteredMenu = computed(() => {
  if (menuFilter.value === 'Semua') return menuItems
  return menuItems.filter(d => d.category === menuFilter.value)
})

const filteredCount = computed(() => filteredMenu.value.length)

// ============================================================
// PRIVATE EVENTS (3)
// ============================================================
const events = [
  { id: 1, name: 'Wine Pairing Dinner', format: '4 jam · 8 sajian · dari Rp 18.000.000 / grup', description: 'Empat sommelier dari Jakarta Wine and Cheese Co. memandu pencocokan anggur natural Indonesia dan import dari kebun-kebun kecil. Berlangsung 4 jam, Kamis atau Jumat malam.' },
  { id: 2, name: "Chef's Table di Dapur", format: '4 jam · 8 sajian · dari Rp 12.000.000 / grup', description: 'Empat kursi kayu elm di tengah dapur, tepat di samping kompor. Aria menjelaskan setiap sajian sebelum dihidangkan: ritme, suhu, kenapa rempah ini bukan itu.' },
  { id: 3, name: 'Garden Brunch Ahad', format: '4 jam · 5 sajian · dari Rp 8.500.000 / grup', description: 'Tersedia setiap hari Minggu pertama bulan. Taman belakang dengan 12 kursi, cahaya pagi tanpa filter. Menu lebih ringan, waktu lebih panjang, percakapan lebih pelan.' },
]

// ============================================================
// PRESS
// ============================================================
const pressItems = [
  { name: 'FWA Of The Day', year: '2023' },
  { name: 'Awwwards SOTD', year: '2024' },
  { name: 'Harpers Bazaar Indonesia', year: '2023' },
  { name: 'DestinAsian Indonesia', year: '2022' },
  { name: 'Jurnal Gourmet', year: '2023' },
  { name: 'Tatler Indonesia', year: '2024' },
  { name: 'The Jakarta Post', year: '2024' },
  { name: 'Monocle', year: '2023' },
]

// ============================================================
// RESERVATION FORM
// ============================================================
const form = reactive({
  tanggal: '',
  waktu: '',
  tamu: 2,
  acara: '',
  nama: '',
  phone: '',
  email: '',
  catatan: '',
})

const timeSlots = ['18.00', '18.45', '19.30', '20.15', '21.00']
const occasionOptions = ['Makan malam', 'Ulang tahun', 'Anniversary', 'Makan bisnis', 'Lainnya']
const reservationCode = computed(() => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'SAS-'
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
})

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

function isSunday(dateStr: string) {
  if (!dateStr) return false
  return new Date(dateStr).getDay() === 0
}

function submitReservation() {
  if (!form.tanggal || !form.waktu || !form.nama || !form.phone) return
  const lines = [
    'Halo Sasana, saya mau reservasi:',
    '',
    `Tanggal: ${form.tanggal}`,
    `Slot: ${form.waktu}`,
    `Tamu: ${form.tamu} orang`,
    `Acara: ${form.acara || 'Makan malam'}`,
    `Nama: ${form.nama}`,
    `WhatsApp: ${form.phone}`,
  ]
  if (form.catatan) lines.push(`Catatan: ${form.catatan}`)
  lines.push('', `Kode reservasi: ${reservationCode.value}`)
  const url = `https://wa.me/6285188627365?text=${encodeURIComponent(lines.join('\n'))}`
  reservationSuccess.value = true
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
    reservationSuccess.value = false
  }, 1200)
}

function openEventWhatsApp(eventName: string) {
  const msg = `Halo Sasana, saya tertarik dengan acara "${eventName}". Bisa info ketersediaan?`
  window.open(`https://wa.me/6285188627365?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
}

// ============================================================
// HOURS TICKER
// ============================================================
function updateHours() {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const currentMinutes = hour * 60 + minute
  const openTime = 18 * 60
  const lastSeating = 21 * 60
  const closeTime = 22 * 60 + 30

  if (day === 0) {
    hoursOpen.value = false
    hoursLabel.value = 'Tutup · buka Selasa 18.00'
  } else if (day === 1) {
    hoursOpen.value = false
    hoursLabel.value = 'Tutup · buka besok 18.00'
  } else if (currentMinutes >= openTime && currentMinutes < closeTime) {
    hoursOpen.value = true
    hoursLabel.value = 'Buka · last seating 21.00'
  } else {
    hoursOpen.value = false
    if (day === 6) hoursLabel.value = 'Tutup · buka Selasa 18.00'
    else hoursLabel.value = 'Tutup · buka besok 18.00'
  }
}

// ============================================================
// SCROLL-SPY
// ============================================================
let sectionObserver: IntersectionObserver | null = null

function initScrollSpy() {
  const sections = ['hero', 'cerita', 'menu', 'reservasi', 'acara', 'lokasi', 'press']
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          activeSection.value = e.target.id
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  )
  for (const id of sections) {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  }
}

// ============================================================
// 3D PARTICLES — 6 ambient forest-green WebGL points
// ============================================================
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
let particleGL: WebGLRenderingContext | null = null
let particleProg: WebGLProgram | null = null
let particleBuf: WebGLBuffer | null = null
let particleAnimId = 0
let particleStartTime = 0
let particleInView = true
const isReducedMotion = ref(false)

const PARTICLE_SEEDS = [
  { x: -0.7, y: 0.4, freq: 0.18, seed: 0.0 },
  { x: -0.3, y: -0.5, freq: 0.22, seed: 1.4 },
  { x: 0.1, y: 0.3, freq: 0.15, seed: 2.7 },
  { x: 0.4, y: -0.2, freq: 0.25, seed: 4.1 },
  { x: 0.6, y: 0.5, freq: 0.19, seed: 5.5 },
  { x: 0.8, y: -0.4, freq: 0.21, seed: 7.2 },
]

function initParticles() {
  const canvas = particleCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    particleGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  } catch { return }
  if (!particleGL) return

  const vs = `
    attribute vec2 aPos;
    attribute float aFreq;
    attribute float aSeed;
    uniform float uTime;
    void main() {
      float t = uTime;
      vec2 p = aPos + vec2(
        sin(t * aFreq + aSeed) * 0.04,
        cos(t * aFreq * 0.7 + aSeed) * 0.06
      ) * 0.6;
      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = 80.0;
    }
  `
  const fs = `
    precision mediump float;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      float a = smoothstep(0.5, 0.0, d) * 0.5;
      gl_FragColor = vec4(0.247, 0.353, 0.227, a);
    }
  `

  const vert = particleGL.createShader(particleGL.VERTEX_SHADER)!
  particleGL.shaderSource(vert, vs)
  particleGL.compileShader(vert)
  const frag = particleGL.createShader(particleGL.FRAGMENT_SHADER)!
  particleGL.shaderSource(frag, fs)
  particleGL.compileShader(frag)
  particleProg = particleGL.createProgram()!
  particleGL.attachShader(particleProg, vert)
  particleGL.attachShader(particleProg, frag)
  particleGL.linkProgram(particleProg)

  const data: number[] = []
  for (const p of PARTICLE_SEEDS) {
    data.push(p.x, p.y, p.freq, p.seed)
  }
  particleBuf = particleGL.createBuffer()
  particleGL.bindBuffer(particleGL.ARRAY_BUFFER, particleBuf)
  particleGL.bufferData(particleGL.ARRAY_BUFFER, new Float32Array(data), particleGL.STATIC_DRAW)

  particleStartTime = performance.now()

  const io = new IntersectionObserver(
    (entries) => { particleInView = entries[0]?.isIntersecting ?? false },
    { threshold: 0.05 },
  )
  io.observe(canvas)

  function tick() {
    if (!particleGL || !particleProg || !particleBuf) return
    particleAnimId = requestAnimationFrame(tick)
    if (!particleInView) return
    const elapsed = (performance.now() - particleStartTime) / 1000
    const uTime = isReducedMotion.value ? 0 : elapsed

    particleGL.viewport(0, 0, particleGL.drawingBufferWidth, particleGL.drawingBufferHeight)
    particleGL.clearColor(0, 0, 0, 0)
    particleGL.clear(particleGL.COLOR_BUFFER_BIT)
    particleGL.enable(particleGL.BLEND)
    particleGL.blendFunc(particleGL.SRC_ALPHA, particleGL.ONE_MINUS_SRC_ALPHA)
    particleGL.useProgram(particleProg)
    particleGL.bindBuffer(particleGL.ARRAY_BUFFER, particleBuf)

    const aPos = particleGL.getAttribLocation(particleProg, 'aPos')
    const aFreq = particleGL.getAttribLocation(particleProg, 'aFreq')
    const aSeed = particleGL.getAttribLocation(particleProg, 'aSeed')

    particleGL.enableVertexAttribArray(aPos)
    particleGL.vertexAttribPointer(aPos, 2, particleGL.FLOAT, false, 16, 0)
    particleGL.enableVertexAttribArray(aFreq)
    particleGL.vertexAttribPointer(aFreq, 1, particleGL.FLOAT, false, 16, 8)
    particleGL.enableVertexAttribArray(aSeed)
    particleGL.vertexAttribPointer(aSeed, 1, particleGL.FLOAT, false, 16, 12)

    particleGL.uniform1f(particleGL.getUniformLocation(particleProg, 'uTime'), uTime)
    particleGL.drawArrays(particleGL.POINTS, 0, 6)
  }
  tick()
}

// ============================================================
// LIGHTBOX
// ============================================================
const lightboxImages = [
  { src: '', alt: 'Dapur Sasana', caption: 'Dapur, 18.00 sebelum tamu datang.' },
  { src: '', alt: 'Hidangan di meja', caption: 'Gohu Ikan Maluku, sajian pertama.' },
  { src: '', alt: 'Taman belakang', caption: 'Taman belakang, brunch Ahad.' },
]

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  setTimeout(() => { heroLoaded.value = true }, 100)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  updateHours()
  hoursInterval = window.setInterval(updateHours, 30000)
  initScrollSpy()
  setTimeout(initParticles, 80)
})

onBeforeUnmount(() => {
  if (particleAnimId) cancelAnimationFrame(particleAnimId)
  if (hoursInterval) clearInterval(hoursInterval)
  if (sectionObserver) sectionObserver.disconnect()
})

function handleNavClick(e: MouseEvent, href: string) {
  e.preventDefault()
  const el = document.querySelector(href)
  if (el) {
    const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function fmtRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}
</script>

<template>
  <div class="sasana" :style="styles">
    <a class="skip-link" href="#hero">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <!-- ============================== -->
    <!-- NAVBAR                          -->
    <!-- ============================== -->
    <TmplNavbar
      brand="Sasana"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Hidangan', href: '#menu' },
        { label: 'Cadangan', href: '#reservasi' },
        { label: 'Acara', href: '#acara' },
        { label: 'Lokasi', href: '#lokasi' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
      force-mode="light"
    >
      <template #default>
        <div class="sasana-nav-hours" :style="monoStyle">
          <span class="sasana-nav-dot" :class="hoursOpen ? 'sasana-nav-dot--open' : 'sasana-nav-dot--closed'" />
          {{ hoursLabel }}
        </div>
      </template>
    </TmplNavbar>

    <main id="main">

      <!-- ============================== -->
      <!-- SECTION 01 — HERO               -->
      <!-- ============================== -->
      <section id="hero" class="sasana-hero">
        <!-- 3D Particles -->
        <canvas ref="particleCanvasRef" class="sasana-hero__particles" />

        <div class="sasana-hero__content">
          <p class="sasana-hero__eyebrow" :style="monoStyle">Musim 12 · Jakarta · 2026</p>

          <h1 :style="{ ...h1Style, fontSize: 'clamp(4.5rem, 11vw, 11rem)', lineHeight: '0.92', letterSpacing: '-0.025em' }" class="sasana-hero__h1">
            Tujuh kursi.<br />Satu chef.
          </h1>

          <p class="sasana-hero__sub">
            Satu filosofi: bahan lokal, musiman, tidak dilebih-lebihkan.
          </p>

          <div class="sasana-hero__ctas">
            <a href="#menu" class="sasana-btn sasana-btn--ghost" @click="handleNavClick($event, '#menu')">Lihat Menu</a>
            <a href="#reservasi" class="sasana-btn sasana-btn--primary" @click="handleNavClick($event, '#reservasi')">Cadangan →</a>
          </div>

          <div class="sasana-hero__meta" :style="monoStyle">
            Tempat duduk 7 · Tasting menu 8 sajian · Reservasi 7 hari sebelumnya
          </div>
        </div>

        <div class="sasana-hero__index" :style="monoStyle">01 / 08</div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 02 — CERITA             -->
      <!-- ============================== -->
      <section id="cerita" class="sasana-cerita">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Surat dari dapur.</h2>
          <p class="sasana-section-sub" :style="monoStyle">oleh Aria Pratama · Kepala Dapur</p>
        </div>

        <div class="sasana-cerita__grid">
          <div class="sasana-cerita__letter">
            <p class="sasana-cerita__dropcap">
              Surat untuk Anda.
            </p>
            <p>
              Dapur ini berawal dari kebiasaan makan siang di rumah nenek saya di Bukittinggi. Setiap pukul dua belas, nasi dihidangkan dengan sayur yang baru dipetik dan ikan yang baru ditangkap dari danau. Tidak ada yang istimewa, kecuali semuanya selalu terasa cukup. Itulah yang ingin saya hadirkan di Sasana: makanan yang membuat Anda merasa cukup, bukan kenyang; yang membuat Anda berhenti sejenak, bukan buru-buru pulang.
            </p>
            <p>
              Saya tidak mengejar teknik. Saya mengejar rasa yang jujur. Setiap piring di meja Anda melewati pasar pagi itu, tangan supplier yang sama selama belasan tahun, dan kompor kami yang tidak pernah tidur sebelum pukul sebelas malam.
            </p>
            <p>
              Tiga tahun lalu, saya pulang dari Kopenhagen dengan satu keyakinan: Indonesia tidak butuh meniru dapur Eropa. Kita punya apa yang mereka cari.
            </p>
            <p class="sasana-cerita__sig">
              Aria Pratama, Kepala Dapur, Mei 2026
            </p>
          </div>

          <aside class="sasana-cerita__meta" :style="monoStyle">
            <p>Bali · 2018–2020</p>
            <p>Singapura · 2021–2022</p>
            <p>Kopenhagen · 2023</p>
            <p>Jakarta · 2024–sekarang</p>
          </aside>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 03 — MENU               -->
      <!-- ============================== -->
      <section id="menu" class="sasana-menu">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Hidangan.</h2>
          <p class="sasana-section-sub" :style="monoStyle">8 sajian · 4 kategori · Berubah mengikuti musim</p>
        </div>

        <!-- Filter pills -->
        <div class="sasana-menu__filters">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="sasana-pill"
            :class="{ 'sasana-pill--active': menuFilter === cat }"
            @click="menuFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <p class="sasana-menu__count" :style="monoStyle">Menampilkan {{ filteredCount }} dari 8</p>

        <!-- Dish grid -->
        <TransitionGroup name="sasana-menu-fade" tag="div" class="sasana-menu__grid">
          <div
            v-for="dish in filteredMenu"
            :key="dish.id"
            class="sasana-dish"
          >
            <div class="sasana-dish__head">
              <span class="sasana-dish__num" :style="monoStyle">{{ String(dish.id).padStart(2, '0') }} — {{ dish.category.toUpperCase() }}</span>
              <span class="sasana-dish__price">{{ dish.price }}</span>
            </div>
            <h3 class="sasana-dish__name">{{ dish.name }}</h3>
            <p class="sasana-dish__desc">{{ dish.description }}</p>
          </div>
        </TransitionGroup>

        <div class="sasana-menu__footer">
          <p :style="monoStyle">Hidangan berubah setiap 6 minggu.</p>
          <a href="https://instagram.com/sasana.jkt" target="_blank" rel="noopener" class="sasana-link">Lihat menu lengkap di Instagram →</a>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 04 — RESERVASI           -->
      <!-- ============================== -->
      <section id="reservasi" class="sasana-reservasi">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Cadangan.</h2>
          <p class="sasana-section-sub" :style="monoStyle">Untuk 2–12 orang · 7 hari sebelumnya</p>
        </div>

        <div class="sasana-reservasi__grid">
          <!-- Form -->
          <form class="sasana-form" novalidate @submit.prevent="submitReservation">
            <div class="sasana-form__field">
              <label for="r-tanggal" class="sasana-form__label" :style="monoStyle">Tanggal *</label>
              <input id="r-tanggal" v-model="form.tanggal" type="date" :min="minDate" required class="sasana-form__input" />
              <p v-if="form.tanggal && isSunday(form.tanggal)" class="sasana-form__error">Sasana tutup setiap Minggu.</p>
            </div>

            <div class="sasana-form__field">
              <label class="sasana-form__label" :style="monoStyle">Slot waktu *</label>
              <div class="sasana-form__chips">
                <button
                  v-for="slot in timeSlots"
                  :key="slot"
                  type="button"
                  class="sasana-chip"
                  :class="{ 'sasana-chip--active': form.waktu === slot }"
                  @click="form.waktu = slot"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <div class="sasana-form__field">
              <label class="sasana-form__label" :style="monoStyle">Jumlah tamu</label>
              <div class="sasana-form__stepper">
                <button type="button" class="sasana-stepper__btn" :disabled="form.tamu <= 2" @click="form.tamu--">−</button>
                <span class="sasana-stepper__val">{{ form.tamu }}</span>
                <button type="button" class="sasana-stepper__btn" :disabled="form.tamu >= 12" @click="form.tamu++">+</button>
              </div>
            </div>

            <div class="sasana-form__field">
              <label for="r-acara" class="sasana-form__label" :style="monoStyle">Acara</label>
              <select id="r-acara" v-model="form.acara" class="sasana-form__input">
                <option value="">Pilih acara</option>
                <option v-for="opt in occasionOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div class="sasana-form__field">
              <label for="r-nama" class="sasana-form__label" :style="monoStyle">Nama lengkap *</label>
              <input id="r-nama" v-model="form.nama" type="text" placeholder="Nama Anda" required class="sasana-form__input" />
            </div>

            <div class="sasana-form__field">
              <label for="r-phone" class="sasana-form__label" :style="monoStyle">Nomor WhatsApp *</label>
              <input id="r-phone" v-model="form.phone" type="tel" placeholder="+62 812 ..." required class="sasana-form__input" />
            </div>

            <div class="sasana-form__field">
              <label for="r-email" class="sasana-form__label" :style="monoStyle">Email</label>
              <input id="r-email" v-model="form.email" type="email" placeholder="nama@email.com" class="sasana-form__input" />
            </div>

            <div class="sasana-form__field">
              <label for="r-catatan" class="sasana-form__label" :style="monoStyle">Catatan untuk dapur</label>
              <textarea id="r-catatan" v-model="form.catatan" rows="3" maxlength="280" placeholder="Alergi, permintaan khusus" class="sasana-form__input sasana-form__input--textarea" />
              <span class="sasana-form__counter" :style="monoStyle">{{ form.catatan.length }}/280</span>
            </div>

            <div class="sasana-form__field">
              <label class="sasana-form__label" :style="monoStyle">Kode Reservasi</label>
              <span class="sasana-form__code" :style="monoStyle">{{ reservationCode }}</span>
            </div>

            <button
              type="submit"
              class="sasana-btn sasana-btn--primary sasana-btn--full"
              :disabled="!form.tanggal || !form.waktu || !form.nama || !form.phone || (form.tanggal && isSunday(form.tanggal))"
            >
              <span v-if="reservationSuccess">✓ WhatsApp terbuka — konfirmasi di sana.</span>
              <span v-else>Kirim permintaan →</span>
            </button>

            <p class="sasana-form__disclaimer" :style="monoStyle">10% biaya konfirmasi · dp ditransfer via QRIS · tidak bisa di-refund dalam 48 jam</p>
          </form>

          <!-- Essay -->
          <div class="sasana-reservasi__essay">
            <p>Dua belas kursi. Tidak lebih. Setiap kursi kami hitung karena dapur kami yang kecil hanya bisa memasak untuk sejumlah tangan pada satu waktu.</p>
            <p>Menu tasting 8 sajian. Tidak ada pilihan a la carte. Kami tidak masak untuk permintaan khusus di luar alergi. Bukan karena tidak sopan, tapi karena menunya dirancang sebagai satu arc, bukan kumpulan hidangan.</p>
            <p>Konfirmasi H-1. Kami akan WhatsApp Anda 24 jam sebelum tanggal untuk mengonfirmasi dan mengirim QRIS untuk DP 10%. Tanpa konfirmasi, kursi kami lepas.</p>
            <p>Lebih dari 15 menit dari slot waktu, kami tidak bisa menjamin makanan Anda dimasak di suhu yang tepat. Hubungi kami jika terlambat.</p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 05 — ACARA              -->
      <!-- ============================== -->
      <section id="acara" class="sasana-acara">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Acara.</h2>
          <p class="sasana-section-sub" :style="monoStyle">Ruang pribadi · untuk 6–24 orang · Selasa – Sabtu</p>
        </div>

        <div class="sasana-acara__grid">
          <div v-for="(evt, i) in events" :key="evt.id" class="sasana-event-card">
            <span class="sasana-event-card__tag" :style="monoStyle">ACARA 0{{ i + 1 }} — 03</span>
            <h3 class="sasana-event-card__name">{{ evt.name }}</h3>
            <p class="sasana-event-card__format" :style="monoStyle">{{ evt.format }}</p>
            <p class="sasana-event-card__desc">{{ evt.description }}</p>
            <button type="button" class="sasana-link" @click="openEventWhatsApp(evt.name)">Tanya ketersediaan →</button>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 06 — LOKASI             -->
      <!-- ============================== -->
      <section id="lokasi" class="sasana-lokasi">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Lokasi.</h2>
          <p class="sasana-section-sub" :style="monoStyle">Tebet, Jakarta Selatan</p>
        </div>

        <div class="sasana-lokasi__grid">
          <TmplMap
            label="Sasana"
            address="Jl. Tebet Barat Dalam IV No. 17"
            city="Jakarta Selatan 12820"
            :lat="-6.2297"
            :lng="106.8567"
            accent="var(--tmpl-accent)"
            google-maps-url="https://maps.google.com/?q=Sasana+Jl+Tebet+Barat+Dalam+IV+No+17+Jakarta+Selatan"
          />

          <div class="sasana-lokasi__info">
            <div class="sasana-lokasi__item">
              <span class="sasana-lokasi__label" :style="monoStyle">Alamat</span>
              <p>Jl. Tebet Barat Dalam IV No. 17, Jakarta Selatan 12820</p>
            </div>
            <div class="sasana-lokasi__item">
              <span class="sasana-lokasi__label" :style="monoStyle">Jam buka</span>
              <p>Selasa – Sabtu · 18.00 – 22.30. Last seating 21.00.</p>
            </div>
            <div class="sasana-lokasi__item">
              <span class="sasana-lokasi__label" :style="monoStyle">Kontak</span>
              <p><a href="tel:+622183594421" class="sasana-link">+62 21 8359 4421</a></p>
              <p><a href="mailto:halo@sasana.id" class="sasana-link">halo@sasana.id</a></p>
              <p><a href="https://instagram.com/sasana.jkt" target="_blank" rel="noopener" class="sasana-link">@sasana.jkt</a></p>
            </div>
            <div class="sasana-lokasi__item">
              <span class="sasana-lokasi__label" :style="monoStyle">Parkir</span>
              <p>Tersedia 4 mobil di halaman, valet gratis.</p>
            </div>
            <div class="sasana-lokasi__item">
              <span class="sasana-lokasi__label" :style="monoStyle">Akses</span>
              <p>Stasiun MRT Tebet 8 menit jalan kaki. Halte TransJakarta 3 menit.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 07 — PRESS              -->
      <!-- ============================== -->
      <section id="press" class="sasana-press">
        <div class="sasana-section-head">
          <h2 :style="h2Style">Disebut di.</h2>
          <p class="sasana-section-sub" :style="monoStyle">Liputan editorial · 2022–2024</p>
        </div>

        <TmplMarquee
          :items="pressItems.map(p => `${p.name} ${p.year}`)"
          separator="·"
          speed="slow"
          accent="var(--tmpl-accent)"
        />

        <p class="sasana-press__footnote" :style="monoStyle">Tahun 2026 · Daftar penghargaan lengkap menyusul.</p>
      </section>

      <!-- ============================== -->
      <!-- SECTION 08 — FOOTER             -->
      <!-- ============================== -->
      <TmplFooter
        brand-name="Sasana"
        variant="signoff"
        signoff="Bahan lokal. Musiman. Tidak dilebih-lebihkan."
        signature="Dirancang di Jakarta, dibuat untuk UMKM Indonesia"
        accent="var(--tmpl-accent)"
      />

    </main>

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      accent="var(--tmpl-accent)"
      :actions="[
        { label: 'Reservasi makan malam', detail: 'Untuk 2–12 orang, Selasa–Sabtu', icon: 'i-lucide-calendar', message: 'Halo Sasana, saya mau reservasi makan malam. Berapa hari sebelumnya?' },
        { label: 'Tanya menu hari ini', detail: '8 sajian, berubah tiap 6 minggu', icon: 'i-lucide-utensils', message: 'Halo Sasana, menu hari ini apa saja?' },
        { label: 'Private event', detail: 'Wine Dinner, Chef\'s Table, Brunch Ahad', icon: 'i-lucide-party-popper', message: 'Halo Sasana, saya mau tanya soal private event.' },
        { label: 'Bicara langsung', detail: 'WhatsApp langsung ke dapur', icon: 'i-lucide-phone', message: 'Halo, saya mau bicara langsung dengan tim Sasana.' },
      ]"
    />
  </div>
</template>

<style scoped>
.sasana {
  min-height: 100dvh;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  padding: 0.5rem 1rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
  z-index: 100;
  font-size: 14px;
}
.skip-link:focus {
  top: 0;
}

/* ============================================================
   HERO
   ============================================================ */
.sasana-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}
.sasana-hero__particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
.sasana-hero__content {
  position: relative;
  z-index: 2;
  max-width: 52rem;
}
.sasana-hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-muted);
  margin-bottom: 2rem;
}
.sasana-hero__h1 {
  font-family: var(--tmpl-font-display);
  margin: 0 0 2rem;
}
.sasana-hero__sub {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.125rem, 1.6vw, 1.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.55;
  max-width: 36ch;
  color: var(--tmpl-muted);
  margin: 0 0 2rem;
}
.sasana-hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 3rem;
}
.sasana-hero__meta {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.5;
}
.sasana-hero__index {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  font-size: 12px;
  letter-spacing: 0.1em;
  opacity: 0.4;
  transform: rotate(90deg);
  transform-origin: bottom right;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.sasana-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 250ms ease, transform 200ms ease, border-color 250ms ease, box-shadow 250ms ease;
}
.sasana-btn--primary {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.sasana-btn--primary:hover:not(:disabled) {
  background: oklch(0.26% 0.075 145);
  box-shadow: 0 0 0 3px oklch(0.34% 0.062 145 / 0.12);
}
.sasana-btn--primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.sasana-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border: 1px solid var(--tmpl-border);
}
.sasana-btn--ghost:hover {
  background: var(--tmpl-surface);
}
.sasana-btn--full {
  width: 100%;
}

/* ============================================================
   SECTION HEADS
   ============================================================ */
.sasana-section-head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.sasana-section-head h2 {
  margin: 0 0 0.5rem;
}
.sasana-section-sub {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
}

/* ============================================================
   CERITA
   ============================================================ */
.sasana-cerita {
  padding: 8rem 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-cerita__grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .sasana-cerita__grid {
    grid-template-columns: 7fr 5fr;
    gap: 4rem;
  }
}
.sasana-cerita__letter {
  max-width: 48ch;
}
.sasana-cerita__letter p {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.125rem, 1.5vw, 1.375rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.65;
  margin: 0 0 1.5rem;
  color: var(--tmpl-fg);
}
.sasana-cerita__dropcap::first-letter {
  font-size: 4em;
  float: left;
  line-height: 0.8;
  margin-right: 0.08em;
  margin-top: 0.05em;
  color: var(--tmpl-accent);
}
.sasana-cerita__sig {
  font-size: 1rem !important;
  font-weight: 400 !important;
  margin-top: 2rem !important;
  color: var(--tmpl-muted) !important;
}
.sasana-cerita__meta {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
}
.sasana-cerita__meta p {
  margin: 0;
  line-height: 1.5;
}

/* ============================================================
   MENU
   ============================================================ */
.sasana-menu {
  padding: 8rem 2rem;
  max-width: 72rem;
  margin: 0 auto;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-menu__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.sasana-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-muted);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 250ms ease;
}
.sasana-pill--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.sasana-pill:hover:not(.sasana-pill--active) {
  border-color: var(--tmpl-muted);
  color: var(--tmpl-fg);
}
.sasana-menu__count {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0 0 3rem;
}
.sasana-menu__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
@media (min-width: 768px) {
  .sasana-menu__grid {
    grid-template-columns: 1fr 1fr;
    gap: 0 4rem;
  }
}
.sasana-dish {
  padding: clamp(20px, 2.4vw, 32px) 0;
  border-bottom: 1px solid var(--tmpl-border);
  transition: background-color 350ms ease;
}
.sasana-dish__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.sasana-dish__num {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
}
.sasana-dish__price {
  font-family: var(--tmpl-font-display);
  font-size: 1.125rem;
  font-style: italic;
  color: var(--tmpl-accent);
}
.sasana-dish__name {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.25rem, 1.8vw, 1.625rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.15;
  margin: 0 0 0.75rem;
  transition: color 350ms ease;
}
.sasana-dish__desc {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.55;
  color: var(--tmpl-muted);
  max-width: 56ch;
  margin: 0;
}

/* Menu transition */
.sasana-menu-fade-enter-active {
  transition: opacity 300ms ease, transform 300ms ease;
}
.sasana-menu-fade-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.sasana-menu-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.sasana-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.sasana-menu-fade-move {
  transition: transform 300ms ease;
}

.sasana-menu__footer {
  text-align: center;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}
.sasana-menu__footer p {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0;
}

/* ============================================================
   LINK (underline style)
   ============================================================ */
.sasana-link {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--tmpl-accent);
  text-decoration: none;
  border-bottom: 1px solid var(--tmpl-accent);
  transition: border-color 200ms ease;
  background: none;
  cursor: pointer;
  padding: 0;
}
.sasana-link:hover {
  border-color: transparent;
}

/* ============================================================
   RESERVASI
   ============================================================ */
.sasana-reservasi {
  padding: 8rem 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-reservasi__grid {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
}
@media (min-width: 1024px) {
  .sasana-reservasi__grid {
    grid-template-columns: 6fr 4fr;
    gap: 6rem;
  }
}
.sasana-reservasi__essay {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sasana-reservasi__essay p {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.55;
  color: var(--tmpl-muted);
  margin: 0;
  max-width: 32ch;
}

/* ============================================================
   FORM
   ============================================================ */
.sasana-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.sasana-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.sasana-form__label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
}
.sasana-form__input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: transparent;
  border: 1px solid var(--tmpl-border);
  border-radius: 6px;
  color: var(--tmpl-fg);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  transition: border-color 200ms ease;
}
.sasana-form__input:focus {
  outline: none;
  border-color: var(--tmpl-accent);
}
.sasana-form__input--textarea {
  resize: vertical;
  min-height: 80px;
}
.sasana-form__error {
  font-family: var(--tmpl-font-display);
  font-size: 13px;
  font-style: italic;
  color: var(--tmpl-accent);
  margin: 0;
}
.sasana-form__counter {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
  align-self: flex-end;
}
.sasana-form__code {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--tmpl-surface);
  border: 1px solid var(--tmpl-border);
  border-radius: 6px;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--tmpl-accent);
}
.sasana-form__disclaimer {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0;
  text-align: center;
}

/* Chips */
.sasana-form__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.sasana-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-muted);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 200ms ease;
}
.sasana-chip--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.sasana-chip:hover:not(.sasana-chip--active) {
  border-color: var(--tmpl-muted);
}

/* Stepper */
.sasana-form__stepper {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  align-self: flex-start;
}
.sasana-stepper__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-fg);
  font-size: 18px;
  cursor: pointer;
  transition: all 200ms ease;
}
.sasana-stepper__btn:hover:not(:disabled) {
  background: var(--tmpl-surface);
}
.sasana-stepper__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.sasana-stepper__val {
  font-family: var(--tmpl-font-display);
  font-size: 1.5rem;
  font-style: italic;
  min-width: 2ch;
  text-align: center;
}

/* ============================================================
   ACARA
   ============================================================ */
.sasana-acara {
  padding: 8rem 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-acara__grid {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .sasana-acara__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.sasana-event-card {
  background: var(--tmpl-surface);
  padding: clamp(28px, 3vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.sasana-event-card__tag {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
}
.sasana-event-card__name {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.25rem, 1.8vw, 1.625rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.15;
  margin: 0;
}
.sasana-event-card__format {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
}
.sasana-event-card__desc {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.55;
  color: var(--tmpl-muted);
  margin: 0;
}

/* ============================================================
   LOKASI
   ============================================================ */
.sasana-lokasi {
  padding: 8rem 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-lokasi__grid {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .sasana-lokasi__grid {
    grid-template-columns: 6fr 4fr;
    gap: 4rem;
  }
}
.sasana-lokasi__info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sasana-lokasi__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.sasana-lokasi__label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
}
.sasana-lokasi__item p {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

/* ============================================================
   PRESS
   ============================================================ */
.sasana-press {
  padding: 8rem 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.sasana-press__footnote {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 2rem 0 0;
}

/* ============================================================
   NAV HOURS TICKER
   ============================================================ */
.sasana-nav-hours {
  display: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
  white-space: nowrap;
}
@media (min-width: 768px) {
  .sasana-nav-hours {
    display: inline-flex;
  }
}
.sasana-nav-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
}
.sasana-nav-dot--open {
  background: var(--tmpl-accent);
  animation: sasana-pulse 1.6s ease-in-out infinite;
}
.sasana-nav-dot--closed {
  background: var(--tmpl-muted);
}
@keyframes sasana-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .sasana-nav-dot--open {
    animation: none;
  }
  .sasana-menu-fade-enter-active,
  .sasana-menu-fade-leave-active,
  .sasana-menu-fade-move {
    transition: none;
  }
}
</style>
