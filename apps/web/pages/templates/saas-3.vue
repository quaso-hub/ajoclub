<script setup lang="ts">
/**
 * saas-3.vue — Lintas
 * Color-Wash SaaS Editorial. 7 OKLCH section washes. GLSL morphing blob.
 *
 * 8 sections: Hero, Marquee, Features, Pricing, Testimonials, FAQ, CTA, Footer
 * Fraunces 800 italic H1. Force light mode.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('saas-3')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const billing = ref<'monthly' | 'yearly'>('monthly')
const openFaq = ref<number | null>(0)
const heroLoaded = ref(false)
const isReducedMotion = ref(false)

// Section color washes (OKLCH)
const washes = {
  hero:        'oklch(0.95 0.04 300)',
  marquee:     'oklch(0.97 0.03 80)',
  features:    'oklch(0.95 0.03 180)',
  pricing:     'oklch(0.95 0.04 140)',
  testimonials:'oklch(0.96 0.03 15)',
  faq:         'oklch(0.96 0.01 250)',
  cta:         'oklch(0.98 0.008 85)',
}

// ============================================================
// DATA
// ============================================================
const klien = [
  'Kopi Tanpa Nama', 'Sasana Visual', 'Bilik Kreasi', 'Lumina Works',
  'Arsitek Lokal', 'Aksara Co.', 'Kolektif Dua', 'Rumah Reka',
  'Studio Patah', 'Tiga Bingkai', 'Ruang Cerita', 'Titik Koma',
]

const features = [
  { icon: 'i-lucide-zap', name: 'Alur Otomatis', desc: 'Atur trigger dan aksi. Biarkan sistem yang jalan tanpa kamu.' },
  { icon: 'i-lucide-database', name: 'Data Terhubung', desc: 'Satu sumber kebenaran. Semua data di satu tempat, selalu sinkron.' },
  { icon: 'i-lucide-bar-chart-3', name: 'Laporan Instan', desc: 'Klik satu tombol, laporan siap. Tidak perlu minta tolong akuntan.' },
  { icon: 'i-lucide-users', name: 'Tim & Akses', desc: 'Atur siapa bisa lihat apa. Kasir tidak perlu laporan keuangan.' },
  { icon: 'i-lucide-credit-card', name: 'Integrasi Lokal', desc: 'QRIS, GoPay, OVO, BCA, Mandiri. Semua terhubung.' },
  { icon: 'i-lucide-bell', name: 'Notifikasi Cerdas', desc: 'Alert stok rendah, tagihan jatuh tempo, promo yang perlu dikirim.' },
]

const PRICING = {
  pemula: { base: 99000, label: 'Pemula', users: '1 pengguna', tx: '500 transaksi/bulan', support: 'Email support' },
  tim: { base: 299000, label: 'Tim', users: '5 pengguna', tx: 'Transaksi tanpa batas', support: 'WhatsApp support' },
  perusahaan: { base: 599000, label: 'Perusahaan', users: 'Tanpa batas', tx: 'API & SSO', support: 'Manajer akun' },
}

const yearlyDiscount = 0.83
const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
const getPrice = (base: number) => billing.value === 'yearly' ? Math.round(base * yearlyDiscount) : base

const testimonials = [
  { name: 'Dewi Anggraeni', role: 'Pemilik, Kopi Tanpa Nama', quote: 'Pindah dari 3 aplikasi ke Lintas. Tim saya hemat 2 jam sehari.' },
  { name: 'Raka Firmansyah', role: 'Manajer Keuangan, Sasana Visual', quote: 'Laporan keuangan yang dulu butuh 3 hari, sekarang 10 menit.' },
  { name: 'Siti Nurhaliza', role: 'Owner, Bilik Kreasi', quote: 'Setup-nya 15 menit. Tidak perlu training. Langsung jalan.' },
]

const faqs = [
  { q: 'Apa itu Lintas?', a: 'Lintas adalah aplikasi operasional untuk UMKM Indonesia. Satu tempat untuk data, laporan, dan otomatisasi.' },
  { q: 'Berapa harganya?', a: 'Mulai dari Rp 99.000 per bulan. Tidak ada tier gratis, tapi ada trial 14 hari tanpa kartu kredit.' },
  { q: 'Bisa integrasi dengan apa?', a: 'QRIS, GoPay, OVO, BCA, Mandiri, dan semua bank lokal. Untuk integrasi custom, paket Perusahaan punya API.' },
  { q: 'Data saya aman?', a: 'Data disimpan di server Jakarta. Enkripsi TLS 1.3. Backup harian. Tidak dijual ke pihak ketiga.' },
  { q: 'Kalau saya non-teknis?', a: 'Lintas dirancang untuk orang yang tidak sabar dengan software. Setup 15 menit, antarmuka Bahasa Indonesia.' },
  { q: 'Bisa coba dulu?', a: 'Ya. Trial 14 hari gratis. Tidak perlu kartu kredit. Cukup daftar dan langsung pakai.' },
]

// ============================================================
// GLSL MORPHING BLOB
// ============================================================
const blobCanvasRef = ref<HTMLCanvasElement | null>(null)
let blobGL: WebGLRenderingContext | null = null
let blobProg: WebGLProgram | null = null
let blobAnimId = 0
let blobStartTime = 0
let blobMouseX = 0
let blobMouseY = 0
let blobInView = false

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setTimeout(() => { heroLoaded.value = true }, 100)
  if (!isReducedMotion.value) {
    setTimeout(initBlob, 80)
  }
})

onBeforeUnmount(() => {
  if (blobAnimId) cancelAnimationFrame(blobAnimId)
})

function initBlob() {
  const canvas = blobCanvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  try {
    blobGL = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  catch { return }
  if (!blobGL) return

  const vs = `
    attribute vec2 aPos;
    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `
  const fs = `
    precision mediump float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;

    // Simplex noise (2D)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= uResolution.x / uResolution.y;

      // Mouse influence
      vec2 mouse = uMouse * 0.15;

      // Morphing blob via noise
      float t = uTime * 0.3;
      float n1 = snoise(p * 1.2 + vec2(t, 0.0) + mouse);
      float n2 = snoise(p * 2.0 + vec2(0.0, t * 0.7) - mouse * 0.5);
      float n3 = snoise(p * 0.8 + vec2(t * 0.5, t * 0.3));

      float radius = 0.55 + n1 * 0.18 + n2 * 0.08 + n3 * 0.05;
      float d = length(p);
      float blob = smoothstep(radius + 0.08, radius - 0.08, d);

      // Color blend: violet to teal based on angle
      float angle = atan(p.y, p.x) / 6.2831853 + 0.5;
      vec3 violet = vec3(0.55, 0.20, 0.82);
      vec3 teal = vec3(0.20, 0.72, 0.65);
      vec3 col = mix(violet, teal, angle + n1 * 0.3);

      // Soft glow
      float glow = exp(-d * 2.5) * 0.3;
      col += glow * vec3(0.4, 0.2, 0.6);

      // Alpha with soft edge
      float alpha = blob * 0.7 + glow * 0.3;

      gl_FragColor = vec4(col, alpha);
    }
  `
  const vert = blobGL.createShader(blobGL.VERTEX_SHADER)!
  blobGL.shaderSource(vert, vs)
  blobGL.compileShader(vert)
  const frag = blobGL.createShader(blobGL.FRAGMENT_SHADER)!
  blobGL.shaderSource(frag, fs)
  blobGL.compileShader(frag)
  blobProg = blobGL.createProgram()!
  blobGL.attachShader(blobProg, vert)
  blobGL.attachShader(blobProg, frag)
  blobGL.linkProgram(blobProg)

  // Fullscreen quad
  const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1])
  const buf = blobGL.createBuffer()
  blobGL.bindBuffer(blobGL.ARRAY_BUFFER, buf)
  blobGL.bufferData(blobGL.ARRAY_BUFFER, quad, blobGL.STATIC_DRAW)

  blobStartTime = performance.now()

  // Intersection observer
  const io = new IntersectionObserver(
    (entries) => { blobInView = entries[0]?.isIntersecting ?? false },
    { threshold: 0.1 },
  )
  io.observe(canvas)

  window.addEventListener('mousemove', (e) => {
    blobMouseX = (e.clientX / window.innerWidth) * 2 - 1
    blobMouseY = -((e.clientY / window.innerHeight) * 2 - 1)
  })

  function tick() {
    if (!blobGL || !blobProg || !blobCanvasRef.value) return
    blobAnimId = requestAnimationFrame(tick)
    if (!blobInView) return

    const elapsed = (performance.now() - blobStartTime) / 1000
    blobGL.viewport(0, 0, blobGL.drawingBufferWidth, blobGL.drawingBufferHeight)
    blobGL.clearColor(0, 0, 0, 0)
    blobGL.clear(blobGL.COLOR_BUFFER_BIT)
    blobGL.enable(blobGL.BLEND)
    blobGL.blendFunc(blobGL.SRC_ALPHA, blobGL.ONE_MINUS_SRC_ALPHA)
    blobGL.useProgram(blobProg)
    blobGL.bindBuffer(blobGL.ARRAY_BUFFER, buf)
    blobGL.enableVertexAttribArray(blobGL.getAttribLocation(blobProg, 'aPos'))
    blobGL.vertexAttribPointer(blobGL.getAttribLocation(blobProg, 'aPos'), 2, blobGL.FLOAT, false, 0, 0)
    blobGL.uniform2f(blobGL.getUniformLocation(blobProg, 'uResolution'), blobGL.drawingBufferWidth, blobGL.drawingBufferHeight)
    blobGL.uniform1f(blobGL.getUniformLocation(blobProg, 'uTime'), elapsed)
    blobGL.uniform2f(blobGL.getUniformLocation(blobProg, 'uMouse'), blobMouseX, blobMouseY)
    blobGL.drawArrays(blobGL.TRIANGLE_STRIP, 0, 4)
  }
  tick()
}
</script>

<template>
  <div class="lintas" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Lintas"
      :links="[
        { label: 'Fitur', href: '#fitur' },
        { label: 'Harga', href: '#harga' },
        { label: 'Testimoni', href: '#testimoni' },
        { label: 'FAQ', href: '#faq' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
      force-mode="light"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. HERO + GLSL BLOB            -->
      <!-- ============================== -->
      <section
        class="lintas-hero"
        :style="{ '--section-bg': washes.hero, background: washes.hero }"
      >
        <canvas ref="blobCanvasRef" class="lintas-hero__blob" />
        <div class="lintas-hero__content">
          <p class="lintas-label" :style="monoStyle">UNTUK UMKM INDONESIA</p>

          <h1 :style="h1Style" class="lintas-h1 text-balance">
            <span>Alur kerja</span>
            <span>yang bekerja sendiri.</span>
          </h1>

          <p class="lintas-lede">
            Hubungkan data, otomatiskan proses, dan ukur dampaknya. Tanpa spreadsheet, tanpa copy-paste.
          </p>

          <div class="lintas-cta-row">
            <a href="#harga" class="lintas-btn lintas-btn--primary">
              Mulai gratis 14 hari
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </a>
            <a href="#fitur" class="lintas-btn lintas-btn--ghost">
              Lihat demo
            </a>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 2. MARQUEE                     -->
      <!-- ============================== -->
      <section
        class="lintas-marquee-section"
        :style="{ '--section-bg': washes.marquee, background: washes.marquee }"
      >
        <p class="lintas-label lintas-label--center" :style="monoStyle">DIPERCAYA OLEH</p>
        <TmplMarquee
          :items="klien"
          separator="·"
          speed="slow"
          accent="var(--tmpl-accent)"
        />
      </section>

      <!-- ============================== -->
      <!-- 3. FEATURES (6 CARDS)          -->
      <!-- ============================== -->
      <section
        id="fitur"
        class="lintas-features"
        :style="{ '--section-bg': washes.features, background: washes.features }"
      >
        <div class="lintas-section-head">
          <p class="lintas-label" :style="monoStyle">FITUR</p>
          <h2 :style="h2Style" class="text-balance">
            Enam hal yang membuat tim Anda pulang lebih awal.
          </h2>
        </div>

        <div class="lintas-features__grid">
          <div
            v-for="(f, i) in features"
            :key="i"
            class="lintas-feature-card"
          >
            <span class="lintas-feature-card__icon">
              <UIcon :name="f.icon" class="w-5 h-5" />
            </span>
            <h3 class="lintas-feature-card__name">{{ f.name }}</h3>
            <p class="lintas-feature-card__desc">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 4. PRICING (3 TIERS)           -->
      <!-- ============================== -->
      <section
        id="harga"
        class="lintas-pricing"
        :style="{ '--section-bg': washes.pricing, background: washes.pricing }"
      >
        <div class="lintas-section-head">
          <p class="lintas-label" :style="monoStyle">HARGA</p>
          <h2 :style="h2Style" class="text-balance">
            Harga yang jujur. Tanpa kejutan.
          </h2>
          <p class="lintas-section-sub">
            Gratis untuk dua pengguna pertama. Tidak perlu kartu kredit.
          </p>
        </div>

        <!-- Billing toggle -->
        <div class="lintas-billing">
          <button
            type="button"
            :class="{ active: billing === 'monthly' }"
            @click="billing = 'monthly'"
          >
            Bulanan
          </button>
          <button
            type="button"
            :class="{ active: billing === 'yearly' }"
            @click="billing = 'yearly'"
          >
            Tahunan
            <span class="lintas-billing__save" :style="monoStyle">hemat 17%</span>
          </button>
        </div>

        <!-- Tier cards -->
        <div class="lintas-tiers">
          <div
            v-for="(p, key) in PRICING"
            :key="key"
            class="lintas-tier"
            :class="{ 'lintas-tier--featured': key === 'tim' }"
          >
            <span v-if="key === 'tim'" class="lintas-tier__ribbon" :style="monoStyle">PALING DIPILIH</span>
            <p class="lintas-tier__name" :style="monoStyle">{{ p.label }}</p>
            <p class="lintas-tier__price">
              <span class="lintas-tier__price-value">{{ fmtRp(getPrice(p.base)) }}</span>
              <span class="lintas-tier__price-period" :style="monoStyle">/bulan</span>
            </p>
            <ul class="lintas-tier__features">
              <li>
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                {{ p.users }}
              </li>
              <li>
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                {{ p.tx }}
              </li>
              <li>
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                {{ p.support }}
              </li>
              <li v-if="key === 'tim'">
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                Portal klien
              </li>
              <li v-if="key === 'perusahaan'">
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                SSO & manajer akun
              </li>
            </ul>
            <a
              href="#"
              class="lintas-tier__cta"
              :class="{ 'lintas-tier__cta--primary': key === 'tim' }"
            >
              Mulai dengan {{ p.label }}
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 5. TESTIMONIALS (3)            -->
      <!-- ============================== -->
      <section
        id="testimoni"
        class="lintas-testimonials"
        :style="{ '--section-bg': washes.testimonials, background: washes.testimonials }"
      >
        <div class="lintas-section-head">
          <p class="lintas-label" :style="monoStyle">TESTIMONI</p>
          <h2 :style="h2Style" class="text-balance">
            Tim yang sudah pindah ke Lintas.
          </h2>
        </div>

        <div class="lintas-testimonials__grid">
          <blockquote
            v-for="(t, i) in testimonials"
            :key="i"
            class="lintas-testimonial"
          >
            <p class="lintas-testimonial__quote">"{{ t.quote }}"</p>
            <footer class="lintas-testimonial__footer">
              <p class="lintas-testimonial__name">{{ t.name }}</p>
              <p class="lintas-testimonial__role" :style="monoStyle">{{ t.role }}</p>
            </footer>
          </blockquote>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 6. FAQ (6 ACCORDION)           -->
      <!-- ============================== -->
      <section
        id="faq"
        class="lintas-faq-section"
        :style="{ '--section-bg': washes.faq, background: washes.faq }"
      >
        <div class="lintas-section-head">
          <p class="lintas-label" :style="monoStyle">FAQ</p>
          <h2 :style="h2Style" class="text-balance">
            Pertanyaan yang sering ditanya.
          </h2>
        </div>

        <ul class="lintas-faq">
          <li
            v-for="(item, i) in faqs"
            :key="i"
            class="lintas-faq__item"
            :class="{ 'lintas-faq__item--open': openFaq === i }"
          >
            <h3 class="lintas-faq__h">
              <button
                type="button"
                class="lintas-faq__btn"
                :aria-expanded="openFaq === i"
                :aria-controls="`faq-${i}`"
                @click="openFaq = openFaq === i ? null : i"
              >
                <span class="lintas-faq__num" :style="monoStyle">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="lintas-faq__q">{{ item.q }}</span>
                <UIcon
                  :name="openFaq === i ? 'i-lucide-minus' : 'i-lucide-plus'"
                  class="lintas-faq__icon w-4 h-4"
                />
              </button>
            </h3>
            <Transition
              enter-active-class="transition-all duration-300 ease-out overflow-hidden"
              leave-active-class="transition-all duration-200 ease-in overflow-hidden"
              enter-from-class="opacity-0 max-h-0"
              leave-to-class="opacity-0 max-h-0"
            >
              <p v-if="openFaq === i" :id="`faq-${i}`" class="lintas-faq__a">
                {{ item.a }}
              </p>
            </Transition>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- 7. CTA                         -->
      <!-- ============================== -->
      <section
        class="lintas-cta-section"
        :style="{ '--section-bg': washes.cta, background: washes.cta }"
      >
        <h2 :style="h1Style" class="lintas-cta__h1 text-balance">
          Mulai malam ini.
        </h2>
        <p class="lintas-cta__sub">
          Gratis untuk dua pengguna pertama. Tidak perlu kartu kredit.
        </p>
        <div class="lintas-cta-row">
          <a href="#" class="lintas-btn lintas-btn--primary">
            Mulai gratis 14 hari
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </a>
          <a href="#" class="lintas-btn lintas-btn--ghost">
            Lihat demo
          </a>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 8. FOOTER                      -->
      <!-- ============================== -->
      <TmplFooter
        brand-name="Lintas"
        variant="columns"
        accent="var(--tmpl-accent)"
        :links="[
          { label: 'Fitur', href: '#fitur' },
          { label: 'Harga', href: '#harga' },
          { label: 'Testimoni', href: '#testimoni' },
          { label: 'FAQ', href: '#faq' },
        ]"
        signature="Dibuat di Jakarta, untuk UMKM Indonesia"
      />
    </main>

    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="SaaS"
    />
  </div>
</template>

<style scoped>
.lintas {
  min-height: 100dvh;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  padding: 0.5rem 1rem;
  z-index: 100;
  font-size: 13px;
}
.skip-link:focus {
  top: 0;
}

/* === Labels === */
.lintas-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 15%, transparent);
}
.lintas-label--center {
  display: block;
  text-align: center;
}

