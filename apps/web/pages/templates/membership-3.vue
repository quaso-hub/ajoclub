<script setup lang="ts">
/**
 * membership-3.vue � Raka Writes
 * Solo creator tip/support page. Warm cream, butter yellow accent, Cardo italic H1.
 * 8 sections: Hero+3D, Tentang, Dukungan (3 tiers), Milestones, Tulisan Terbaru, Testimoni, FAQ, Footer
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('membership-3')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme
useScrollReveal('membership-3')
const { buildUrl } = useWhatsApp()

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const selectedTip = ref(25000)
const selectedTier = ref('kopi')
const milestoneVisible = ref([false, false, false, false])
const faqOpen = ref<number | null>(null)
const isReducedMotion = ref(false)

// ============================================================
// DATA
// ============================================================
const tipAmounts = [
  { value: 10000, label: 'Rp 10rb' },
  { value: 25000, label: 'Rp 25rb' },
  { value: 50000, label: 'Rp 50rb' },
  { value: 100000, label: 'Rp 100rb' },
]

const tiers = [
  {
    id: 'kopi',
    name: 'Kopi',
    price: 'Rp 25rb',
    period: 'sekali',
    description: 'Traktir satu kopi.',
    popular: false,
    perks: [
      'Ucapan terima kasih lewat email',
      'Nama di halaman pendukung',
      'Esai eksklusif bulanan',
    ],
  },
  {
    id: 'bulanan',
    name: 'Bulanan',
    price: 'Rp 50rb',
    period: 'per bulan',
    description: 'Dukungan rutin, konsistensi nulis.',
    popular: true,
    perks: [
      'Semua di tier Kopi',
      'Akses awal esai baru',
      'Obrolan bulanan via video call',
    ],
  },
  {
    id: 'tahunan',
    name: 'Tahunan',
    price: 'Rp 500rb',
    period: 'per tahun',
    description: 'Hemat dua bulan, dampak lebih besar.',
    popular: false,
    perks: [
      'Semua di tier Bulanan',
      'Buku fisik pertama saat terbit',
      'Konsultasi 1-on-1 per kuartal',
    ],
  },
]

const milestones = [
  { target: 100, current: 87, label: '100 pendukung', description: 'Raka bisa fokus nulis full-time tanpa freelance.' },
  { target: 500, current: 87, label: '500 pendukung', description: 'Raka bisa hire editor tetap untuk setiap esai.' },
  { target: 1000, current: 87, label: '1.000 pendukung', description: 'Raka bisa terbitin buku pertama secara indie.' },
  { target: 1, current: 0, label: 'Buku pertama', description: 'Kumpulan esai terbaik, cetak fisik, dikirim ke pendukung.' },
]

const posts = [
  { title: 'Bahasa yang Hilang di Pinggir Jalan', date: '12 JUN 2026', read: '8 menit', excerpt: 'Papan nama warung yang semakin mirip satu sama lain.' },
  { title: 'Trotoar Bukan Hiasan', date: '5 JUN 2026', read: '11 menit', excerpt: 'Hak pejalan kaki di kota yang dibangun untuk mobil.' },
  { title: 'Mengapa Saya Tidak Punya Podcast', date: '29 MEI 2026', read: '6 menit', excerpt: 'Kenapa menulis tetap lebih jujur daripada bicara.' },
  { title: 'Surat untuk Tetangga yang Pindah', date: '22 MEI 2026', read: '5 menit', excerpt: 'Kenapa kita tidak pernah bilang selamat tinggal dengan benar.' },
  { title: 'Kota Kecil yang Tidak Ingin Dikenal', date: '15 MEI 2026', read: '9 menit', excerpt: 'Kabupaten yang tidak ada di Google Maps.' },
  { title: 'Daftar Bacaan Mei 2026', date: '8 MEI 2026', read: '4 menit', excerpt: 'Buku dan esai yang membuat saya berhenti scroll.' },
]

const testimonials = [
  {
    quote: 'Setiap Jumat pagi, sebelum kopi habis, esai Raka sudah selesai saya baca. Rasanya seperti punya teman yang memperhatikan dunia.',
    name: 'Sinta Wulandari',
    role: 'guru bahasa, Yogyakarta',
  },
  {
    quote: 'Raka menulis tentang hal yang saya tahu tapi tidak bisa ungkapkan. Setelah baca, saya jadi lebih memperhatikan tempat tinggal saya sendiri.',
    name: 'Budi Santoso',
    role: 'arsitek, Bandung',
  },
  {
    quote: 'Saya traktir kopi karena tulisan yang bagus butuh waktu, dan waktu butuh uang. Investasi kecil untuk hidup yang sedikit lebih bermakna.',
    name: 'Dita Kusuma',
    role: 'desainer grafis, Jakarta',
  },
]

const faqs = [
  {
    q: 'Kenapa harus bayar?',
    a: 'Tulisan tetap gratis. Dukunganmu membayar waktu riset, menulis, dan mengedit. Tanpa itu, Raka harus cari kerja lain.',
  },
  {
    q: 'Uangnya dipakai untuk apa?',
    a: 'Biaya hidup, langganan riset, editor freelance, dan ongkos cetak buku. Laporan keuangan dipublikasi setiap kuartal.',
  },
  {
    q: 'Bisa berhenti kapan saja?',
    a: 'Bisa, tanpa penalti. Akses tetap aktif sampai periode berakhir.',
  },
  {
    q: 'Saya di luar Indonesia, bisa?',
    a: 'Bisa. Kartu kredit internasional atau transfer bank. Harga bisa disesuaikan.',
  },
  {
    q: 'Apa bedanya dengan Patreon?',
    a: 'Raka punya kendali penuh atas data pendukung. Plus, semua tulisan bisa dibaca tanpa login.',
  },
]

// ============================================================
// INTERACTIONS
// ============================================================
function selectTip(amount: number) {
  selectedTip.value = amount
}

function selectTier(tierId: string) {
  selectedTier.value = tierId
}

function toggleFaq(index: number) {
  faqOpen.value = faqOpen.value === index ? null : index
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

// Milestone observer
let milestoneObserver: IntersectionObserver | null = null

onMounted(() => {
  heroLoaded.value = true
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isReducedMotion.value) {
    milestoneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.milestone)
          if (entry.isIntersecting && !Number.isNaN(idx)) {
            milestoneVisible.value[idx] = true
          }
        }
      },
      { threshold: 0.3 },
    )
    document.querySelectorAll('[data-milestone]').forEach(el => milestoneObserver?.observe(el))
  } else {
    milestoneVisible.value = [true, true, true, true]
  }
})

onBeforeUnmount(() => {
  milestoneObserver?.disconnect()
})
</script>

<template>
  <div class="raka" :style="styles">
    <TmplBack accent="var(--tmpl-accent)" />

    <!-- ============================================ -->
    <!-- 3D: Coffee cup + steam (cinematic-scroll)    -->
    <!-- ============================================ -->
    <div class="raka__ambient" aria-hidden="true">
      <TmplExperienceCanvas
        preset="cinematic-scroll"
        :accent="tpl.accentColor"
        intensity="calm"
        label="Secangkir kopi dengan uap dan koin melayang"
      />
    </div>

    <!-- ============================================ -->
    <!-- SECTION 1: HERO + 3D                         -->
    <!-- ============================================ -->
    <section id="hero" class="raka__hero">
      <div class="raka__hero-inner">
        <!-- Creator photo placeholder -->
        <div class="raka__photo">
          <div class="raka__photo-img">
            <span class="raka__photo-label">Foto Raka</span>
          </div>
        </div>

        <h1 class="raka__h1" :style="h1Style">
          Halo, saya Raka.
        </h1>

        <p class="raka__tagline">
          Esai panjang setiap Jumat tentang desain, urbanisme, dan bahasa Indonesia. Tanpa iklan, tanpa SEO. Kalau suka, traktir kopi.
        </p>

        <!-- Tip selector -->
        <div class="raka__tip-group">
          <button
            type="button"
            class="raka__cta"
            @click="scrollToSection('dukungan')"
          >
            <span class="raka__cta-icon">&#9749;</span>
            <span>Traktir Kopi &mdash; {{ formatRupiah(selectedTip) }}</span>
          </button>
          <div class="raka__tip-chips">
            <button
              v-for="tip in tipAmounts"
              :key="tip.value"
              type="button"
              class="raka__tip-chip"
              :class="{ 'raka__tip-chip--active': selectedTip === tip.value }"
              @click="selectTip(tip.value)"
            >
              {{ tip.label }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="raka__stats">
          <span>218 pendukung tetap</span>
          <span class="raka__stats-dot">&middot;</span>
          <span>1.847 kopi diberikan tahun ini</span>
          <span class="raka__stats-dot">&middot;</span>
          <span>Sejak Januari 2025</span>
        </div>

        <!-- Scroll cue -->
        <div class="raka__scroll-cue" @click="scrollToSection('tentang')">
          <div class="raka__scroll-line" />
          <span class="raka__scroll-label" :style="monoStyle">Gulir untuk membaca</span>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 2: TENTANG (creator bio)             -->
    <!-- ============================================ -->
    <section id="tentang" class="raka__section">
      <div class="raka__section-inner" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">TENTANG PENULIS</p>
        <h2 :style="h2Style" class="raka__section-title">Siapa itu Raka</h2>

        <div class="raka__bio">
          <div class="raka__bio-text">
            <p>
              Raka Pratama menulis esai sejak 2019. Dulu jurnalis lepas di Jakarta, sekarang menetap di Bandung. Tulisannya tentang kota, bahasa, dan cara orang Indonesia hidup di ruang yang tidak dirancang untuk mereka.
            </p>
            <p>
              Ia memulai Raka Writes pada Januari 2025. Alasannya sederhana: menulis esai panjang butuh waktu, dan waktu butuh uang. 218 pendukung rutin menerima satu esai baru setiap Jumat pagi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 3: DUKUNGAN (3 tier cards)           -->
    <!-- ============================================ -->
    <section id="dukungan" class="raka__section raka__section--warm">
      <div class="raka__section-inner" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">DUKUNG KARYA RAKA</p>
        <h2 :style="h2Style" class="raka__section-title">Pilih cara mendukung</h2>
        <p class="raka__section-desc">
          Dukung tulisan yang kamu suka. Baca dulu, kalau cocok, traktir kopi.
        </p>

        <div class="raka__tiers">
          <div
            v-for="tier in tiers"
            :key="tier.id"
            class="raka__tier"
            :class="{
              'raka__tier--popular': tier.popular,
              'raka__tier--selected': selectedTier === tier.id,
            }"
            @click="selectTier(tier.id)"
          >
            <div v-if="tier.popular" class="raka__tier-badge">
              Paling populer
            </div>
            <h3 class="raka__tier-name" :style="{ fontFamily: 'var(--tmpl-font-display)' }">
              {{ tier.name }}
            </h3>
            <div class="raka__tier-price">
              <span class="raka__tier-amount">{{ tier.price }}</span>
              <span class="raka__tier-period">{{ tier.period }}</span>
            </div>
            <p class="raka__tier-desc">{{ tier.description }}</p>
            <ul class="raka__tier-perks">
              <li v-for="perk in tier.perks" :key="perk" class="raka__tier-perk">
                <span class="raka__tier-check" aria-hidden="true">&#10003;</span>
                {{ perk }}
              </li>
            </ul>
            <button
              type="button"
              class="raka__tier-btn"
              :class="{ 'raka__tier-btn--primary': tier.popular }"
            >
              Pilih paket ini
            </button>
          </div>
        </div>

        <!-- Recent supporters -->
        <div class="raka__supporters-recent">
          <p class="raka__supporters-label" :style="monoStyle">Dukungan terbaru</p>
          <div class="raka__supporters-ticker">
            <span class="raka__supporter-chip">Sinta W. &mdash; Rp 50rb</span>
            <span class="raka__supporter-chip">Budi P. &mdash; Rp 25rb</span>
            <span class="raka__supporter-chip">Ayu N. &mdash; Rp 100rb</span>
            <span class="raka__supporter-chip">Dita K. &mdash; Rp 50rb</span>
            <span class="raka__supporter-chip">Fajar R. &mdash; Rp 25rb</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 4: MILESTONES (4 goals + progress)   -->
    <!-- ============================================ -->
    <section id="milestones" class="raka__section">
      <div class="raka__section-inner" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">TARGET BERSAMA</p>
        <h2 :style="h2Style" class="raka__section-title">Ke mana dukunganmu pergi</h2>
        <p class="raka__section-desc">
          Setiap kopi membawa kita satu langkah lebih dekat ke target bersama.
        </p>

        <div class="raka__milestones">
          <div
            v-for="(m, i) in milestones"
            :key="i"
            :data-milestone="i"
            class="raka__milestone"
            :class="{ 'raka__milestone--visible': milestoneVisible[i] }"
          >
            <div class="raka__milestone-header">
              <span class="raka__milestone-icon" aria-hidden="true">&#127919;</span>
              <span class="raka__milestone-label">{{ m.label }}</span>
            </div>
            <div class="raka__milestone-bar">
              <div
                class="raka__milestone-fill"
                :style="{ width: milestoneVisible[i] ? `${Math.min((m.current / m.target) * 100, 100)}%` : '0%' }"
              />
            </div>
            <p class="raka__milestone-desc">{{ m.description }}</p>
            <p class="raka__milestone-progress" :style="monoStyle">
              <template v-if="i < 3">
                {{ m.current }} dari {{ m.target }} pendukung
              </template>
              <template v-else>
                Dalam perencanaan
              </template>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 5: TULISAN TERBARU (6 posts)         -->
    <!-- ============================================ -->
    <section id="tulisan" class="raka__section raka__section--warm">
      <div class="raka__section-inner raka__section-inner--wide" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">TULISAN TERBARU</p>
        <h2 :style="h2Style" class="raka__section-title">Yang sudah terbit</h2>

        <div class="raka__posts">
          <article v-for="post in posts" :key="post.title" class="raka__post">
            <div class="raka__post-meta">
              <time class="raka__post-date" :style="monoStyle">{{ post.date }}</time>
              <span class="raka__post-read" :style="monoStyle">{{ post.read }}</span>
            </div>
            <h3 class="raka__post-title">{{ post.title }}</h3>
            <p class="raka__post-excerpt">{{ post.excerpt }}</p>
          </article>
        </div>

        <button type="button" class="raka__posts-more" @click="scrollToSection('tulisan')">
          Lihat semua tulisan
        </button>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 6: TESTIMONI (3 supporters)          -->
    <!-- ============================================ -->
    <section id="testimoni" class="raka__section">
      <div class="raka__section-inner" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">KATA MEREKA</p>
        <h2 :style="h2Style" class="raka__section-title">Kenapa mereka dukung Raka</h2>

        <div class="raka__testimoni-list">
          <figure v-for="(t, i) in testimonials" :key="i" class="raka__testimoni">
            <div class="raka__testimoni-quote" aria-hidden="true">&ldquo;</div>
            <blockquote class="raka__testimoni-text">
              {{ t.quote }}
            </blockquote>
            <figcaption class="raka__testimoni-attr" :style="monoStyle">
              {{ t.name }}, {{ t.role }}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 7: FAQ                               -->
    <!-- ============================================ -->
    <section id="faq" class="raka__section raka__section--warm">
      <div class="raka__section-inner" data-reveal="fade-up">
        <p class="raka__eyebrow" :style="monoStyle">PERTANYAAN</p>
        <h2 :style="h2Style" class="raka__section-title">Yang sering ditanyakan</h2>

        <div class="raka__faq">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="raka__faq-item"
            :class="{ 'raka__faq-item--open': faqOpen === i }"
          >
            <button
              type="button"
              class="raka__faq-q"
              @click="toggleFaq(i)"
              :aria-expanded="faqOpen === i"
            >
              <span>{{ faq.q }}</span>
              <span class="raka__faq-toggle" aria-hidden="true">
                {{ faqOpen === i ? '&minus;' : '+' }}
              </span>
            </button>
            <div v-if="faqOpen === i" class="raka__faq-a">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECTION 8: FOOTER                            -->
    <!-- ============================================ -->
    <TmplFooter data-reveal="fade-up" brand-name="Raka Writes"
      variant="signoff"
      signoff="Dari Bandung, dengan kopi, setiap Jumat."
      :accent="tpl.accentColor"
      signature="&copy; 2025 sampai 2026 Raka Pratama. Hak cipta dilindungi."
      :links="[
        { label: 'Tentang Raka', href: '#tentang' },
        { label: 'Dukung', href: '#dukungan' },
        { label: 'Tulisan', href: '#tulisan' },
        { label: 'FAQ', href: '#faq' },
      ]"
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="membership"
    />
  </div>
</template>

<style scoped>
/* ============================================================
   RAKA WRITES � Creator Tip/Support Styles
   Warm cream, butter yellow accent, Cardo italic H1, Plus Jakarta Sans body
   ============================================================ */

