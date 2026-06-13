<script setup lang="ts">
/**
 * wedding-2.vue — Dita & Budi
 * Modern Minimal Wedding. Ultra-clean, cool paper, blue accent.
 *
 * 12 sections. SUBTLE 3D: 1 wireframe torus ring barely visible.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('wedding-2')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

const isLoaded = ref(false)
const isReducedMotion = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const copiedBank = ref<string | null>(null)
let copiedTimer: number | null = null

const { buildUrl } = useWhatsApp()

const rsvpFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text' as const, placeholder: 'Misal: Sari', required: true },
  { key: 'party', label: 'Jumlah tamu', type: 'select' as const, required: true, options: ['1 orang', '2 orang', '3 orang', '4 orang', '5+ orang'] },
  { key: 'attendance', label: 'Kehadiran', type: 'select' as const, required: true, options: ['Insha Allah hadir', 'Maaf, tidak bisa hadir'] },
  { key: 'ucapan', label: 'Ucapan untuk kedua mempelai', type: 'textarea' as const, placeholder: 'Doa dan ucapanmu untuk kami' },
]
const rsvpMessage = 'Halo, saya ingin konfirmasi kehadiran di pernikahan Dita & Budi.'

// ============================================================
// 12 SECTIONS DATA
// ============================================================
const ceritaKami = [
  { year: '2018', text: 'Ketemu di kampus, sama-sama terlambat masuk kelas statistik. Kursi kosong tinggal satu.' },
  { year: '2020', text: 'Lulus bareng di tengah pandemi. Wisuda online, foto toga di kosan. Tidak apa.' },
  { year: '2023', text: 'Pindah ke Jakarta. Kerja di gedung yang beda lantai. Makan siang selalu bareng.' },
  { year: '2025', text: 'Dia melamar di Danau Toba, pagi hari, sebelum sarapan. Tanpa cincin, tanpa rencana. Hanya iya.' },
]

const acara = [
  { time: '09:00', label: 'Akad Nikah', location: 'Masjid Raya Al-Azhar, Jakarta Selatan' },
  { time: '12:00', label: 'Resepsi', location: 'Ballroom Hotel Mulia Senayan, Jakarta' },
  { time: '19:00', label: 'Makan Malam', location: 'SKYE Bar & Restaurant, BCA Tower, Jakarta' },
]

const galleryImages = [
  { src: '', alt: 'Foto prewedding di Danau Toba', caption: 'Danau Toba, pagi hari, 2025' },
  { src: '', alt: 'Foto prewedding di Kota Tua Jakarta', caption: 'Kota Tua, sore hari, 2025' },
  { src: '', alt: 'Foto prewedding di Kebun Raya Bogor', caption: 'Kebun Raya Bogor, musim hujan, 2024' },
  { src: '', alt: 'Foto lamaran di Danau Toba', caption: 'Momen lamaran, Danau Toba, 2025' },
  { src: '', alt: 'Foto pertama kali ketemu', caption: 'Kelas statistik, 2018' },
  { src: '', alt: 'Foto wisuda online', caption: 'Wisuda online, 2020' },
  { src: '', alt: 'Foto makan siang bareng', caption: 'Makan siang di Senayan, 2024' },
  { src: '', alt: 'Foto liburan Bali', caption: 'Liburan pertama ke Bali, 2023' },
]

const banks = [
  { id: 'bni', name: 'BNI', number: '012-345-6789', holder: 'Dita A. Putri' },
  { id: 'bca', name: 'BCA', number: '987-654-3210', holder: 'Budi S. Prasetyo' },
  { id: 'mandiri', name: 'Mandiri', number: '555-666-7778', holder: 'Dita & Budi' },
]

// ============================================================
// 3D — 1 WIREFRAME TORUS (barely visible, calm)
// ============================================================
const torusCanvasRef = ref<HTMLCanvasElement | null>(null)
let torusGL: WebGLRenderingContext | null = null
let torusProg: WebGLProgram | null = null
let torusBuf: WebGLBuffer | null = null
let torusAnimId = 0
let torusStartTime = 0

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 200)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isReducedMotion.value) {
    setTimeout(initTorus3D, 100)
  }
})

onBeforeUnmount(() => {
  if (torusAnimId) cancelAnimationFrame(torusAnimId)
  if (copiedTimer) clearTimeout(copiedTimer)
})

function initTorus3D() {
  const canvas = torusCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    torusGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!torusGL) return

  const aspect = rect.width / rect.height
  const seg = 64
  const tubeSeg = 24
  const R = 0.38
  const r = 0.12

  const verts: number[] = []
  for (let i = 0; i <= seg; i++) {
    const u = (i / seg) * Math.PI * 2
    for (let j = 0; j <= tubeSeg; j++) {
      const v = (j / tubeSeg) * Math.PI * 2
      const x = (R + r * Math.cos(v)) * Math.cos(u)
      const y = (R + r * Math.cos(v)) * Math.sin(u)
      const z = r * Math.sin(v)
      verts.push(x, y, z)
    }
  }

  const indices: number[] = []
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < tubeSeg; j++) {
      const a = i * (tubeSeg + 1) + j
      const b = a + tubeSeg + 1
      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }

  const vs = `
    attribute vec3 aPos;
    uniform float uTime;
    uniform float uAspect;
    void main() {
      float c = cos(uTime * 0.12);
      float s = sin(uTime * 0.12);
      vec3 p = aPos;
      p.xz = mat2(c, s, -s, c) * p.xz;
      float c2 = cos(uTime * 0.06 + 1.5);
      float s2 = sin(uTime * 0.06 + 1.5);
      p.yz = mat2(c2, s2, -s2, c2) * p.yz;
      p.x /= uAspect;
      gl_Position = vec4(p * 0.85, 1.0);
    }
  `
  const fs = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.28, 0.36, 0.55, 0.07);
    }
  `
  const vert = torusGL.createShader(torusGL.VERTEX_SHADER)!
  torusGL.shaderSource(vert, vs)
  torusGL.compileShader(vert)
  const frag = torusGL.createShader(torusGL.FRAGMENT_SHADER)!
  torusGL.shaderSource(frag, fs)
  torusGL.compileShader(frag)
  torusProg = torusGL.createProgram()!
  torusGL.attachShader(torusProg, vert)
  torusGL.attachShader(torusProg, frag)
  torusGL.linkProgram(torusProg)

  torusBuf = torusGL.createBuffer()
  torusGL.bindBuffer(torusGL.ARRAY_BUFFER, torusBuf)
  torusGL.bufferData(torusGL.ARRAY_BUFFER, new Float32Array(verts), torusGL.STATIC_DRAW)

  const idxBuf = torusGL.createBuffer()!
  torusGL.bindBuffer(torusGL.ELEMENT_ARRAY_BUFFER, idxBuf)
  torusGL.bufferData(torusGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), torusGL.STATIC_DRAW)

  torusStartTime = performance.now()

  function tick() {
    if (!torusGL || !torusProg || !torusBuf || !torusCanvasRef.value) return
    torusAnimId = requestAnimationFrame(tick)
    const elapsed = (performance.now() - torusStartTime) / 1000
    torusGL.viewport(0, 0, torusGL.drawingBufferWidth, torusGL.drawingBufferHeight)
    torusGL.clearColor(0, 0, 0, 0)
    torusGL.clear(torusGL.COLOR_BUFFER_BIT)
    torusGL.enable(torusGL.BLEND)
    torusGL.blendFunc(torusGL.SRC_ALPHA, torusGL.ONE_MINUS_SRC_ALPHA)
    torusGL.useProgram(torusProg)
    torusGL.bindBuffer(torusGL.ARRAY_BUFFER, torusBuf)
    torusGL.enableVertexAttribArray(torusGL.getAttribLocation(torusProg, 'aPos'))
    torusGL.vertexAttribPointer(torusGL.getAttribLocation(torusProg, 'aPos'), 3, torusGL.FLOAT, false, 12, 0)
    torusGL.uniform1f(torusGL.getUniformLocation(torusProg, 'uTime'), elapsed)
    torusGL.uniform1f(torusGL.getUniformLocation(torusProg, 'uAspect'), aspect)
    torusGL.drawElements(torusGL.LINES, indices.length, torusGL.UNSIGNED_SHORT, 0)
  }
  tick()
}

// ============================================================
// INTERACTIONS
// ============================================================
function openLightbox(i: number) {
  lightboxIndex.value = i
  lightboxOpen.value = true
}
function closeLightbox() {
  lightboxOpen.value = false
}

async function copyBank(bank: typeof banks[number]) {
  try {
    await navigator.clipboard.writeText(`${bank.name} ${bank.number} a.n. ${bank.holder}`)
    copiedBank.value = bank.id
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => { copiedBank.value = null }, 1800)
  }
  catch {
    copiedBank.value = bank.id
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => { copiedBank.value = null }, 1800)
  }
}

function downloadICS() {
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AjoClub//Wedding//ID',
    'BEGIN:VEVENT',
    'UID:dita-budi-wedding-2026@ajoclub.id',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20260620T020000Z',
    'DTEND:20260620T140000Z',
    'SUMMARY:Akad Nikah & Resepsi Dita & Budi',
    'DESCRIPTION:Pernikahan Dita & Budi, Sabtu 20 Juni 2026, Jakarta. Akad 09:00 di Masjid Raya Al-Azhar, Resepsi 12:00 di Hotel Mulia Senayan.',
    'LOCATION:Masjid Raya Al-Azhar, Jakarta Selatan',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'dita-budi-wedding.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function openLiveStream() {
  window.open(buildUrl('Halo, saya mau link live streaming pernikahan Dita & Budi.'), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="db" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Dita & Budi"
      wordmark="D & B"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'RSVP', href: '#rsvp' },
        { label: 'Amplop', href: '#amplop' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
    />

    <TmplAudioToggle
      src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
      storage-key="wedding-2-audio"
      :accent="tpl.accentColor"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- OPENING — Bismillah + Names + 3D Torus -->
      <!-- ============================== -->
      <section class="db-hero" :style="{ minHeight: '100dvh' }">
        <canvas ref="torusCanvasRef" class="db-hero__torus" aria-hidden="true" />

        <div class="db-hero__content">
          <p class="db-hero__opening" :style="monoStyle">Bismillahirrahmanirrahim</p>
          <p class="db-hero__opening" :style="monoStyle">Assalamualaikum Warahmatullahi Wabarakatuh</p>

          <h1 :style="h1Style" class="db-hero__names text-balance">
            <span class="db-hero__name">Dita</span>
            <span class="db-hero__amp">&amp;</span>
            <span class="db-hero__name">Budi</span>
          </h1>

          <p class="db-hero__date" :style="monoStyle">Sabtu &middot; 20 &middot; Juni &middot; 2026</p>
          <p class="db-hero__city" :style="monoStyle">Jakarta, Indonesia</p>

          <div class="db-hero__countdown">
            <TmplCountdown target="2026-06-20T09:00:00+07:00" variant="blocks" label="Pintu akad dibuka dalam" />
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- CERITA — Timeline -->
      <!-- ============================== -->
      <section id="cerita" class="db-cerita">
        <p class="db-eyebrow" :style="monoStyle">Perjalanan Kami</p>
        <h2 :style="h1Style" class="db-cerita__title text-balance">Tempat kami mulai.</h2>

        <ol class="db-cerita__list">
          <li v-for="item in ceritaKami" :key="item.year" class="db-cerita__item">
            <span class="db-cerita__year" :style="monoStyle">{{ item.year }}</span>
            <p :style="h2Style" class="db-cerita__text">{{ item.text }}</p>
          </li>
        </ol>
      </section>

      <!-- ============================== -->
      <!-- ACARA — 3 events -->
      <!-- ============================== -->
      <section id="acara" class="db-acara">
        <p class="db-eyebrow" :style="monoStyle">Detail Acara</p>
        <h2 :style="h1Style" class="db-acara__title text-balance">Sabtu, 20 Juni 2026.</h2>

        <div class="db-acara__list">
          <article v-for="(e, i) in acara" :key="e.label" class="db-acara__item">
            <p class="db-acara__time" :style="monoStyle">{{ e.time }}</p>
            <h3 :style="h1Style" class="db-acara__label">{{ e.label }}</h3>
            <p class="db-acara__location">{{ e.location }}</p>
            <span class="db-acara__num" :style="monoStyle">{{ String(i + 1).padStart(2, '0') }}</span>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- GALERI — Photos with lightbox -->
      <!-- ============================== -->
      <section id="galeri" class="db-galeri">
        <p class="db-eyebrow" :style="monoStyle">Galeri</p>
        <h2 :style="h1Style" class="db-galeri__title text-balance">Foto-foto yang kami simpan.</h2>

        <div class="db-galeri__grid">
          <button
            v-for="(img, i) in galleryImages"
            :key="i"
            type="button"
            class="db-galeri__item"
            :aria-label="img.alt"
            @click="openLightbox(i)"
          >
            <span class="db-galeri__photo" :aria-hidden="true">
              <span :style="monoStyle" class="db-galeri__photo-label">Foto {{ String(i + 1).padStart(2, '0') }}</span>
            </span>
            <p class="db-galeri__caption" :style="h2Style">{{ img.caption }}</p>
          </button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- RSVP — Working form -->
      <!-- ============================== -->
      <section id="rsvp" class="db-rsvp">
        <p class="db-eyebrow" :style="monoStyle">Konfirmasi</p>
        <h2 :style="h1Style" class="db-rsvp__title text-balance">Bisa hadir?</h2>
        <p class="db-rsvp__sub">Mohon konfirmasi sebelum 6 Juni 2026.</p>

        <TmplForm
          :fields="rsvpFields"
          submit-label="Kirim Konfirmasi"
          :whatsapp-message="rsvpMessage"
          :accent="tpl.accentColor"
          class="db-rsvp__form"
        />
      </section>

      <!-- ============================== -->
      <!-- AMPLOP — 3 banks, copy-to-clipboard -->
      <!-- ============================== -->
      <section id="amplop" class="db-amplop">
        <p class="db-eyebrow" :style="monoStyle">Amplop</p>
        <h2 :style="h1Style" class="db-amplop__title text-balance">Kehadiran Anda sudah lebih dari cukup.</h2>
        <p class="db-amplop__sub">Namun jika ingin mengirim kado, kami menyediakan rekening berikut.</p>

        <ul class="db-amplop__banks">
          <li v-for="bank in banks" :key="bank.id" class="db-bank" :class="{ 'db-bank--copied': copiedBank === bank.id }">
            <header class="db-bank__head">
              <p class="db-bank__name" :style="monoStyle">{{ bank.name }}</p>
              <button
                type="button"
                class="db-bank__copy"
                :aria-label="`Salin rekening ${bank.name}`"
                @click="copyBank(bank)"
              >
                <UIcon :name="copiedBank === bank.id ? 'i-lucide-check' : 'i-lucide-copy'" class="w-4 h-4" />
                <span :style="monoStyle">{{ copiedBank === bank.id ? 'Tersalin' : 'Salin' }}</span>
              </button>
            </header>
            <p :style="h1Style" class="db-bank__number">{{ bank.number }}</p>
            <p class="db-bank__holder" :style="monoStyle">a.n. {{ bank.holder }}</p>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- ADD TO CALENDAR + LIVE STREAM -->
      <!-- ============================== -->
      <section class="db-actions">
        <div class="db-actions__grid">
          <div class="db-action">
            <p class="db-eyebrow" :style="monoStyle">Tambah ke kalender</p>
            <p class="db-action__sub">Simpan tanggal acaranya supaya tidak lupa.</p>
            <button type="button" class="db-action__btn" @click="downloadICS">
              <UIcon name="i-lucide-calendar-plus" class="w-4 h-4" />
              Download .ics
            </button>
          </div>
          <div class="db-action">
            <p class="db-eyebrow" :style="monoStyle">Siaran langsung</p>
            <p class="db-action__sub">Siaran langsung akad dan resepsi via YouTube. Link akan dikirimkan H-1.</p>
            <button type="button" class="db-action__btn" @click="openLiveStream">
              <UIcon name="i-lucide-video" class="w-4 h-4" />
              Buka link
            </button>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SIGNOFF -->
      <!-- ============================== -->
      <section class="db-signoff">
        <p :style="h1Style" class="db-signoff__text text-balance">
          &ldquo;Terima kasih. Sampai jumpa di hari yang kami tunggu.&rdquo;
        </p>
        <p :style="monoStyle" class="db-signoff__byline">Dengan cinta &middot; Dita &amp; Budi</p>
      </section>
    </main>

    <TmplFooter
      :brand-name="'Dita & Budi'"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'RSVP', href: '#rsvp' },
        { label: 'Amplop', href: '#amplop' },
      ]"
      variant="marquee"
      :marquee-items="['Dita & Budi', '20.06.2026', 'Jakarta', '20.06.2026', 'Sabtu', '20.06.2026', 'Jakarta, Indonesia', '20.06.2026']"
      signoff="Atas kehadiran dan doa restu Anda, kami ucapkan terima kasih."
      :accent="tpl.accentColor"
    />

    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="wedding undangan"
    />

    <TmplLightbox
      :images="galleryImages"
      :open-index="lightboxOpen ? lightboxIndex : -1"
      title="Dita & Budi"
      @close="closeLightbox"
    />
  </div>
</template>

<style scoped>
.db {
  min-height: 100dvh;
  position: relative;
}

.db .skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  text-decoration: none;
  transition: top 200ms ease;
}
.db .skip-link:focus { top: 0; }

.db-eyebrow {
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.5;
  margin: 0 0 1.5rem;
  text-align: center;
}

/* ============================================================ */
/* HERO — names + torus                                          */
/* ============================================================ */
.db-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 4rem;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 40%, color-mix(in oklch, var(--tmpl-accent) 6%, transparent), transparent 55%),
    var(--tmpl-bg);
}
.db-hero__torus {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.db-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 36rem;
}
.db-hero__opening {
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0 0 0.6rem;
}
.db-hero__opening:last-of-type {
  margin-bottom: 2.5rem;
}
.db-hero__names {
  font-size: var(--tmpl-h1);
  font-weight: 300;
  font-style: italic;
  line-height: 0.85;
  letter-spacing: -0.02em;
  margin: 0 0 2rem;
  color: var(--tmpl-fg);
}
.db-hero__name {
  display: block;
}
.db-hero__amp {
  display: block;
  font-size: 0.5em;
  opacity: 0.35;
  margin: 0.2em 0;
  font-style: italic;
}
.db-hero__date {
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.7;
  margin: 0 0 0.4rem;
}
.db-hero__city {
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.4;
  margin: 0 0 3rem;
}
.db-hero__countdown {
  margin-top: 2rem;
}