/* === Section heads === */
.lintas-section-head {
  max-width: 42rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.lintas-section-head h2 {
  margin: 0 0 1rem;
}
.lintas-section-head h2 em {
  font-style: italic;
  color: var(--tmpl-accent);
}
.lintas-section-sub {
  font-size: 1rem;
  opacity: 0.7;
  line-height: 1.55;
  margin: 0;
}

/* === H1 === */
.lintas-h1 {
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin: 0 0 1.5rem;
}
.lintas-h1 span {
  display: block;
}

/* === Lede === */
.lintas-lede {
  font-size: clamp(1.05rem, 1.3vw, 1.2rem);
  line-height: 1.6;
  max-width: 44ch;
  opacity: 0.75;
  margin: 0 0 2rem;
}

/* === CTA row === */
.lintas-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.lintas-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: background-color 200ms ease, transform 200ms ease, border-color 200ms ease;
}
.lintas-btn--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.lintas-btn--primary:hover {
  transform: translateY(-1px);
}
.lintas-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: color-mix(in oklch, currentColor 25%, transparent);
}
.lintas-btn--ghost:hover {
  background: color-mix(in oklch, currentColor 5%, transparent);
  border-color: color-mix(in oklch, currentColor 40%, transparent);
}

/* ============================== */
/* HERO                           */
/* ============================== */
.lintas-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.5rem 4rem;
  overflow: hidden;
}
.lintas-hero__blob {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.55;
}
.lintas-hero__content {
  position: relative;
  z-index: 2;
  max-width: 48rem;
  text-align: center;
}

