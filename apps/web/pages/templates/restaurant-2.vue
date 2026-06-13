<script setup lang="ts">
/**
 * restaurant-2.vue — Kopi Rumah
 * Modern cafe. Pilot Coffee / Blue Bottle style. Space Grotesk bold, warm cream, sun accent.
 *
 * 8 sections: Hero+3D, Menu, Tentang, Lokasi+Jam, Galeri, Reservasi, Footer
 * Working: menu filter (Kopi/Makanan/Roti), cart->WhatsApp, reservation form, hours ticker, 3D cup
 */
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('restaurant-2')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeSection = ref('hero')
const menuFilter = ref('Semua')
const cartOpen = ref(false)
const reservationSuccess = ref(false)
const hoursOpen = ref(false)
const hoursLabel = ref('')
let hoursInterval: number | null = null

// ============================================================
// MENU DATA (8 items, 3 categories)
// ============================================================
interface CafeMenuItem {
  id: number
  name: string
  category: 'Kopi' | 'Makanan' | 'Roti'
  price: number
  description: string
  tag?: string
}

const menuItems: CafeMenuItem[] = [
  { id: 1, name: 'Kopi Susu', category: 'Kopi', price: 28000, description: 'Espresso house blend, susu segar, gula aren. Dingin atau panas.', tag: 'best seller' },
  { id: 2, name: 'Es Kopi Hitam', category: 'Kopi', price: 22000, description: 'Kopi tubruk dingin tanpa susu. Bersih, bold, tanpa ribet.', tag: undefined },
  { id: 3, name: 'Matcha Latte', category: 'Kopi', price: 35000, description: 'Matcha Uji dari Kyoto, susu oat, sedikit madu. Hijau cerah.', tag: undefined },
  { id: 4, name: 'Roti Panggang Mentega', category: 'Roti', price: 18000, description: 'Roti sourdough panggang, mentega asin, taburan garam laut.', tag: undefined },
  { id: 5, name: 'Croissant Cokelat', category: 'Roti', price: 25000, description: 'Croissant butter 72 lapis, isian dark chocolate 64%. Dibuat setiap pagi.', tag: 'fresh daily' },
  { id: 6, name: 'Nasi Goreng Spesial', category: 'Makanan', price: 38000, description: 'Nasi goreng kecap manis, ayam suwir, telur mata sapi, acar, kerupuk.', tag: undefined },
  { id: 7, name: 'Pisang Goreng', category: 'Roti', price: 15000, description: 'Pisang kepok goreng tepung renyah. Cocol saus cokelat atau sambal.', tag: undefined },
  { id: 8, name: 'Teh Tarik', category: 'Kopi', price: 20000, description: 'Teh hitam pekat ditarik tinggi-tinggi dengan susu kental manis.', tag: undefined },
]

const categories = ['Semua', 'Kopi', 'Makanan', 'Roti'] as const

const filteredMenu = computed(() => {
  if (menuFilter.value === 'Semua') return menuItems
  return menuItems.filter(d => d.category === menuFilter.value)
})

const filteredCount = computed(() => filteredMenu.value.length)

// ============================================================
// CART (simple add->WhatsApp flow)
// ============================================================
interface CartLine { item: CafeMenuItem; qty: number }
const cartLines = ref<CartLine[]>([])

function addToCart(item: CafeMenuItem) {
  const existing = cartLines.value.find(l => l.item.id === item.id)
  if (existing) { existing.qty++ }
  else { cartLines.value.push({ item, qty: 1 }) }
}

function removeFromCart(id: number) {
  cartLines.value = cartLines.value.filter(l => l.item.id !== id)
}

const cartTotal = computed(() => cartLines.value.reduce((s, l) => s + l.item.price * l.qty, 0))
const cartCount = computed(() => cartLines.value.reduce((s, l) => s + l.qty, 0))

function checkoutWhatsApp() {
  if (cartLines.value.length === 0) return
  const lines = ['Halo Kopi Rumah, saya mau pesan:', '']
  for (const l of cartLines.value) {
    lines.push(`${l.qty}x ${l.item.name} (Rp ${l.item.price.toLocaleString('id-ID')})`)
  }
  lines.push('', `Total: Rp ${cartTotal.value.toLocaleString('id-ID')}`)
  lines.push('', 'Nama: ', 'Alamat: ')
  const url = `https://wa.me/6281234567890?text=${encodeURIComponent(lines.join('\n'))}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function fmtRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}

// ============================================================
// RESERVATION FORM
// ============================================================
const resForm = reactive({
  nama: '',
  phone: '',
  tanggal: '',
  waktu: '',
  tamu: 2,
  catatan: '',
})

const resTimeSlots = ['08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00', '20.00', '21.00']

const resMinDate = computed(() => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
})

function submitReservation() {
  if (!resForm.nama || !resForm.phone || !resForm.tanggal || !resForm.waktu) return
  const lines = [
    'Halo Kopi Rumah, saya mau reservasi tempat duduk:',
    '',
    `Tanggal: ${resForm.tanggal}`,
    `Jam: ${resForm.waktu}`,
    `Jumlah: ${resForm.tamu} orang`,
    `Nama: ${resForm.nama}`,
    `WhatsApp: ${resForm.phone}`,
  ]
  if (resForm.catatan) lines.push(`Catatan: ${resForm.catatan}`)
  const url = `https://wa.me/6281234567890?text=${encodeURIComponent(lines.join('\n'))}`
  reservationSuccess.value = true
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
    reservationSuccess.value = false
  }, 1200)
}

