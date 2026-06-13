<script setup lang="ts">
/**
 * wedding-1.vue — Anindya & Rama
 * Luxury Romantic Wedding invitation. Magazine / hand-bound book metaphor.
 *
 * 12 sections, 5-7 dust-mote particles only (SUBTLE 3D).
 * 7 working interactions. Paper metaphor. NO dark mode.
 * Real Indonesian copy (Cihampelas, Batur, etc.).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('wedding-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const musicOn = ref(false)
const isReducedMotion = ref(false)
const lightboxIndex = ref<number | null>(null)
const toastMessage = ref('')
let toastTimer: number | null = null

// Countdown
const targetDate = new Date('2026-03-14T08:00:00+07:00').getTime()
const now = ref(Date.now())
let rafId = 0
const countdown = computed(() => {
  const diff = Math.max(0, targetDate - now.value)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
})
function tickCountdown() {
  now.value = Date.now()
  rafId = requestAnimationFrame(tickCountdown)
}

// RSVP form
const rsvp = reactive({
  name: '',
  whatsapp: '',
  email: '',
  attending: 'hadir',
  guests: 1,
  message: '',
})
const rsvpSubmitted = ref(false)
const rsvpValid = computed(() => rsvp.name.trim() && rsvp.whatsapp.trim())

function submitRsvp() {
  if (!rsvpValid.value) return
  rsvpSubmitted.value = true
}
function resetRsvp() {
  rsvpSubmitted.value = false
  rsvp.name = ''
  rsvp.whatsapp = ''
  rsvp.email = ''
  rsvp.message = ''
}

// Banks (3 banks for "kirim amplop")
const banks = [
  { name: 'BCA', account: '123-456-7890', holder: 'Anindya P. Sari' },
  { name: 'Mandiri', account: '098-765-4321', holder: 'Rama W. Pratama' },
  { name: 'BRI', account: '456-789-0123', holder: 'Anindya & Rama' },
]
async function copyAccount(account: string) {
  try {
    await navigator.clipboard.writeText(account)
    showToast('Nomor rekening disalin.')
  }
  catch {
    showToast(`Salin manual: ${account}`)
  }
}

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toastMessage.value = '' }, 2000)
}

// Lightbox
const photos = [
  { src: '/img/wedding-1.jpg', alt: 'Anindya & Rama, prewedding di Cihampelas Walk', caption: 'Cihampelas Walk, 14.02.2026' },
  { src: '/img/wedding-2.jpg', alt: 'Sesi foto di Kawah Putih, Bandung', caption: 'Kawah Putih, 22.02.2026' },
  { src: '/img/wedding-3.jpg', alt: 'Latihan tari untuk resepsi', caption: 'Studio Tari Bandung' },
  { src: '/img/wedding-4.jpg', alt: 'Makan malam sebelum lamaran', caption: 'Warung Nasi Ampera, 18.10.2024' },
  { src: '/img/wedding-5.jpg', alt: 'Lamaran di Pantai Pandawa', caption: 'Pantai Pandawa, Bali, 19.10.2024' },
  { src: '/img/wedding-6.jpg', alt: 'Foto bersama keluarga', caption: 'Rumah Anindya, Bandung' },
  { src: '/img/wedding-7.jpg', alt: 'Anindya saat fitting kebaya', caption: 'Atelier Lina, 02.03.2026' },
  { src: '/img/wedding-8.jpg', alt: 'Rama saat fitting jas', caption: 'Suit Supply, Jakarta' },
  { src: '/img/wedding-9.jpg', alt: 'Bunga untuk dekorasi', caption: 'Toko Bunga Setiabudi' },
  { src: '/img/wedding-10.jpg', alt: 'Cincin pernikahan', caption: 'Atelier Jewelry, Surabaya' },
]
function openLightbox(i: number) { lightboxIndex.value = i }
function closeLightbox() { lightboxIndex.value = null }
function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.length
}
function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.length) % photos.length
}
function onLightboxKey(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextPhoto()
  else if (e.key === 'ArrowLeft') prevPhoto()
}

// ICS download
function downloadIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AjoClub//Wedding//ID',
    'BEGIN:VEVENT',
    'UID:anindya-rama-2026@ajoclub.id',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20260314T010000Z',  // 08:00 WIB = 01:00 UTC
    'DTEND:20260314T110000Z',
    'SUMMARY:Akad Nikah Anindya & Rama',
    'LOCATION:Masjid Raya Bandung Provinsi, Gedebage',
    'DESCRIPTION:Akad nikah pukul 08:00 WIB, dilanjutkan resepsi.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'anindya-rama-14-maret-2026.ics'
  a.click()
  URL.revokeObjectURL(url)
  showToast('File kalender diunduh.')
}

// Music
const audioRef = ref<HTMLAudioElement | null>(null)
function toggleMusic() {
  if (!audioRef.value) return
  musicOn.value = !musicOn.value
  if (musicOn.value) {
    audioRef.value.volume = 0.35
    audioRef.value.play().catch(() => { musicOn.value = false })
  }
  else {
    audioRef.value.pause()
  }
}

// ============================================================
// LOVE STORY TIMELINE
// ============================================================
const story = [
  {
    year: '2019',
    text: 'Bertemu pertama kali di pernikahan teman. Saling tidak kenal satu pun. Tapi kopi yang sama. Sama-sama pesan tubruk, tanpa gula.',
  },
  {
    year: '2021',
    text: 'Pindah ke Bandung bareng. Nge-kos di Cihampelas. Makan nasi goreng tiap malam. Tidak bosan.',
  },
  {
    year: '2024',
    text: 'Dia melamar di Pantai Pandawa saat matahari terbenam. Saya lupa apa yang dikatakan. Hanya "ya".',
  },
  {
    year: '2026',
    text: 'Nikah.',
  },
]

// ============================================================
// EVENTS
// ============================================================
const events = [
  {
    time: '08.00 WIB',
    name: 'Akad Nikah',
    location: 'Masjid Raya Bandung Provinsi, Gedebage',
    dress: 'Akad: busana muslim putih.',
  },
  {
    time: '11.00 WIB',
    name: 'Resepsi',
    location: 'Gedung Sasana Budaya, Bandung',
    dress: 'Resepsi: batik / formal.',
  },
  {
    time: '18.00 WIB',
    name: 'Makan Malam',
    location: 'Sasana Visual, Bandung',
    dress: 'Makan malam: casual.',
  },
]

// ============================================================
// 3D DUST MOTE — 7 particles, slow drift, NO interactivity
// ============================================================
const dustCanvasRef = ref<HTMLCanvasElement | null>(null)
let dustGL: WebGLRenderingContext | null = null
let dustProg: WebGLProgram | null = null
let dustBuf: WebGLBuffer | null = null
let dustAnimId = 0
let dustStartTime = 0

onMounted(() => {
  setTimeout(() => { heroLoaded.value = true }, 200)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  initDust()
  if (!isReducedMotion.value) tickCountdown()
  else {
    // Reduced motion: update once per second
    const interval = setInterval(() => { now.value = Date.now() }, 1000)
    onBeforeUnmount(() => clearInterval(interval))
  }
  document.addEventListener('keydown', onLightboxKey)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (dustAnimId) cancelAnimationFrame(dustAnimId)
  document.removeEventListener('keydown', onLightboxKey)
})

function initDust() {
  const canvas = dustCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    dustGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!dustGL) return

  const aspect = rect.width / rect.height

  const vs = `
    attribute vec2 aPos;
    attribute float aRandom;
    uniform float uTime;
    uniform float uAspect;
    void main() {
      // Per-particle slow drift via Perlin-like sinusoidal motion
      vec2 p = aPos;
      float t = uTime * 0.08;
      p.x += sin(t + aRandom * 6.28) * 0.04;
      p.y += sin(t * 0.6 + aRandom * 12.56) * 0.06 + cos(t * 0.3 + aRandom * 4.0) * 0.03;
      p.x /= uAspect;
      gl_Position = vec4(p, 0.0, 1.0);
      gl_PointSize = 2.0 + aRandom * 1.5;
    }
  `
  const fs = `
    precision mediump float;
    uniform vec3 uColor;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d) * 0.6;
      gl_FragColor = vec4(uColor, a);
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

  // 7 dust motes — that's the entire 3D. SUBTLE.
  const motes: number[] = []
  const seedPositions = [
    [-0.7, 0.3],
    [-0.4, -0.2],
    [-0.1, 0.5],
    [0.2, -0.4],
    [0.5, 0.2],
    [0.7, -0.3],
    [0.85, 0.4],
  ]
  for (const [x, y] of seedPositions) {
    motes.push(x, y, Math.random())
  }
  dustBuf = dustGL.createBuffer()
  dustGL.bindBuffer(dustGL.ARRAY_BUFFER, dustBuf)
  dustGL.bufferData(dustGL.ARRAY_BUFFER, new Float32Array(motes), dustGL.STATIC_DRAW)

  dustGL.useProgram(dustProg)
  // oklch(0.84 0.08 85) = gold-dust warm white
  dustGL.uniform3f(dustGL.getUniformLocation(dustProg, 'uColor'), 0.96, 0.88, 0.72)

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
    dustGL.vertexAttribPointer(dustGL.getAttribLocation(dustProg, 'aPos'), 2, dustGL.FLOAT, false, 12, 0)
    dustGL.enableVertexAttribArray(dustGL.getAttribLocation(dustProg, 'aRandom'))
    dustGL.vertexAttribPointer(dustGL.getAttribLocation(dustProg, 'aRandom'), 1, dustGL.FLOAT, false, 12, 8)
    dustGL.uniform1f(dustGL.getUniformLocation(dustProg, 'uTime'), elapsed)
    dustGL.uniform1f(dustGL.getUniformLocation(dustProg, 'uAspect'), aspect)
    dustGL.drawArrays(dustGL.POINTS, 0, 7)
  }
  tick()
}

const padded = (n: number) => n.toString().padStart(2, '0')
const { buildUrl } = useWhatsApp()
</script>

<template>
  <div class="anindya" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Anindya & Rama"
      wordmark="A & R"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'Konfirmasi', href: '#konfirmasi' },
      ]"
      accent="var(--tmpl-accent)"
      style="transparent"
      :show-theme-toggle="false"
    />

    <main id="main">

      <!-- HERO: Bismillah + Assalamualaikum + Names + Date + 5-7 dust motes -->
      <section class="anindya-hero">
        <ClientOnly>
          <canvas ref="dustCanvasRef" class="anindya-hero__dust" />
        </ClientOnly>

        <div class="anindya-hero__inner">
          <p class="anindya-hero__bismillah" :style="monoStyle">Bismillahirrahmanirrahim</p>
          <p class="anindya-hero__salam" :style="monoStyle">Assalamualaikum Warahmatullahi Wabarakatuh</p>

          <h1 :style="h1Style" class="anindya-hero__h1">
            <span class="anindya-hero__name">Anindya</span>
            <span class="anindya-hero__amp">&amp;</span>
            <span class="anindya-hero__name">Rama</span>
          </h1>

          <p class="anindya-hero__date" :style="monoStyle">
            Sabtu &nbsp;·&nbsp; 14 &nbsp;·&nbsp; Maret &nbsp;·&nbsp; 2026
          </p>
          <p class="anindya-hero__place" :style="monoStyle">
            Bandung, Indonesia
          </p>
        </div>

        <a href="#cerita" class="anindya-hero__scroll" aria-label="Lanjut membaca">
          <UIcon name="i-lucide-arrow-down" class="w-4 h-4" />
        </a>
      </section>

      <!-- CERITA: love story timeline -->
      <section id="cerita" class="anindya-cerita">
        <p class="anindya-eyebrow" :style="monoStyle">Cerita Kami</p>
        <h2 :style="h2Style" class="anindya-cerita__h2">
          Dari mana kami mulai.
        </h2>

        <div class="anindya-cerita__timeline">
          <span class="anindya-cerita__rule" aria-hidden="true" />
          <div v-for="(s, i) in story" :key="s.year" class="anindya-cerita__row" :class="{ 'anindya-cerita__row--last': i === story.length - 1 }">
            <p class="anindya-cerita__year" :style="monoStyle">{{ s.year }}</p>
            <p class="anindya-cerita__text" :style="h2Style">{{ s.text }}</p>
          </div>
        </div>
      </section>

      <!-- DATE: large day number, .ics download -->
      <section class="anindya-date">
        <p class="anindya-eyebrow" :style="monoStyle">Simpan tanggal</p>
        <p class="anindya-date__month" :style="monoStyle">Maret</p>
        <p class="anindya-date__day" :style="h1Style">14</p>
        <p class="anindya-date__year" :style="monoStyle">2026</p>

        <button type="button" class="anindya-date__ics" @click="downloadIcs">
          Tambah ke Kalender
        </button>
        <p class="anindya-date__ics-sub" :style="monoStyle">
          Apple &middot; Google &middot; Outlook
        </p>
      </section>

      <!-- ACARA: 3 events -->
      <section id="acara" class="anindya-acara">
        <p class="anindya-eyebrow" :style="monoStyle">Detail Acara</p>
        <h2 :style="h2Style" class="anindya-acara__h2">
          Sabtu, 14 Maret 2026.
        </h2>

        <div class="anindya-acara__list">
          <article v-for="e in events" :key="e.name" class="anindya-acara__event">
            <p class="anindya-acara__time" :style="monoStyle">{{ e.time }}</p>
            <h3 :style="h2Style" class="anindya-acara__name">{{ e.name }}</h3>
            <p class="anindya-acara__location">{{ e.location }}</p>
            <p class="anindya-acara__dress" :style="monoStyle">{{ e.dress }}</p>
          </article>
        </div>
      </section>

      <!-- GALERI: asymmetric grid with lightbox -->
      <section id="galeri" class="anindya-galeri">
        <p class="anindya-eyebrow" :style="monoStyle">Galeri</p>
        <h2 :style="h2Style" class="anindya-galeri__h2">
          Dari Cihampelas ke Bali.
        </h2>

        <div class="anindya-galeri__grid">
          <button
            v-for="(photo, i) in photos"
            :key="i"
            type="button"
            class="anindya-galeri__item"
            :class="`anindya-galeri__item--${i % 6}`"
            :aria-label="`Buka foto ${i + 1}: ${photo.alt}`"
            @click="openLightbox(i)"
          >
            <span class="anindya-galeri__placeholder" :style="monoStyle">
              {{ photo.caption }}
            </span>
          </button>
        </div>
      </section>

      <!-- COUNTDOWN -->
      <section class="anindya-countdown">
        <p class="anindya-eyebrow" :style="monoStyle">Hitung mundur</p>
        <p class="anindya-countdown__line" :style="h2Style">Counting down.</p>
        <div class="anindya-countdown__blocks">
          <div class="anindya-countdown__block">
            <span class="anindya-countdown__num" :style="h1Style">{{ padded(countdown.days) }}</span>
            <span class="anindya-countdown__label" :style="monoStyle">Hari</span>
          </div>
          <div class="anindya-countdown__block">
            <span class="anindya-countdown__num" :style="h1Style">{{ padded(countdown.hours) }}</span>
            <span class="anindya-countdown__label" :style="monoStyle">Jam</span>
          </div>
          <div class="anindya-countdown__block">
            <span class="anindya-countdown__num" :style="h1Style">{{ padded(countdown.minutes) }}</span>
            <span class="anindya-countdown__label" :style="monoStyle">Menit</span>
          </div>
          <div class="anindya-countdown__block">
            <span class="anindya-countdown__num anindya-countdown__num--sec" :style="h1Style">{{ padded(countdown.seconds) }}</span>
            <span class="anindya-countdown__label" :style="monoStyle">Detik</span>
          </div>
        </div>
      </section>

      <!-- AMPLOP: gift / 3 banks -->
      <section class="anindya-amplop">
        <p class="anindya-amplop__intro" :style="h2Style">
          Doa dan kehadiran Anda adalah hadiah terindah. Jika berkenan memberi tanda kasih:
        </p>
        <div class="anindya-amplop__grid">
          <div v-for="b in banks" :key="b.name" class="anindya-amplop__card">
            <p class="anindya-amplop__bank" :style="monoStyle">{{ b.name }}</p>
            <p class="anindya-amplop__account" :style="monoStyle">{{ b.account }}</p>
            <p class="anindya-amplop__holder">{{ b.holder }}</p>
            <button type="button" class="anindya-amplop__copy" @click="copyAccount(b.account)">
              Salin nomor
            </button>
          </div>
        </div>
      </section>

      <!-- KONFIRMASI: RSVP form -->
      <section id="konfirmasi" class="anindya-konfirmasi">
        <p class="anindya-eyebrow" :style="monoStyle">Konfirmasi</p>
        <h2 :style="h2Style" class="anindya-konfirmasi__h2">
          Bisa hadir?
        </h2>

        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-400 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-2"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <form v-if="!rsvpSubmitted" key="form" class="anindya-konfirmasi__form" @submit.prevent="submitRsvp">
            <label>
              <span :style="monoStyle">Nama lengkap</span>
              <input v-model="rsvp.name" type="text" required />
            </label>
            <label>
              <span :style="monoStyle">Nomor WhatsApp</span>
              <input v-model="rsvp.whatsapp" type="tel" required />
            </label>
            <label>
              <span :style="monoStyle">Email (opsional)</span>
              <input v-model="rsvp.email" type="email" />
            </label>
            <fieldset>
              <legend :style="monoStyle">Konfirmasi kehadiran</legend>
              <label class="anindya-konfirmasi__radio">
                <input v-model="rsvp.attending" type="radio" value="hadir" />
                <span :style="h2Style">Insha Allah hadir</span>
              </label>
              <label class="anindya-konfirmasi__radio">
                <input v-model="rsvp.attending" type="radio" value="tidak" />
                <span :style="h2Style">Maaf, belum bisa</span>
              </label>
            </fieldset>
            <label v-if="rsvp.attending === 'hadir'">
              <span :style="monoStyle">Jumlah yang hadir (termasuk kamu)</span>
              <input v-model.number="rsvp.guests" type="number" min="1" max="5" />
            </label>
            <label>
              <span :style="monoStyle">Pesan / ucapan untuk kedua mempelai</span>
              <textarea v-model="rsvp.message" rows="3" />
            </label>
            <button type="submit" class="anindya-konfirmasi__submit">
              Kirim konfirmasi
            </button>
          </form>

          <div v-else key="success" class="anindya-konfirmasi__success">
            <p :style="h1Style">Terima kasih.</p>
            <p :style="h2Style">Doa Anda sangat berarti.</p>
            <p class="anindya-konfirmasi__success-note" :style="monoStyle">
              Konfirmasi kamu sudah kami catat. Bukti akan kami kirim via WhatsApp dalam 24 jam.
            </p>
            <button type="button" class="anindya-konfirmasi__again" @click="resetRsvp">
              Kirim ucapan lain
            </button>
          </div>
        </Transition>
      </section>

      <!-- SIGNOFF + COLOPHON -->
      <footer class="anindya-signoff">
        <p :style="h1Style" class="anindya-signoff__text">
          Terima kasih sudah meluangkan waktu untuk membaca.
        </p>
        <p :style="monoStyle" class="anindya-signoff__meta">
          A &amp; R &nbsp;·&nbsp; 14.03.2026 &nbsp;·&nbsp; BANDUNG
        </p>
        <p :style="monoStyle" class="anindya-signoff__meta anindya-signoff__meta--sub">
          Template by AjoClub
        </p>
      </footer>
    </main>

    <!-- Lightbox (Teleport) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxIndex !== null"
          class="anindya-lightbox"
          @click.self="closeLightbox"
        >
          <button type="button" class="anindya-lightbox__close" @click="closeLightbox" aria-label="Tutup">
            <UIcon name="i-lucide-x" class="w-5 h-5" />
          </button>
          <button v-if="photos.length > 1" type="button" class="anindya-lightbox__nav anindya-lightbox__nav--prev" @click.stop="prevPhoto" aria-label="Foto sebelumnya">
            <UIcon name="i-lucide-chevron-left" class="w-6 h-6" />
          </button>
          <button v-if="photos.length > 1" type="button" class="anindya-lightbox__nav anindya-lightbox__nav--next" @click.stop="nextPhoto" aria-label="Foto berikutnya">
            <UIcon name="i-lucide-chevron-right" class="w-6 h-6" />
          </button>
          <figure class="anindya-lightbox__figure">
            <span class="anindya-lightbox__placeholder" :style="monoStyle">
              {{ photos[lightboxIndex].caption }}
            </span>
            <figcaption class="anindya-lightbox__caption" :style="monoStyle">
              {{ lightboxIndex + 1 }} / {{ photos.length }} &middot; {{ photos[lightboxIndex].alt }}
            </figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>

    <!-- Music toggle (small, top-right) -->
    <button
      type="button"
      class="anindya-music"
      :class="{ 'anindya-music--on': musicOn }"
      :aria-pressed="musicOn"
      :aria-label="musicOn ? 'Matikan musik' : 'Putar musik'"
      @click="toggleMusic"
    >
      <ClientOnly>
        <span v-if="musicOn" class="anindya-music__bars" aria-hidden="true">
          <span /><span /><span /><span />
        </span>
        <UIcon v-else name="i-lucide-volume-x" class="w-4 h-4" />
      </ClientOnly>
    </button>
    <audio ref="audioRef" src="/audio/wedding-ambient.mp3" loop preload="none" />

    <!-- Toast -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toastMessage" class="anindya-toast" :style="h2Style">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ============================================================ */
