<script setup lang="ts">
/**
 * wedding-3.vue — Sarah & Kevin
 * Destination Wedding. Sand/sunset/sea palette.
 *
 * 12 sections. SUBTLE 3D: slow wireframe wave (cinematic-scroll, calm).
 * Weather widget. Travel info. Itinerary.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('wedding-3')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

const isLoaded = ref(false)
const isReducedMotion = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const copiedBank = ref<string | null>(null)
let copiedTimer: number | null = null

const { buildUrl } = useWhatsApp()

// ============================================================
// 12 SECTIONS DATA
// ============================================================
const ceritaKami = [
  { year: '2020', location: 'Yogyakarta', text: 'Ketemu di kedai kopi dekat Malioboro. Dia tanya rekomendasi gudeg, saya ajak jalan kaki ke Taman Sari. Ternyata satu penerbangan besok.' },
  { year: '2022', location: 'Raja Ampat', text: 'Trip pertama bareng. Snorkeling di Wayag, naik perahu sewaan, hujan deras di tengah laut. Pulang-pulang sudah tidak bisa pulang ke status teman.' },
  { year: '2024', location: 'Labuan Bajo', text: 'Sunrise di Pulau Padar. Dia bangun lebih pagi dari saya, bawa cincin yang ternyata sudah disimpan sejak Jakarta. Tanpa pidato, tanpa rencana. Cuma satu pertanyaan.' },
  { year: '2026', location: 'Bali', text: 'Dan sekarang, kami ingin kalian ada di sini. Di pantai yang sama, di bawah langit yang sama. Bukan resepsi besar. Hanya hari baik dengan orang-orang yang penting.' },
]

const acara = [
  { time: '08:00', label: 'Akad Nikah', location: 'Pantai Melasti, Ungasan', note: 'Di tepi pantai, kaki di pasir. Baju formal tapi santai.' },
  { time: '14:00', label: 'Resepsi', location: 'Villa Infinity, Uluwatu', note: 'Makan siang, musik live, kolam renang terbuka.' },
  { time: '19:00', label: 'Makan Malam', location: 'Sundara Beach Club, Jimbaran', note: 'Sunset dinner di tepi laut. Dress code: resort elegant.' },
]

const travel = [
  { icon: 'i-lucide-plane', label: 'Penerbangan', value: 'Bali (DPS) — semua maskapai. Dari bandara ke hotel 25 menit taksi.' },
  { icon: 'i-lucide-hotel', label: 'Hotel', value: 'The Edge Bali, Uluwatu. Kamar ditanggung untuk semua tamu undangan.' },
  { icon: 'i-lucide-car', label: 'Transportasi', value: 'Shuttle bandara disediakan. Di Bali ada mobil operasional selama 3 hari.' },
  { icon: 'i-lucide-calendar', label: 'Check-in/out', value: 'Check-in: 13 Maret 2026. Check-out: 16 Maret 2026.' },
]

const galleryImages = [
  { src: '', alt: 'Pantai Melasti dari atas tebing', caption: 'Pantai Melasti, tempat akad' },
  { src: '', alt: 'Sunrise di Pulau Padar, Labuan Bajo', caption: 'Pulau Padar, 2024' },
  { src: '', alt: 'Snorkeling di Wayag, Raja Ampat', caption: 'Wayag, Raja Ampat, 2022' },
  { src: '', alt: 'Jalan kaki di Taman Sari Yogyakarta', caption: 'Taman Sari, Yogyakarta, 2020' },
  { src: '', alt: 'Villa Infinity Uluwatu dari kolam', caption: 'Villa Infinity, resepsi' },
  { src: '', alt: 'Sunset di Sundara Beach Club', caption: 'Sundara, makan malam' },
  { src: '', alt: 'Kedai kopi tempat pertama ketemu', caption: 'Kedai kopi, Malioboro' },
  { src: '', alt: 'Cincin di atas pasir Labuan Bajo', caption: 'Labuan Bajo, momen lamaran' },
]

const banks = [
  { id: 'bca', name: 'BCA', number: '882-0456-789', holder: 'Sarah Wijaya' },
  { id: 'mandiri', name: 'Mandiri', number: '123-0067-890-123', holder: 'Kevin Hartono' },
  { id: 'bni', name: 'BNI', number: '034-567-8901', holder: 'Sarah & Kevin' },
]

const rsvpFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text' as const, placeholder: 'Misal: Rina', required: true },
  { key: 'party', label: 'Jumlah tamu', type: 'select' as const, required: true, options: ['1 orang', '2 orang', '3 orang', '4+ orang'] },
  { key: 'attendance', label: 'Kehadiran', type: 'select' as const, required: true, options: ['Hadir di Bali', 'Hadir via live stream', 'Maaf, tidak bisa'] },
  { key: 'message', label: 'Pesan untuk kami', type: 'textarea' as const, placeholder: 'Doa atau ucapan' },
]
const rsvpMessage = 'Halo Sarah & Kevin, saya ingin konfirmasi kehadiran di pernikahan di Bali.'

// ============================================================
// WEATHER WIDGET (static display, Bali March)
// ============================================================
const weather = {
  location: 'Bali, Maret 2026',
  temp: '28-32\u00B0C',
  condition: 'Cerah berawan, sesekali hujan sore',
  humidity: '75-85%',
  wind: '10-15 km/jam dari tenggara',
}

// ============================================================
// 3D — SUBTLE WIREFRAME WAVE (cinematic-scroll, calm)
// ============================================================
const waveCanvasRef = ref<HTMLCanvasElement | null>(null)
let waveGL: WebGLRenderingContext | null = null
let waveProg: WebGLProgram | null = null
let waveBuf: WebGLBuffer | null = null
let waveAnimId = 0
let waveStartTime = 0

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 200)
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isReducedMotion.value) {
    setTimeout(initWave3D, 100)
  }
})

onBeforeUnmount(() => {
  if (waveAnimId) cancelAnimationFrame(waveAnimId)
  if (copiedTimer) clearTimeout(copiedTimer)
})

function initWave3D() {
  const canvas = waveCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    waveGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!waveGL) return

  const aspect = rect.width / rect.height
  const segX = 48
  const segZ = 24

  const verts: number[] = []
  for (let iz = 0; iz <= segZ; iz++) {
    for (let ix = 0; ix <= segX; ix++) {
      const x = (ix / segX - 0.5) * 2.0
      const z = (iz / segZ - 0.5) * 1.2
      verts.push(x, 0, z)
    }
  }

  const indices: number[] = []
  for (let iz = 0; iz < segZ; iz++) {
    for (let ix = 0; ix < segX; ix++) {
      const a = iz * (segX + 1) + ix
      const b = a + segX + 1
      indices.push(a, b)
      indices.push(a, a + 1)
    }
  }

  const vs = `
    attribute vec3 aPos;
    uniform float uTime;
    uniform float uAspect;
    varying float vAlpha;
    void main() {
      vec3 p = aPos;
      float wave = sin(p.x * 2.0 + uTime * 0.4) * 0.06
                 + sin(p.z * 3.0 + uTime * 0.3) * 0.04
                 + sin((p.x + p.z) * 1.5 + uTime * 0.2) * 0.03;
      p.y += wave;
      float c = cos(uTime * 0.06);
      float s = sin(uTime * 0.06);
      p.xz = mat2(c, s, -s, c) * p.xz;
      p.x /= uAspect;
      p.y -= 0.15;
      gl_Position = vec4(p * 0.7, 1.0);
      float dist = length(aPos.xz);
      vAlpha = smoothstep(1.2, 0.3, dist) * 0.55;
    }
  `
  const fs = `
    precision mediump float;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(0.58, 0.42, 0.32, vAlpha * 0.06);
    }
  `
  const vert = waveGL.createShader(waveGL.VERTEX_SHADER)!
  waveGL.shaderSource(vert, vs)
  waveGL.compileShader(vert)
  const frag = waveGL.createShader(waveGL.FRAGMENT_SHADER)!
  waveGL.shaderSource(frag, fs)
  waveGL.compileShader(frag)
  waveProg = waveGL.createProgram()!
  waveGL.attachShader(waveProg, vert)
  waveGL.attachShader(waveProg, frag)
  waveGL.linkProgram(waveProg)

  waveBuf = waveGL.createBuffer()
  waveGL.bindBuffer(waveGL.ARRAY_BUFFER, waveBuf)
  waveGL.bufferData(waveGL.ARRAY_BUFFER, new Float32Array(verts), waveGL.STATIC_DRAW)

  const idxBuf = waveGL.createBuffer()!
  waveGL.bindBuffer(waveGL.ELEMENT_ARRAY_BUFFER, idxBuf)
  waveGL.bufferData(waveGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), waveGL.STATIC_DRAW)

  waveStartTime = performance.now()

  function tick() {
    if (!waveGL || !waveProg || !waveBuf || !waveCanvasRef.value) return
    waveAnimId = requestAnimationFrame(tick)
    const elapsed = (performance.now() - waveStartTime) / 1000
    waveGL.viewport(0, 0, waveGL.drawingBufferWidth, waveGL.drawingBufferHeight)
    waveGL.clearColor(0, 0, 0, 0)
    waveGL.clear(waveGL.COLOR_BUFFER_BIT)
    waveGL.enable(waveGL.BLEND)
    waveGL.blendFunc(waveGL.SRC_ALPHA, waveGL.ONE_MINUS_SRC_ALPHA)
    waveGL.useProgram(waveProg)
    waveGL.bindBuffer(waveGL.ARRAY_BUFFER, waveBuf)
    waveGL.enableVertexAttribArray(waveGL.getAttribLocation(waveProg, 'aPos'))
    waveGL.vertexAttribPointer(waveGL.getAttribLocation(waveProg, 'aPos'), 3, waveGL.FLOAT, false, 12, 0)
    waveGL.uniform1f(waveGL.getUniformLocation(waveProg, 'uTime'), elapsed)
    waveGL.uniform1f(waveGL.getUniformLocation(waveProg, 'uAspect'), aspect)
    waveGL.drawElements(waveGL.LINES, indices.length, waveGL.UNSIGNED_SHORT, 0)
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
  }
  catch {}
  copiedBank.value = bank.id
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => { copiedBank.value = null }, 1800)
}

function downloadICS() {
  const event = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AjoClub//Wedding//ID',
    'BEGIN:VEVENT',
    'UID:sarah-kevin-wedding-2026@ajoclub.id',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20260314T010000Z',
    'DTEND:20260314T130000Z',
    'SUMMARY:Pernikahan Sarah & Kevin di Bali',
    'DESCRIPTION:Akad 08:00 Pantai Melasti, Resepsi 14:00 Villa Infinity, Makan Malam 19:00 Sundara Beach Club.',
    'LOCATION:Pantai Melasti, Ungasan, Bali',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'sarah-kevin-bali.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function openLiveStream() {
  window.open(buildUrl('Halo, saya mau tanya link live streaming pernikahan Sarah & Kevin di Bali.'), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="sk" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Sarah & Kevin"
      wordmark="S & K"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Travel', href: '#travel' },
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
      storage-key="wedding-3-audio"
      :accent="tpl.accentColor"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. OPENING — Bismillah + 3D Wave -->
      <!-- ============================== -->
      <section class="sk-hero" :style="{ minHeight: '100dvh' }">
        <canvas ref="waveCanvasRef" class="sk-hero__wave" aria-hidden="true" />

        <div class="sk-hero__content">
          <p class="sk-hero__opening" :style="monoStyle">Bismillahirrahmanirrahim</p>
          <p class="sk-hero__opening" :style="monoStyle">Dengan izin Allah SWT, kami mengundang Anda</p>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 2. NAMES HERO -->
      <!-- ============================== -->
      <section class="sk-names">
        <p class="sk-names__eyebrow" :style="monoStyle">Insya Allah menikah</p>
        <h1 :style="h1Style" class="sk-names__h1 text-balance">
          <span class="sk-names__name">Sarah</span>
          <span class="sk-names__amp">&amp;</span>
          <span class="sk-names__name">Kevin</span>
        </h1>
        <p class="sk-names__date" :style="monoStyle">Sabtu &middot; 14 &middot; Maret &middot; 2026</p>
        <p class="sk-names__loc" :style="monoStyle">Bali, Indonesia</p>
      </section>

      <!-- ============================== -->
      <!-- 3. COUNTDOWN -->
      <!-- ============================== -->
      <section class="sk-countdown">
        <TmplCountdown target="2026-03-14T08:00:00+08:00" variant="blocks" label="Hari baik akan tiba dalam" />
      </section>

      <!-- ============================== -->
      <!-- 4. CERITA — 4 milestones -->
      <!-- ============================== -->
      <section id="cerita" class="sk-cerita">
        <p class="sk-eyebrow" :style="monoStyle">Perjalanan Kami</p>
        <h2 :style="h2Style" class="sk-cerita__title text-balance">Dari kedai kopi sampai sini.</h2>

        <ol class="sk-cerita__list">
          <li v-for="item in ceritaKami" :key="item.year" class="sk-cerita__item">
            <div class="sk-cerita__head">
              <span class="sk-cerita__year" :style="monoStyle">{{ item.year }}</span>
              <span class="sk-cerita__loc" :style="monoStyle">{{ item.location }}</span>
            </div>
            <p class="sk-cerita__text">{{ item.text }}</p>
          </li>
        </ol>
      </section>

      <!-- ============================== -->
      <!-- 5. ACARA — 3 events -->
      <!-- ============================== -->
      <section id="acara" class="sk-acara">
        <p class="sk-eyebrow" :style="monoStyle">Detail Acara</p>
        <h2 :style="h2Style" class="sk-acara__title text-balance">Sabtu, 14 Maret 2026.</h2>

        <div class="sk-acara__list">
          <article v-for="(e, i) in acara" :key="e.label" class="sk-acara__item">
            <div class="sk-acara__time-block">
              <p class="sk-acara__time" :style="monoStyle">{{ e.time }}</p>
              <span class="sk-acara__num" :style="monoStyle">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="sk-acara__info">
              <h3 :style="h2Style" class="sk-acara__label">{{ e.label }}</h3>
              <p class="sk-acara__location">{{ e.location }}</p>
              <p class="sk-acara__note">{{ e.note }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 6. TRAVEL INFO -->
      <!-- ============================== -->
      <section id="travel" class="sk-travel">
        <p class="sk-eyebrow" :style="monoStyle">Info Perjalanan</p>
        <h2 :style="h2Style" class="sk-travel__title text-balance">Yang perlu kamu tahu sebelum berangkat.</h2>

        <!-- Weather widget -->
        <div class="sk-weather">
          <div class="sk-weather__icon">
            <UIcon name="i-lucide-sun" class="sk-weather__sun" />
            <UIcon name="i-lucide-cloud" class="sk-weather__cloud" />
          </div>
          <div class="sk-weather__info">
            <p class="sk-weather__loc" :style="monoStyle">{{ weather.location }}</p>
            <p class="sk-weather__temp">{{ weather.temp }}</p>
            <p class="sk-weather__desc">{{ weather.condition }}</p>
            <p class="sk-weather__meta" :style="monoStyle">Kelembapan {{ weather.humidity }} &middot; Angin {{ weather.wind }}</p>
          </div>
        </div>

        <div class="sk-travel__grid">
          <article v-for="t in travel" :key="t.label" class="sk-travel__card">
            <span class="sk-travel__icon">
              <UIcon :name="t.icon" class="w-5 h-5" />
            </span>
            <div>
              <p class="sk-travel__label" :style="monoStyle">{{ t.label }}</p>
              <p class="sk-travel__value">{{ t.value }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 7. GALERI — 8 photos -->
      <!-- ============================== -->
      <section id="galeri" class="sk-galeri">
        <p class="sk-eyebrow" :style="monoStyle">Galeri</p>
        <h2 :style="h2Style" class="sk-galeri__title text-balance">Tempat-tempat yang membawa kami ke sini.</h2>

        <div class="sk-galeri__grid">
          <button
            v-for="(img, i) in galleryImages"
            :key="i"
            type="button"
            class="sk-galeri__item"
            :aria-label="img.alt"
            @click="openLightbox(i)"
          >
            <span class="sk-galeri__photo" :aria-hidden="true">
              <span :style="monoStyle" class="sk-galeri__photo-label">Foto {{ String(i + 1).padStart(2, '0') }}</span>
            </span>
            <p class="sk-galeri__caption">{{ img.caption }}</p>
          </button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 8. RSVP -->
      <!-- ============================== -->
      <section id="rsvp" class="sk-rsvp">
        <p class="sk-eyebrow" :style="monoStyle">Konfirmasi</p>
        <h2 :style="h2Style" class="sk-rsvp__title text-balance">Bisa hadir di Bali?</h2>
        <p class="sk-rsvp__sub">Konfirmasi sebelum 1 Februari 2026. Hotel ditanggung.</p>

        <TmplForm
          :fields="rsvpFields"
          submit-label="Kirim Konfirmasi"
          :whatsapp-message="rsvpMessage"
          :accent="tpl.accentColor"
          class="sk-rsvp__form"
        />
      </section>

      <!-- ============================== -->
      <!-- 9. AMPLOP — 3 banks -->
      <!-- ============================== -->
      <section id="amplop" class="sk-amplop">
        <p class="sk-eyebrow" :style="monoStyle">Amplop</p>
        <h2 :style="h2Style" class="sk-amplop__title text-balance">Kehadiranmu sudah lebih dari cukup.</h2>
        <p class="sk-amplop__sub">Tapi kalau ingin mengirim kado, kami siapkan rekening berikut.</p>

        <ul class="sk-amplop__banks">
          <li v-for="bank in banks" :key="bank.id" class="sk-bank" :class="{ 'sk-bank--copied': copiedBank === bank.id }">
            <header class="sk-bank__head">
              <p class="sk-bank__name" :style="monoStyle">{{ bank.name }}</p>
              <button
                type="button"
                class="sk-bank__copy"
                :aria-label="`Salin rekening ${bank.name}`"
                @click="copyBank(bank)"
              >
                <UIcon :name="copiedBank === bank.id ? 'i-lucide-check' : 'i-lucide-copy'" class="w-4 h-4" />
                <span :style="monoStyle">{{ copiedBank === bank.id ? 'Tersalin' : 'Salin' }}</span>
              </button>
            </header>
            <p :style="h1Style" class="sk-bank__number">{{ bank.number }}</p>
            <p class="sk-bank__holder" :style="monoStyle">a.n. {{ bank.holder }}</p>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- 10. ADD TO CALENDAR -->
      <!-- ============================== -->
      <section class="sk-actions">
        <div class="sk-actions__grid">
          <div class="sk-action">
            <p class="sk-eyebrow" :style="monoStyle">Tambah ke kalender</p>
            <p class="sk-action__sub">Simpan tanggalnya supaya tidak lupa.</p>
            <button type="button" class="sk-action__btn" @click="downloadICS">
              <UIcon name="i-lucide-calendar-plus" class="w-4 h-4" />
              Download .ics
            </button>
          </div>

          <!-- ============================== -->
          <!-- 11. LIVE STREAMING -->
          <!-- ============================== -->
          <div class="sk-action">
            <p class="sk-eyebrow" :style="monoStyle">Siaran langsung</p>
            <p class="sk-action__sub">Tidak bisa ke Bali? Tonton dari mana saja. Link dikirim H-1.</p>
            <button type="button" class="sk-action__btn" @click="openLiveStream">
              <UIcon name="i-lucide-video" class="w-4 h-4" />
              Minta link
            </button>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 12. SIGNOFF -->
      <!-- ============================== -->
      <section class="sk-signoff">
        <p :style="h1Style" class="sk-signoff__text text-balance">
          Sampai jumpa di pantai.
        </p>
        <p :style="monoStyle" class="sk-signoff__byline">Sarah &amp; Kevin &middot; Bali &middot; 14.03.2026</p>
      </section>
    </main>

    <TmplFooter
      brand-name="Sarah & Kevin"
      :links="[
        { label: 'Cerita', href: '#cerita' },
        { label: 'Acara', href: '#acara' },
        { label: 'Travel', href: '#travel' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'RSVP', href: '#rsvp' },
        { label: 'Amplop', href: '#amplop' },
      ]"
      variant="marquee"
      :marquee-items="['Sarah & Kevin', '14.03.2026', 'Bali', '14.03.2026', 'Pantai Melasti', '14.03.2026', 'Uluwatu, Bali', '14.03.2026']"
      signoff="Terima kasih. Sampai jumpa di pantai."
      :accent="tpl.accentColor"
    />

    <TmplWhatsAppFab
      :accent="tpl.accentColor"
      :actions="[
        { label: 'Konfirmasi kehadiran', detail: 'Lewat WhatsApp, langsung tercatat', icon: 'i-lucide-check-circle', message: 'Halo Sarah & Kevin, saya [nama], Insha Allah hadir di Bali.' },
        { label: 'Tanya soal travel', detail: 'Penerbangan, hotel, transportasi', icon: 'i-lucide-plane', message: 'Halo, saya mau tanya soal info travel ke Bali untuk pernikahan.' },
        { label: 'Tanya soal amplop', detail: 'Transfer atau kirim kado', icon: 'i-lucide-gift', message: 'Halo, saya mau tanya soal amplop untuk Sarah & Kevin.' },
      ]"
    />

    <TmplLightbox
      :images="galleryImages"
      :open-index="lightboxOpen ? lightboxIndex : -1"
      title="Sarah & Kevin"
      @close="closeLightbox"
    />
  </div>
</template>

<style scoped>
.sk {
  min-height: 100dvh;
  position: relative;
}

.sk .skip-link {
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
.sk .skip-link:focus { top: 0; }

.sk-eyebrow {
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.5;
  margin: 0 0 1.5rem;
  text-align: center;
}

/* ============================================================ */
/* 1. HERO — Opening + 3D wave                                   */
/* ============================================================ */
.sk-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 4rem;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 60%, color-mix(in oklch, var(--tmpl-accent) 5%, transparent), transparent 50%),
    var(--tmpl-bg);
}
.sk-hero__wave {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.sk-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 36rem;
}
.sk-hero__opening {
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 400;
  opacity: 0.55;
  margin: 0 0 0.6rem;
}