/* ============================== */
/* MARQUEE                        */
/* ============================== */
.lintas-marquee-section {
  padding: 2.5rem 0;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}

/* ============================== */
/* FEATURES                       */
/* ============================== */
.lintas-features {
  padding: 6rem 1.5rem;
}
.lintas-features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 64rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .lintas-features__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .lintas-features__grid { grid-template-columns: repeat(3, 1fr); }
}
.lintas-feature-card {
  padding: 1.75rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in oklch, var(--section-bg, white) 60%, white);
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.lintas-feature-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in oklch, var(--tmpl-accent) 30%, transparent);
  box-shadow: 0 8px 32px color-mix(in oklch, var(--tmpl-accent) 8%, transparent);
}
.lintas-feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: color-mix(in oklch, var(--tmpl-accent) 12%, transparent);
  color: var(--tmpl-accent);
  margin-bottom: 1rem;
}
.lintas-feature-card__name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem;
}
.lintas-feature-card__desc {
  font-size: 13.5px;
  line-height: 1.55;
  opacity: 0.75;
  margin: 0;
}

/* ============================== */
/* PRICING                        */
/* ============================== */
.lintas-pricing {
  padding: 6rem 1.5rem;
}
.lintas-billing {
  display: flex;
  justify-content: center;
  gap: 0;
  margin: 0 auto 3rem;
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 8px;
  padding: 3px;
  width: fit-content;
  background: color-mix(in oklch, currentColor 4%, transparent);
}
.lintas-billing button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: inherit;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.lintas-billing button.active {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.lintas-billing__save {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: color-mix(in oklch, currentColor 12%, transparent);
}
.lintas-billing button.active .lintas-billing__save {
  background: color-mix(in oklch, var(--tmpl-bg) 20%, transparent);
}

.lintas-tiers {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 56rem;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .lintas-tiers { grid-template-columns: repeat(3, 1fr); }
}
.lintas-tier {
  position: relative;
  padding: 2rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in oklch, var(--section-bg, white) 60%, white);
  display: flex;
  flex-direction: column;
  transition: transform 200ms ease, border-color 200ms ease;
}
.lintas-tier:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklch, currentColor 25%, transparent);
}
.lintas-tier--featured {
  border-color: var(--tmpl-accent);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--tmpl-accent) 18%, transparent);
}
.lintas-tier__ribbon {
  position: absolute;
  top: -0.65rem;
  left: 1.25rem;
  padding: 0.2rem 0.65rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  font-size: 9px;
  letter-spacing: 0.15em;
  font-weight: 700;
  border-radius: 999px;
}
.lintas-tier__name {
  font-size: 11px;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}