/* BASE — warm paper, no dark mode                                */
/* ============================================================ */
.anindya {
  min-height: 100dvh;
  position: relative;
}
.anindya-eyebrow {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  text-align: center;
  font-weight: 500;
  opacity: 0.55;
  margin: 0 0 1.5rem;
  color: var(--tmpl-accent);
}

/* ============================================================ */
/* HERO                                                           */
/* ============================================================ */
.anindya-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.5rem 6rem;
  text-align: center;
  overflow: hidden;
}
.anindya-hero__dust {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.anindya-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 36rem;
  width: 100%;
}
.anindya-hero__bismillah {
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.5rem;
  font-weight: 500;
}
.anindya-hero__salam {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0 0 4rem;
  line-height: 1.6;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}
.anindya-hero__h1 {
  font-size: clamp(4.5rem, 13vw, 9rem);
  font-weight: 300;
  font-style: italic;
  line-height: 0.92;
  letter-spacing: -0.01em;
  margin: 0 0 2.5rem;
  color: var(--tmpl-fg);
}
.anindya-hero__name {
  display: inline-block;
}
.anindya-hero__amp {
  display: inline-block;
  margin: 0 0.4em;
  opacity: 0.4;
  font-style: italic;
  font-weight: 300;
}
.anindya-hero__date {
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.7;
  margin: 0 0 0.5rem;
  font-weight: 500;
}
.anindya-hero__place {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
  font-weight: 500;
}
.anindya-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tmpl-fg);
  opacity: 0.4;
  border: 1px solid color-mix(in oklch, currentColor 20%, transparent);
  border-radius: 999px;
  animation: anindya-bob 2.5s ease-in-out infinite;
}
@keyframes anindya-bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(6px); }
}
@media (prefers-reduced-motion: reduce) {
  .anindya-hero__scroll { animation: none; }
}