// ============================================================
// BREW TICKER (today's brew)
// ============================================================
const brews = [
  'Gayo Wine Process · Aceh · 1450m',
  'Toraja Sapan · Sulawesi · 1700m',
  'Mandailing Lintong · Sumatera · 1300m',
  'Kintamani Bali · 1200m',
  'Java Estate Blawan · 1500m',
  'Flores Bajawa · 1250m',
]
const todayBrew = computed(() => {
  const idx = new Date().getDay() % brews.length
  return brews[idx]
})

// ============================================================
// HOURS TICKER
// ============================================================
function updateHours() {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const mins = hour * 60 + minute
  const openMin = 7 * 60
  const closeMin = 22 * 60

  if (mins >= openMin && mins < closeMin) {
    hoursOpen.value = true
    hoursLabel.value = 'Buka · tutup 22.00'
  } else {
    hoursOpen.value = false
    hoursLabel.value = 'Tutup · buka besok 07.00'
  }
}

// ============================================================
// GALERI (6 placeholder slots)
// ============================================================
const galeriItems = [
  { label: 'Suasana pagi', caption: 'Pagi hari, sinar matahari masuk dari jendela besar.' },
  { label: 'Kopi susu', caption: 'Kopi susu gula aren, menu yang paling dicari.' },
  { label: 'Dapur kami', caption: 'Roti dibuat fresh setiap jam 5 pagi.' },
  { label: 'Barista at work', caption: 'Latte art adalah seni yang bisa diminum.' },
  { label: 'Corner seat', caption: 'Kursi pojok favorit untuk kerja atau baca.' },
  { label: 'Croissant', caption: '72 lapis butter, renyah di luar, lembut di dalam.' },
]

// ============================================================
// 3D CUP — raw WebGL canvas, cursor-following lathe cup + steam
// ============================================================
const cupCanvasRef = ref<HTMLCanvasElement | null>(null)
let cupGL: WebGLRenderingContext | null = null
let cupProg: WebGLProgram | null = null
let cupAnimId = 0
let cupStartTime = 0
let cupInView = true
let mouseX = 0
let mouseY = 0
const isReducedMotion = ref(false)