/* ============================================================ */
/* CERITA — Timeline                                             */
/* ============================================================ */
.db-cerita {
  padding: 8rem 1.5rem;
  max-width: 38rem;
  margin: 0 auto;
  text-align: center;
}
.db-cerita__title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
}
.db-cerita__list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.db-cerita__item {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 1.5rem;
  align-items: baseline;
}
.db-cerita__year {
  font-size: 11px;
  letter-spacing: 0.18em;
  font-weight: 500;
  opacity: 0.5;
  text-align: right;
  padding-top: 0.4rem;
}
.db-cerita__text {
  font-size: 1.125rem;
  font-weight: 400;
  font-style: italic;
  line-height: 1.65;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--tmpl-fg);
  font-feature-settings: "liga" 1, "dlig" 1;
}

/* ============================================================ */
/* ACARA — 3 events                                              */
/* ============================================================ */
.db-acara {
  padding: 8rem 1.5rem;
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
  text-align: center;
}
.db-acara__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
.db-acara__list {
  max-width: 36rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.db-acara__item {
  position: relative;
  padding: 2.5rem 0 2.5rem 3.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  text-align: left;
}
.db-acara__item:last-child {
  border-bottom: 0;
}
.db-acara__num {
  position: absolute;
  left: 0;
  top: 2.5rem;
  font-size: 9px;
  letter-spacing: 0.2em;
  opacity: 0.4;
}
.db-acara__time {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0 0 0.5rem;
}
.db-acara__label {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 0.4rem;
  color: var(--tmpl-fg);
}
.db-acara__location {
  font-size: 13px;
  opacity: 0.7;
  margin: 0;
  line-height: 1.5;
}

/* ============================================================ */
/* GALERI — Photos with lightbox                                 */
/* ============================================================ */
.db-galeri {
  padding: 8rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  text-align: center;
}
.db-galeri__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
}
.db-galeri__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .db-galeri__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.db-galeri__item {
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.db-galeri__photo {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, color-mix(in oklch, var(--tmpl-accent) 6%, var(--tmpl-bg)) 0%, color-mix(in oklch, var(--tmpl-fg) 3%, var(--tmpl-bg)) 100%);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  transition: transform 400ms ease;
}
.db-galeri__photo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, color-mix(in oklch, white 5%, transparent), transparent 60%);
}
.db-galeri__item:hover .db-galeri__photo {
  transform: scale(1.02);
}
.db-galeri__photo-label {
  position: relative;
  font-size: 9px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.45;
  z-index: 1;
}
.db-galeri__caption {
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
  line-height: 1.4;
  letter-spacing: -0.005em;
  margin: 0;
  opacity: 0.65;
  padding: 0 0.25rem;
}