/* ============================================================ */
/* CERITA (love story timeline)                                   */
/* ============================================================ */
.anindya-cerita {
  padding: 7rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
}
.anindya-cerita__h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.015em;
  line-height: 1.1;
  margin: 0 0 4rem;
  color: var(--tmpl-fg);
}
.anindya-cerita__timeline {
  position: relative;
  text-align: left;
  padding-left: 4rem;
}
.anindya-cerita__rule {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.5rem;
  width: 1px;
  background-image: radial-gradient(circle, color-mix(in oklch, currentColor 40%, transparent) 1px, transparent 1.5px);
  background-size: 1px 8px;
  background-repeat: repeat-y;
  opacity: 0.5;
}
.anindya-cerita__row {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 1.25rem;
  padding: 0 0 3rem;
  position: relative;
}
.anindya-cerita__row--last {
  padding-bottom: 0;
}
.anindya-cerita__row::before {
  content: '';
  position: absolute;
  left: -3.65rem;
  top: 0.4rem;
  width: 9px;
  height: 9px;
  background: var(--tmpl-accent);
  border-radius: 999px;
}
.anindya-cerita__year {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: right;
  opacity: 0.55;
  padding-top: 0.3rem;
  margin: 0;
}
.anindya-cerita__text {
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  font-style: italic;
  font-weight: 300;
  line-height: 1.7;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--tmpl-fg);
}

