<script setup lang="ts">
/**
 * architecture-2.vue — Bukit Hijau
 * Real estate developer. Inter Tight Black H1, Inter body, JetBrains Mono for data.
 *
 * 8 sections: Hero+3D, Proyek (6), Unit (grid+floor plan), KPR Calculator,
 * Fasilitas (12), Lokasi+map, Kontak, Footer
 *
 * Palette: bukit (light, moss green accent)
 * Typography: bukit (Inter Tight Black + Inter + JetBrains Mono)
 * 3D: orbit-product preset, balanced intensity
 */
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('architecture-2')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme
useScrollReveal('architecture-2')

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeProject = ref<number | null>(null)
const compareUnits = ref<number[]>([])

onMounted(() => { setTimeout(() => { heroLoaded.value = true }, 120) })

// ============================================================
// DATA — 6 Property Projects
// ============================================================
const projects = [
  {
    id: 0, name: 'Bukit Hijau BSD', location: 'BSD City, Tangerang Selatan',
    type: 'Rumah', price: 1850000000, priceLabel: 'Rp 1,85 Miliar',
    sqm: 108, bedrooms: 3, bathrooms: 2,
    status: 'Tersedia', statusClass: 'bh-status--available',
    desc: 'Cluster premium BSD City. 8 menit ke AEON Mall, 12 menit ke Stasiun KRL. SHM lengkap.',
    units: 48, unitsLeft: 12,
  },
  {
    id: 1, name: 'Bukit Hijau Alam Sutera', location: 'Alam Sutera, Tangerang',
    type: 'Rumah', price: 2400000000, priceLabel: 'Rp 2,4 Miliar',
    sqm: 140, bedrooms: 4, bathrooms: 3,
    status: 'Tersedia', statusClass: 'bh-status--available',
    desc: 'Townhouse 2 lantai premium. 5 menit ke IKEA, akses langsung Tol Jakarta-Serpong.',
    units: 32, unitsLeft: 8,
  },
  {
    id: 2, name: 'Bukit Hijau PIK 2', location: 'Pantai Indah Kapuk 2, Jakarta Utara',
    type: 'Apartemen', price: 650000000, priceLabel: 'Rp 650 Juta',
    sqm: 45, bedrooms: 1, bathrooms: 1,
    status: 'Sisa 5 Unit', statusClass: 'bh-status--selling',
    desc: 'Studio dan 1BR view laut. Infinity pool, gym, coworking. 10 menit ke Bandara.',
    units: 120, unitsLeft: 5,
  },
  {
    id: 3, name: 'Bukit Hijau Sentul', location: 'Sentul City, Bogor',
    type: 'Rumah', price: 1200000000, priceLabel: 'Rp 1,2 Miliar',
    sqm: 90, bedrooms: 3, bathrooms: 2,
    status: 'Tersedia', statusClass: 'bh-status--available',
    desc: 'Rumah tapak kaki Gunung Pancar. Udara sejuk, view pegunungan. 15 menit ke tol.',
    units: 60, unitsLeft: 22,
  },
  {
    id: 4, name: 'Bukit Hijau Cibubur', location: 'Cibubur, Jakarta Timur',
    type: 'Rumah', price: 980000000, priceLabel: 'Rp 980 Juta',
    sqm: 72, bedrooms: 3, bathrooms: 2,
    status: 'Tersedia', statusClass: 'bh-status--available',
    desc: 'Cluster keluarga muda. 5 menit ke tol Jagorawi, 10 menit ke Mall Ciputra. Smart home.',
    units: 80, unitsLeft: 35,
  },
  {
    id: 5, name: 'Bukit Hijau Lembang', location: 'Lembang, Bandung',
    type: 'Rumah', price: 3200000000, priceLabel: 'Rp 3,2 Miliar',
    sqm: 180, bedrooms: 4, bathrooms: 3,
    status: 'Pre-Launch', statusClass: 'bh-status--coming',
    desc: 'Villa retreat 1.300 mdpl. Kayu jati, batu alam, kolam renang pribadi.',
    units: 24, unitsLeft: 24,
  },
]

// ============================================================
// DATA — Unit Types
// ============================================================
const unitTypes = [
  { id: 0, name: 'Tipe 36/72', building: 36, land: 72, bedrooms: 2, bathrooms: 1, price: 'Rp 480 Jt', priceNum: 480000000, carport: 1, cluster: 'Cibubur' },
  { id: 1, name: 'Tipe 45/84', building: 45, land: 84, bedrooms: 2, bathrooms: 1, price: 'Rp 650 Jt', priceNum: 650000000, carport: 1, cluster: 'Cibubur, Sentul' },
  { id: 2, name: 'Tipe 60/108', building: 60, land: 108, bedrooms: 3, bathrooms: 2, price: 'Rp 1,2 M', priceNum: 1200000000, carport: 1, cluster: 'BSD, Sentul' },
  { id: 3, name: 'Tipe 70/140', building: 70, land: 140, bedrooms: 3, bathrooms: 2, price: 'Rp 1,85 M', priceNum: 1850000000, carport: 2, cluster: 'BSD, Alam Sutera' },
  { id: 4, name: 'Tipe 90/180', building: 90, land: 180, bedrooms: 4, bathrooms: 3, price: 'Rp 2,4 M', priceNum: 2400000000, carport: 2, cluster: 'Alam Sutera' },
  { id: 5, name: 'Tipe 120/200', building: 120, land: 200, bedrooms: 4, bathrooms: 3, price: 'Rp 3,2 M', priceNum: 3200000000, carport: 2, cluster: 'Lembang' },
]

// ============================================================
// KPR CALCULATOR (real 2025 Sinarmas rates)
// ============================================================
const kprPrice = ref(1850000000)
const kprDpPercent = ref(20)
const kprTenor = ref(20)
const kprRate = ref(8.5)
const kprRatePreset = ref('floating')