/* ============================================================ */
/* 2. NAMES HERO                                                  */
/* ============================================================ */
.sk-names {
  text-align: center;
  padding: 6rem 1.5rem 3rem;
  background:
    linear-gradient(180deg, color-mix(in oklch, var(--tmpl-accent) 3%, var(--tmpl-bg)), var(--tmpl-bg));
}
.sk-names__eyebrow {
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 2rem;
}
.sk-names__h1 {
  font-size: var(--tmpl-h1);
  line-height: 0.85;
  letter-spacing: -0.02em;
  margin: 0;
}
.sk-names__name {
  display: block;
}
.sk-names__amp {
  display: block;
  font-size: 0.4em;
  opacity: 0.35;
  margin: 0.3em 0;
  font-style: normal;
}
.sk-names__date {
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 2.5rem 0 0.4rem;
}
.sk-names__loc {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.4;
}

/* ============================================================ */
/* 3. COUNTDOWN                                                   */
/* ============================================================ */
.sk-countdown {
  display: flex;
  justify-content: center;
  padding: 3rem 1.5rem 5rem;
}

/* ============================================================ */
/* 4. CERITA                                                      */
/* ============================================================ */
.sk-cerita {
  padding: 5rem 1.5rem;
  max-width: 42rem;
  margin: 0 auto;
}
.sk-cerita__title {
  text-align: center;
  margin: 0 0 3.5rem;
}
.sk-cerita__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.sk-cerita__item {
  padding-bottom: 2.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--tmpl-border) 60%, transparent);
}
.sk-cerita__item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.sk-cerita__head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.sk-cerita__year {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.6;
}
.sk-cerita__loc {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
}
.sk-cerita__text {
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.7;
  margin: 0;
  color: color-mix(in srgb, var(--tmpl-fg) 85%, transparent);
}