/* ============================================================ */
/* RSVP                                                          */
/* ============================================================ */
.db-rsvp {
  padding: 8rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
}
.db-rsvp__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: var(--tmpl-fg);
}
.db-rsvp__sub {
  font-size: 13px;
  opacity: 0.7;
  margin: 0 0 3rem;
  line-height: 1.5;
}
.db-rsvp__form {
  text-align: left;
}

/* ============================================================ */
/* AMPLOP — Banks with copy                                      */
/* ============================================================ */
.db-amplop {
  padding: 8rem 1.5rem;
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
  text-align: center;
}
.db-amplop__title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: var(--tmpl-fg);
  max-width: 30rem;
  margin-left: auto;
  margin-right: auto;
}
.db-amplop__sub {
  font-size: 13px;
  opacity: 0.7;
  margin: 0 0 3rem;
  line-height: 1.5;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
.db-amplop__banks {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.db-bank {
  padding: 1.5rem;
  background: var(--tmpl-bg);
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 6px;
  text-align: left;
  transition: border-color 200ms ease, transform 200ms ease;
}
.db-bank:hover {
  border-color: color-mix(in oklch, var(--tmpl-accent) 35%, transparent);
  transform: translateY(-1px);
}
.db-bank--copied {
  border-color: color-mix(in oklch, #22c55e 50%, transparent);
}
.db-bank__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.db-bank__name {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.7;
  margin: 0;
}
.db-bank__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  background: transparent;
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 4px;
  color: inherit;
  font: inherit;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
.db-bank__copy:hover {
  border-color: var(--tmpl-accent);
  background: color-mix(in oklch, var(--tmpl-accent) 6%, transparent);
}
.db-bank--copied .db-bank__copy {
  border-color: #22c55e;
  color: #22c55e;
}
.db-bank__number {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem;
  color: var(--tmpl-fg);
  font-variant-numeric: tabular-nums;
}
.db-bank__holder {
  font-size: 11px;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin: 0;
}

/* ============================================================ */
/* ACTIONS — Add to calendar + live stream                       */
/* ============================================================ */
.db-actions {
  padding: 6rem 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
}
.db-actions__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .db-actions__grid { grid-template-columns: 1fr 1fr; }
}
.db-action {
  text-align: center;
  padding: 2rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  background: var(--tmpl-surface);
}
.db-action__sub {
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.5;
  margin: 0 0 1.25rem;
  max-width: 32ch;
  margin-left: auto;
  margin-right: auto;
}
.db-action__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: transparent;
  border: 1px solid color-mix(in oklch, currentColor 20%, transparent);
  border-radius: 999px;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.db-action__btn:hover {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}

/* ============================================================ */
/* SIGNOFF                                                       */
/* ============================================================ */
.db-signoff {
  padding: 10rem 1.5rem 8rem;
  text-align: center;
  max-width: 40rem;
  margin: 0 auto;
}
.db-signoff__text {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.4;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  color: var(--tmpl-fg);
}
.db-signoff__byline {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0;
}
</style>