const ratePresets = [
  { key: 'floating', label: 'Floating 8,5%', rate: 8.5, desc: 'BCA, Mandiri, BNI, BRI' },
  { key: 'fix2', label: 'Fix 2 thn 1,88%', rate: 1.88, desc: 'Sinarmas Land, min 10 thn' },
  { key: 'fix3', label: 'Fix 3 thn 3,23%', rate: 3.23, desc: 'Sinarmas Land, min 10 thn' },
  { key: 'fix3alt', label: 'Fix 3 thn 4,35%', rate: 4.35, desc: 'Sinarmas Land, tenor panjang' },
]

function selectRate(preset: typeof ratePresets[0]) {
  kprRatePreset.value = preset.key
  kprRate.value = preset.rate
}

const kprDp = computed(() => kprPrice.value * (kprDpPercent.value / 100))
const kprPokok = computed(() => kprPrice.value - kprDp.value)
const kprTenorBulan = computed(() => kprTenor.value * 12)
const kprBulanRate = computed(() => kprRate.value / 100 / 12)

const kprCicilan = computed(() => {
  const P = kprPokok.value
  const r = kprBulanRate.value
  const n = kprTenorBulan.value
  if (r === 0) return P / n
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
})

const kprTotalBayar = computed(() => kprCicilan.value * kprTenorBulan.value)
const kprTotalBunga = computed(() => kprTotalBayar.value - kprPokok.value)

function formatRp(n: number): string {
  if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1).replace('.', ',')} Miliar`
  if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(0)} Juta`
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`
}

function formatRpFull(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`
}

// ============================================================
// UNIT COMPARISON
// ============================================================
const compareSlots = computed(() => {
  return compareUnits.value.map(id => unitTypes.find(u => u.id === id)).filter(Boolean)
})

function toggleCompare(id: number) {
  const idx = compareUnits.value.indexOf(id)
  if (idx >= 0) compareUnits.value.splice(idx, 1)
  else if (compareUnits.value.length < 3) compareUnits.value.push(id)
}

// ============================================================
// AMENITIES (12)
// ============================================================
const amenities = [
  { icon: 'i-lucide-waves', name: 'Kolam Renang', desc: 'Dewasa dan anak, 06-21' },
  { icon: 'i-lucide-dumbbell', name: 'Gym & Fitness', desc: 'Technogym, 24 jam' },
  { icon: 'i-lucide-trees', name: 'Taman Tematik', desc: 'Playground dan jogging 1,2 km' },
  { icon: 'i-lucide-baby', name: 'Playground', desc: 'Lantai karet aman' },
  { icon: 'i-lucide-book-open', name: 'Perpustakaan', desc: '2.000 koleksi' },
  { icon: 'i-lucide-shield-check', name: 'Keamanan 24 Jam', desc: 'CCTV, one-gate system' },
  { icon: 'i-lucide-heart', name: 'Mushola', desc: 'Kapasitas 80 jamaah' },
  { icon: 'i-lucide-cross', name: 'Klinik', desc: 'Senin-Sabtu 08-20' },
  { icon: 'i-lucide-store', name: 'Minimarket', desc: 'Indomaret dan Alfamart' },
  { icon: 'i-lucide-bus', name: 'Shuttle Bus', desc: 'Stasiun KRL dan mall' },
  { icon: 'i-lucide-zap', name: 'Smart Home', desc: 'Smart lock, lighting, AC' },
  { icon: 'i-lucide-leaf', name: 'Area Hijau', desc: '30% ruang terbuka hijau' },
]

// ============================================================
// SITE VISIT BOOKING
// ============================================================
const visitCluster = ref('')
const visitDate = ref('')
const visitTime = ref('')
const visitName = ref('')
const visitPhone = ref('')
const visitSlots = ['09.00', '11.00', '14.00', '16.00']

function submitSiteVisit() {
  const msg = [
    'Halo Bukit Hijau, saya ingin menjadwalkan kunjungan site.',
    '', `Nama: ${visitName.value}`, `Telepon: ${visitPhone.value}`,
    `Cluster: ${visitCluster.value}`, `Tanggal: ${visitDate.value}`,
    `Jam: ${visitTime.value}`, '', 'Mohon konfirmasi. Terima kasih.',
  ].join('\n')
  window.open(`https://wa.me/6285188627365?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
}

// ============================================================
// NAV & WHATSAPP
// ============================================================
const navLinks = [
  { label: 'Proyek', href: '#proyek' },
  { label: 'Unit', href: '#unit' },
  { label: 'KPR', href: '#kpr' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Kontak', href: '#kontak' },
]

const waUrl = computed(() => {
  const msg = 'Halo Bukit Hijau, saya tertarik dengan properti Anda. Bisa info lebih lanjut?'
  return `https://wa.me/6285188627365?text=${encodeURIComponent(msg)}`
})
</script>