/* ============================================================ */
/* DATE                                                           */
/* ============================================================ */
.anindya-date {
  padding: 6rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  background: color-mix(in oklch, currentColor 3%, transparent);
}
.anindya-date__month {
  font-size: 14px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  opacity: 0.7;
  margin: 0 0 0.5rem;
  font-weight: 500;
  color: var(--tmpl-accent);
}
.anindya-date__day {
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--tmpl-fg);
}
.anindya-date__year {
  font-size: 12px;
  letter-spacing: 0.4em;
  opacity: 0.6;
  margin: 0.5rem 0 2rem;
  font-weight: 500;
}
.anindya-date__ics {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 1.25rem;
  background: transparent;
  border: 1px solid var(--tmpl-accent);
  border-radius: 999px;
  color: var(--tmpl-accent);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
.anindya-date__ics:hover {
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
}
.anindya-date__ics-sub {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0.75rem 0 0;
}

/* ============================================================ */
/* ACARA                                                          */
/* ============================================================ */
.anindya-acara {
  padding: 7rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
}
.anindya-acara__h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.015em;
  line-height: 1.1;
  margin: 0 0 3rem;
  color: var(--tmpl-fg);
}
.anindya-acara__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.anindya-acara__event {
  padding: 1.5rem 0;
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  text-align: center;
}
.anindya-acara__event:last-child {
  border-bottom: 0;
}
.anindya-acara__time {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: var(--tmpl-accent);
}
.anindya-acara__name {
  font-size: clamp(1.5rem, 2.5vw, 1.875rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem;
  color: var(--tmpl-fg);
}
.anindya-acara__location {
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 0.5rem;
  color: var(--tmpl-fg);
  opacity: 0.85;
}
.anindya-acara__dress {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0;
  font-weight: 500;
}

/* ============================================================ */
/* GALERI                                                         */
/* ============================================================ */
.anindya-galeri {
  padding: 7rem 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
}
.anindya-galeri__h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.015em;
  line-height: 1.1;
  margin: 0 0 3rem;
}
.anindya-galeri__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
@media (min-width: 768px) {
  .anindya-galeri__grid { grid-template-columns: repeat(6, 1fr); }
}
.anindya-galeri__item {
  position: relative;
  aspect-ratio: 4 / 5;
  background: color-mix(in oklch, currentColor 6%, transparent);
  border: 0;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: transform 240ms ease;
}
.anindya-galeri__item:hover {
  transform: scale(1.02);
}
@media (min-width: 768px) {
  .anindya-galeri__item--0 { grid-column: span 6; aspect-ratio: 16 / 7; }
  .anindya-galeri__item--1 { grid-column: span 3; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--2 { grid-column: span 3; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--3 { grid-column: span 4; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--4 { grid-column: span 2; aspect-ratio: 1; }
  .anindya-galeri__item--5 { grid-column: span 3; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--6 { grid-column: span 3; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--7 { grid-column: span 2; aspect-ratio: 1; }
  .anindya-galeri__item--8 { grid-column: span 4; aspect-ratio: 4 / 3; }
  .anindya-galeri__item--9 { grid-column: span 6; aspect-ratio: 16 / 7; }
}
.anindya-galeri__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
  color: var(--tmpl-fg);
  background:
    radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--tmpl-accent) 8%, transparent), transparent 60%),
    linear-gradient(135deg, color-mix(in oklch, currentColor 8%, transparent), color-mix(in oklch, currentColor 3%, transparent));
}

/* ============================================================ */
/* COUNTDOWN                                                      */
/* ============================================================ */
.anindya-countdown {
  padding: 6rem 1.5rem;
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.anindya-countdown__line {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-style: italic;
  font-weight: 300;
  margin: 0 0 3rem;
  letter-spacing: -0.01em;
}
.anindya-countdown__blocks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  max-width: 36rem;
  margin: 0 auto;
}
.anindya-countdown__block {
  padding: 1rem 0.5rem;
  border-right: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.anindya-countdown__block:last-child { border-right: 0; }
.anindya-countdown__num {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--tmpl-fg);
}
.anindya-countdown__num--sec {
  color: var(--tmpl-accent);
  transition: color 200ms ease;
}
.anindya-countdown__label {
  font-size: 9px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  opacity: 0.6;
  font-weight: 500;
}

/* ============================================================ */
/* AMPLOP                                                         */
/* ============================================================ */
.anindya-amplop {
  padding: 6rem 1.5rem;
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}
.anindya-amplop__intro {
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
  font-style: italic;
  font-weight: 300;
  line-height: 1.55;
  margin: 0 auto 3rem;
  max-width: 38rem;
  color: var(--tmpl-fg);
}
.anindya-amplop__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 48rem;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .anindya-amplop__grid { grid-template-columns: repeat(3, 1fr); }
}
.anindya-amplop__card {
  padding: 1.75rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  border-radius: 6px;
  text-align: left;
  background: color-mix(in oklch, currentColor 1%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.anindya-amplop__bank {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--tmpl-accent);
  margin: 0;
}
.anindya-amplop__account {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin: 0.25rem 0 0;
  font-variant-numeric: tabular-nums;
}
.anindya-amplop__holder {
  font-size: 13px;
  opacity: 0.75;
  margin: 0;
}
.anindya-amplop__copy {
  margin-top: 0.75rem;
  align-self: flex-start;
  padding: 0.4rem 0.85rem;
  background: transparent;
  border: 1px solid var(--tmpl-accent);
  border-radius: 999px;
  color: var(--tmpl-accent);
  font: inherit;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
.anindya-amplop__copy:hover {
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
}

/* ============================================================ */
/* KONFIRMASI                                                     */
/* ============================================================ */
.anindya-konfirmasi {
  padding: 6rem 1.5rem;
  max-width: 32rem;
  margin: 0 auto;
  text-align: center;
}
.anindya-konfirmasi__h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.015em;
  line-height: 1.1;
  margin: 0 0 3rem;
}
.anindya-konfirmasi__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}
.anindya-konfirmasi__form label,
.anindya-konfirmasi__form fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 0;
  padding: 0;
  margin: 0;
}
.anindya-konfirmasi__form legend {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
  font-weight: 500;
  margin-bottom: 0.25rem;
  padding: 0;
}
.anindya-konfirmasi__form label > span {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.6;
  font-weight: 500;
}
.anindya-konfirmasi__form input,
.anindya-konfirmasi__form textarea {
  background: transparent;
  border: 0;
  border-bottom: 1px solid color-mix(in oklch, currentColor 18%, transparent);
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 15px;
  padding: 0.5rem 0;
  font-style: italic;
  transition: border-color 200ms ease;
}
.anindya-konfirmasi__form input:focus,
.anindya-konfirmasi__form textarea:focus {
  outline: 0;
  border-bottom-color: var(--tmpl-accent);
}
.anindya-konfirmasi__form textarea {
  resize: vertical;
  min-height: 80px;
}
.anindya-konfirmasi__radio {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}
.anindya-konfirmasi__radio input[type="radio"] {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid color-mix(in oklch, currentColor 30%, transparent);
  border-radius: 999px;
  margin: 0;
  position: relative;
  cursor: pointer;
}
.anindya-konfirmasi__radio input[type="radio"]:checked {
  border-color: var(--tmpl-accent);
}
.anindya-konfirmasi__radio input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--tmpl-accent);
  border-radius: 999px;
}
.anindya-konfirmasi__radio > span {
  font-size: 14px;
  opacity: 0.85;
  letter-spacing: 0;
  text-transform: none;
}
.anindya-konfirmasi__submit {
  margin-top: 1rem;
  height: 52px;
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
  border: 0;
  border-radius: 4px;
  font: inherit;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 200ms ease, transform 200ms ease;
}
.anindya-konfirmasi__submit:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}
.anindya-konfirmasi__success {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.anindya-konfirmasi__success p:first-child {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin: 0;
  color: var(--tmpl-fg);
}
.anindya-konfirmasi__success p:nth-child(2) {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 300;
  font-style: italic;
  margin: 0;
  color: var(--tmpl-fg);
  opacity: 0.85;
}
.anindya-konfirmasi__success-note {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 1.5rem 0 0;
  font-weight: 500;
  text-align: center;
  max-width: 28rem;
  line-height: 1.6;
}
.anindya-konfirmasi__again {
  margin-top: 1.5rem;
  background: transparent;
  border: 0;
  color: var(--tmpl-accent);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ============================================================ */
/* SIGNOFF                                                        */
/* ============================================================ */
.anindya-signoff {
  padding: 6rem 1.5rem 8rem;
  text-align: center;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.anindya-signoff__text {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0 0 1.5rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  color: var(--tmpl-fg);
}
.anindya-signoff__meta {
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
  font-weight: 500;
}
.anindya-signoff__meta--sub {
  font-size: 9px;
  margin-top: 0.5rem;
  opacity: 0.3;
  letter-spacing: 0.28em;
}

/* ============================================================ */
/* LIGHTBOX                                                       */
/* ============================================================ */
.anindya-lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: color-mix(in oklch, var(--tmpl-fg) 96%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
}
.anindya-lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  z-index: 2;
}
.anindya-lightbox__close:hover {
  background: rgba(255, 255, 255, 0.18);
}
.anindya-lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 200ms ease;
}
.anindya-lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.18);
}
.anindya-lightbox__nav--prev { left: 1.25rem; }
.anindya-lightbox__nav--next { right: 1.25rem; }
.anindya-lightbox__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 90vw;
  max-height: 80vh;
  margin: 0;
}
.anindya-lightbox__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(72vw, 720px);
  aspect-ratio: 4 / 3;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}