/* ============================================================ */
/* 5. ACARA                                                       */
/* ============================================================ */
.sk-acara {
  padding: 5rem 1.5rem;
  max-width: 42rem;
  margin: 0 auto;
}
.sk-acara__title {
  text-align: center;
  margin: 0 0 3.5rem;
}
.sk-acara__list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.sk-acara__item {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid color-mix(in srgb, var(--tmpl-border) 60%, transparent);
}
.sk-acara__item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.sk-acara__time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 3.5rem;
}
.sk-acara__time {
  font-size: 13px;
  letter-spacing: 0.08em;
  font-weight: 600;
  opacity: 0.7;
  margin: 0;
}
.sk-acara__num {
  font-size: 9px;
  letter-spacing: 0.15em;
  opacity: 0.3;
}
.sk-acara__info {
  flex: 1;
}
.sk-acara__label {
  margin: 0 0 0.35rem;
  font-size: clamp(1.4rem, 3vw, 2rem);
}
.sk-acara__location {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 0.35rem;
  opacity: 0.8;
}
.sk-acara__note {
  font-size: 13px;
  opacity: 0.55;
  margin: 0;
  line-height: 1.5;
}

/* ============================================================ */
/* 6. TRAVEL                                                      */
/* ============================================================ */
.sk-travel {
  padding: 5rem 1.5rem;
  background: color-mix(in srgb, var(--tmpl-surface) 100%, transparent);
}
.sk-travel__title {
  text-align: center;
  max-width: 32rem;
  margin: 0 auto 2.5rem;
}

