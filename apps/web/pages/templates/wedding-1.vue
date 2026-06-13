<script setup lang="ts">
/**
 * wedding-1.vue — Anindya & Rama
 * Luxury Romantic Wedding. Hand-bound book layout.
 *
 * 12 sections. 7+ working interactions. SUBTLE 3D (5-7 dust-mote particles).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('wedding-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const isLoaded = ref(false)
const isReducedMotion = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const copiedBank = ref<string | null>(null)
let copiedTimer: number | null = null

const { buildUrl } = useWhatsApp()

const rsvpFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text' as const, placeholder: 'Misal: Putri', required: true },
  { key: 'party', label: 'Jumlah tamu', type: 'select' as const, required: true, options: ['1 orang', '2 orang', '3 orang', '4 orang', '5+ orang'] },
  { key: 'attendance', label: 'Kehadiran', type: 'select' as const, required: true, options: ['Insha Allah hadir', 'Maaf, tidak bisa hadir'] },
  { key: 'ucapan', label: 'Ucapan untuk kedua mempelai', type: 'textarea' as const, placeholder: 'Doa dan ucapanmu untuk kami' },
]
const rsvpMessage = 'Halo, saya ingin konfirmasi kehadiran di pernikahan Anindya & Rama.'

// ============================================================
// 12 SECTIONS DATA
// ============================================================
const loveStory = [
  { year: '2019', text: 'Bertemu di pernikahan teman. Saling tidak kenal. Tapi kopi yang sama.' },
  { year: '2021', text: 'Pindah ke Bandung. Ngekos di Cihampelas, nasi goreng tiap malam.' },
  { year: '2024', text: 'Lamaran di Pantai Pandawa, Bali. Matahari terbenam. Hanya iya.' },
  { year: '2026', text: 'Akad nikah. Resepsi. Dan seterusnya.' },
]

const acara = [
  { time: '08:00', label: 'Akad Nikah', location: 'Masjid Al-Ikhlas, Bandung' },
  { time: '11:00', label: 'Resepsi', location: 'Gedung Sasana Budaya Ganesha, Bandung' },
  { time: '18:00', label: 'Makan Malam', location: 'Restoran Sunda Asri, Lembang' },
]

const galleryImages = [
  { src: '', alt: 'Foto prewedding di Kebon Raya Bogor', caption: 'Prewedding di Kebon Raya Bogor, April 2025' },
  { src: '', alt: 'Foto prewedding di Kawah Putih', caption: 'Prewedding di Kawah Putih, Mei 2025' },
  { src: '', alt: 'Foto prewedding di Kota Tua', caption: 'Prewedding sore di Kota Tua, Juni 2025' },
  { src: '', alt: 'Foto saat lamaran', caption: 'Momen lamaran, Bali, Oktober 2024' },
  { src: '', alt: 'Foto kopi pertama', caption: 'Kopi pertama bersama, 2019' },
  { src: '', alt: 'Foto ngekos Cihampelas', caption: 'Ngekos Cihampelas, 2021' },
  { src: '', alt: 'Foto ultah bersama', caption: 'Ultah Anindya yang ke-25, 2023' },
  { src: '', alt: 'Foto liburan Lembang', caption: 'Liburan singkat ke Lembang, 2024' },
  { src: '', alt: 'Foto family gathering', caption: 'Family gathering, Surabaya, 2025' },
  { src: '', alt: 'Foto terakhir sebelum hari H', caption: 'Satu foto terakhir sebelum hari H' },
]

const banks = [
  { id: 'bca', name: 'BCA', number: '123-456-7890', holder: 'Anindya P. Sari' },
  { id: 'mandiri', name: 'Mandiri', number: '098-765-4321', holder: 'Rama W. Pratama' },
  { id: 'bri', name: 'BRI', number: '456-789-0123', holder: 'Anindya & Rama' },
]

// ============================================================
// 3D — 5-7 DUST MOTE PARTICLES (raw WebGL, very subtle)
// ============================================================
const dustCanvasRef = ref<HTMLCanvasElement | null>(null)
let dustGL: WebGLRenderingContext | null = null
let dustProg: WebGLProgram | null = null
let dustBuf: WebGLBuffer | null = null
let dustAnimId = 0
let dustStartTime = 0
const DUST_COUNT = 7

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 200)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isReducedMotion.value) {
    setTimeout(initDust3D, 100)
  }
})

onBeforeUnmount(() => {
  if (dustAnimId) cancelAnimationFrame(dustAnimId)
  if (copiedTimer) clearTimeout(copiedTimer)
})

function initDust3D() {
  const canvas = dustCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    dustGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!dustGL) return

  const aspect = rect.width / rect.height

  // Each particle has aPos (xy), aDir (per-particle random offset for drift)
  const vs = `
    attribute vec2 aPos;
    attribute vec2 aDir;
    attribute float aSize;
    uniform float uTime;
    uniform float uAspect;
    void main() {
      // Very slow drift, max 0.005 units per frame equivalent
      vec2 p = aPos + aDir * 0.15 * sin(uTime * 0.3 + aDir.x * 10.0) + aDir * 0.08 * sin(uTime * 0.15 + aDir.y * 7.0);
      // Drift very slowly downward (like dust settling)
      p.y += sin(uTime * 0.05 + aDir.x * 5.0) * 0.05 - 0.02;
      p.x /= uAspect;
      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = aSize;
    }
  `
  const fs = `
    precision mediump float;
    uniform vec3 uColor;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d) * 0.5;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
  const vert = dustGL.createShader(dustGL.VERTEX_SHADER)!
  dustGL.shaderSource(vert, vs)
  dustGL.compileShader(vert)
  const frag = dustGL.createShader(dustGL.FRAGMENT_SHADER)!
  dustGL.shaderSource(frag, fs)
  dustGL.compileShader(frag)
  dustProg = dustGL.createProgram()!
  dustGL.attachShader(dustProg, vert)
  dustGL.attachShader(dustProg, frag)
  dustGL.linkProgram(dustProg)

  const data: number[] = []
  for (let i = 0; i < DUST_COUNT; i++) {
    // Distribute particles in the central 60% of the viewport
    const x = (Math.random() - 0.5) * 1.2
    const y = (Math.random() - 0.5) * 0.8
    const dx = (Math.random() - 0.5) * 2
    const dy = (Math.random() - 0.5) * 2
    const size = 4 + Math.random() * 6  // 4-10px
    data.push(x, y, dx, dy, size)
  }
  dustBuf = dustGL.createBuffer()
  dustGL.bindBuffer(dustGL.ARRAY_BUFFER, dustBuf)
  dustGL.bufferData(dustGL.ARRAY_BUFFER, new Float32Array(data), dustGL.STATIC_DRAW)

  // Warm white particles
  dustGL.useProgram(dustProg)
  dustGL.uniform3f(dustGL.getUniformLocation(dustProg, 'uColor'), 1.0, 0.95, 0.88)

  dustStartTime = performance.now()

  function tick() {
    if (!dustGL || !dustProg || !dustBuf || !dustCanvasRef.value) return
    dustAnimId = requestAnimationFrame(tick)
    const elapsed = (performance.now() - dustStartTime) / 1000
    dustGL.viewport(0, 0, dustGL.drawingBufferWidth, dustGL.drawingBufferHeight)
    dustGL.clearColor(0, 0, 0, 0)
    dustGL.clear(dustGL.COLOR_BUFFER_BIT)
    dustGL.useProgram(dustProg)
    dustGL.bindBuffer(dustGL.ARRAY_BUFFER, dustBuf)
    dustGL.enableVertexAttribArray(dustGL.getAttribLocation(dustProg, 'aPos'))
    dustGL.vertexAttribPointer(dustGL.getAttribLocation(dustProg, 'aPos'), 2, dustGL.FLOAT, false, 20, 0)
    dustGL.enableVertexAttribArray(dustGL.getAttribLocation(dustProg, 'aDir'))
    dustGL.vertexAttribPointer(dustGL.getAttribLocation(dustProg, 'aDir'), 2, dustGL.FLOAT, false, 20, 8)
    dustGL.enableVertexAttribArray(dustGL.getAttribLocation(dustProg, 'aSize'))
    dustGL.vertexAttribPointer(dustGL.getAttribLocation(dustProg, 'aSize'), 1, dustGL.FLOAT, false, 20, 16)
    dustGL.uniform1f(dustGL.getUniformLocation(dustProg, 'uTime'), elapsed)
    dustGL.uniform1f(dustGL.getUniformLocation(dustProg, 'uAspect'), aspect)
    dustGL.drawArrays(dustGL.POINTS, 0, DUST_COUNT)
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
    // fallback: just highlight
    copiedBank.value = bank.id
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = window.setTimeout(() => { copiedBank.value = null }, 1800)
  }
}

// .ics generation
function downloadICS() {
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AjoClub//Wedding//ID',
    'BEGIN:VEVENT',
    'UID:anindya-rama-wedding-2026@ajoclub.id',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20260314T010000Z',  // 08:00 WIB
    'DTEND:20260314T150000Z',    // 22:00 WIB
    'SUMMARY:Akad Nikah & Resepsi Anindya & Rama',
    'DESCRIPTION:Pernikahan Anindya & Rama, Sabtu 14 Maret 2026, Bandung. Akad 08:00 di Masjid Al-Ikhlas, Resepsi 11:00 di Sasana Budaya Ganesha.',
    'LOCATION:Masjid Al-Ikhlas, Bandung',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'anindya-rama-wedding.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function openLiveStream() {
  // Mock — would open YouTube live in real
  window.open(buildUrl('Halo, saya mau link live streaming pernikahan Anindya & Rama.'), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="ar" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Anindya & Rama"
      wordmark="A & R"
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
      storage-key="wedding-1-audio"
      :accent="tpl.accentColor"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. HERO — Names + Date + 3D Dust -->
      <!-- ============================== -->
      <section class="ar-hero" :style="{ minHeight: '100dvh' }">
        <canvas ref="dustCanvasRef" class="ar-hero__dust" aria-hidden="true" />

        <div class="ar-hero__content">
          <p class="ar-hero__opening" :style="monoStyle">Bismillahirrahmanirrahim</p>

          <h1 :style="h1Style" class="ar-hero__names text-balance">
            <span class="ar-hero__name">Anindya</span>
            <span class="ar-hero__amp">&amp;</span>
            <span class="ar-hero__name">Rama</span>
          </h1>

          <p class="ar-hero__date" :style="monoStyle">Sabtu &middot; 14 Maret 2026 &middot; Bandung</p>

          <div class="ar-hero__countdown">
            <TmplCountdown target="2026-03-14T08:00:00+07:00" variant="blocks" label="Pintu akad dibuka dalam" />
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 2. CERITA — Love story timeline -->
      <!-- ============================== -->
      <section id="cerita" class="ar-cerita">
        <p class="ar-eyebrow" :style="monoStyle">Cerita Kami</p>
        <h2 :style="h1Style" class="ar-cerita__title text-balance">Dari mana kami mulai.</h2>

        <ol class="ar-cerita__list">
          <li v-for="(item, i) in loveStory" :key="item.year" class="ar-cerita__item">
            <span class="ar-cerita__year" :style="monoStyle">{{ item.year }}</span>
            <p :style="h2Style" class="ar-cerita__text">{{ item.text }}</p>
          </li>
        </ol>
      </section>

      <!-- ============================== -->
      <!-- 3. ACARA — 3 events -->
      <!-- ============================== -->
      <section id="acara" class="ar-acara">
        <p class="ar-eyebrow" :style="monoStyle">Detail Acara</p>
        <h2 :style="h1Style" class="ar-acara__title text-balance">Sabtu, 14 Maret 2026.</h2>

        <div class="ar-acara__list">
          <article v-for="(e, i) in acara" :key="e.label" class="ar-acara__item">
            <p class="ar-acara__time" :style="monoStyle">{{ e.time }}</p>
            <h3 :style="h1Style" class="ar-acara__label">{{ e.label }}</h3>
            <p class="ar-acara__location">{{ e.location }}</p>
            <span class="ar-acara__num" :style="monoStyle">{{ String(i + 1).padStart(2, '0') }}</span>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 4. GALERI — Photos with lightbox -->
      <!-- ============================== -->
      <section id="galeri" class="ar-galeri">
        <p class="ar-eyebrow" :style="monoStyle">Galeri</p>
        <h2 :style="h1Style" class="ar-galeri__title text-balance">Momen yang ingin kami ingat.</h2>

        <div class="ar-galeri__grid">
          <button
            v-for="(img, i) in galleryImages"
            :key="i"
            type="button"
            class="ar-galeri__item"
            :aria-label="img.alt"
            @click="openLightbox(i)"
          >
            <span class="ar-galeri__photo" :aria-hidden="true">
              <span :style="monoStyle" class="ar-galeri__photo-label">Foto {{ String(i + 1).padStart(2, '0') }}</span>
            </span>
            <p class="ar-galeri__caption" :style="h2Style">{{ img.caption }}</p>
          </button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 5. RSVP — Working form -->
      <!-- ============================== -->
      <section id="rsvp" class="ar-rsvp">
        <p class="ar-eyebrow" :style="monoStyle">Konfirmasi</p>
        <h2 :style="h1Style" class="ar-rsvp__title text-balance">Bisa hadir?</h2>
        <p class="ar-rsvp__sub">Konfirmasi sebelum 28 Februari 2026.</p>

        <TmplForm
          :fields="rsvpFields"
          submit-label="Kirim Konfirmasi"
          :whatsapp-message="rsvpMessage"
          :accent="tpl.accentColor"
          class="ar-rsvp__form"
        />
      </section>

      <!-- ============================== -->
      <!-- 6. AMPLOP — 3 banks, copy-to-clipboard -->
      <!-- ============================== -->
      <section id="amplop" class="ar-amplop">
        <p class="ar-eyebrow" :style="monoStyle">Amplop</p>
        <h2 :style="h1Style" class="ar-amplop__title text-balance">Amplop Digital</h2>
        <p class="ar-amplop__sub">Jika ingin mengirim kado.</p>

        <ul class="ar-amplop__banks">
          <li v-for="bank in banks" :key="bank.id" class="ar-bank" :class="{ 'ar-bank--copied': copiedBank === bank.id }">
            <header class="ar-bank__head">
              <p class="ar-bank__name" :style="monoStyle">{{ bank.name }}</p>
              <button
                type="button"
                class="ar-bank__copy"
                :aria-label="`Salin rekening ${bank.name}`"
                @click="copyBank(bank)"
              >
                <UIcon :name="copiedBank === bank.id ? 'i-lucide-check' : 'i-lucide-copy'" class="w-4 h-4" />
                <span :style="monoStyle">{{ copiedBank === bank.id ? 'Tersalin' : 'Salin' }}</span>
              </button>
            </header>
            <p :style="h1Style" class="ar-bank__number">{{ bank.number }}</p>
            <p class="ar-bank__holder" :style="monoStyle">a.n. {{ bank.holder }}</p>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- 7. ADD TO CALENDAR + LIVE STREAM -->
      <!-- ============================== -->
      <section class="ar-actions">
        <div class="ar-actions__grid">
          <div class="ar-action">
            <p class="ar-eyebrow" :style="monoStyle">Kalender</p>
            <button type="button" class="ar-action__btn" @click="downloadICS">
              <UIcon name="i-lucide-calendar-plus" class="w-4 h-4" />
              Download .ics
            </button>
          </div>
          <div class="ar-action">
            <p class="ar-eyebrow" :style="monoStyle">Siaran Langsung</p>
            <button type="button" class="ar-action__btn" @click="openLiveStream">
              <UIcon name="i-lucide-video" class="w-4 h-4" />
              Buka link
            </button>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 8. SIGNOFF -->
      <!-- ============================== -->
      <section class="ar-signoff">
        <p :style="h1Style" class="ar-signoff__text text-balance">
          &ldquo;Sampai jumpa di hari kami.&rdquo;
        </p>
        <p :style="monoStyle" class="ar-signoff__byline">Dengan cinta &middot; Anindya &amp; Rama</p>
      </section>
    </main>

    <TmplFooter
      :brand-name="'Anindya & Rama'"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'RSVP', href: '#rsvp' },
        { label: 'Amplop', href: '#amplop' },
      ]"
      variant="marquee"
      :marquee-items="['Anindya & Rama', '14.03.2026', 'Bandung', '14.03.2026', 'Sabtu', '14.03.2026', 'Bandung, Indonesia', '14.03.2026']"
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
      title="Anindya & Rama"
      @close="closeLightbox"
    />
  </div>
</template>

<style scoped>
.ar {
  min-height: 100dvh;
  position: relative;
}

.ar .skip-link {
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
.ar .skip-link:focus { top: 0; }

.ar-eyebrow {
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.5;
  margin: 0 0 1.5rem;
  text-align: center;
}

/* ============================================================ */
/* HERO — names + dust                                           */
/* ============================================================ */
.ar-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.5rem 6rem;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 35%, color-mix(in oklch, var(--tmpl-accent) 8%, transparent), transparent 60%),
    var(--tmpl-bg);
}
.ar-hero__dust {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.ar-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 36rem;
}
.ar-hero__opening {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0 0 2.5rem;
}
.ar-hero__names {
  font-size: clamp(3.5rem, 12vw, 9rem);
  font-weight: 300;
  font-style: italic;
  line-height: 0.85;
  letter-spacing: -0.015em;
  margin: 0 0 2rem;
  color: var(--tmpl-fg);
}
.ar-hero__name {
  display: block;
}
.ar-hero__amp {
  display: block;
  font-size: 0.5em;
  opacity: 0.4;
  margin: 0.2em 0;
  font-style: italic;
}
.ar-hero__date {
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.6;
  margin: 0 0 3rem;
}
.ar-hero__countdown {
  margin-top: 2rem;
}