.anindya-lightbox__caption {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  margin: 0;
  max-width: 36rem;
}

/* ============================================================ */
/* MUSIC TOGGLE                                                   */
/* ============================================================ */
.anindya-music {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 45;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in oklch, currentColor 4%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  transition: all 200ms ease;
}
.anindya-music:hover {
  background: color-mix(in oklch, currentColor 8%, transparent);
}
.anindya-music--on {
  border-color: var(--tmpl-accent);
  color: var(--tmpl-accent);
}
.anindya-music__bars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 14px;
}
.anindya-music__bars span {
  display: inline-block;
  width: 2px;
  background: currentColor;
  border-radius: 1px;
  animation: anindya-bars 0.8s ease-in-out infinite;
}
.anindya-music__bars span:nth-child(1) { height: 50%; animation-delay: 0s; }
.anindya-music__bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.anindya-music__bars span:nth-child(3) { height: 70%; animation-delay: 0.3s; }
.anindya-music__bars span:nth-child(4) { height: 90%; animation-delay: 0.45s; }
@keyframes anindya-bars {
  0%, 100% { transform: scaleY(0.4); }
  50%      { transform: scaleY(1); }
}
@media (prefers-reduced-motion: reduce) {
  .anindya-music__bars span { animation: none; }
}

/* ============================================================ */
/* TOAST                                                          */
/* ============================================================ */
.anindya-toast {
  position: fixed;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.65rem 1.25rem;
  background: color-mix(in oklch, var(--tmpl-fg) 92%, transparent);
  color: var(--tmpl-bg);
  font-size: 13px;
  font-style: italic;
  border-radius: 999px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}
</style>
