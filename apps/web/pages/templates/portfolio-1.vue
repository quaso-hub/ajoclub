<script setup lang="ts">
/**
 * portfolio-1.vue — Grapiku
 * Dark immersive agency portfolio. Awwwards target.
 *
 * 8 sections, 8 case studies, 6 services, 4-step process,
 * 16-klien marquee, 4 founders, 12 awards, contact form.
 * Bahasa Indonesia. Electric blue on near-black.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('portfolio-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme

// ============================================================
// STATE
// ============================================================
const isLoaded = ref(false)
const activeFilter = ref('Semua')
const heroInView = ref(true)
const countersAnimated = ref(false)

const contactFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text' as const, placeholder: 'Misal: Putri', required: true },
  { key: 'company', label: 'Perusahaan / brand', type: 'text' as const, placeholder: 'Misal: Fore Coffee' },
  { key: 'email', label: 'Email', type: 'email' as const, placeholder: 'kamu@perusahaan.com', required: true },
  { key: 'project', label: 'Apa yang kamu butuhin?', type: 'textarea' as const, placeholder: 'Ceritain proyeknya, target user, dan kira-kira timeline.', required: true },
  { key: 'budget', label: 'Kira-kira budget?', type: 'select' as const, options: ['< Rp 50 juta', 'Rp 50-200 juta', 'Rp 200 juta+', 'Belum tahu'] },
]

// ============================================================
// CASE STUDIES — 8 Indonesian brands
// ============================================================
const cases = [
  {
    slug: 'fore-coffee',
    name: 'Fore Coffee',
    year: 2024,
    discipline: 'Produk',
    tag: 'Produk',
    color: 'var(--t-brand)',
    desc: 'Redesign aplikasi mobile ordering untuk coffee chain dengan 250+ outlet.',
    outcome: '+24% repeat order dalam 3 bulan.',
  },
  {
    slug: 'erigo',
    name: 'Erigo',
    year: 2024,
    discipline: 'Brand',
    tag: 'Brand',
    color: 'var(--t-brand)',
    desc: 'Refresh logo dan visual system untuk apparel lokal asal Bandung.',
    outcome: '18 social mentions dalam minggu pertama.',
  },
  {
    slug: 'janji-jiwa',
    name: 'Janji Jiwa',
    year: 2023,
    discipline: 'Brand',
    tag: 'Brand',
    color: 'var(--t-brand)',
    desc: 'Packaging refresh untuk 50 SKU produk kopi kemasan.',
    outcome: 'Distribusi ke 200+ retail.',
  },
  {
    slug: 'cottonink',
    name: 'Cottonink',
    year: 2023,
    discipline: 'Web',
    tag: 'Web',
    color: 'var(--t-web)',
    desc: 'E-commerce redesign untuk brand fashion modest wear.',
    outcome: '-38% cart abandonment.',
  },
  {
    slug: 'xendit',
    name: 'Xendit',
    year: 2023,
    discipline: 'UX',
    tag: 'UX',
    color: 'var(--t-dash)',
    desc: 'Dashboard redesign untuk developer portal payment gateway.',
    outcome: '-22% support tickets.',
  },
  {
    slug: 'brodo',
    name: 'Brodo',
    year: 2022,
    discipline: 'Brand',
    tag: 'Brand',
    color: 'var(--t-brand)',
    desc: 'Naming dan identity untuk brand sepatu lokal Bandung.',
    outcome: 'Diliput 6 media dalam sebulan.',
  },
  {
    slug: 'sasc',
    name: 'SASC',
    year: 2022,
    discipline: 'Produk',
    tag: 'Produk',
    color: 'var(--t-brand)',
    desc: 'Build aplikasi tracking logistik untuk brand fashion beauty.',
    outcome: 'Dipakai 15 cabang.',
  },
  {
    slug: 'privy',
    name: 'Privy',
    year: 2022,
    discipline: 'UX',
    tag: 'UX',
    color: 'var(--t-dash)',
    desc: 'Redesign flow e-signature untuk startup B2B.',
    outcome: 'Completion rate 71% menjadi 89%.',
  },
]

const filterTags = ['Semua', 'UX', 'Brand', 'Produk', 'Web']

const filteredCases = computed(() => {
  if (activeFilter.value === 'Semua') return cases
  return cases.filter(c => c.tag === activeFilter.value)
})

const filterCount = computed(() => filteredCases.value.length)

// ============================================================
// SERVICES — 6
// ============================================================
const services = [
  { num: '01', title: 'Riset Pengguna', desc: 'Wawancara, journey mapping, usability testing.', cta: 'Lihat 3 riset →' },
  { num: '02', title: 'Desain Produk', desc: 'UX, UI, prototyping, design system.', cta: 'Lihat 5 produk →' },
  { num: '03', title: 'Desain Merek', desc: 'Logo, typography, color, guidelines.', cta: 'Lihat 4 rebrand →' },
  { num: '04', title: 'Pengembangan Web', desc: 'Nuxt, Next, Astro, SvelteKit.', cta: 'Lihat 6 web →' },
  { num: '05', title: 'Pengembangan Mobile', desc: 'React Native, native iOS dan Android.', cta: 'Lihat 3 app →' },
  { num: '06', title: 'Konsultan', desc: 'Audit, strategi, mentoring tim internal.', cta: 'Lihat 2 audit →' },
]

// ============================================================
// PROCESS — 4 steps
// ============================================================
const processSteps = [
  { step: '01', title: 'Riset', weeks: '3 minggu', desc: 'Wawancara 8-12 user, journey mapping, competitive audit.' },
  { step: '02', title: 'Eksplorasi', weeks: '2 minggu', desc: 'Sketch, wireframe, eksplorasi visual.' },
  { step: '03', title: 'Desain & uji', weeks: '6 minggu', desc: 'Desain hi-fi, prototype, usability test 3 putaran.' },
  { step: '04', title: 'Peluncuran', weeks: '4 minggu', desc: 'Engineer handoff, monitoring 30 hari.' },
]

// ============================================================
// KLIEN MARQUEE — 16
// ============================================================
const klienRow1 = ['Fore Coffee', 'Erigo', 'Xendit', 'Brodo', 'Bittersweet by Najla', 'Privy', 'Hijack', 'SASC']
const klienRow2 = ['Janji Jiwa', 'Cottonink', 'Mekari', 'Kaum', 'Otten', 'AMUZ', 'BukuKas', 'Spike']

// ============================================================
// FOUNDERS — 4
// ============================================================
const founders = [
  { name: 'Maya Kusuma', role: 'Founder, design lead', bio: 'Sebelumnya desainer produk di Tokopedia selama 4 tahun.', handle: '@mayakusuma', gradient: 'linear-gradient(135deg, #4A8CFF 0%, #2563EB 100%)' },
  { name: 'Andika Wirajaya', role: 'Founder, engineering', bio: 'Pernah backend engineer di Gojek.', handle: '@andikaw', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)' },
  { name: 'Ratna Halim', role: 'Co-founder, brand strategy', bio: 'Latar belakang periklanan di Ogilvy.', handle: '@ratnahalim', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' },
  { name: 'Bayu Pratama', role: 'Co-founder, ops & client', bio: 'Sebelumnya account director di Dentsu.', handle: '@bayup', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
]

// ============================================================
// AWARDS — 12
// ============================================================
const awards = [
  { pub: 'Awwwards', award: 'SOTD', year: 2024, project: 'Fore Coffee' },
  { pub: 'Awwwards', award: 'HM', year: 2024, project: 'Erigo' },
  { pub: 'FWA', award: 'Of The Day', year: 2023, project: 'Janji Jiwa' },
  { pub: 'Behance', award: 'Featured', year: 2023, project: 'Xendit' },
  { pub: 'Awwwards', award: 'SOTD', year: 2022, project: 'Brodo' },
  { pub: 'CSS Design Awards', award: 'SOTD', year: 2023, project: 'Cottonink' },
  { pub: 'FWA', award: 'Of The Day', year: 2022, project: 'SASC' },
  { pub: 'Awwwards', award: 'SOTD', year: 2021, project: 'Internal' },
  { pub: 'Behance', award: 'Featured', year: 2022, project: 'Studio' },
  { pub: 'Type Directors Club', award: 'Award', year: 2023, project: 'Typography' },
  { pub: 'Awwwards', award: 'HM', year: 2020, project: 'Early Work' },
  { pub: 'Indigo Design', award: 'Award', year: 2021, project: 'Brand' },
]

// ============================================================
// STATS (counter animation)
// ============================================================
const stats = [
  { label: 'Tahun', value: 5, suffix: '' },
  { label: 'Proyek', value: 47, suffix: '' },
  { label: 'Klien', value: 38, suffix: '' },
  { label: 'Industri', value: 6, suffix: '' },
]

const animatedStats = ref(stats.map(s => ({ ...s, current: 0 })))

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounters() {
  if (countersAnimated.value) return
  countersAnimated.value = true
  const duration = 1800
  const start = performance.now()
  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    for (let i = 0; i < stats.length; i++) {
      animatedStats.value[i].current = Math.round(stats[i].value * eased)
    }
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// ============================================================
// INTERSECTION OBSERVER for counters
// ============================================================
let counterIO: IntersectionObserver | null = null
let heroIO: IntersectionObserver | null = null

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 150)

  // Counter observer
  counterIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) animateCounters()
      }
    },
    { threshold: 0.3 },
  )
  const statsEl = document.getElementById('grapiku-stats')
  if (statsEl) counterIO.observe(statsEl)

  // Hero visibility
  heroIO = new IntersectionObserver(
    (entries) => { heroInView.value = entries[0]?.isIntersecting ?? false },
    { threshold: 0.1 },
  )
  const heroEl = document.getElementById('grapiku-hero')
  if (heroEl) heroIO.observe(heroEl)
})

onBeforeUnmount(() => {
  counterIO?.disconnect()
  heroIO?.disconnect()
})

// ============================================================
// NAV LINKS
// ============================================================
const navLinks = [
  { label: 'Karya', href: '#karya' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Proses', href: '#proses' },
  { label: 'Tim', href: '#tim' },
  { label: 'Kontak', href: '#kontak' },
]
</script>

<template>
  <div class="grapiku" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <!-- NAVBAR -->
    <TmplNavbar
      brand="Grapiku"
      :links="navLinks"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. HERO — Particle-morph 3D    -->
      <!-- ============================== -->
      <section id="grapiku-hero" class="gp-hero">
        <ClientOnly>
          <TmplExperienceCanvas
            preset="particle-morph"
            accent="#4A8CFF"
            intensity="immersive"
            label="Grapiku"
            class="gp-hero__canvas"
          />
        </ClientOnly>
        <div class="gp-hero__gradient" aria-hidden="true" />

        <div class="gp-hero__content">
          <p class="gp-meta" :style="monoStyle">Studio desain · Bandung · 2021-</p>
          <h1 :style="h1Style" class="gp-h1 text-balance">
            Bikin brand<br />yang jalan.
          </h1>
          <p class="gp-hero__sub">
            Studio kecil 4 orang di Bandung. Brand, web, dashboard. Untuk UMKM sampai startup Series C.
          </p>
          <p class="gp-hero__badge" :style="monoStyle">47 proyek · 38 klien · 6 industri · 5 tahun</p>
          <div class="gp-hero__ctas">
            <a href="#karya" class="gp-btn gp-btn--primary">Lihat studi kasus</a>
            <a href="#kontak" class="gp-btn gp-btn--ghost">Bicara langsung</a>
          </div>
        </div>

        <Transition enter-active-class="transition-opacity duration-1000" leave-active-class="transition-opacity duration-500">
          <div v-if="heroInView" class="gp-hero__scroll" :style="monoStyle">
            <span class="gp-hero__scroll-line" />
            Scroll
          </div>
        </Transition>
      </section>

      <!-- ============================== -->
      <!-- 2. STATS — Counter animation   -->
      <!-- ============================== -->
      <section id="grapiku-stats" class="gp-stats">
        <div v-for="s in animatedStats" :key="s.label" class="gp-stat">
          <span class="gp-stat__value" :style="h1Style">{{ s.current }}{{ s.suffix }}</span>
          <span class="gp-stat__label" :style="monoStyle">{{ s.label }}</span>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 3. STUDI KASUS — 8 cards       -->
      <!-- ============================== -->
      <section id="karya" class="gp-section">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Studi kasus</p>
          <h2 :style="h2Style" class="text-balance">
            08 proyek pilihan.<br />47 total. 6 disiplin.
          </h2>
        </div>

        <!-- Filter chips -->
        <div class="gp-filters">
          <button
            v-for="tag in filterTags"
            :key="tag"
            type="button"
            class="gp-filter"
            :class="{ 'gp-filter--active': activeFilter === tag }"
            @click="activeFilter = tag"
          >
            {{ tag }}
          </button>
          <span class="gp-filter__count" :style="monoStyle">Menampilkan {{ filterCount }} dari 8</span>
        </div>

        <!-- Case grid -->
        <TransitionGroup name="gp-case" tag="div" class="gp-cases">
          <article
            v-for="c in filteredCases"
            :key="c.slug"
            class="gp-case"
          >
            <div class="gp-case__cover" :style="{ background: `linear-gradient(135deg, ${c.color} 0%, var(--tmpl-bg) 100%)` }">
              <span class="gp-case__tag" :style="monoStyle">{{ c.discipline }}</span>
            </div>
            <div class="gp-case__info">
              <div class="gp-case__head">
                <h3 class="gp-case__name">{{ c.name }}</h3>
                <span class="gp-case__year" :style="monoStyle">{{ c.year }}</span>
              </div>
              <p class="gp-case__desc">{{ c.desc }}</p>
              <p class="gp-case__outcome">{{ c.outcome }}</p>
            </div>
          </article>
        </TransitionGroup>
      </section>

      <!-- ============================== -->
      <!-- 4. LAYANAN — 6 cards           -->
      <!-- ============================== -->
      <section id="layanan" class="gp-section gp-section--alt">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Layanan</p>
          <h2 :style="h2Style" class="text-balance">Apa yang bisa kami kerjakan.</h2>
        </div>

        <div class="gp-services">
          <article v-for="s in services" :key="s.num" class="gp-service">
            <span class="gp-service__num" :style="monoStyle">{{ s.num }}</span>
            <h3 class="gp-service__title">{{ s.title }}</h3>
            <p class="gp-service__desc">{{ s.desc }}</p>
            <span class="gp-service__cta" :style="monoStyle">{{ s.cta }}</span>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 5. CARA KERJA — 4 steps        -->
      <!-- ============================== -->
      <section id="proses" class="gp-section">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Cara kerja</p>
          <h2 :style="h2Style" class="text-balance">Empat langkah. Tanpa drama.</h2>
        </div>

        <div class="gp-process">
          <article v-for="step in processSteps" :key="step.step" class="gp-step">
            <span class="gp-step__num" :style="h1Style">{{ step.step }}</span>
            <h3 class="gp-step__title">{{ step.title }}</h3>
            <p class="gp-step__desc">{{ step.desc }}</p>
            <span class="gp-step__weeks" :style="monoStyle">{{ step.weeks }}</span>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 6. KLIEN MARQUEE — 16 names    -->
      <!-- ============================== -->
      <section class="gp-section gp-klien">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Klien</p>
          <h2 :style="h2Style" class="text-balance">
            Klien kami.<br />Brand, founder, dan tim<br />yang percaya kami bikin<br />sesuatu yang serius.
          </h2>
        </div>

        <div class="gp-marquee-wrap">
          <TmplMarquee
            :items="klienRow1"
            separator="·"
            direction="left"
            speed="slow"
            accent="var(--tmpl-accent)"
          />
          <div class="gp-marquee-gap" />
          <TmplMarquee
            :items="klienRow2"
            separator="·"
            direction="right"
            speed="slow"
            accent="var(--tmpl-accent)"
          />
        </div>
      </section>

      <!-- ============================== -->
      <!-- 7. TIM — 4 founders            -->
      <!-- ============================== -->
      <section id="tim" class="gp-section gp-section--alt">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Tim</p>
          <h2 :style="h2Style" class="text-balance">
            4 orang. Bandung.<br />Bukan 50. Bukan 5.
          </h2>
          <p class="gp-section__sub">Cukup untuk dengerin, mikir, dan nge-ship tanpa nge-drag.</p>
        </div>

        <div class="gp-team">
          <article v-for="f in founders" :key="f.name" class="gp-founder">
            <div class="gp-founder__avatar" :style="{ background: f.gradient }" />
            <h3 class="gp-founder__name">{{ f.name }}</h3>
            <p class="gp-founder__role" :style="monoStyle">{{ f.role }}</p>
            <p class="gp-founder__bio">{{ f.bio }}</p>
            <a class="gp-founder__handle" :style="monoStyle" :href="`https://instagram.com/${f.handle.replace('@', '')}`" target="_blank" rel="noopener">{{ f.handle }}</a>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 8. PENGHARGAAN — 12 grid       -->
      <!-- ============================== -->
      <section class="gp-section">
        <div class="gp-section__head">
          <p class="gp-meta" :style="monoStyle">Penghargaan</p>
          <h2 :style="h2Style" class="text-balance">
            Diakui sama publikasi<br />yang kami hormati.
          </h2>
        </div>

        <div class="gp-awards">
          <article v-for="(a, i) in awards" :key="i" class="gp-award">
            <span class="gp-award__pub" :style="monoStyle">{{ a.pub }}</span>
            <span class="gp-award__name">{{ a.award }}</span>
            <span class="gp-award__year" :style="monoStyle">{{ a.year }}</span>
            <span class="gp-award__project">{{ a.project }}</span>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 9. TULIS KE KAMI — Contact     -->
      <!-- ============================== -->
      <section id="kontak" class="gp-section gp-section--alt gp-contact">
        <div class="gp-contact__grid">
          <div class="gp-contact__form-side">
            <p class="gp-meta" :style="monoStyle">Tulis ke kami</p>
            <h2 :style="h2Style" class="text-balance">Mau mulai?</h2>
            <p class="gp-contact__sub">
              Balas dalam 24 jam. Konsultasi pertama gratis. Bisa via WhatsApp, email, atau ketemu langsung di studio.
            </p>

            <TmplForm
              :fields="contactFields"
              submit-label="Kirim brief →"
              whatsapp-message-prefix="Halo Grapiku, saya ingin ngobrol soal proyek:"
              :accent="tpl.accentColor"
            />
          </div>
          <div class="gp-contact__info-side">
            <div class="gp-contact__info-block">
              <span class="gp-contact__info-label" :style="monoStyle">WhatsApp</span>
              <a class="gp-contact__info-value" href="https://wa.me/6285188627365" target="_blank" rel="noopener">+62 851-8862-7365</a>
            </div>
            <div class="gp-contact__info-block">
              <span class="gp-contact__info-label" :style="monoStyle">Email</span>
              <a class="gp-contact__info-value" href="mailto:hello@grapiku.id">hello@grapiku.id</a>
            </div>
            <div class="gp-contact__info-block">
              <span class="gp-contact__info-label" :style="monoStyle">Lokasi</span>
              <p class="gp-contact__info-value">Bandung, Senin-Jumat 09-18 WIB</p>
            </div>
            <div class="gp-contact__info-block">
              <span class="gp-contact__info-label" :style="monoStyle">Sosial</span>
              <div class="gp-contact__socials">
                <a href="https://instagram.com/grapiku" target="_blank" rel="noopener">Instagram</a>
                <a href="https://behance.net/grapiku" target="_blank" rel="noopener">Behance</a>
                <a href="https://are.na/grapiku" target="_blank" rel="noopener">Are.na</a>
                <a href="https://x.com/grapiku" target="_blank" rel="noopener">X</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <TmplFooter
      brand-name="Grapiku"
      variant="columns"
      :links="navLinks"
      :marquee-items="['Grapiku', 'Bandung', '2021', 'Brand', 'Web', 'Dashboard', 'Mobile', '3D']"
      signature="© 2021-2026 Grapiku Studio. Buat orang yang serius sama brand-nya."
      :accent="tpl.accentColor"
    />

    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="portfolio"
    />
  </div>
</template>

<style scoped>
.grapiku {
  min-height: 100dvh;
  position: relative;
  --t-brand: oklch(72% 0.18 30);
  --t-web: oklch(68% 0.21 258);
  --t-dash: oklch(66% 0.22 290);
  --t-mobile: oklch(72% 0.18 350);
}
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
  text-decoration: none;
  transition: top 200ms ease;
}
.skip-link:focus { top: 0; }

/* ============================== */
/* HERO                           */
/* ============================== */
.gp-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.gp-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.gp-hero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, color-mix(in oklch, var(--tmpl-bg) 40%, transparent) 50%, var(--tmpl-bg) 100%);
  z-index: 1;
  pointer-events: none;
}
.gp-hero__content {
  position: relative;
  z-index: 2;
  max-width: 56rem;
  padding: 8rem 2rem 4rem;
}
.gp-meta {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin-bottom: 2rem;
}
.gp-h1 {
  font-family: var(--tmpl-font-display);
  font-size: clamp(4rem, 9vw, 9.5rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.045em;
  margin: 0 0 2rem;
  color: var(--tmpl-fg);
}
.gp-hero__sub {
  font-size: clamp(1.0625rem, 1.2vw, 1.25rem);
  line-height: 1.55;
  max-width: 28ch;
  color: var(--tmpl-muted);
  margin: 0 0 1.5rem;
}
.gp-hero__badge {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tmpl-muted);
  opacity: 0.6;
  margin: 0 0 2.5rem;
}
.gp-hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.gp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 200ms ease;
  border: 1px solid transparent;
}
.gp-btn--primary {
  background: var(--tmpl-accent);
  color: var(--tmpl-bg);
}
.gp-btn--primary:hover {
  box-shadow: 0 0 24px color-mix(in oklch, var(--tmpl-accent) 30%, transparent);
  transform: translateY(-1px);
}
.gp-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: color-mix(in oklch, currentColor 20%, transparent);
}
.gp-btn--ghost:hover {
  border-color: color-mix(in oklch, currentColor 40%, transparent);
  background: color-mix(in oklch, currentColor 5%, transparent);
}
.gp-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.4;
  animation: gp-scroll-pulse 2s ease-in-out infinite;
}
.gp-hero__scroll-line {
  display: block;
  width: 1px;
  height: 32px;
  background: var(--tmpl-accent);
  animation: gp-scroll-line 2s ease-in-out infinite;
}
@keyframes gp-scroll-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@keyframes gp-scroll-line {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* ============================== */
/* STATS                          */
/* ============================== */
.gp-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.gp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  border-right: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.gp-stat:last-child { border-right: 0; }
.gp-stat__value {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--tmpl-fg);
}
.gp-stat__label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-muted);
  margin-top: 0.75rem;
}