<template>
  <div class="bh" :style="styles">
    <TemplateBack />

    <!-- NAVBAR -->
    <TmplNavbar
      brand="Bukit Hijau"
      :links="navLinks"
      accent="var(--tmpl-accent)"
      bg="var(--tmpl-surface-elevated)"
      text="var(--tmpl-fg)"
      style="transparent"
      :show-theme-toggle="false"
      :show-whatsapp-cta="true"
      force-mode="light"
    />

    <!-- ============================================================ -->
    <!-- SECTION 1: HERO + 3D -->
    <!-- ============================================================ -->
    <section id="hero" data-section class="bh-hero">
      <div class="bh-hero__3d">
        <TmplExperienceCanvas
          preset="orbit-product"
          :accent="tpl.accentColor"
          intensity="balanced"
          label="Bukit Hijau cluster flyover"
        />
      </div>
      <div class="bh-hero__overlay" />
      <div class="bh-hero__content">
        <Transition enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 translate-y-6" enter-to-class="opacity-100 translate-y-0">
          <div v-if="heroLoaded">
            <p class="bh-mono-label">Developer Properti Sejak 1989</p>
            <h1 :style="h1Style" class="bh-h1">Properti yang layak dihuni.</h1>
            <p class="bh-hero__sub">6 cluster di Jabodetabek dan Bandung. Mulai Rp 480 Juta, KPR mulai Rp 3,8 juta/bulan.</p>
            <div class="bh-hero__cta">
              <a href="#proyek" class="bh-btn bh-btn--primary">Lihat Proyek</a>
              <a :href="waUrl" target="_blank" rel="noopener" class="bh-btn bh-btn--ghost">Konsultasi WhatsApp</a>
            </div>
            <div class="bh-hero__stats">
              <span>6 Cluster</span><span>444 Unit</span><span>35 Tahun</span><span>SHM Lengkap</span>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 2: PROYEK (6 projects) -->
    <!-- ============================================================ -->
    <section id="proyek" data-section class="bh-section">
      <div class="bh-container">
        <p class="bh-mono-label">Proyek Kami</p>
        <h2 :style="h2Style" class="bh-h2">6 Cluster, 6 Lokasi</h2>
        <p class="bh-section__desc">Legalitas jelas, akses tol dekat, fasilitas lengkap.</p>

        <div class="bh-project-grid" data-reveal="stagger-children">
          <article
            v-for="p in projects" :key="p.id"
            class="bh-card"
            @click="activeProject = activeProject === p.id ? null : p.id"
          >
            <div class="bh-card__img">
              <span class="bh-card__img-label">{{ p.name }}</span>
            </div>
            <div class="bh-card__body">
              <div class="bh-card__meta">
                <span class="bh-status" :class="p.statusClass">{{ p.status }}</span>
                <span class="bh-card__type">{{ p.type }}</span>
              </div>
              <h3 class="bh-card__title">{{ p.name }}</h3>
              <p class="bh-card__loc">{{ p.location }}</p>
              <p class="bh-card__price">{{ p.priceLabel }}</p>
              <div class="bh-card__specs">
                <span>{{ p.sqm }} m&sup2;</span><span>{{ p.bedrooms }} KT</span><span>{{ p.bathrooms }} KM</span>
              </div>
              <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-40" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 max-h-0">
                <div v-if="activeProject === p.id" class="bh-card__expand">
                  <p class="bh-card__desc">{{ p.desc }}</p>
                  <div class="bh-card__actions">
                    <a :href="waUrl" target="_blank" rel="noopener" class="bh-btn bh-btn--primary bh-btn--sm" @click.stop>Chat Marketing</a>
                  </div>
                </div>
              </Transition>
              <p class="bh-card__stock">{{ p.unitsLeft }} dari {{ p.units }} unit tersisa</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 3: UNIT GRID + FLOOR PLAN -->
    <!-- ============================================================ -->
    <section id="unit" data-section class="bh-section bh-section--alt">
      <div class="bh-container">
        <div class="bh-section__header">
          <div>
            <p class="bh-mono-label">Tipe Unit</p>
            <h2 :style="h2Style" class="bh-h2">Pilih Sesuai Kebutuhan</h2>
          </div>
          <p class="bh-section__hint">Klik unit untuk pilih. Pilih hingga 3 unit untuk dibandingkan.</p>
        </div>

        <div class="bh-unit-grid" data-reveal="stagger-children">
          <div
            v-for="u in unitTypes" :key="u.id"
            class="bh-unit-card"
            :class="{ 'bh-unit-card--selected': compareUnits.includes(u.id) }"
            @click="toggleCompare(u.id)"
          >
            <div class="bh-unit-card__plan">
              <svg viewBox="0 0 200 150" class="bh-floor-svg">
                <rect x="20" y="15" width="160" height="120" fill="none" stroke="var(--tmpl-accent)" stroke-width="2" />
                <rect x="20" y="15" width="80" height="70" fill="none" stroke="var(--tmpl-border)" stroke-width="1" stroke-dasharray="4,2" />
                <text x="60" y="55" text-anchor="middle" font-size="7" fill="var(--tmpl-muted)">R. Tamu</text>
                <rect x="100" y="15" width="80" height="45" fill="none" stroke="var(--tmpl-border)" stroke-width="1" stroke-dasharray="4,2" />
                <text x="140" y="42" text-anchor="middle" font-size="7" fill="var(--tmpl-muted)">Dapur</text>
                <rect x="20" y="85" width="60" height="50" fill="none" stroke="var(--tmpl-border)" stroke-width="1" stroke-dasharray="4,2" />
                <text x="50" y="115" text-anchor="middle" font-size="7" fill="var(--tmpl-muted)">KT 1</text>
                <rect x="80" y="85" width="60" height="50" fill="none" stroke="var(--tmpl-border)" stroke-width="1" stroke-dasharray="4,2" />
                <text x="110" y="115" text-anchor="middle" font-size="7" fill="var(--tmpl-muted)">KT 2</text>
                <rect x="140" y="85" width="40" height="50" fill="none" stroke="var(--tmpl-border)" stroke-width="1" stroke-dasharray="4,2" />
                <text x="160" y="115" text-anchor="middle" font-size="7" fill="var(--tmpl-muted)">KM</text>
                <line x1="55" y1="85" x2="65" y2="85" stroke="var(--tmpl-accent)" stroke-width="2" />
                <line x1="95" y1="85" x2="105" y2="85" stroke="var(--tmpl-accent)" stroke-width="2" />
              </svg>
              <div v-if="compareUnits.includes(u.id)" class="bh-unit-card__badge">{{ compareUnits.indexOf(u.id) + 1 }}</div>
            </div>
            <h3 class="bh-unit-card__name">{{ u.name }}</h3>
            <p class="bh-unit-card__cluster">{{ u.cluster }}</p>
            <div class="bh-unit-card__info">
              <div class="bh-unit-card__specs">
                <div>Luas: {{ u.building }} m&sup2; / {{ u.land }} m&sup2;</div>
                <div>{{ u.bedrooms }} KT &middot; {{ u.bathrooms }} KM &middot; {{ u.carport }} Carport</div>
              </div>
              <p class="bh-unit-card__price">{{ u.price }}</p>
            </div>
          </div>
        </div>

        <!-- Unit Comparison -->
        <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
          <div v-if="compareSlots.length >= 2" class="bh-compare">
            <p class="bh-mono-label">Perbandingan Unit</p>
            <div class="bh-compare__table-wrap">
              <table class="bh-compare__table">
                <thead>
                  <tr>
                    <th>Spesifikasi</th>
                    <th v-for="s in compareSlots" :key="s!.id">{{ s!.name }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Harga</td><td v-for="s in compareSlots" :key="s!.id" class="bh-compare__bold">{{ s!.price }}</td></tr>
                  <tr><td>Luas Bangunan</td><td v-for="s in compareSlots" :key="s!.id">{{ s!.building }} m&sup2;</td></tr>
                  <tr><td>Luas Tanah</td><td v-for="s in compareSlots" :key="s!.id">{{ s!.land }} m&sup2;</td></tr>
                  <tr><td>Kamar Tidur</td><td v-for="s in compareSlots" :key="s!.id">{{ s!.bedrooms }}</td></tr>
                  <tr><td>Kamar Mandi</td><td v-for="s in compareSlots" :key="s!.id">{{ s!.bathrooms }}</td></tr>
                  <tr><td>Carport</td><td v-for="s in compareSlots" :key="s!.id">{{ s!.carport }}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="bh-compare__actions">
              <a :href="waUrl" target="_blank" rel="noopener" class="bh-btn bh-btn--primary bh-btn--sm">Minta Rekomendasi via WhatsApp</a>
              <button class="bh-btn bh-btn--ghost bh-btn--sm" @click="compareUnits = []">Reset</button>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 4: KPR CALCULATOR -->
    <!-- ============================================================ -->
    <section id="kpr" data-section class="bh-section">
      <div class="bh-container">
        <p class="bh-mono-label">Simulasi KPR</p>
        <h2 :style="h2Style" class="bh-h2">Hitung Cicilan Anda</h2>
        <p class="bh-section__desc">Masukkan harga, pilih DP dan tenor. Hasil langsung berubah.</p>

        <div class="bh-kpr">
          <!-- Input -->
          <div class="bh-kpr__input">
            <div class="bh-kpr__field">
              <label class="bh-kpr__label">Harga Unit</label>
              <div class="bh-kpr__slider-row">
                <input v-model.number="kprPrice" type="range" :min="300000000" :max="8000000000" :step="50000000" class="bh-range" />
                <span class="bh-kpr__value">{{ formatRp(kprPrice) }}</span>
              </div>
            </div>
            <div class="bh-kpr__field">
              <label class="bh-kpr__label">Down Payment (DP)</label>
              <div class="bh-kpr__slider-row">
                <input v-model.number="kprDpPercent" type="range" :min="5" :max="50" :step="5" class="bh-range" />
                <span class="bh-kpr__value">{{ kprDpPercent }}%</span>
              </div>
              <p class="bh-kpr__hint">DP: {{ formatRp(kprDp) }}</p>
            </div>
            <div class="bh-kpr__field">
              <label class="bh-kpr__label">Tenor</label>
              <div class="bh-kpr__chips">
                <button v-for="t in [15, 20, 25, 30]" :key="t" class="bh-chip" :class="{ 'bh-chip--active': kprTenor === t }" @click="kprTenor = t">{{ t }} tahun</button>
              </div>
            </div>
            <div class="bh-kpr__field">
              <label class="bh-kpr__label">Suku Bunga</label>
              <div class="bh-kpr__rates">
                <button v-for="rp in ratePresets" :key="rp.key" class="bh-rate-btn" :class="{ 'bh-rate-btn--active': kprRatePreset === rp.key }" @click="selectRate(rp)">
                  <span class="bh-rate-btn__label">{{ rp.label }}</span>
                  <span class="bh-rate-btn__desc">{{ rp.desc }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="bh-kpr__result">
            <p class="bh-mono-label">Hasil Simulasi</p>
            <div class="bh-kpr__rows">
              <div class="bh-kpr__row"><span>Pokok Pinjaman</span><span class="bh-kpr__row-val">{{ formatRpFull(kprPokok) }}</span></div>
              <div class="bh-kpr__row"><span>Total Bunga</span><span class="bh-kpr__row-val">{{ formatRpFull(kprTotalBunga) }}</span></div>
            </div>
            <div class="bh-kpr__big">
              <p class="bh-kpr__big-label">Cicilan per Bulan</p>
              <p class="bh-kpr__big-num">{{ formatRpFull(kprCicilan) }}</p>
              <p class="bh-kpr__big-sub">untuk {{ kprTenor }} tahun &middot; bunga {{ kprRate }}%</p>
            </div>
            <div class="bh-kpr__row"><span>Total Bayar</span><span class="bh-kpr__row-val bh-kpr__row-val--lg">{{ formatRpFull(kprTotalBayar) }}</span></div>
            <a
              :href="`https://wa.me/6285188627365?text=${encodeURIComponent(`Halo Bukit Hijau, saya ingin info KPR.\n\nHarga: ${formatRp(kprPrice)}\nDP: ${kprDpPercent}% (${formatRp(kprDp)})\nTenor: ${kprTenor} tahun\nBunga: ${kprRate}%\nCicilan: ${formatRpFull(kprCicilan)}/bulan\n\nMohon info penawaran terbaru. Terima kasih.`)}`"
              target="_blank" rel="noopener"
              class="bh-btn bh-btn--primary bh-kpr__cta"
            >Hubungi Marketing untuk Penawaran</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 5: FASILITAS (12 amenities) -->
    <!-- ============================================================ -->
    <section id="fasilitas" data-section class="bh-section bh-section--alt">
      <div class="bh-container">
        <p class="bh-mono-label">Fasilitas Cluster</p>
        <h2 :style="h2Style" class="bh-h2">Lengkap untuk Keluarga</h2>
        <p class="bh-section__desc">Fasilitas untuk kenyamanan penghuni sehari-hari.</p>
        <div class="bh-amenity-grid" data-reveal="stagger-children">
          <div v-for="a in amenities" :key="a.name" class="bh-amenity">
            <UIcon :name="a.icon" class="bh-amenity__icon" />
            <h4 class="bh-amenity__name">{{ a.name }}</h4>
            <p class="bh-amenity__desc">{{ a.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 6: LOKASI + MAP -->
    <!-- ============================================================ -->
    <section id="lokasi" data-section class="bh-section">
      <div class="bh-container">
        <p class="bh-mono-label">Lokasi</p>
        <h2 :style="h2Style" class="bh-h2">Akses Mudah ke Mana-mana</h2>
        <p class="bh-section__desc">Dekat tol, KRL, sekolah internasional, dan rumah sakit.</p>
        <div class="bh-location">
          <div class="bh-location__map">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.5%2C-6.5%2C107.0%2C-6.2&layer=mapnik"
              loading="lazy"
              title="Peta lokasi Bukit Hijau"
            />
          </div>
          <div class="bh-location__list">
            <div v-for="p in projects" :key="p.id" class="bh-location__item">
              <UIcon name="i-lucide-map-pin" class="bh-location__pin" />
              <div>
                <p class="bh-location__name">{{ p.name }}</p>
                <p class="bh-location__addr">{{ p.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 7: KONTAK + SITE VISIT -->
    <!-- ============================================================ -->
    <section id="kontak" data-section class="bh-section bh-section--alt">
      <div class="bh-container">
        <div class="bh-contact">
          <!-- Register interest -->
          <div>
            <p class="bh-mono-label">Daftar Minat</p>
            <h2 :style="h2Style" class="bh-h2">Dapatkan Price List Terbaru</h2>
            <p class="bh-section__desc">Isi formulir. Marketing menghubungi dalam 1x24 jam.</p>
            <form class="bh-form" @submit.prevent="window.open(waUrl, '_blank', 'noopener,noreferrer')">
              <div class="bh-form__field">
                <label class="bh-form__label">Nama Lengkap</label>
                <input type="text" required class="bh-form__input" placeholder="Nama Anda" />
              </div>
              <div class="bh-form__field">
                <label class="bh-form__label">WhatsApp</label>
                <input type="tel" required class="bh-form__input" placeholder="+62 812-xxxx-xxxx" />
              </div>
              <div class="bh-form__field">
                <label class="bh-form__label">Cluster yang Diminati</label>
                <select class="bh-form__input">
                  <option value="">Pilih cluster</option>
                  <option v-for="p in projects" :key="p.id" :value="p.name">{{ p.name }} - {{ p.location }}</option>
                </select>
              </div>
              <button type="submit" class="bh-btn bh-btn--primary bh-form__submit">Kirim via WhatsApp</button>
            </form>
          </div>

          <!-- Site visit booking -->
          <div>
            <p class="bh-mono-label">Jadwalkan Kunjungan</p>
            <h2 :style="h2Style" class="bh-h2">Lihat Langsung di Lokasi</h2>
            <p class="bh-section__desc">Marketing mendampingi. Antar-jemput gratis dari luar kota.</p>
            <form class="bh-form" @submit.prevent="submitSiteVisit">
              <div class="bh-form__field">
                <label class="bh-form__label">Nama</label>
                <input v-model="visitName" type="text" required class="bh-form__input" placeholder="Nama Anda" />
              </div>
              <div class="bh-form__field">
                <label class="bh-form__label">Telepon</label>
                <input v-model="visitPhone" type="tel" required class="bh-form__input" placeholder="+62 812-xxxx-xxxx" />
              </div>
              <div class="bh-form__field">
                <label class="bh-form__label">Cluster</label>
                <select v-model="visitCluster" required class="bh-form__input">
                  <option value="">Pilih cluster</option>
                  <option v-for="p in projects" :key="p.id" :value="p.name">{{ p.name }}</option>
                </select>
              </div>
              <div class="bh-form__row">
                <div class="bh-form__field">
                  <label class="bh-form__label">Tanggal</label>
                  <input v-model="visitDate" type="date" required class="bh-form__input" />
                </div>
                <div class="bh-form__field">
                  <label class="bh-form__label">Jam</label>
                  <select v-model="visitTime" required class="bh-form__input">
                    <option value="">Pilih jam</option>
                    <option v-for="s in visitSlots" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="bh-btn bh-btn--outline bh-form__submit">Jadwalkan Kunjungan</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 8: FOOTER -->
    <!-- ============================================================ -->
    <footer class="bh-footer" data-reveal="fade-up">
      <div class="bh-container">
        <div class="bh-footer__grid" data-reveal="stagger-children">
          <div>
            <p class="bh-footer__brand">Bukit Hijau</p>
            <p class="bh-footer__about">Developer properti sejak 1989. 12.000+ unit di 15 kota. Legalitas jelas, after-sales terjamin.</p>
            <p class="bh-footer__legal">PT Bukit Hijau Development Indonesia<br />NPWP 01.234.567.8-901.000</p>
          </div>
          <div>
            <p class="bh-footer__title">Cluster</p>
            <ul class="bh-footer__list">
              <li v-for="p in projects" :key="p.id"><a href="#proyek">{{ p.name }}</a></li>
            </ul>
          </div>
          <div>
            <p class="bh-footer__title">Menu</p>
            <ul class="bh-footer__list">
              <li v-for="link in navLinks" :key="link.href"><a :href="link.href">{{ link.label }}</a></li>
            </ul>
          </div>
          <div>
            <p class="bh-footer__title">Hubungi</p>
            <a :href="waUrl" target="_blank" rel="noopener" class="bh-footer__wa">
              <svg class="bh-footer__wa-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat WhatsApp
            </a>
            <p class="bh-footer__hours">Senin-Sabtu 09.00-18.00 WIB</p>
          </div>
        </div>
        <div class="bh-footer__bottom">
          <p>&copy; {{ new Date().getFullYear() }} Bukit Hijau. PT Bukit Hijau Development Indonesia. Izin DPMPTSP No. XXX.</p>
          <p>Dibuat dengan AjoClub</p>
        </div>
      </div>
    </footer>

    <!-- WHATSAPP FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="architecture"
    />
  </div>
</template>

<style scoped>
/* ============================================================
   BUKIT HIJAU — Scoped styles
   ============================================================ */
.bh { min-height: 100vh; }

/* Hero */
.bh-hero { position: relative; min-height: 100vh; display: flex; align-items: center; padding-top: 4rem; overflow: hidden; }
.bh-hero__3d { position: absolute; inset: 0; z-index: 0; }
.bh-hero__3d :deep(canvas) { width: 100% !important; height: 100% !important; }
.bh-hero__overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(135deg, oklch(99% 0.005 145 / 0.92), oklch(99% 0.005 145 / 0.7)); }
.bh-hero__content { position: relative; z-index: 2; width: 100%; max-width: 72rem; margin: 0 auto; padding: 5rem 1.5rem; }
.bh-hero__sub { font-size: clamp(0.95rem, 1.1vw, 1.1rem); max-width: 36rem; margin-bottom: 2rem; color: var(--tmpl-muted); line-height: 1.7; }
.bh-hero__cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2.5rem; }
.bh-hero__stats { display: flex; flex-wrap: wrap; gap: 2rem; font-family: var(--tmpl-font-mono); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--tmpl-muted); }

/* Mono label */
.bh-mono-label { font-family: var(--tmpl-font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem; color: var(--tmpl-accent); }

/* Headings — Inter Tight Black, 3 sizes max */
.bh-h1 { margin-bottom: 1.5rem; font-family: var(--tmpl-font-heading, 'Inter Tight', sans-serif); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; }
.bh-h2 { margin-bottom: 1rem; font-family: var(--tmpl-font-heading, 'Inter Tight', sans-serif); font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; }

/* Container */
.bh-container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; }

/* Section */
.bh-section { padding: 80px 0; border-top: 1px solid var(--tmpl-border); }
.bh-section--alt { background: var(--tmpl-surface); }
.bh-section__desc { font-size: 0.875rem; margin-bottom: 3rem; max-width: 32rem; color: var(--tmpl-muted); line-height: 1.7; }
.bh-section__header { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
@media (min-width: 768px) { .bh-section__header { flex-direction: row; align-items: flex-end; justify-content: space-between; } }
.bh-section__hint { font-size: 0.75rem; color: var(--tmpl-muted); }

/* Buttons */
.bh-btn { display: inline-flex; align-items: center; justify-content: center; height: 2.75rem; padding: 0 1.5rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 200ms ease; cursor: pointer; border: none; }
.bh-btn:hover { transform: translateY(-1px); }
.bh-btn--primary { background: var(--tmpl-accent); color: var(--tmpl-accent-fg); }
.bh-btn--ghost { border: 1px solid var(--tmpl-border); color: var(--tmpl-fg); background: transparent; }
.bh-btn--outline { border: 1px solid var(--tmpl-accent); color: var(--tmpl-accent); background: transparent; }
.bh-btn--sm { height: 2.25rem; padding: 0 1rem; font-size: 0.75rem; }
.bh-form__submit { width: 100%; }

/* Project grid — asymmetric: 1fr 1.4fr on desktop */
.bh-project-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 768px) { .bh-project-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .bh-project-grid { grid-template-columns: 1fr 1.4fr 1fr; } }

/* Card */
.bh-card { border-radius: 8px; border: 1px solid var(--tmpl-border); background: var(--tmpl-surface-elevated); transition: all 300ms ease; cursor: pointer; overflow: hidden; }
.bh-card:hover { box-shadow: 0 4px 24px oklch(22% 0.012 60 / 0.08); }
.bh-card__img { aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; background: var(--tmpl-surface); border-radius: 8px 8px 0 0; }
.bh-card__img-label { font-family: var(--tmpl-font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tmpl-muted); }
.bh-card__body { padding: 1.25rem; }
.bh-card__meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.bh-card__type { font-family: var(--tmpl-font-mono); font-size: 11px; color: var(--tmpl-muted); }
.bh-card__title { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--tmpl-fg); font-family: var(--tmpl-font-heading, 'Inter Tight', sans-serif); }
.bh-card__loc { font-size: 0.75rem; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-card__price { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem; font-variant-numeric: tabular-nums; color: var(--tmpl-fg); }
.bh-card__specs { display: flex; gap: 1rem; font-family: var(--tmpl-font-mono); font-size: 11px; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-card__expand { overflow: hidden; }
.bh-card__desc { font-size: 0.875rem; line-height: 1.6; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-card__actions { display: flex; gap: 0.5rem; }
.bh-card__stock { font-family: var(--tmpl-font-mono); font-size: 10px; margin-top: 0.5rem; color: var(--tmpl-muted); }

/* Status badges */
.bh-status { font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.125rem 0.5rem; border-radius: 4px; }
.bh-status--available { background: oklch(94% 0.025 145); color: oklch(48% 0.13 145); }
.bh-status--selling { background: oklch(94% 0.06 60); color: oklch(50% 0.16 60); }
.bh-status--coming { background: oklch(94% 0.01 240); color: oklch(50% 0.04 240); }

/* Unit grid — asymmetric 1fr 1.2fr on desktop */
.bh-unit-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 768px) { .bh-unit-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .bh-unit-grid { grid-template-columns: 1fr 1.2fr; } }

.bh-unit-card { border-radius: 8px; border: 1px solid var(--tmpl-border); padding: 1.25rem; transition: all 200ms ease; cursor: pointer; background: var(--tmpl-surface-elevated); }
.bh-unit-card--selected { border-color: var(--tmpl-accent); box-shadow: 0 0 0 1px var(--tmpl-accent); }
.bh-unit-card__plan { aspect-ratio: 4/3; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: var(--tmpl-surface); }
.bh-floor-svg { width: 100%; height: 100%; padding: 1rem; }
.bh-unit-card__badge { position: absolute; top: 0.5rem; right: 0.5rem; width: 1.5rem; height: 1.5rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: var(--tmpl-accent); color: var(--tmpl-accent-fg); }
.bh-unit-card__name { font-size: 0.875rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--tmpl-fg); font-family: var(--tmpl-font-heading, 'Inter Tight', sans-serif); }
.bh-unit-card__cluster { font-size: 0.75rem; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-unit-card__info { display: flex; justify-content: space-between; align-items: flex-end; }
.bh-unit-card__specs { font-family: var(--tmpl-font-mono); font-size: 11px; color: var(--tmpl-muted); line-height: 1.6; }
.bh-unit-card__price { font-size: 1rem; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--tmpl-fg); }

/* Compare */
.bh-compare { margin-top: 3rem; border-radius: 8px; border: 1px solid var(--tmpl-accent); padding: 1.5rem; background: var(--tmpl-surface-elevated); }
.bh-compare__table-wrap { overflow-x: auto; margin-top: 1rem; }
.bh-compare__table { width: 100%; font-size: 0.875rem; border-collapse: collapse; }
.bh-compare__table th { text-align: left; padding: 0.5rem 1rem 0.5rem 0; font-family: var(--tmpl-font-mono); font-size: 10px; text-transform: uppercase; color: var(--tmpl-muted); border-bottom: 1px solid var(--tmpl-border); }
.bh-compare__table td { text-align: left; padding: 0.5rem 1rem 0.5rem 0; font-family: var(--tmpl-font-mono); font-size: 12px; color: var(--tmpl-muted); border-bottom: 1px solid var(--tmpl-border); }
.bh-compare__bold { font-weight: 700; color: var(--tmpl-fg); }
.bh-compare__actions { display: flex; gap: 0.75rem; margin-top: 1rem; }

/* KPR — asymmetric 1.2fr 1fr */
.bh-kpr { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1024px) { .bh-kpr { grid-template-columns: 1.2fr 1fr; } }
.bh-kpr__input { display: flex; flex-direction: column; gap: 1.5rem; }
.bh-kpr__field { display: flex; flex-direction: column; gap: 0.5rem; }
.bh-kpr__label { font-family: var(--tmpl-font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--tmpl-muted); }
.bh-kpr__slider-row { display: flex; align-items: center; gap: 0.75rem; }
.bh-kpr__value { font-size: 0.875rem; font-weight: 700; font-variant-numeric: tabular-nums; min-width: 8rem; text-align: right; color: var(--tmpl-fg); }
.bh-kpr__hint { font-family: var(--tmpl-font-mono); font-size: 11px; color: var(--tmpl-muted); }
.bh-range { flex: 1; accent-color: var(--tmpl-accent); }
.bh-kpr__chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.bh-chip { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; border: 1px solid var(--tmpl-border); background: transparent; color: var(--tmpl-fg); cursor: pointer; transition: all 200ms ease; }
.bh-chip--active { background: var(--tmpl-accent); color: var(--tmpl-accent-fg); border-color: var(--tmpl-accent); }
.bh-kpr__rates { display: flex; flex-direction: column; gap: 0.5rem; }
.bh-rate-btn { text-align: left; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--tmpl-border); background: transparent; cursor: pointer; transition: all 200ms ease; }
.bh-rate-btn--active { background: var(--tmpl-accent-soft); border-color: var(--tmpl-accent); }
.bh-rate-btn__label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--tmpl-fg); }
.bh-rate-btn__desc { font-family: var(--tmpl-font-mono); font-size: 11px; color: var(--tmpl-muted); }