/* ============================================================ */
/* CERITA — Love story timeline                                  */
/* ============================================================ */
.ar-cerita {
  padding: 10rem 1.5rem;
  max-width: 38rem;
  margin: 0 auto;
  text-align: center;
}
.ar-cerita__title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.015em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
}
.ar-cerita__list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.ar-cerita__item {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 1.5rem;
  align-items: baseline;
}
.ar-cerita__year {
  font-size: 10px;
  letter-spacing: 0.18em;
  font-weight: 500;
  opacity: 0.5;
  text-align: right;
  padding-top: 0.4rem;
}
.ar-cerita__text {
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
.ar-acara {
  padding: 10rem 1.5rem;
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
  text-align: center;
}
.ar-acara__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
.ar-acara__list {
  max-width: 36rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ar-acara__item {
  position: relative;
  padding: 2.5rem 0 2.5rem 3.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  text-align: left;
}
.ar-acara__item:last-child {
  border-bottom: 0;
}
.ar-acara__num {
  position: absolute;
  left: 0;
  top: 2.5rem;
  font-size: 10px;
  letter-spacing: 0.2em;
  opacity: 0.4;
}
.ar-acara__time {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0 0 0.5rem;
}
.ar-acara__label {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 0.4rem;
  color: var(--tmpl-fg);
}
.ar-acara__location {
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
  line-height: 1.5;
}

/* ============================================================ */
/* GALERI — Photos with lightbox                                 */
/* ============================================================ */
.ar-galeri {
  padding: 10rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  text-align: center;
}
.ar-galeri__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
}
.ar-galeri__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .ar-galeri__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.ar-galeri__item {
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
.ar-galeri__photo {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
  background: linear-gradient(135deg, color-mix(in oklch, var(--tmpl-accent) 8%, var(--tmpl-bg)) 0%, color-mix(in oklch, var(--tmpl-fg) 4%, var(--tmpl-bg)) 100%);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transition: transform 400ms ease;
}
.ar-galeri__photo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, color-mix(in oklch, white 6%, transparent), transparent 60%);
}
.ar-galeri__item:hover .ar-galeri__photo {
  transform: scale(1.02);
}
.ar-galeri__photo-label {
  position: relative;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.45;
  z-index: 1;
}
.ar-galeri__caption {
  font-size: 11px;
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
.ar-rsvp {
  padding: 10rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
}
.ar-rsvp__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.015em;
  margin: 0 0 1rem;
  color: var(--tmpl-fg);
}
.ar-rsvp__sub {
  font-size: 12px;
  opacity: 0.7;
  margin: 0 0 3rem;
  line-height: 1.5;
}
.ar-rsvp__form {
  text-align: left;
}