/* ============================== */
/* SECTION COMMON                 */
/* ============================== */
.gp-section {
  padding: 6rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
}
.gp-section--alt {
  background: var(--tmpl-surface);
  max-width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
}
.gp-section__head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.gp-section__head h2 {
  font-family: var(--tmpl-font-display);
  font-size: var(--tmpl-h2);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 1rem;
  color: var(--tmpl-fg);
}
.gp-section__sub {
  font-size: 1rem;
  color: var(--tmpl-muted);
  line-height: 1.55;
  margin: 0;
}

/* ============================== */
/* FILTERS                        */
/* ============================== */
.gp-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.gp-filter {
  padding: 0.5rem 1rem;
  border: 1px solid color-mix(in oklch, currentColor 15%, transparent);
  border-radius: 999px;
  background: transparent;
  color: var(--tmpl-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all 200ms ease;
}
.gp-filter:hover {
  color: var(--tmpl-fg);
  border-color: color-mix(in oklch, currentColor 30%, transparent);
}
.gp-filter--active {
  background: var(--tmpl-surface-elevated);
  color: var(--tmpl-fg);
  border-color: var(--tmpl-accent);
}
.gp-filter__count {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tmpl-muted);
  margin-left: 0.5rem;
}

/* ============================== */
/* CASE STUDIES                   */
/* ============================== */
.gp-cases {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .gp-cases { grid-template-columns: 1fr 1fr; }
}
.gp-case {
  border: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease;
  background: var(--tmpl-bg);
}
.gp-case:hover {
  border-color: var(--tmpl-accent);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--tmpl-accent) 20%, transparent);
  transform: translateY(-2px);
}
.gp-case__cover {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: flex-end;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: transform 400ms ease;
}
.gp-case:hover .gp-case__cover {
  transform: scale(1.02);
}
.gp-case__tag {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-bg);
  background: color-mix(in oklch, var(--tmpl-bg) 30%, transparent);
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
}
.gp-case__info {
  padding: 1.25rem;
}
.gp-case__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.gp-case__name {
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--tmpl-fg);
}
.gp-case__year {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--tmpl-muted);
}
.gp-case__desc {
  font-size: 14px;
  color: var(--tmpl-muted);
  line-height: 1.5;
  margin: 0 0 0.5rem;
}
.gp-case__outcome {
  font-size: 13px;
  font-weight: 500;
  color: var(--tmpl-accent);
  margin: 0;
}