/* KPR result */
.bh-kpr__result { border-radius: 8px; border: 1px solid var(--tmpl-border); padding: 1.5rem; background: var(--tmpl-surface-elevated); }
.bh-kpr__rows { margin-bottom: 1.5rem; }
.bh-kpr__row { display: flex; justify-content: space-between; align-items: baseline; padding: 0.75rem 0; border-bottom: 1px solid var(--tmpl-border); font-size: 0.875rem; color: var(--tmpl-muted); }
.bh-kpr__row-val { font-weight: 700; font-variant-numeric: tabular-nums; color: var(--tmpl-fg); }
.bh-kpr__row-val--lg { font-size: 1.125rem; }
.bh-kpr__big { text-align: center; padding: 1.5rem 0; border-bottom: 1px solid var(--tmpl-border); margin-bottom: 1rem; }
.bh-kpr__big-label { font-family: var(--tmpl-font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--tmpl-muted); }
.bh-kpr__big-num { font-size: 2rem; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--tmpl-accent); }
@media (min-width: 768px) { .bh-kpr__big-num { font-size: 2.5rem; } }
.bh-kpr__big-sub { font-family: var(--tmpl-font-mono); font-size: 11px; margin-top: 0.25rem; color: var(--tmpl-muted); }
.bh-kpr__cta { width: 100%; margin-top: 1.5rem; }

