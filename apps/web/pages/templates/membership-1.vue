<script setup lang="ts">
/**
 * membership-1.vue ï¿½ Catatan Harian
 * Indonesian editorial newsletter. Substack/Aeon/The Information aesthetic.
 * Lora serif. Cream paper. Terracotta accent. Slow, paper-like, not gamified.
 *
 * 8 sections: Hero, Tentang, Tulisan Terbaru, Arsip, Berlangganan, Testimoni, Pertanyaan, Footer
 * 7 interactions: archive filter, subscribe form, article hover, 3D ambient, marquee, counter, sticky line
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('membership-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme
useScrollReveal('membership-1')
const { buildUrl } = useWhatsApp()

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeFilter = ref('Semua')
const subName = ref('')
const subEmail = ref('')
const subError = ref('')
const subSuccess = ref(false)
const totalPosts = ref(0)
const isReducedMotion = ref(false)
const testimonialVisible = ref([false, false, false])

// ============================================================
// DATA
// ============================================================
const categories = ['Semua', 'Esai', 'Catatan', 'Wawancara', 'Daftar bacaan']

const articles = [
  {
    title: 'Tentang Orang-Orang yang Menulis di Kertas',
    date: '14 APR 2026',
    readTime: '12 MIN',
    category: 'Esai',
    slug: 'tentang-orang-yang-menulis-di-kertas',
    excerpt: 'Saya menemukan tulisan tangan ayah di laci ketiga. Bukan catatan penting, hanya daftar belanja. Hurufnya miring ke kanan.',
  },
  {
    title: 'Catatan dari Kedai Kopi Dekat Pasar Minggu',
    date: '28 MAR 2026',
    readTime: '6 MIN',
    category: 'Catatan',
    slug: 'catatan-dari-kedai-kopi-dekat-pasar-minggu',
    excerpt: 'Saya pergi ke kedai ini setiap Kamis selama dua tahun sebelum menyadari pelayan tetapnya tidak pernah mengingat wajah saya.',
  },
  {
    title: 'Wawancara: Seorang Pustakawan Tua di Yogyakarta',
    date: '09 MAR 2026',
    readTime: '22 MIN',
    category: 'Wawancara',
    slug: 'wawancara-seorang-pustakawan-tua-di-yogyakarta',
    excerpt: 'Pak Hadi sudah menjaga Perpustakaan Kota Yogyakarta selama tiga puluh dua tahun. Wawancara ini berlangsung empat jam dengan dua cangkir teh.',
  },
  {
    title: 'Daftar Bacaan November 2026',
    date: '03 NOV 2026',
    readTime: '4 MIN',
    category: 'Daftar bacaan',
    slug: 'daftar-bacaan-november-2026',
    excerpt: 'Bulan ini saya lebih banyak membaca esai panjang tentang kesunyian dan satu novel terjemahan dari Korea. Bukan rekomendasi, hanya inventarisasi apa yang sempat membuat saya berhenti menandai halaman.',
  },
  {
    title: 'Mengapa Saya Berhenti Membaca Twitter Pagi Hari',
    date: '17 FEB 2026',
    readTime: '9 MIN',
    category: 'Esai',
    slug: 'mengapa-saya-berhenti-membaca-twitter-pagi-hari',
    excerpt: 'Selama tiga tahun saya membuka Twitter sebelum mandi. Tahun lalu saya berhenti. Tidak ada yang dramatis, hanya rasa lelah yang menumpuk.',
  },
  {
    title: 'Surat Pendek untuk Teman yang Pindah ke Luar Negeri',
    date: '22 JAN 2026',
    readTime: '5 MIN',
    category: 'Catatan',
    slug: 'surat-pendek-untuk-teman-yang-pindah-ke-luar-negeri',
    excerpt: 'Dear Tama, kamu sudah enam bulan di Amsterdam. Saya hanya ingin bilang, kita tidak perlu sering-sering bicara. Tapi tolong kirim satu foto langit dari jendelamu.',
  },
  {
    title: 'Percakapan dengan Penulis yang Tidak Lagi Menulis',
    date: '11 DES 2025',
    readTime: '18 MIN',
    category: 'Wawancara',
    slug: 'percakapan-dengan-penulis-yang-tidak-lagi-menulis',
    excerpt: 'Dia berhenti menulis di usia empat puluh tiga. Tidak ada skandal, hanya keputusan pelan bahwa dia sudah selesai.',
  },
]

// Archive: same articles + extra older ones visible only in archive
const archiveArticles = [
  ...articles,
  {
    title: 'Kota yang Tidak Pernah Tidur Tapi Penduduknya Ngantuk',
    date: '15 DES 2025',
    readTime: '7 MIN',
    category: 'Esai',
    slug: 'kota-yang-tidak-pernah-tidur',
    excerpt: 'Jakarta bukan kota yang tidak pernah tidur. Jakarta adalah kota yang dipaksa tidak tidur.',
  },
  {
    title: 'Resep Sambal dari Nenek yang Tidak Pernah Ditulis',
    date: '01 NOV 2025',
    readTime: '3 MIN',
    category: 'Catatan',
    slug: 'resep-sambal-dari-nenek',
    excerpt: 'Nenek tidak pernah menulis resepnya. Semuanya di tangan. Saya mencoba mengingatnya setiap kali memasak.',
  },
  {
    title: 'Tentang Kenapa Kita Berhenti Membaca Buku Fisik',
    date: '20 OKT 2025',
    readTime: '11 MIN',
    category: 'Esai',
    slug: 'tentang-kenapa-kita-berhenti-membaca-buku-fisik',
    excerpt: 'Bukan karena tidak suka. Mungkin karena kita sudah terlalu terbiasa membaca sesuatu yang bisa di-scroll.',
  },
]

const testimonials = [
  {
    quote: 'Tulisan Rara selalu selesai dengan satu kalimat yang membuat saya diam selama beberapa menit. Sekarang saya tidak lagi menganggap esai pendek mudah.',
    name: 'Andri Setiawan',
    role: 'penulis Kopi Pagi',
  },
  {
    quote: 'Saya membaca Catatan Harian di kereta setiap pagi. Tidak pernah lebih dari tiga menit. Tapi setelah membaca satu, saya selalu menulis catatan kecil di notes HP.',
    name: 'Mira Lestari',
    role: 'desainer grafis di Bandung',
  },
  {
    quote: 'Rara hanya menulis apa yang ia perhatikan. Setelah dua tahun membaca Catatan Harian, saya rasa saya menjadi lebih sabar, bukan lebih pintar.',
    name: 'Hasan Albanna',
    role: 'guru SMA di Makassar',
  },
]

const faqs = [
  {
    q: 'Berapa lama Catatan Harian terbit?',
    a: 'Setiap Kamis pagi, tanpa kecuali. Kalau Rara sakit, tulisannya lebih pendek, tapi tetap terbit.',
  },
  {
    q: 'Apakah ini newsletter gratis atau berbayar?',
    a: 'Gratis. Selamanya. Tidak ada tier berbayar, tidak ada paywall.',
  },
  {
    q: 'Bisa saya menerima edisi sebelumnya?',
    a: 'Arsip di situs ini memuat semua edisi sejak November 2024. Gulir ke bagian Arsip.',
  },
  {
    q: 'Boleh saya mengirim tulisan balasan untuk Rara?',
    a: 'Boleh. Balas saja ke email newsletter ini. Rara membaca semua surat dan biasanya membalas dalam tiga hari.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Email anda tidak disimpan di server mana pun. Subscribe via WhatsApp, bukan database.',
  },
]

// ============================================================
// COMPUTED
// ============================================================
const filteredArchive = computed(() => {
  if (activeFilter.value === 'Semua') return archiveArticles
  return archiveArticles.filter(a => a.category === activeFilter.value)
})

const archiveByYear = computed(() => {
  const years: Record<string, typeof archiveArticles> = {}
  for (const a of filteredArchive.value) {
    const year = a.date.split(' ').pop()
    if (year) {
      if (!years[year]) years[year] = []
      years[year].push(a)
    }
  }
  return Object.entries(years).sort(([a], [b]) => Number(b) - Number(a))
})

// ============================================================
// INTERACTIONS
// ============================================================
function setFilter(cat: string) {
  activeFilter.value = cat
  if (cat === 'Semua') {
    history.replaceState(null, '', window.location.pathname)
  } else {
    history.replaceState(null, '', `#${cat.toLowerCase().replace(/\s+/g, '-')}`)
  }
}

function handleSubscribe(e: Event) {
  e.preventDefault()
  subError.value = ''
  if (!subName.value.trim()) {
    subError.value = 'Tolong isi nama anda.'
    return
  }
  if (!subEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail.value)) {
    subError.value = 'Format email tidak valid. Contoh: rara@contoh.id'
    return
  }
  const msg = `Halo Rara, saya ${encodeURIComponent(subName.value)} ingin berlangganan Catatan Harian. Email saya ${encodeURIComponent(subEmail.value)}. Terima kasih.`
  const url = `https://wa.me/62812XXXXXXX?text=${msg}`
  window.open(url, '_blank', 'noopener,noreferrer')
  subSuccess.value = true
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Animated counter
function animateCounter(target: number) {
  const duration = 1200
  const start = performance.now()
  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    totalPosts.value = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Testimonial observer
let testimonialObserver: IntersectionObserver | null = null

onMounted(() => {
  heroLoaded.value = true
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  animateCounter(archiveArticles.length)

  // Read hash for filter
  const hash = window.location.hash.slice(1)
  if (hash) {
    const match = categories.find(c => c.toLowerCase().replace(/\s+/g, '-') === hash)
    if (match) activeFilter.value = match
  }

  // Testimonial intersection observer
  if (!isReducedMotion.value) {
    testimonialObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.testimonial)
          if (entry.isIntersecting && !Number.isNaN(idx)) {
            testimonialVisible.value[idx] = true
          }
        }
      },
      { threshold: 0.2 },
    )
    document.querySelectorAll('[data-testimonial]').forEach(el => testimonialObserver?.observe(el))
  } else {
    testimonialVisible.value = [true, true, true]
  }
})

onBeforeUnmount(() => {
  testimonialObserver?.disconnect()
})
</script>

<template>
  <div class="catatan" :style="styles">
    <TmplBack accent="var(--tmpl-accent)" />

    <!-- ============================================ -->
    <!-- 3D AMBIENT: Paper-grain shader (fullscreen)  -->
    <!-- ============================================ -->
    <div class="catatan__ambient" aria-hidden="true">
      <TmplExperienceCanvas
        preset="cinematic-scroll"
        :accent="tpl.accentColor"
        intensity="calm"
      />
    </div>

    <!-- ============================================ -->
    <!-- SECTION 1: HERO (80vh)                       -->
    <!-- ============================================ -->
    <section id="hero" class="catatan__hero">
      <div class="catatan__hero-inner">
        <p class="catatan__issue" :style="monoStyle">EDISI KE-23, 13 JUNI 2026</p>

        <h1 class="catatan__h1">
          Catatan Harian
        </h1>

        <p class="catatan__tagline">
          Tulisan yang layak dibaca.
        </p>

        <div class="catatan__hero-cta">
          <button type="button" class="catatan__btn catatan__btn--primary" @click="scrollToSection('berlangganan')">
            Berlangganan
          </button>
          <button type="button" class="catatan__btn catatan__btn--ghost" @click="scrollToSection('tulisan')">
            Baca dulu
          </button>
        </div>

        <!-- Scroll cue -->
        <div class="catatan__scroll-cue" @click="scrollToSection('tentang')">
          <div class="catatan__scroll-line" />
          <span class="catatan__scroll-label" :style="monoStyle">Gulir untuk membaca</span>
        </div>
      </div>
    </section>

    <!-- Sticky subscribe line (appears after hero) -->
    <div class="catatan__sticky-line">
      <button type="button" class="catatan__sticky-btn" :style="monoStyle" @click="scrollToSection('berlangganan')">
        BERLANGGANAN
      </button>
    </div>

    <!-- Marquee: what people say -->
    data-reveal="fade-up" <TmplMarquee
      :items="[
        '2.400 pembaca setiap Kamis',
        'Tidak ada iklan',
        'Tidak ada pelacakan',
        'Balas semua surat',
        'Terbit sejak November 2024',
        'Dari Jakarta, dengan kopi',
      ]"
      separator="ï¿½"
      speed="slow"
      accent="var(--tmpl-accent)"
      class="catatan__marquee-top"
    />

    <main>
      <!-- ============================================ -->
      <!-- SECTION 2: TENTANG PENULIS                   -->
      <!-- ============================================ -->
      <section id="tentang" class="catatan__section">
        <div class="catatan__section-inner" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">TENTANG PENULIS</p>
          <h2 :style="h2Style" class="catatan__section-title">Tentang Rara</h2>

          <div class="catatan__bio">
            <div class="catatan__bio-photo">
              <div class="catatan__bio-img">
                <span class="catatan__bio-placeholder">Foto Rara</span>
              </div>
              <div class="catatan__bio-name">
                <p class="catatan__bio-nama">Rara Adiswara</p>
                <p class="catatan__bio-role">Penulis Catatan Harian</p>
                <p class="catatan__bio-loc" :style="monoStyle">Jakarta, Indonesia</p>
              </div>
            </div>

            <div class="catatan__bio-text">
              <p>
                Rara Adiswara menulis catatan sejak 2017. Sebelumnya ia editor di jurnal sastra kecil di Yogyakarta selama enam tahun. Ia lahir di Padang, pindah ke Jakarta pada usia dua puluh tiga.
              </p>
              <p>
                Tulisannya kebanyakan esai pendek tentang membaca, kesepian kota, dan memori yang tidak berguna. Ia memulai Catatan Harian November 2024 karena tulisan yang tidak dibaca orang lain terasa berat. Sekarang ada sekitar 2.400 orang yang membacanya setiap Kamis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 3: TULISAN TERBARU (7 articles)      -->
      <!-- ============================================ -->
      <section id="tulisan" class="catatan__section">
        <div class="catatan__section-inner catatan__section-inner--wide" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">TULISAN TERBARU</p>
          <h2 :style="h2Style" class="catatan__section-title">Yang sudah terbit</h2>

          <!-- Post counter -->
          <p class="catatan__counter">
            <span class="catatan__counter-num" :style="monoStyle">{{ totalPosts }}</span>
            <span class="catatan__counter-label">tulisan sejak November 2024</span>
          </p>

          <div class="catatan__posts">
            <article v-for="article in articles" :key="article.slug" class="catatan__post">
              <div class="catatan__post-meta">
                <time class="catatan__post-date" :style="monoStyle">{{ article.date }}</time>
                <span class="catatan__post-cat">{{ article.category }}</span>
                <span class="catatan__post-read" :style="monoStyle">{{ article.readTime }}</span>
              </div>
              <h3 class="catatan__post-title">
                <a href="#" class="catatan__post-link">
                  {{ article.title }}
                </a>
              </h3>
              <p class="catatan__post-excerpt">{{ article.excerpt }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 4: ARSIP (filtered list)             -->
      <!-- ============================================ -->
      <section id="arsip" class="catatan__section catatan__section--warm">
        <div class="catatan__section-inner catatan__section-inner--wide" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">ARSIP</p>
          <h2 :style="h2Style" class="catatan__section-title">Semua tulisan</h2>

          <!-- Category filter pills -->
          <div class="catatan__filters" role="tablist" aria-label="Filter kategori">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              role="tab"
              :aria-pressed="activeFilter === cat"
              class="catatan__filter-pill"
              :class="{ 'catatan__filter-pill--active': activeFilter === cat }"
              @click="setFilter(cat)"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Archive list grouped by year -->
          <div class="catatan__archive" role="tabpanel">
            <template v-for="[year, yearArticles] in archiveByYear" :key="year">
              <p class="catatan__archive-year" :style="monoStyle">{{ year }}</p>
              <article v-for="article in yearArticles" :key="article.slug" class="catatan__archive-item">
                <time class="catatan__archive-date" :style="monoStyle">{{ article.date }}</time>
                <a href="#" class="catatan__archive-title">{{ article.title }}</a>
                <span class="catatan__archive-cat">{{ article.category }}</span>
                <span class="catatan__archive-read" :style="monoStyle">{{ article.readTime }}</span>
              </article>
            </template>

            <p v-if="filteredArchive.length === 0" class="catatan__archive-empty">
              Belum ada tulisan di kategori ini. Coba kategori lain, atau lihat semua tulisan.
            </p>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 5: BERLANGGANAN (subscribe form)     -->
      <!-- ============================================ -->
      <section id="berlangganan" class="catatan__section catatan__section--subscribe">
        <div class="catatan__section-inner catatan__section-inner--narrow" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">BERLANGGANAN</p>
          <h2 :style="h2Style" class="catatan__section-title">Tetap terhubung</h2>
          <p class="catatan__subscribe-intro">
            Terbit setiap Kamis. Tanpa iklan, tanpa pelacakan.
          </p>

          <TmplForm
            :fields="[
              { key: 'nama', label: 'Nama', type: 'text', placeholder: 'Nama anda', required: true },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'Email anda', required: true },
            ]"
            submit-label="Kirim ke WhatsApp Rara"
            whatsapp-phone="62812XXXXXXX"
            whatsapp-message-prefix="Halo Rara, saya ingin berlangganan Catatan Harian."
            :accent="tpl.accentColor"
          />

          <p class="catatan__subscribe-note">
            Email tidak disimpan. Pesan langsung ke WhatsApp Rara.
          </p>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 6: TESTIMONI (3 cards)               -->
      <!-- ============================================ -->
      <section id="testimoni" class="catatan__section">
        <div class="catatan__section-inner catatan__section-inner--narrow" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">APA KATA MEREKA</p>
          <h2 :style="h2Style" class="catatan__section-title">Tentang Catatan Harian</h2>

          <div class="catatan__testimoni-list">
            <figure
              v-for="(t, i) in testimonials"
              :key="i"
              :data-testimonial="i"
              class="catatan__testimoni"
              :class="{ 'catatan__testimoni--visible': testimonialVisible[i] }"
            >
              <div class="catatan__testimoni-quote" aria-hidden="true">&ldquo;</div>
              <blockquote class="catatan__testimoni-text">
                {{ t.quote }}
              </blockquote>
              <figcaption class="catatan__testimoni-attr" :style="monoStyle">
                {{ t.name }}, {{ t.role }}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SECTION 7: PERTANYAAN (FAQ)                  -->
      <!-- ============================================ -->
      <section id="pertanyaan" class="catatan__section">
        <div class="catatan__section-inner catatan__section-inner--narrow" data-reveal="fade-up">
          <p class="catatan__eyebrow" :style="monoStyle">PERTANYAAN</p>
          <h2 :style="h2Style" class="catatan__section-title">Yang sering ditanyakan</h2>

          <div class="catatan__faq">
            <details v-for="(faq, i) in faqs" :key="i" class="catatan__faq-item">
              <summary class="catatan__faq-q">
                {{ faq.q }}
              </summary>
              <p class="catatan__faq-a">
                {{ faq.a }}
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <!-- ============================================ -->
    <!-- SECTION 8: FOOTER                            -->
    <!-- ============================================ -->
    <TmplFooter data-reveal="fade-up" brand-name="Catatan Harian"
      variant="signoff"
      signoff="Oleh Rara Adiswara. Dari Jakarta, dengan kopi."
      :accent="tpl.accentColor"
      signature="ï¿½ 2024 sampai 2026 Rara Adiswara. Hak cipta dilindungi."
      :links="[
        { label: 'Tentang Rara', href: '#tentang' },
        { label: 'Arsip', href: '#arsip' },
        { label: 'Berlangganan', href: '#berlangganan' },
      ]"
    />

    <!-- Footer bottom links -->
    <div class="catatan__footer-bottom">
      <button type="button" class="catatan__footer-link" @click="scrollToTop">
        Balik ke atas
      </button>
      <a href="#" class="catatan__footer-link">Berhenti berlangganan</a>
      <a href="#" class="catatan__footer-link">RSS (akan datang)</a>
    </div>

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="membership"
    />
  </div>
</template>

<style scoped>
/* ============================================================
   CATATAN HARIAN ï¿½ Editorial Newsletter Styles
   Cream paper, terracotta accent, Lora serif, slow and paper-like
   ============================================================ */