.lintas-tier__price {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0 0 1.5rem;
}
.lintas-tier__price-value {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  font-style: italic;
  letter-spacing: -0.02em;
  font-family: var(--tmpl-font-display);
  font-variant-numeric: tabular-nums;
}
.lintas-tier__price-period {
  font-size: 11px;
  letter-spacing: 0.1em;
  opacity: 0.6;
}
.lintas-tier__features {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}
.lintas-tier__features li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 13px;
  line-height: 1.45;
}
.lintas-tier__features li :deep(svg) {
  color: var(--tmpl-accent);
  flex-shrink: 0;
  margin-top: 2px;
}
.lintas-tier__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in oklch, currentColor 20%, transparent);
  border-radius: 8px;
  background: transparent;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 200ms ease;
}
.lintas-tier__cta:hover {
  transform: translateY(-1px);
}
.lintas-tier__cta--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}

/* ============================== */
/* TESTIMONIALS                   */
/* ============================== */
.lintas-testimonials {
  padding: 6rem 1.5rem;
}
.lintas-testimonials__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 56rem;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .lintas-testimonials__grid { grid-template-columns: repeat(3, 1fr); }
}
.lintas-testimonial {
  padding: 1.75rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in oklch, var(--section-bg, white) 60%, white);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 200ms ease, border-color 200ms ease;
}
.lintas-testimonial:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklch, var(--tmpl-accent) 25%, transparent);
}
.lintas-testimonial__quote {
  font-size: 15px;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
  flex: 1;
}
.lintas-testimonial__footer {
  border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  padding-top: 1rem;
}
.lintas-testimonial__name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 0.15rem;
}
.lintas-testimonial__role {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0;
}