/* Amenities — 2col → 3col → 6col asymmetric */
.bh-amenity-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .bh-amenity-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .bh-amenity-grid { grid-template-columns: repeat(6, 1fr); } }
.bh-amenity { border-radius: 8px; border: 1px solid var(--tmpl-border); padding: 1rem; transition: all 200ms ease; background: var(--tmpl-surface-elevated); }
.bh-amenity:hover { box-shadow: 0 2px 12px oklch(22% 0.012 60 / 0.06); }
.bh-amenity__icon { width: 1.5rem; height: 1.5rem; margin-bottom: 0.75rem; color: var(--tmpl-accent); }
.bh-amenity__name { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--tmpl-fg); }
.bh-amenity__desc { font-size: 0.75rem; line-height: 1.5; color: var(--tmpl-muted); }

/* Location — asymmetric 1.2fr 1fr */
.bh-location { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 768px) { .bh-location { grid-template-columns: 1.2fr 1fr; } }
.bh-location__map { border-radius: 8px; overflow: hidden; border: 1px solid var(--tmpl-border); }
.bh-location__map iframe { width: 100%; aspect-ratio: 4/3; border: 0; }
.bh-location__list { display: flex; flex-direction: column; gap: 1rem; }
.bh-location__item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; border-radius: 8px; background: var(--tmpl-surface); }
.bh-location__pin { width: 1rem; height: 1rem; margin-top: 0.125rem; flex-shrink: 0; color: var(--tmpl-accent); }
.bh-location__name { font-size: 0.875rem; font-weight: 600; color: var(--tmpl-fg); }
.bh-location__addr { font-size: 0.75rem; color: var(--tmpl-muted); }