function initCup() {
  const canvas = cupCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try { cupGL = canvas.getContext('webgl2') || canvas.getContext('webgl') }
  catch { return }
  if (!cupGL) return

  const vs = `
    attribute vec2 aPos;
    attribute float aType;
    attribute float aSeed;
    uniform float uTime;
    uniform vec2 uMouse;
    varying float vAlpha;
    varying float vType;
    void main() {
      vec2 p = aPos;
      float t = uTime;
      if (aType < 0.5) {
        // cup body vertices
        p += uMouse * 0.04;
        vAlpha = 0.9;
      } else {
        // steam particles
        float life = fract(t * 0.15 + aSeed);
        float y = life * 1.4;
        float x = sin(t * 0.8 + aSeed * 6.28) * 0.06 * (1.0 - life);
        p = aPos + vec2(x + uMouse.x * 0.02, y);
        vAlpha = (1.0 - life) * 0.35;
      }
      vType = aType;
      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = aType < 0.5 ? 1.0 : mix(24.0, 8.0, fract(aSeed + t * 0.15));
    }
  `
  const fs = `
    precision mediump float;
    varying float vAlpha;
    varying float vType;
    void main() {
      if (vType < 0.5) discard;
      float d = length(gl_PointCoord - vec2(0.5));
      float a = smoothstep(0.5, 0.0, d) * vAlpha;
      gl_FragColor = vec4(0.95, 0.92, 0.85, a);
    }
  `

  const vert = cupGL.createShader(cupGL.VERTEX_SHADER)!
  cupGL.shaderSource(vert, vs)
  cupGL.compileShader(vert)
  const frag = cupGL.createShader(cupGL.FRAGMENT_SHADER)!
  cupGL.shaderSource(frag, fs)
  cupGL.compileShader(frag)
  cupProg = cupGL.createProgram()!
  cupGL.attachShader(cupProg, vert)
  cupGL.attachShader(cupProg, frag)
  cupGL.linkProgram(cupProg)

  // Build cup geometry: lathe profile (silhouette of cup + saucer)
  const cupProfile: number[] = []
  // Saucer (flat ellipse at bottom)
  const saucerPts = [[-0.35, -0.55], [-0.3, -0.58], [0.3, -0.58], [0.35, -0.55]]
  for (const pt of saucerPts) cupProfile.push(pt[0], pt[1], 0.0, 0.0) // type=0 (cup)
  // Cup body (tapered cylinder)
  const cupPts = [
    [-0.22, -0.5], [-0.2, -0.35], [-0.18, -0.15], [-0.16, 0.0],
    [-0.14, 0.12], [-0.12, 0.18], [-0.1, 0.2],
    [0.1, 0.2], [0.12, 0.18], [0.14, 0.12],
    [0.16, 0.0], [0.18, -0.15], [0.2, -0.35], [0.22, -0.5],
  ]
  for (const pt of cupPts) cupProfile.push(pt[0], pt[1], 0.0, 0.0)
  // Coffee surface
  const coffeePts = [[-0.1, 0.19], [0.0, 0.2], [0.1, 0.19]]
  for (const pt of coffeePts) cupProfile.push(pt[0], pt[1], 0.0, 0.0)
  // Handle
  const handlePts = [
    [0.22, 0.1], [0.28, 0.05], [0.3, -0.05], [0.28, -0.15], [0.22, -0.2],
  ]
  for (const pt of handlePts) cupProfile.push(pt[0], pt[1], 0.0, 0.0)

  // Steam particles (50 particles at cup rim)
  const steamPts: number[] = []
  for (let i = 0; i < 50; i++) {
    const sx = (Math.random() - 0.5) * 0.18
    const sy = 0.2 + Math.random() * 0.05
    steamPts.push(sx, sy, 1.0, Math.random()) // type=1 (steam), seed=random
  }

  const allData = new Float32Array([...cupProfile, ...steamPts])

  const buf = cupGL.createBuffer()
  cupGL.bindBuffer(cupGL.ARRAY_BUFFER, buf)
  cupGL.bufferData(cupGL.ARRAY_BUFFER, allData, cupGL.STATIC_DRAW)

  cupStartTime = performance.now()
  const totalVertices = cupProfile.length / 4 + steamPts.length / 4

  const io = new IntersectionObserver(
    (entries) => { cupInView = entries[0]?.isIntersecting ?? false },
    { threshold: 0.05 },
  )
  io.observe(canvas)

  function tick() {
    if (!cupGL || !cupProg) return
    cupAnimId = requestAnimationFrame(tick)
    if (!cupInView) return
    const elapsed = isReducedMotion.value ? 0 : (performance.now() - cupStartTime) / 1000

    cupGL.viewport(0, 0, cupGL.drawingBufferWidth, cupGL.drawingBufferHeight)
    cupGL.clearColor(0, 0, 0, 0)
    cupGL.clear(cupGL.COLOR_BUFFER_BIT)
    cupGL.enable(cupGL.BLEND)
    cupGL.blendFunc(cupGL.SRC_ALPHA, cupGL.ONE_MINUS_SRC_ALPHA)
    cupGL.useProgram(cupProg)
    cupGL.bindBuffer(cupGL.ARRAY_BUFFER, buf)

    const stride = 16
    const aPos = cupGL.getAttribLocation(cupProg, 'aPos')
    const aType = cupGL.getAttribLocation(cupProg, 'aType')
    const aSeed = cupGL.getAttribLocation(cupProg, 'aSeed')
    cupGL.enableVertexAttribArray(aPos)
    cupGL.vertexAttribPointer(aPos, 2, cupGL.FLOAT, false, stride, 0)
    cupGL.enableVertexAttribArray(aType)
    cupGL.vertexAttribPointer(aType, 1, cupGL.FLOAT, false, stride, 8)
    cupGL.enableVertexAttribArray(aSeed)
    cupGL.vertexAttribPointer(aSeed, 1, cupGL.FLOAT, false, stride, 12)

    cupGL.uniform1f(cupGL.getUniformLocation(cupProg, 'uTime'), elapsed)
    cupGL.uniform2f(cupGL.getUniformLocation(cupProg, 'uMouse'), mouseX, mouseY)

    // Draw cup lines
    const cupVertCount = cupProfile.length / 4
    cupGL.drawArrays(cupGL.LINE_LOOP, 0, cupVertCount)
    // Draw steam points
    cupGL.drawArrays(cupGL.POINTS, cupVertCount, totalVertices - cupVertCount)
  }
  tick()
}

// ============================================================
// SCROLL-SPY
// ============================================================
let sectionObserver: IntersectionObserver | null = null

function initScrollSpy() {
  const ids = ['hero', 'menu', 'tentang', 'lokasi', 'galeri', 'reservasi']
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeSection.value = e.target.id
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  )
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  }
}

// ============================================================
// MOUSE TRACKING (for 3D cup)
// ============================================================
function onMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
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
  setTimeout(initCup, 80)
})