/* ============================== */
/* FAQ                            */
/* ============================== */
.lintas-faq-section {
  padding: 6rem 1.5rem;
}
.lintas-faq {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 42rem;
  border-top: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
.lintas-faq__item {
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
}
.lintas-faq__btn {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 0.5rem;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.lintas-faq__num {
  font-size: 10px;
  letter-spacing: 0.18em;
  font-weight: 600;
  opacity: 0.5;
  min-width: 1.75rem;
  padding-top: 0.35rem;
}
.lintas-faq__q {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.4;
}
.lintas-faq__icon {
  flex-shrink: 0;
  margin-top: 0.25rem;
  color: var(--tmpl-accent);
}
.lintas-faq__a {
  padding: 0 0.5rem 1.5rem 2.75rem;
  font-size: 14.5px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.8;
}

/* ============================== */
/* CTA                            */
/* ============================== */
.lintas-cta-section {
  padding: 8rem 1.5rem;
  text-align: center;
}
.lintas-cta__h1 {
  margin: 0 0 1rem;
}
.lintas-cta__sub {
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  opacity: 0.7;
  line-height: 1.55;
  margin: 0 auto 2.5rem;
  max-width: 36ch;
}
.lintas-cta-section .lintas-cta-row {
  justify-content: center;
}

/* === Reduced motion === */
@media (prefers-reduced-motion: reduce) {
  .lintas-hero__blob {
    display: none;
  }
}
</style>