.catatan {
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
}

/* === 3D Ambient === */
.catatan__ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

/* === Hero === */
.catatan__hero {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: 6rem 1.5rem 4rem 3rem;
}
@media (min-width: 768px) {
  .catatan__hero {
    padding: 6rem 2rem 4rem 6rem;
  }
}
.catatan__hero-inner {
  max-width: 560px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}
.catatan__issue {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}
.catatan__h1 {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;
  font-style: italic;
  line-height: 0.92;
  letter-spacing: -0.025em;
  color: var(--tmpl-fg, #2B2520);
  margin: 0;
}
.catatan__tagline {
  font-family: var(--tmpl-font-body, 'Inter', system-ui, sans-serif);
  font-size: clamp(1rem, 1.3vw, 1.125rem);
  line-height: 1.65;
  color: var(--tmpl-muted, #7A6E60);
  max-width: 480px;
  margin: 0;
}
.catatan__hero-cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.catatan__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: all 200ms ease;
}
.catatan__btn--primary {
  background: var(--tmpl-accent, #B85C3A);
  color: var(--tmpl-bg, #F5EFE3);
  border-color: var(--tmpl-accent, #B85C3A);
}
.catatan__btn--primary:hover {
  background: var(--tmpl-accent-deep, #8A4530);
  transform: translateY(-1px);
}
.catatan__btn--ghost {
  background: transparent;
  color: var(--tmpl-fg, #2B2520);
  border-color: var(--tmpl-border, #DCD3C0);
}
.catatan__btn--ghost:hover {
  border-color: var(--tmpl-accent, #B85C3A);
  color: var(--tmpl-accent, #B85C3A);
}

/* Scroll cue */
.catatan__scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 2rem;
  cursor: pointer;
}
.catatan__scroll-line {
  width: 120px;
  height: 1.5px;
  background: var(--tmpl-accent, #B85C3A);
  animation: scroll-pulse 1.5s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .catatan__scroll-line {
    animation: none;
    width: 72px;
  }
}
@keyframes scroll-pulse {
  0%, 100% { width: 20%; }
  50% { width: 100%; }
}
.catatan__scroll-label {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-muted, #7A6E60);
}

/* Sticky subscribe line */
.catatan__sticky-line {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--tmpl-bg, #F5EFE3);
  border-bottom: 1.5px solid var(--tmpl-accent, #B85C3A);
  padding: 0.375rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}
.catatan__sticky-btn {
  background: none;
  border: none;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-fg, #2B2520);
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 200ms ease;
}
.catatan__sticky-btn:hover {
  color: var(--tmpl-accent, #B85C3A);
}

/* Marquee */
.catatan__marquee-top {
  position: relative;
  z-index: 1;
  border-bottom: 1px solid var(--tmpl-border, #DCD3C0);
}

/* === Sections === */
.catatan__section {
  position: relative;
  z-index: 1;
  padding: 5rem 1.5rem 5rem 3rem;
}
@media (min-width: 768px) {
  .catatan__section {
    padding: 80px 2rem 80px 6rem;
  }
}
.catatan__section--warm {
  background: var(--tmpl-surface, #EDE5D3);
}
.catatan__section--subscribe {
  background: var(--tmpl-surface, #EDE5D3);
}

.catatan__section-inner {
  max-width: 640px;
  margin: 0 auto;
}
.catatan__section-inner--wide {
  max-width: 1200px;
}
.catatan__section-inner--narrow {
  max-width: 640px;
}

.catatan__eyebrow {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-accent, #B85C3A);
  margin: 0 0 0.75rem;
}
.catatan__section-title {
  margin: 0 0 2.5rem;
}

/* === Bio === */
.catatan__bio {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .catatan__bio {
    flex-direction: row;
    gap: 3rem;
  }
}
.catatan__bio-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .catatan__bio-photo {
    align-items: flex-start;
  }
}
.catatan__bio-img {
  width: 240px;
  height: 240px;
  background: var(--tmpl-surface, #EDE5D3);
  border: 1px solid var(--tmpl-border, #DCD3C0);
  display: flex;
  align-items: center;
  justify-content: center;
}
.catatan__bio-placeholder {
  font-size: 0.75rem;
  color: var(--tmpl-muted, #7A6E60);
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  letter-spacing: 0.04em;
}
.catatan__bio-name {
  text-align: center;
}
@media (min-width: 768px) {
  .catatan__bio-name {
    text-align: left;
  }
}
.catatan__bio-nama {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: var(--tmpl-fg, #2B2520);
}
.catatan__bio-role {
  font-size: 0.8125rem;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0 0 0.25rem;
}
.catatan__bio-loc {
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}
.catatan__bio-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 640px;
}
.catatan__bio-text p {
  font-family: var(--tmpl-font-body, 'Inter', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--tmpl-fg, #2B2520);
  margin: 0;
}

/* === Posts (Tulisan Terbaru) === */
.catatan__counter {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 2.5rem;
}
.catatan__counter-num {
  font-size: 2rem;
  font-weight: 500;
  color: var(--tmpl-accent, #B85C3A);
  font-variant-numeric: tabular-nums;
}
.catatan__counter-label {
  font-size: 0.875rem;
  color: var(--tmpl-muted, #7A6E60);
}

.catatan__posts {
  display: flex;
  flex-direction: column;
}
.catatan__post {
  border-top: 1px solid var(--tmpl-border, #DCD3C0);
  padding: 3rem 0;
}
.catatan__post-meta {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}
.catatan__post-date {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  font-variant-numeric: tabular-nums;
}
.catatan__post-cat {
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent-fg, #F5EFE3);
  background: var(--tmpl-accent, #B85C3A);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
}
.catatan__post-read {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}
.catatan__post-title {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 0.75rem;
}
.catatan__post-link {
  color: var(--tmpl-fg, #2B2520);
  text-decoration: none;
  transition: all 200ms ease;
  background-image: linear-gradient(var(--tmpl-accent, #B85C3A), var(--tmpl-accent, #B85C3A));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
}
.catatan__post-link:hover {
  background-size: 100% 1px;
  color: var(--tmpl-accent, #B85C3A);
}
.catatan__post-excerpt {
  font-family: var(--tmpl-font-body, 'Inter', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--tmpl-muted, #7A6E60);
  max-width: 640px;
  margin: 0;
  transition: max-height 300ms ease, opacity 300ms ease;
}

/* === Archive === */
.catatan__filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}
.catatan__filter-pill {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--tmpl-border, #DCD3C0);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--tmpl-muted, #7A6E60);
  cursor: pointer;
  transition: all 200ms ease;
  font-family: inherit;
}
.catatan__filter-pill:hover {
  border-color: var(--tmpl-accent, #B85C3A);
  color: var(--tmpl-accent, #B85C3A);
}
.catatan__filter-pill--active {
  background: var(--tmpl-accent, #B85C3A);
  color: var(--tmpl-accent-fg, #F5EFE3);
  border-color: var(--tmpl-accent, #B85C3A);
}

.catatan__archive-year {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-muted, #7A6E60);
  margin: 2.5rem 0 1rem;
}
.catatan__archive-year:first-child {
  margin-top: 0;
}

.catatan__archive-item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--tmpl-border, #DCD3C0);
  flex-wrap: wrap;
}
.catatan__archive-date {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  min-width: 80px;
  font-variant-numeric: tabular-nums;
}
.catatan__archive-title {
  flex: 1;
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: 1rem;
  font-weight: 500;
  color: var(--tmpl-fg, #2B2520);
  text-decoration: none;
  transition: color 200ms ease;
  min-width: 200px;
}
.catatan__archive-title:hover {
  color: var(--tmpl-accent, #B85C3A);
}
.catatan__archive-cat {
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent, #B85C3A);
  padding: 0.125rem 0.375rem;
  border: 1px solid var(--tmpl-accent, #B85C3A);
  border-radius: 6px;
}
.catatan__archive-read {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  font-variant-numeric: tabular-nums;
}
.catatan__archive-empty {
  font-size: 0.9375rem;
  color: var(--tmpl-muted, #7A6E60);
  padding: 2rem 0;
  text-align: center;
}

/* === Subscribe === */
.catatan__subscribe-intro {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--tmpl-muted, #7A6E60);
  max-width: 640px;
  margin: 0 0 2rem;
}
.catatan__subscribe-note {
  font-size: 0.75rem;
  color: var(--tmpl-muted, #7A6E60);
  text-align: left;
  margin: 1.5rem 0 0;
  opacity: 0.7;
}

/* === Testimoni === */
.catatan__testimoni-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.catatan__testimoni {
  border-top: 1px solid var(--tmpl-border, #DCD3C0);
  padding: 3rem 0;
  max-width: 640px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
.catatan__testimoni--visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .catatan__testimoni {
    opacity: 1;
    transform: none;
  }
}
.catatan__testimoni-quote {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-style: italic;
  font-size: 2rem;
  line-height: 0.8;
  color: var(--tmpl-accent, #B85C3A);
  margin-bottom: 0.5rem;
}
.catatan__testimoni-text {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: 1.25rem;
  line-height: 1.5;
  color: var(--tmpl-fg, #2B2520);
  margin: 0 0 1.5rem;
  padding: 0;
  border: 0;
}
.catatan__testimoni-attr {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}

/* === FAQ === */
.catatan__faq {
  display: flex;
  flex-direction: column;
}
.catatan__faq-item {
  border-bottom: 1px solid var(--tmpl-border, #DCD3C0);
}
.catatan__faq-q {
  font-family: var(--tmpl-font-display, 'Lora', Georgia, serif);
  font-size: 1rem;
  font-weight: 500;
  padding: 1.25rem 0;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  color: var(--tmpl-fg, #2B2520);
  transition: color 200ms ease;
}
.catatan__faq-q::-webkit-details-marker {
  display: none;
}
.catatan__faq-q::after {
  content: '+';
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--tmpl-accent, #B85C3A);
  flex-shrink: 0;
  transition: transform 200ms ease;
}
.catatan__faq-item[open] .catatan__faq-q::after {
  content: '-';
}
.catatan__faq-item[open] .catatan__faq-q {
  color: var(--tmpl-accent, #B85C3A);
}
.catatan__faq-a {
  font-family: var(--tmpl-font-body, 'Inter', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--tmpl-muted, #7A6E60);
  padding: 0 0 1.5rem;
  margin: 0;
}

/* === Footer bottom === */
.catatan__footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  padding: 1.5rem;
  padding-left: 3rem;
  border-top: 1px solid var(--tmpl-border, #DCD3C0);
  flex-wrap: wrap;
}
@media (min-width: 768px) {
  .catatan__footer-bottom {
    padding-left: 6rem;
  }
}
.catatan__footer-link {
  font-size: 0.8125rem;
  color: var(--tmpl-muted, #7A6E60);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  transition: color 200ms ease;
}
.catatan__footer-link:hover {
  color: var(--tmpl-accent, #B85C3A);
}
</style>