onBeforeUnmount(() => {
  if (cupAnimId) cancelAnimationFrame(cupAnimId)
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
</script>

<template>
  <div class="kopi" :style="styles" @mousemove="onMouseMove">
    <a class="skip-link" href="#hero">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <!-- ============================== -->
    <!-- NAVBAR                          -->
    <!-- ============================== -->
    <TmplNavbar
      brand="kopi rumah."
      :links="[
        { label: 'Menu', href: '#menu' },
        { label: 'Tentang', href: '#tentang' },
        { label: 'Lokasi', href: '#lokasi' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'Reservasi', href: '#reservasi' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
      force-mode="light"
    >
      <template #default>
        <div class="kopi-nav-right">
          <div class="kopi-nav-hours" :style="monoStyle">
            <span class="kopi-nav-dot" :class="hoursOpen ? 'kopi-nav-dot--open' : 'kopi-nav-dot--closed'" />
            {{ hoursLabel }}
          </div>
          <button
            type="button"
            class="kopi-nav-cart"
            aria-label="Buka keranjang"
            @click="cartOpen = true"
          >
            <UIcon name="i-lucide-shopping-bag" class="w-5 h-5" />
            <span v-if="cartCount > 0" class="kopi-nav-cart__badge">{{ cartCount }}</span>
          </button>
        </div>
      </template>
    </TmplNavbar>

    <main id="main">

      <!-- ============================== -->
      <!-- SECTION 01 — HERO + 3D          -->
      <!-- ============================== -->
      <section id="hero" class="kopi-hero" @mousemove="onMouseMove">
        <!-- Today's brew ticker -->
        <div class="kopi-ticker" :style="monoStyle">
          <div class="kopi-ticker__track">
            <span v-for="n in 4" :key="n" class="kopi-ticker__item">
              <span class="kopi-ticker__dot" />
              Hari ini brew: {{ todayBrew }} · Roasted fresh · Est. 2019 Kemang
            </span>
          </div>
        </div>

        <div class="kopi-hero__grid">
          <div class="kopi-hero__content">
            <h1
              :style="{ ...h1Style, fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: '0.95', letterSpacing: '-0.03em' }"
              class="kopi-hero__h1"
            >
              your daily cup,<br />treated like a<br />single-origin lot.
            </h1>

            <p class="kopi-hero__sub">
              Dari rumah kami, ke cangkir anda. Specialty coffee, freshly roasted di Kemang, Jakarta.
            </p>

            <div class="kopi-hero__ctas">
              <a href="#menu" class="kopi-btn kopi-btn--primary" @click="handleNavClick($event, '#menu')">Lihat Menu</a>
              <a href="#reservasi" class="kopi-btn kopi-btn--ghost" @click="handleNavClick($event, '#reservasi')">Reservasi Kursi</a>
            </div>

            <div class="kopi-hero__meta" :style="monoStyle">
              Kemang, Jakarta · Buka 07.00 - 22.00 · 4 lokasi + 1 roastery
            </div>
          </div>

          <!-- 3D Cup -->
          <div class="kopi-hero__cup-wrap">
            <canvas ref="cupCanvasRef" class="kopi-hero__cup-canvas" />
            <p class="kopi-hero__cup-label" :style="monoStyle">gerakkan mouse</p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 02 — MENU (8 items)     -->
      <!-- ============================== -->
      <section id="menu" class="kopi-menu">
        <div class="kopi-section-head">
          <h2 :style="h2Style">Menu.</h2>
          <p class="kopi-section-sub" :style="monoStyle">8 pilihan · Kopi, Makanan, Roti</p>
        </div>

        <!-- Filter pills -->
        <div class="kopi-menu__filters">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="kopi-pill"
            :class="{ 'kopi-pill--active': menuFilter === cat }"
            @click="menuFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <p class="kopi-menu__count" :style="monoStyle">Menampilkan {{ filteredCount }} dari 8</p>

        <!-- Menu grid -->
        <TransitionGroup name="kopi-menu-fade" tag="div" class="kopi-menu__grid">
          <div
            v-for="item in filteredMenu"
            :key="item.id"
            class="kopi-menu-card"
          >
            <div class="kopi-menu-card__head">
              <span class="kopi-menu-card__cat" :style="monoStyle">{{ item.category.toUpperCase() }}</span>
              <span v-if="item.tag" class="kopi-menu-card__tag">{{ item.tag }}</span>
            </div>
            <h3 class="kopi-menu-card__name">{{ item.name }}</h3>
            <p class="kopi-menu-card__desc">{{ item.description }}</p>
            <div class="kopi-menu-card__foot">
              <span class="kopi-menu-card__price">{{ fmtRp(item.price) }}</span>
              <button
                type="button"
                class="kopi-menu-card__add"
                :style="{ background: 'var(--tmpl-accent)', color: 'var(--tmpl-accent-fg)' }"
                @click="addToCart(item)"
              >
                + Tambah
              </button>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="cartCount > 0" class="kopi-menu__cart-bar">
          <span>{{ cartCount }} item · {{ fmtRp(cartTotal) }}</span>
          <button type="button" class="kopi-btn kopi-btn--primary kopi-btn--sm" @click="checkoutWhatsApp">
            Pesan via WhatsApp
          </button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 03 — TENTANG            -->
      <!-- ============================== -->
      <section id="tentang" class="kopi-tentang">
        <div class="kopi-section-head">
          <h2 :style="h2Style">Cerita kami.</h2>
          <p class="kopi-section-sub" :style="monoStyle">Sejak 2019 · Kemang, Jakarta</p>
        </div>

        <div class="kopi-tentang__grid">
          <div class="kopi-tentang__text">
            <p class="kopi-tentang__lead">
              Kopi Rumah lahir dari satu pertanyaan sederhana: kenapa kopi enak harus mahal?
            </p>
            <p>
              Tahun 2019, kami mulai dari garasi rumah di Kemang. Dua mesin espresso, satu grinder, dan kopi Gayo dari petani langsung. Tidak ada menu fancy, tidak ada tempat duduk mewah. Hanya kopi yang dibuat dengan benar.
            </p>
            <p>
              Sekarang kami punya 4 kedai dan 1 roastery. Biji kopi kami datang dari Aceh, Toraja, Mandailing, Kintamani, dan Flores. Kami sangrai sendiri setiap minggu. Karena kopi itu bukan cuma caffeine, ini rasa.
            </p>
            <p>
              Datang, duduk, pesan. Tidak perlu reservasi untuk secangkir kopi. Tapi kalau mau kerja seharian, kursi pojok kami selalu siap.
            </p>
          </div>
          <aside class="kopi-tentang__facts" :style="monoStyle">
            <div class="kopi-fact">
              <span class="kopi-fact__num">4</span>
              <span class="kopi-fact__label">kedai di Jakarta</span>
            </div>
            <div class="kopi-fact">
              <span class="kopi-fact__num">1</span>
              <span class="kopi-fact__label">roastery di Kemang</span>
            </div>
            <div class="kopi-fact">
              <span class="kopi-fact__num">6</span>
              <span class="kopi-fact__label">asal biji Indonesia</span>
            </div>
            <div class="kopi-fact">
              <span class="kopi-fact__num">2019</span>
              <span class="kopi-fact__label">tahun berdiri</span>
            </div>
          </aside>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 04 — LOKASI + JAM       -->
      <!-- ============================== -->
      <section id="lokasi" class="kopi-lokasi">
        <div class="kopi-section-head">
          <h2 :style="h2Style">Datang ngopi.</h2>
          <p class="kopi-section-sub" :style="monoStyle">4 lokasi + 1 roastery</p>
        </div>

        <div class="kopi-lokasi__grid">
          <TmplMap
            label="Kopi Rumah Kemang"
            address="Jl. Kemang Selatan IX No. 42"
            city="Jakarta Selatan 12730"
            :lat="-6.2615"
            :lng="106.8106"
            accent="var(--tmpl-accent)"
            google-maps-url="https://maps.google.com/?q=Kopi+Rumah+Kemang+Jakarta+Selatan"
          />

          <div class="kopi-lokasi__info">
            <div class="kopi-lokasi__item">
              <span class="kopi-lokasi__label" :style="monoStyle">Alamat utama</span>
              <p>Jl. Kemang Selatan IX No. 42, Jakarta Selatan 12730</p>
            </div>
            <div class="kopi-lokasi__item">
              <span class="kopi-lokasi__label" :style="monoStyle">Jam buka</span>
              <p>Senin - Minggu · 07.00 - 22.00</p>
              <p class="kopi-lokasi__hours-live" :style="monoStyle">
                <span class="kopi-nav-dot" :class="hoursOpen ? 'kopi-nav-dot--open' : 'kopi-nav-dot--closed'" />
                {{ hoursLabel }}
              </p>
            </div>
            <div class="kopi-lokasi__item">
              <span class="kopi-lokasi__label" :style="monoStyle">Kontak</span>
              <p><a href="tel:+6281234567890" class="kopi-link">+62 812 3456 7890</a></p>
              <p><a href="mailto:halo@kopirumah.id" class="kopi-link">halo@kopirumah.id</a></p>
              <p><a href="https://instagram.com/kopirumah.id" target="_blank" rel="noopener" class="kopi-link">@kopirumah.id</a></p>
            </div>
            <div class="kopi-lokasi__item">
              <span class="kopi-lokasi__label" :style="monoStyle">WiFi</span>
              <p>Gratis. Password di struk.</p>
            </div>
            <div class="kopi-lokasi__item">
              <span class="kopi-lokasi__label" :style="monoStyle">Parkir</span>
              <p>Motor dan mobil tersedia. Valet weekend.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 05 — GALERI             -->
      <!-- ============================== -->
      <section id="galeri" class="kopi-galeri">
        <div class="kopi-section-head">
          <h2 :style="h2Style">Suasana.</h2>
          <p class="kopi-section-sub" :style="monoStyle">Foto dari kedai kami</p>
        </div>

        <div class="kopi-galeri__grid">
          <div
            v-for="(g, i) in galeriItems"
            :key="i"
            class="kopi-galeri__item"
          >
            <div class="kopi-galeri__img" :style="{ background: `var(--tmpl-surface)` }">
              <span class="kopi-galeri__label" :style="monoStyle">{{ g.label }}</span>
            </div>
            <p class="kopi-galeri__caption">{{ g.caption }}</p>
          </div>
        </div>

        <div class="kopi-galeri__cta">
          <a href="https://instagram.com/kopirumah.id" target="_blank" rel="noopener" class="kopi-link">
            Lihat lebih banyak di Instagram
          </a>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 06 — RESERVASI          -->
      <!-- ============================== -->
      <section id="reservasi" class="kopi-reservasi">
        <div class="kopi-section-head">
          <h2 :style="h2Style">Reservasi.</h2>
          <p class="kopi-section-sub" :style="monoStyle">Untuk 1-20 orang · Butuh kursi untuk kerja atau meeting?</p>
        </div>

        <div class="kopi-reservasi__grid">
          <form class="kopi-form" novalidate @submit.prevent="submitReservation">
            <div class="kopi-form__row">
              <div class="kopi-form__field">
                <label for="rv-nama" class="kopi-form__label" :style="monoStyle">Nama *</label>
                <input id="rv-nama" v-model="resForm.nama" type="text" placeholder="Nama Anda" required class="kopi-form__input" />
              </div>
              <div class="kopi-form__field">
                <label for="rv-phone" class="kopi-form__label" :style="monoStyle">WhatsApp *</label>
                <input id="rv-phone" v-model="resForm.phone" type="tel" placeholder="+62 812 ..." required class="kopi-form__input" />
              </div>
            </div>

            <div class="kopi-form__row">
              <div class="kopi-form__field">
                <label for="rv-tgl" class="kopi-form__label" :style="monoStyle">Tanggal *</label>
                <input id="rv-tgl" v-model="resForm.tanggal" type="date" :min="resMinDate" required class="kopi-form__input" />
              </div>
              <div class="kopi-form__field">
                <label class="kopi-form__label" :style="monoStyle">Jam *</label>
                <div class="kopi-form__chips">
                  <button
                    v-for="slot in resTimeSlots"
                    :key="slot"
                    type="button"
                    class="kopi-chip"
                    :class="{ 'kopi-chip--active': resForm.waktu === slot }"
                    @click="resForm.waktu = slot"
                  >
                    {{ slot }}
                  </button>
                </div>
              </div>
            </div>

            <div class="kopi-form__row">
              <div class="kopi-form__field">
                <label class="kopi-form__label" :style="monoStyle">Jumlah orang</label>
                <div class="kopi-form__stepper">
                  <button type="button" class="kopi-stepper__btn" :disabled="resForm.tamu <= 1" @click="resForm.tamu--">-</button>
                  <span class="kopi-stepper__val">{{ resForm.tamu }}</span>
                  <button type="button" class="kopi-stepper__btn" :disabled="resForm.tamu >= 20" @click="resForm.tamu++">+</button>
                </div>
              </div>
              <div class="kopi-form__field">
                <label for="rv-catatan" class="kopi-form__label" :style="monoStyle">Catatan</label>
                <textarea id="rv-catatan" v-model="resForm.catatan" rows="2" maxlength="280" placeholder="Butuh colokan, proyektor, atau area merokok?" class="kopi-form__input kopi-form__input--textarea" />
              </div>
            </div>

            <button
              type="submit"
              class="kopi-btn kopi-btn--primary kopi-btn--full"
              :disabled="!resForm.nama || !resForm.phone || !resForm.tanggal || !resForm.waktu"
            >
              <span v-if="reservationSuccess">Terima kasih! WhatsApp terbuka.</span>
              <span v-else>Kirim via WhatsApp</span>
            </button>
          </form>

          <div class="kopi-reservasi__note">
            <p>
              Reservasi untuk 4 orang atau lebih. Untuk 1-3 orang, langsung datang saja. Kami biasanya punya tempat duduk.
            </p>
            <p>
              Butuh ruangan privat untuk meeting? Sebutkan di catatan. Kami punya 2 ruangan dengan proyektor dan whiteboard.
            </p>
            <p>
              Kami akan konfirmasi lewat WhatsApp dalam 1 jam. Kalau tidak ada balasan, cek spam atau hubungi langsung.
            </p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 07 — FOOTER             -->
      <!-- ============================== -->
      <TmplFooter
        brand-name="kopi rumah."
        variant="signoff"
        signoff="Dari rumah kami, ke cangkir anda."
        signature="Dirancang di Jakarta, dibuat untuk UMKM Indonesia"
        accent="var(--tmpl-accent)"
      />

    </main>

    <!-- Cart drawer -->
    <TmplCart
      v-model:open="cartOpen"
      :items="cartLines.map(l => ({ id: String(l.item.id), name: l.item.name, price: l.item.price, qty: l.qty }))"
      accent="var(--tmpl-accent)"
      currency="Rp "
      whatsapp-phone="6281234567890"
      whatsapp-message-prefix="Halo Kopi Rumah, saya mau pesan:"
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="restaurant"
    />
  </div>
</template>

<style scoped>
.kopi {
  min-height: 100dvh;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  padding: 0.5rem 1rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  z-index: 100;
  font-size: 14px;
}
.skip-link:focus {
  top: 0;
}

/* ============================================================
   NAV RIGHT (hours + cart)
   ============================================================ */
.kopi-nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.kopi-nav-hours {
  display: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
  white-space: nowrap;
}
@media (min-width: 768px) {
  .kopi-nav-hours { display: inline-flex; }
}
.kopi-nav-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
}
.kopi-nav-dot--open {
  background: #4ade80;
  animation: kopi-pulse 1.6s ease-in-out infinite;
}
.kopi-nav-dot--closed {
  background: var(--tmpl-muted);
}
@keyframes kopi-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.kopi-nav-cart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--tmpl-border);
  border-radius: 10px;
  color: var(--tmpl-fg);
  cursor: pointer;
  transition: background-color 200ms ease;
}
.kopi-nav-cart:hover {
  background: var(--tmpl-surface);
}
.kopi-nav-cart__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  padding: 0 4px;
}