/* Weather widget */
.sk-weather {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  max-width: 28rem;
  margin: 0 auto 2.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid color-mix(in srgb, var(--tmpl-border) 80%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--tmpl-surface-elevated) 100%, transparent);
}
.sk-weather__icon {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.sk-weather__sun {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  color: var(--tmpl-accent);
  opacity: 0.8;
}
.sk-weather__cloud {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  opacity: 0.5;
}
.sk-weather__loc {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0 0 0.25rem;
}
.sk-weather__temp {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.2rem;
}
.sk-weather__desc {
  font-size: 13px;
  opacity: 0.7;
  margin: 0 0 0.3rem;
}
.sk-weather__meta {
  font-size: 10px;
  letter-spacing: 0.1em;
  opacity: 0.45;
  margin: 0;
}

.sk-travel__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 42rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .sk-travel__grid {
    grid-template-columns: 1fr 1fr;
  }
}
.sk-travel__card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--tmpl-border) 60%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--tmpl-surface-elevated) 100%, transparent);
}
.sk-travel__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: color-mix(in srgb, var(--tmpl-accent) 10%, transparent);
  color: var(--tmpl-accent);
}
.sk-travel__label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0 0 0.35rem;
}
.sk-travel__value {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* ============================================================ */
/* 7. GALERI                                                      */
/* ============================================================ */
.sk-galeri {
  padding: 5rem 1.5rem;
  max-width: 48rem;
  margin: 0 auto;
}
.sk-galeri__title {
  text-align: center;
  margin: 0 0 3rem;
}
.sk-galeri__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
@media (min-width: 768px) {
  .sk-galeri__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.sk-galeri__item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
}
.sk-galeri__photo {
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  background:
    color-mix(in srgb, var(--tmpl-accent) 8%, transparent),
    color-mix(in srgb, var(--tmpl-surface) 100%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.sk-galeri__item:hover .sk-galeri__photo {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--tmpl-fg) 10%, transparent);
}
.sk-galeri__photo-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.35;
}
.sk-galeri__caption {
  font-size: 12px;
  opacity: 0.6;
  margin: 0;
  line-height: 1.4;
}