.raka {
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
}

/* === 3D Ambient === */
.raka__ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}

/* === Hero === */
.raka__hero {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 4rem;
}
.raka__hero-inner {
  max-width: 640px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Creator photo */
.raka__photo {
  margin-bottom: 0.5rem;
}
.raka__photo-img {
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--tmpl-accent, #D4A843) 0%, var(--tmpl-surface, #F3EDD8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--tmpl-accent-soft, #F5EDD0);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--tmpl-accent, #D4A843) 20%, transparent);
}
.raka__photo-label {
  font-size: 0.75rem;
  color: var(--tmpl-muted, #7A6E60);
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  letter-spacing: 0.04em;
}

.raka__h1 {
  margin: 0;
  font-style: italic;
}

.raka__tagline {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.6;
  color: var(--tmpl-muted, #7A6E60);
  max-width: 520px;
  margin: 0;
}

/* Tip group */
.raka__tip-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.raka__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 2rem;
  background: var(--tmpl-accent, #D4A843);
  color: var(--tmpl-fg, #2B2520);
  border: none;
  border-radius: 8px;
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--tmpl-accent, #D4A843) 30%, transparent);
}
.raka__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px color-mix(in srgb, var(--tmpl-accent, #D4A843) 40%, transparent);
}
.raka__cta-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.raka__tip-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.raka__tip-chip {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--tmpl-border, #E0D8C4);
  border-radius: 999px;
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--tmpl-muted, #7A6E60);
  cursor: pointer;
  transition: all 200ms ease;
}
.raka__tip-chip:hover {
  border-color: var(--tmpl-accent, #D4A843);
  color: var(--tmpl-fg, #2B2520);
}
.raka__tip-chip--active {
  background: var(--tmpl-accent, #D4A843);
  color: var(--tmpl-fg, #2B2520);
  border-color: var(--tmpl-accent, #D4A843);
}

/* Stats */
.raka__stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  flex-wrap: wrap;
  justify-content: center;
}
.raka__stats-dot {
  color: var(--tmpl-accent, #D4A843);
}

/* Scroll cue */
.raka__scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  cursor: pointer;
}
.raka__scroll-line {
  width: 80px;
  height: 1.5px;
  background: var(--tmpl-accent, #D4A843);
  animation: raka-pulse 2s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .raka__scroll-line {
    animation: none;
    width: 48px;
  }
}
@keyframes raka-pulse {
  0%, 100% { width: 30%; opacity: 0.5; }
  50% { width: 100%; opacity: 1; }
}
.raka__scroll-label {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-muted, #7A6E60);
}

/* === Sections === */
.raka__section {
  position: relative;
  z-index: 1;
  padding: 5rem 1.5rem;
}
@media (min-width: 768px) {
  .raka__section {
    padding: 100px 2rem;
  }
}
.raka__section--warm {
  background: var(--tmpl-surface, #F3EDD8);
}

.raka__section-inner {
  max-width: 720px;
  margin: 0 auto;
}
.raka__section-inner--wide {
  max-width: 960px;
}

.raka__eyebrow {
  font-size: 0.625rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--tmpl-accent, #D4A843);
  margin: 0 0 0.75rem;
}
.raka__section-title {
  margin: 0 0 1.25rem;
}
.raka__section-desc {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--tmpl-muted, #7A6E60);
  max-width: 560px;
  margin: 0 0 2.5rem;
}

/* === Bio === */
.raka__bio {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.raka__bio-text p {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--tmpl-fg, #2B2520);
  margin: 0;
}

/* === Tier cards === */
.raka__tiers {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .raka__tiers {
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 1.25rem;
    align-items: center;
  }
}

.raka__tier {
  position: relative;
  background: var(--tmpl-bg, #F8F2E4);
  border: 1.5px solid var(--tmpl-border, #E0D8C4);
  border-radius: 8px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 250ms ease;
}
.raka__tier:hover {
  border-color: var(--tmpl-accent, #D4A843);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--tmpl-accent, #D4A843) 15%, transparent);
}
.raka__tier--popular {
  border-color: var(--tmpl-accent, #D4A843);
  border-width: 2px;
}
.raka__tier--selected {
  border-color: var(--tmpl-accent, #D4A843);
  box-shadow: 0 0 0 3px var(--tmpl-accent-soft, #F5EDD0);
}

.raka__tier-badge {
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tmpl-accent, #D4A843);
  color: var(--tmpl-fg, #2B2520);
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.875rem;
  border-radius: 999px;
  white-space: nowrap;
}

.raka__tier-name {
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  margin: 0;
  color: var(--tmpl-fg, #2B2520);
}

.raka__tier-price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}
.raka__tier-amount {
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--tmpl-fg, #2B2520);
  font-variant-numeric: tabular-nums;
}
.raka__tier-period {
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.6875rem;
  color: var(--tmpl-muted, #7A6E60);
  letter-spacing: 0.04em;
}

.raka__tier-desc {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}

.raka__tier-perks {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.raka__tier-perk {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--tmpl-fg, #2B2520);
}
.raka__tier-check {
  color: var(--tmpl-accent, #D4A843);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.raka__tier-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid var(--tmpl-border, #E0D8C4);
  border-radius: 8px;
  background: transparent;
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--tmpl-fg, #2B2520);
  cursor: pointer;
  transition: all 200ms ease;
}
.raka__tier-btn:hover {
  border-color: var(--tmpl-accent, #D4A843);
  background: var(--tmpl-accent-soft, #F5EDD0);
}
.raka__tier-btn--primary {
  background: var(--tmpl-accent, #D4A843);
  border-color: var(--tmpl-accent, #D4A843);
  color: var(--tmpl-fg, #2B2520);
}
.raka__tier-btn--primary:hover {
  background: color-mix(in srgb, var(--tmpl-accent, #D4A843) 85%, black);
}

/* Recent supporters */
.raka__supporters-recent {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--tmpl-border, #E0D8C4);
}
.raka__supporters-label {
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0 0 1rem;
}
.raka__supporters-ticker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.raka__supporter-chip {
  padding: 0.375rem 0.875rem;
  background: color-mix(in srgb, var(--tmpl-accent, #D4A843) 10%, transparent);
  border-radius: 999px;
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.6875rem;
  color: var(--tmpl-fg, #2B2520);
}

/* === Milestones === */
.raka__milestones {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.raka__milestone {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
.raka__milestone--visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .raka__milestone {
    opacity: 1;
    transform: none;
  }
}

.raka__milestone-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}
.raka__milestone-icon {
  font-size: 1.25rem;
  line-height: 1;
}
.raka__milestone-label {
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--tmpl-fg, #2B2520);
}

.raka__milestone-bar {
  width: 100%;
  height: 10px;
  background: var(--tmpl-surface, #F3EDD8);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.raka__milestone-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--tmpl-accent, #D4A843), color-mix(in srgb, var(--tmpl-accent, #D4A843) 70%, white));
  border-radius: 999px;
  transition: width 1200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.raka__milestone-desc {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0 0 0.25rem;
}
.raka__milestone-progress {
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}

/* === Posts === */
.raka__posts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
@media (min-width: 640px) {
  .raka__posts {
    grid-template-columns: 1fr 1fr;
    gap: 0 2.5rem;
  }
}

.raka__post {
  border-top: 1px solid var(--tmpl-border, #E0D8C4);
  padding: 2rem 0;
  cursor: pointer;
  transition: all 200ms ease;
}
.raka__post:hover {
  padding-left: 0.5rem;
}

.raka__post-meta {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.raka__post-date {
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
}
.raka__post-read {
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
}

.raka__post-title {
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--tmpl-fg, #2B2520);
  margin: 0 0 0.5rem;
  transition: color 200ms ease;
}
.raka__post:hover .raka__post-title {
  color: var(--tmpl-accent, #D4A843);
}

.raka__post-excerpt {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}

.raka__posts-more {
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0.875rem;
  border: 1.5px solid var(--tmpl-border, #E0D8C4);
  border-radius: 8px;
  background: transparent;
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--tmpl-fg, #2B2520);
  cursor: pointer;
  transition: all 200ms ease;
}
.raka__posts-more:hover {
  border-color: var(--tmpl-accent, #D4A843);
  background: var(--tmpl-accent-soft, #F5EDD0);
}

/* === Testimoni === */
.raka__testimoni-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.raka__testimoni {
  border-top: 1px solid var(--tmpl-border, #E0D8C4);
  padding: 2.5rem 0;
  max-width: 640px;
  margin: 0;
}
.raka__testimoni-quote {
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-style: italic;
  font-size: 2.5rem;
  line-height: 0.8;
  color: var(--tmpl-accent, #D4A843);
  margin-bottom: 0.5rem;
}
.raka__testimoni-text {
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.55;
  color: var(--tmpl-fg, #2B2520);
  margin: 0 0 1.25rem;
  padding: 0;
  border: 0;
}
.raka__testimoni-attr {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}

/* === FAQ === */
.raka__faq {
  display: flex;
  flex-direction: column;
}
.raka__faq-item {
  border-bottom: 1px solid var(--tmpl-border, #E0D8C4);
}
.raka__faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 0;
  background: none;
  border: none;
  font-family: var(--tmpl-font-display, 'Cardo', Georgia, serif);
  font-size: 1rem;
  font-weight: 500;
  color: var(--tmpl-fg, #2B2520);
  cursor: pointer;
  text-align: left;
  transition: color 200ms ease;
}
.raka__faq-q:hover {
  color: var(--tmpl-accent, #D4A843);
}
.raka__faq-item--open .raka__faq-q {
  color: var(--tmpl-accent, #D4A843);
}

.raka__faq-toggle {
  font-family: var(--tmpl-font-mono, 'JetBrains Mono', monospace);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--tmpl-accent, #D4A843);
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.raka__faq-a {
  padding: 0 0 1.5rem;
}
.raka__faq-a p {
  font-family: var(--tmpl-font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--tmpl-muted, #7A6E60);
  margin: 0;
}
</style>