/* ============================================================
   HERO
   ============================================================ */
.kopi-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Ticker */
.kopi-ticker {
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid var(--tmpl-border);
  padding: 0.625rem 0;
  background: var(--tmpl-surface);
}
.kopi-ticker__track {
  display: flex;
  width: max-content;
  animation: kopi-ticker-scroll 40s linear infinite;
  gap: 3rem;
}
.kopi-ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--tmpl-muted);
}
.kopi-ticker__dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--tmpl-accent);
}
@keyframes kopi-ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.kopi-hero__grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: clamp(6rem, 12vh, 10rem) 2rem 4rem;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
  align-items: center;
}
@media (min-width: 1024px) {
  .kopi-hero__grid {
    grid-template-columns: 7fr 5fr;
    gap: 4rem;
    padding: clamp(6rem, 12vh, 10rem) 3rem 4rem;
  }
}
.kopi-hero__content {
  position: relative;
  z-index: 2;
}
.kopi-hero__h1 {
  font-family: var(--tmpl-font-display);
  margin: 0 0 1.5rem;
}
.kopi-hero__sub {
  font-family: var(--tmpl-font-body);
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  line-height: 1.55;
  max-width: 38ch;
  color: var(--tmpl-muted);
  margin: 0 0 2rem;
}
.kopi-hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}
.kopi-hero__meta {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.45;
}
.kopi-hero__cup-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.kopi-hero__cup-canvas {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 3/4;
}
.kopi-hero__cup-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.3;
  margin-top: 0.5rem;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.kopi-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 200ms ease, transform 180ms ease, box-shadow 200ms ease;
}
.kopi-btn--primary {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.kopi-btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px oklch(72% 0.16 80 / 0.25);
}
.kopi-btn--primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.kopi-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border: 1px solid var(--tmpl-border);
}
.kopi-btn--ghost:hover {
  background: var(--tmpl-surface);
}
.kopi-btn--sm {
  padding: 0.625rem 1rem;
  font-size: 12px;
}
.kopi-btn--full {
  width: 100%;
}