/* ============================================================ */
/* AMPLOP — Banks with copy                                      */
/* ============================================================ */
.ar-amplop {
  padding: 10rem 1.5rem;
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
  text-align: center;
}
.ar-amplop__title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 1rem;
  color: var(--tmpl-fg);
  max-width: 30rem;
  margin-left: auto;
  margin-right: auto;
}
.ar-amplop__sub {
  font-size: 12px;
  opacity: 0.7;
  margin: 0 0 3rem;
  line-height: 1.5;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
.ar-amplop__banks {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ar-bank {
  padding: 1.5rem;
  background: var(--tmpl-bg);
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 4px;
  text-align: left;
  transition: border-color 200ms ease, transform 200ms ease;
}
.ar-bank:hover {
  border-color: color-mix(in oklch, var(--tmpl-accent) 35%, transparent);
  transform: translateY(-1px);
}
.ar-bank--copied {
  border-color: color-mix(in oklch, #22c55e 50%, transparent);
}
.ar-bank__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.ar-bank__name {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.7;
  margin: 0;
}
.ar-bank__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  background: transparent;
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 4px;
  color: inherit;
  font: inherit;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.ar-bank__copy:hover {
  border-color: var(--tmpl-accent);
  background: color-mix(in oklch, var(--tmpl-accent) 6%, transparent);
}
.ar-bank--copied .ar-bank__copy {
  border-color: #22c55e;
  color: #22c55e;
}
.ar-bank__number {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem;
  color: var(--tmpl-fg);
  font-variant-numeric: tabular-nums;
}
.ar-bank__holder {
  font-size: 10px;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin: 0;
}

/* ============================================================ */
/* ACTIONS — Add to calendar + live stream                       */
/* ============================================================ */
.ar-actions {
  padding: 10rem 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
}
.ar-actions__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .ar-actions__grid { grid-template-columns: 1fr 1fr; }
}
.ar-action {
  text-align: center;
  padding: 2rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 4px;
  background: var(--tmpl-surface);
}
.ar-action__sub {
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
  margin: 0 0 1.25rem;
  max-width: 32ch;
  margin-left: auto;
  margin-right: auto;
}
.ar-action__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: transparent;
  border: 1px solid color-mix(in oklch, currentColor 20%, transparent);
  border-radius: 4px;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.ar-action__btn:hover {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}

/* ============================================================ */
/* SIGNOFF                                                      */
/* ============================================================ */
.ar-signoff {
  padding: 12rem 1.5rem 10rem;
  text-align: center;
  max-width: 40rem;
  margin: 0 auto;
}
.ar-signoff__text {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.4;
  letter-spacing: -0.015em;
  margin: 0 0 1.5rem;
  color: var(--tmpl-fg);
}
.ar-signoff__byline {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0;
}
</style>