/* Case transition */
.gp-case-enter-active { transition: all 300ms ease; }
.gp-case-leave-active { transition: all 200ms ease; }
.gp-case-enter-from { opacity: 0; transform: translateY(12px); }
.gp-case-leave-to { opacity: 0; transform: translateY(-12px); }

/* ============================== */
/* SERVICES                       */
/* ============================== */
.gp-services {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 80rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .gp-services { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .gp-services { grid-template-columns: repeat(3, 1fr); }
}
.gp-service {
  padding: 2rem;
  border: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-radius: 12px;
  background: var(--tmpl-bg);
  transition: all 350ms ease;
  cursor: default;
  overflow: hidden;
}
.gp-service:hover {
  background: var(--tmpl-surface-elevated);
  border-color: color-mix(in oklch, currentColor 20%, transparent);
  transform: translateY(-2px);
}
.gp-service__num {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  display: block;
  margin-bottom: 1rem;
}
.gp-service__title {
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  color: var(--tmpl-fg);
}
.gp-service__desc {
  font-size: 14px;
  color: var(--tmpl-muted);
  line-height: 1.5;
  margin: 0 0 1.25rem;
}
.gp-service__cta {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  opacity: 0;
  transition: opacity 300ms ease;
}
.gp-service:hover .gp-service__cta {
  opacity: 1;
}

/* ============================== */
/* PROCESS                        */
/* ============================== */
.gp-process {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 80rem;
  margin: 0 auto;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
@media (min-width: 768px) {
  .gp-process { grid-template-columns: repeat(4, 1fr); }
}
.gp-step {
  position: relative;
  padding: 2.5rem 1.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-right: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  transition: all 300ms ease;
}
.gp-step:last-child { border-right: 0; }
.gp-step:hover {
  background: color-mix(in oklch, var(--tmpl-accent) 4%, var(--tmpl-bg));
}
.gp-step:hover .gp-step__num {
  color: var(--tmpl-accent);
  opacity: 1;
}
.gp-step:hover .gp-step__desc {
  transform: translateY(-4px);
}
.gp-step__num {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.03em;
  opacity: 0.15;
  display: block;
  margin-bottom: 1.5rem;
  transition: all 300ms ease;
  color: var(--tmpl-fg);
}
.gp-step__title {
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  color: var(--tmpl-fg);
}
.gp-step__desc {
  font-size: 14px;
  color: var(--tmpl-muted);
  line-height: 1.5;
  margin: 0 0 1.25rem;
  transition: transform 300ms ease;
}
.gp-step__weeks {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
}

/* ============================== */
/* KLIEN MARQUEE                  */
/* ============================== */
.gp-klien {
  max-width: 100%;
}
.gp-klien .gp-section__head {
  padding: 0 2rem;
}
.gp-marquee-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.gp-marquee-gap {
  height: 1rem;
}

/* ============================== */
/* TEAM                           */
/* ============================== */
.gp-team {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .gp-team { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .gp-team { grid-template-columns: repeat(4, 1fr); }
}
.gp-founder {
  text-align: center;
  padding: 2rem 1rem;
}
.gp-founder__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  position: relative;
  overflow: hidden;
}
.gp-founder__avatar::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 35% 35%, color-mix(in oklch, white 20%, transparent), transparent 60%);
}
.gp-founder__name {
  font-size: clamp(1.25rem, 1.5vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 0.25rem;
  color: var(--tmpl-fg);
}
.gp-founder__role {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin: 0 0 0.75rem;
}
.gp-founder__bio {
  font-size: 13px;
  color: var(--tmpl-muted);
  line-height: 1.5;
  margin: 0 0 0.75rem;
}
.gp-founder__handle {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--tmpl-muted);
  text-decoration: none;
  transition: color 200ms ease;
}
.gp-founder__handle:hover {
  color: var(--tmpl-accent);
}