/* ============================================================
   SECTION HEADS
   ============================================================ */
.kopi-section-head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.kopi-section-head h2 {
  margin: 0 0 0.5rem;
}
.kopi-section-sub {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.45;
  margin: 0;
}

/* ============================================================
   MENU
   ============================================================ */
.kopi-menu {
  padding: clamp(4rem, 8vw, 8rem) 2rem;
  max-width: 72rem;
  margin: 0 auto;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-menu__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.kopi-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-muted);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 200ms ease;
}
.kopi-pill--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.kopi-pill:hover:not(.kopi-pill--active) {
  border-color: var(--tmpl-muted);
  color: var(--tmpl-fg);
}
.kopi-menu__count {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.35;
  margin: 0 0 2.5rem;
}
.kopi-menu__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .kopi-menu__grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .kopi-menu__grid { grid-template-columns: repeat(3, 1fr); }
}

/* Menu card */
.kopi-menu-card {
  background: var(--tmpl-surface);
  border: 1px solid var(--tmpl-border);
  border-radius: 14px;
  padding: clamp(20px, 2.5vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.kopi-menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px oklch(20% 0.02 60 / 0.06);
}
.kopi-menu-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kopi-menu-card__cat {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.4;
}
.kopi-menu-card__tag {
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: var(--tmpl-accent-soft);
  color: var(--tmpl-accent);
  font-weight: 600;
}
.kopi-menu-card__name {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.125rem, 1.5vw, 1.375rem);
  font-weight: 600;
  line-height: 1.15;
  margin: 0;
}
.kopi-menu-card__desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--tmpl-muted);
  margin: 0;
  flex: 1;
}
.kopi-menu-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-menu-card__price {
  font-family: var(--tmpl-font-mono);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.kopi-menu-card__add {
  padding: 0.4rem 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 200ms ease, transform 180ms ease;
}
.kopi-menu-card__add:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Menu transition */
.kopi-menu-fade-enter-active { transition: opacity 280ms ease, transform 280ms ease; }
.kopi-menu-fade-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.kopi-menu-fade-enter-from { opacity: 0; transform: translateY(8px); }
.kopi-menu-fade-leave-to { opacity: 0; transform: translateY(-4px); }
.kopi-menu-fade-move { transition: transform 280ms ease; }

/* Cart bar */
.kopi-menu__cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  background: var(--tmpl-surface-elevated);
  border-top: 1px solid var(--tmpl-border);
  box-shadow: 0 -4px 20px oklch(0% 0 0 / 0.06);
  font-size: 14px;
  font-weight: 600;
}