/* ============================================================ */
/* 8. RSVP                                                        */
/* ============================================================ */
.sk-rsvp {
  padding: 5rem 1.5rem;
  max-width: 28rem;
  margin: 0 auto;
  text-align: center;
}
.sk-rsvp__title {
  margin: 0 0 0.75rem;
}
.sk-rsvp__sub {
  font-size: 14px;
  opacity: 0.6;
  margin: 0 0 2.5rem;
}
.sk-rsvp__form {
  text-align: left;
}

/* ============================================================ */
/* 9. AMPLOP                                                      */
/* ============================================================ */
.sk-amplop {
  padding: 5rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
}
.sk-amplop__title {
  margin: 0 0 0.75rem;
}
.sk-amplop__sub {
  font-size: 14px;
  opacity: 0.6;
  margin: 0 0 2.5rem;
}
.sk-amplop__banks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sk-bank {
  padding: 1.25rem 1.5rem;
  border: 1px solid color-mix(in srgb, var(--tmpl-border) 70%, transparent);
  border-radius: 12px;
  text-align: left;
  transition: border-color 200ms ease, background 200ms ease;
}
.sk-bank--copied {
  border-color: var(--tmpl-accent);
  background: color-mix(in srgb, var(--tmpl-accent) 5%, transparent);
}
.sk-bank__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.sk-bank__name {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.6;
  margin: 0;
}
.sk-bank__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--tmpl-border) 70%, transparent);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.6;
  transition: opacity 200ms ease, border-color 200ms ease;
}
.sk-bank__copy:hover {
  opacity: 1;
  border-color: var(--tmpl-accent);
}
.sk-bank__number {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  margin: 0 0 0.35rem;
  letter-spacing: -0.01em;
}
.sk-bank__holder {
  font-size: 11px;
  letter-spacing: 0.15em;
  opacity: 0.5;
  margin: 0;
}

/* ============================================================ */
/* 10-11. ACTIONS (Calendar + Live)                               */
/* ============================================================ */
.sk-actions {
  padding: 5rem 1.5rem;
}
.sk-actions__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .sk-actions__grid {
    grid-template-columns: 1fr 1fr;
  }
}
.sk-action {
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--tmpl-border) 60%, transparent);
  border-radius: 14px;
  text-align: center;
}
.sk-action__sub {
  font-size: 13px;
  opacity: 0.6;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}
.sk-action__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border: 0;
  border-radius: 10px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: opacity 200ms ease, transform 200ms ease;
}
.sk-action__btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ============================================================ */
/* 12. SIGNOFF                                                    */
/* ============================================================ */
.sk-signoff {
  text-align: center;
  padding: 6rem 1.5rem;
  max-width: 36rem;
  margin: 0 auto;
}
.sk-signoff__text {
  margin: 0 0 1.5rem;
  font-size: var(--tmpl-h2);
}
.sk-signoff__byline {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.45;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .sk-galeri__item:hover .sk-galeri__photo {
    transform: none;
    box-shadow: none;
  }
  .sk-action__btn:hover {
    transform: none;
  }
}
</style>