/* ============================== */
/* AWARDS                         */
/* ============================== */
.gp-awards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 64rem;
  margin: 0 auto;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
@media (min-width: 640px) {
  .gp-awards { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .gp-awards { grid-template-columns: repeat(3, 1fr); }
}
.gp-award {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.5rem;
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-right: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  transition: background 200ms ease;
}
.gp-award:hover {
  background: color-mix(in oklch, currentColor 3%, transparent);
}
.gp-award__pub {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
}
.gp-award__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--tmpl-fg);
}
.gp-award__year {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--tmpl-muted);
}
.gp-award__project {
  font-size: 13px;
  color: var(--tmpl-muted);
  opacity: 0.7;
}

/* ============================== */
/* CONTACT                        */
/* ============================== */
.gp-contact {
  max-width: 100%;
  padding: 6rem 2rem;
}
.gp-contact__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  max-width: 80rem;
  margin: 0 auto;
}
@media (min-width: 1024px) {
  .gp-contact__grid { grid-template-columns: 1.4fr 1fr; }
}
.gp-contact__sub {
  font-size: 1rem;
  color: var(--tmpl-muted);
  line-height: 1.55;
  margin: 0 0 2.5rem;
}
.gp-contact__info-side {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1rem;
}
.gp-contact__info-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.gp-contact__info-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
}
.gp-contact__info-value {
  font-size: 15px;
  color: var(--tmpl-fg);
  text-decoration: none;
  transition: color 200ms ease;
  margin: 0;
}
a.gp-contact__info-value:hover {
  color: var(--tmpl-accent);
}
.gp-contact__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.gp-contact__socials a {
  font-size: 14px;
  color: var(--tmpl-muted);
  text-decoration: none;
  transition: color 200ms ease;
}
.gp-contact__socials a:hover {
  color: var(--tmpl-fg);
}

/* ============================== */
/* RESPONSIVE                     */
/* ============================== */
@media (max-width: 767px) {
  .gp-stats { grid-template-columns: 1fr 1fr; }
  .gp-stat { border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent); }
  .gp-stat:nth-child(2) { border-right: 0; }
  .gp-stat:nth-child(3), .gp-stat:nth-child(4) { border-bottom: 0; }
  .gp-step { border-right: 0; }
  .gp-award { border-right: 0; }
}
</style>