/* ============================================================
   LINK
   ============================================================ */
.kopi-link {
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
.kopi-link:hover {
  border-color: transparent;
}

/* ============================================================
   TENTANG
   ============================================================ */
.kopi-tentang {
  padding: clamp(4rem, 8vw, 8rem) 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-tentang__grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .kopi-tentang__grid {
    grid-template-columns: 7fr 4fr;
    gap: 4rem;
  }
}
.kopi-tentang__lead {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.25rem, 1.8vw, 1.5rem);
  font-weight: 500;
  line-height: 1.35;
  margin: 0 0 1.5rem;
}
.kopi-tentang__text p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--tmpl-muted);
  margin: 0 0 1.25rem;
}
.kopi-tentang__text p:last-child {
  margin-bottom: 0;
}
.kopi-tentang__facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-content: start;
  padding-top: 0.5rem;
}
.kopi-fact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.kopi-fact__num {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1;
  color: var(--tmpl-accent);
  font-variant-numeric: tabular-nums;
}
.kopi-fact__label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.5;
}

/* ============================================================
   LOKASI
   ============================================================ */
.kopi-lokasi {
  padding: clamp(4rem, 8vw, 8rem) 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-lokasi__grid {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .kopi-lokasi__grid {
    grid-template-columns: 6fr 4fr;
    gap: 4rem;
  }
}
.kopi-lokasi__info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.kopi-lokasi__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.kopi-lokasi__label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.4;
}
.kopi-lokasi__item p {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}
.kopi-lokasi__hours-live {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ============================================================
   GALERI
   ============================================================ */
.kopi-galeri {
  padding: clamp(4rem, 8vw, 8rem) 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-galeri__grid {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .kopi-galeri__grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .kopi-galeri__grid { grid-template-columns: repeat(3, 1fr); }
}
.kopi-galeri__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.kopi-galeri__img {
  aspect-ratio: 4/3;
  border-radius: 14px;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}
.kopi-galeri__label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.5;
  background: var(--tmpl-surface-elevated);
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
}
.kopi-galeri__caption {
  font-size: 13px;
  line-height: 1.45;
  color: var(--tmpl-muted);
  margin: 0;
  padding: 0 0.25rem;
}
.kopi-galeri__cta {
  text-align: center;
  margin-top: 2.5rem;
}

/* ============================================================
   RESERVASI
   ============================================================ */
.kopi-reservasi {
  padding: clamp(4rem, 8vw, 8rem) 2rem;
  border-top: 1px solid var(--tmpl-border);
}
.kopi-reservasi__grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .kopi-reservasi__grid {
    grid-template-columns: 3fr 2fr;
    gap: 4rem;
  }
}
.kopi-reservasi__note {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.kopi-reservasi__note p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--tmpl-muted);
  margin: 0;
}