/* Contact — asymmetric 1.3fr 1fr */
.bh-contact { display: grid; grid-template-columns: 1fr; gap: 3rem; }
@media (min-width: 768px) { .bh-contact { grid-template-columns: 1.3fr 1fr; } }

/* Form */
.bh-form { display: flex; flex-direction: column; gap: 1rem; }
.bh-form__field { display: flex; flex-direction: column; gap: 0.25rem; }
.bh-form__label { font-family: var(--tmpl-font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--tmpl-muted); }
.bh-form__input { width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--tmpl-border); font-size: 0.875rem; background: var(--tmpl-surface-elevated); color: var(--tmpl-fg); outline: none; transition: border-color 200ms ease; }
.bh-form__input:focus { border-color: var(--tmpl-accent); }
.bh-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

/* Footer */
.bh-footer { padding: 4rem 0; border-top: 1px solid var(--tmpl-border); }
.bh-footer__grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem; }
@media (min-width: 768px) { .bh-footer__grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
.bh-footer__brand { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--tmpl-fg); font-family: var(--tmpl-font-heading, 'Inter Tight', sans-serif); }
.bh-footer__about { font-size: 0.75rem; line-height: 1.6; margin-bottom: 1rem; color: var(--tmpl-muted); }
.bh-footer__legal { font-family: var(--tmpl-font-mono); font-size: 10px; color: var(--tmpl-muted); }
.bh-footer__title { font-family: var(--tmpl-font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-footer__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.bh-footer__list a { font-size: 0.75rem; text-decoration: none; color: var(--tmpl-fg); transition: color 200ms ease; }
.bh-footer__list a:hover { color: var(--tmpl-accent); }
.bh-footer__wa { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--tmpl-accent); text-decoration: none; }
.bh-footer__wa-icon { width: 1rem; height: 1rem; }
.bh-footer__hours { font-size: 0.75rem; color: var(--tmpl-muted); }
.bh-footer__bottom { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 1.5rem; border-top: 1px solid var(--tmpl-border); font-size: 11px; color: var(--tmpl-muted); }
@media (min-width: 768px) { .bh-footer__bottom { flex-direction: row; justify-content: space-between; align-items: center; } }

/* FAB */
.bh-fab { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 50; }
.bh-fab__popup { position: absolute; bottom: 100%; right: 0; margin-bottom: 0.75rem; width: 18rem; border-radius: 8px; box-shadow: 0 8px 32px oklch(22% 0.012 60 / 0.15); border: 1px solid var(--tmpl-border); padding: 1rem; background: var(--tmpl-surface-elevated); }
.bh-fab__title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--tmpl-fg); }
.bh-fab__desc { font-size: 0.75rem; margin-bottom: 0.75rem; color: var(--tmpl-muted); }
.bh-fab__btn { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.625rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; text-decoration: none; color: #fff; background: #25D366; }
.bh-fab__trigger { width: 3.5rem; height: 3.5rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 4px 16px oklch(22% 0.012 60 / 0.15); background: #25D366; }
.bh-fab__icon { width: 1.5rem; height: 1.5rem; color: #fff; }

@media (prefers-reduced-motion: reduce) {
  .bh-card, .bh-unit-card, .bh-amenity, .bh-btn, .bh-chip, .bh-rate-btn { transition: none; }
  .bh-btn:hover { transform: none; }
}
</style>