/* ============================================================
   FORM
   ============================================================ */
.kopi-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.kopi-form__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .kopi-form__row { grid-template-columns: 1fr 1fr; }
}
.kopi-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.kopi-form__label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.55;
}
.kopi-form__input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: transparent;
  border: 1px solid var(--tmpl-border);
  border-radius: 10px;
  color: var(--tmpl-fg);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  transition: border-color 200ms ease;
  box-sizing: border-box;
}
.kopi-form__input:focus {
  outline: none;
  border-color: var(--tmpl-accent);
}
.kopi-form__input--textarea {
  resize: vertical;
  min-height: 60px;
}

/* Chips */
.kopi-form__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.kopi-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-muted);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 180ms ease;
}
.kopi-chip--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.kopi-chip:hover:not(.kopi-chip--active) {
  border-color: var(--tmpl-muted);
}

/* Stepper */
.kopi-form__stepper {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  align-self: flex-start;
}
.kopi-stepper__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-fg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 180ms ease;
}
.kopi-stepper__btn:hover:not(:disabled) {
  background: var(--tmpl-surface);
}
.kopi-stepper__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.kopi-stepper__val {
  font-family: var(--tmpl-font-display);
  font-size: 1.25rem;
  font-weight: 600;
  min-width: 2ch;
  text-align: center;
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .kopi-ticker__track { animation: none; }
  .kopi-nav-dot--open { animation: none; }
  .kopi-menu-fade-enter-active,
  .kopi-menu-fade-leave-active,
  .kopi-menu-fade-move { transition: none; }
}
</style>
