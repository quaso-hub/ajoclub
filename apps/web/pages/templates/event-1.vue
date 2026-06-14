<script setup lang="ts">
/**
 * event-1.vue: DevTalk 2026
 * Indonesian tech conference. Dark, kelly green accent.
 * 10 sections, 12 speakers, 4 ticket tiers, 5 sponsor tiers.
 * 7+ real interactions. Awwwards target.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('event-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme
useScrollReveal('event-1')
const { buildUrl } = useWhatsApp()

// ============================================================
// STATE
// ============================================================
const activeDay = ref(0)
const selectedTier = ref<string>('earlybird')
const selectedTalk = ref<number | null>(null)
const heroLoaded = ref(false)
const spotsLeft = ref(200)
const spotsAnimating = ref(false)
let spotsAnimFrame = 0

onMounted(() => { setTimeout(() => { heroLoaded.value = true }, 100) })
onBeforeUnmount(() => {
  if (spotsAnimFrame) cancelAnimationFrame(spotsAnimFrame)
})

// ============================================================
// SPEAKERS (12)
// ============================================================
const speakers = [
  { id: 1, name: 'Tilyanawaty Sari', role: 'Backend Lead', company: 'GoTo', talk: 'Scaling Postgres ke 10TB tanpa down 1 menit pun', track: 'Backend', day: 0, slot: 0, time: '09:30', bio: 'Postgres replication, logical decoding, dan zero-downtime migration. 12 tahun di GoTo.' },
  { id: 2, name: 'Adi Harun', role: 'Frontend Engineer', company: 'Tokopedia', talk: 'Kenapa kami rewrite dari React ke Svelte (lagi)', track: 'Frontend', day: 0, slot: 1, time: '11:00', bio: 'Lead rewrite Tokopedia checkout dari React ke Svelte. Bundle size turun 40%.' },
  { id: 3, name: 'Pandu Patil', role: 'ML Engineer', company: 'Nodeflux', talk: 'Vector database: kapan tidak perlu, kapan wajib', track: 'AI/ML', day: 1, slot: 0, time: '09:30', bio: 'Membangun pipeline visi komputer untuk kota Jakarta. 40 simpul edge.' },
  { id: 4, name: 'Hilman Ramdan', role: 'DevOps Lead', company: 'Mekari', talk: 'TypeScript 6: apa yang berubah, apa yang tidak', track: 'DevOps', day: 1, slot: 1, time: '11:00', bio: 'Mengelola infrastruktur untuk 10.000 pelanggan SaaS di Mekari.' },
  { id: 5, name: 'Aditya W. Wibowo', role: 'Product Engineer', company: 'Xendit', talk: 'Membaca kode 5 tahun lalu: pelajaran dari technical debt', track: 'Backend', day: 0, slot: 2, time: '14:00', bio: 'Refaktor payment API Xendit yang melayani 300.000+ merchant.' },
  { id: 6, name: 'Putri Sari', role: 'Design Systems', company: 'DANA', talk: 'Membuat design system yang dipakai 40 engineer', track: 'Frontend', day: 0, slot: 3, time: '15:30', bio: 'Membangun dan memelihara komponen UI untuk aplikasi DANA.' },
  { id: 7, name: 'Reza M. Pratama', role: 'API Architect', company: 'Bukalapak', talk: 'Membangun API yang bisa survive 10x traffic', track: 'Backend', day: 1, slot: 2, time: '14:00', bio: 'Arsitektur API gateway Bukalapak untuk 100 juta pengguna.' },
  { id: 8, name: 'Nadia P. Sari', role: 'Data Engineer', company: 'Traveloka', talk: 'Memilih database: case study dari 3 kegagalan kami', track: 'Data', day: 1, slot: 3, time: '15:30', bio: 'Pipeline data real-time untuk inventaris hotel dan pesawat.' },
  { id: 9, name: 'Bayu A. Nugroho', role: 'Security', company: 'Bank Jago', talk: 'Deobfuscating mobile app untuk menemukan bug security', track: 'Security', day: 2, slot: 0, time: '09:30', bio: 'Penetration testing dan security audit aplikasi mobile banking.' },
  { id: 10, name: 'Laksmi D. Cahyani', role: 'Product Manager', company: 'Shopee ID', talk: 'Real-time collaboration: CRDT vs OT, mana yang benar', track: 'Product', day: 2, slot: 1, time: '11:00', bio: 'Membangun fitur kolaborasi real-time untuk 800 juta pengguna.' },
  { id: 11, name: 'Reza W. Pratama', role: 'Mobile Lead', company: 'Glints', talk: 'Telegram Mini Apps: membangun untuk 800 juta user', track: 'Mobile', day: 2, slot: 2, time: '14:00', bio: 'Membangun Glints career platform di dalam Telegram ecosystem.' },
  { id: 12, name: 'Indah Permatasari', role: 'Platform', company: 'Privy', talk: 'Mengelola 1.000 microservice tanpa gila', track: 'Backend', day: 2, slot: 3, time: '15:30', bio: 'Platform engineering untuk e-KYC dan tanda tangan digital.' },
]

// ============================================================
// SCHEDULE (3 days � 4 slots � 3 tracks)
// ============================================================
const dayThemes = [
  { label: 'Hari 1', theme: 'Backend & Frontend', date: 'Sabtu, 17 September' },
  { label: 'Hari 2', theme: 'AI, ML, & DevOps', date: 'Minggu, 18 September' },
  { label: 'Hari 3', theme: 'Mobile, Security, & Product', date: 'Senin, 19 September' },
]

const timeSlots = ['09:30', '11:00', '14:00', '15:30']
const trackNames = ['Panggung Utama', 'Track A', 'Track B']

const scheduleGrid = computed(() => {
  const daySpeakers = speakers.filter(s => s.day === activeDay.value)
  return timeSlots.map((time, slotIdx) => {
    const slotSpeakers = daySpeakers.filter(s => s.slot === slotIdx)
    return {
      time,
      cells: trackNames.map((track, trackIdx) => {
        const sp = slotSpeakers[trackIdx]
        return sp ? { speaker: sp, title: sp.talk } : null
      }),
    }
  })
})

// ============================================================
// TICKETS (4 tiers)
// ============================================================
const tiers = [
  {
    key: 'earlybird', name: 'Early Bird', price: 500000, priceLabel: 'Rp 500.000',
    desc: '200 pendaftar pertama',
    features: ['Akses 3 hari', 'Makan siang + coffee break', 'T-shirt', 'Akses rekaman', 'Grup Telegram'],
    spots: 200,
  },
  {
    key: 'regular', name: 'Regular', price: 1500000, priceLabel: 'Rp 1.500.000',
    desc: 'Mulai 1 Agustus',
    features: ['Semua Early Bird', 'Dinner networking hari 1', 'Sticker pack', 'Diskon 20% tiket tahun depan'],
    spots: 500,
  },
  {
    key: 'vip', name: 'VIP', price: 5000000, priceLabel: 'Rp 5.000.000',
    desc: '50 kursi',
    features: ['Semua Regular', 'Kursi depan (baris 1-3)', '1-on-1 mentoring (2 pembicara)', 'Dinner eksklusif hari 2', 'Goodie bag sponsor'],
    spots: 50,
  },
  {
    key: 'student', name: 'Student', price: 250000, priceLabel: 'Rp 250.000',
    desc: 'Perlu KTM',
    features: ['Akses 3 hari', 'Makan siang', 'Grup mahasiswa', 'Workshop laptop-friendly'],
    spots: 300,
  },
]

const selectedTierData = computed(() => tiers.find(t => t.key === selectedTier.value)!)

function selectTier(key: string) {
  selectedTier.value = key
}

function animateSpots() {
  if (spotsAnimating.value) return
  spotsAnimating.value = true
  const start = 200
  const end = 47
  const duration = 3000
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    spotsLeft.value = Math.round(start + (end - start) * eased)
    if (progress < 1) {
      spotsAnimFrame = requestAnimationFrame(tick)
    }
  }
  spotsAnimFrame = requestAnimationFrame(tick)
}

function resetSpots() {
  if (spotsAnimFrame) cancelAnimationFrame(spotsAnimFrame)
  spotsAnimating.value = false
  spotsLeft.value = 200
}

const waMessage = computed(() => {
  const tier = selectedTierData.value
  return `Halo, saya mau beli tiket DevTalk 2026 tier ${tier.name} (${tier.priceLabel}). Apakah masih tersedia?`
})

// ============================================================
// SPONSORS (5 tiers)
// ============================================================
const sponsorTiers = [
  {
    tier: 'Platinum', slot: 3,
    sponsors: [
      { name: 'GoTo', desc: 'Gojek + Tokopedia' },
      { name: 'Tokopedia', desc: '12 juta merchant' },
      { name: 'Bank Mandiri', desc: 'Bank BUMN terbesar' },
    ],
  },
  {
    tier: 'Gold', slot: 5,
    sponsors: [
      { name: 'Bukalapak', desc: 'E-commerce UMKM' },
      { name: 'DANA', desc: '130 juta pengguna' },
      { name: 'Traveloka', desc: 'Travel & lifestyle' },
      { name: 'Mekari', desc: 'SaaS HR & payroll' },
      { name: 'Xendit', desc: '300K+ merchant' },
    ],
  },
  {
    tier: 'Silver', slot: 8,
    sponsors: [
      { name: 'Shopee ID', desc: 'Gratis ongkir' },
      { name: 'Privy', desc: 'e-KYC & digital signature' },
      { name: 'Nodeflux', desc: 'AI vision' },
      { name: 'Glints', desc: 'Rekrutmen tech' },
      { name: 'Akulaku', desc: 'Fintech lending' },
      { name: 'Bibit', desc: 'Robo-advisor reksa dana' },
      { name: 'Modalku', desc: 'P2P lending UMKM' },
      { name: 'KoinWorks', desc: 'Fintech pinjaman' },
    ],
  },
  {
    tier: 'Bronze', slot: 12,
    sponsors: [
      { name: 'Jenius', desc: 'Bank digital BTPN' },
      { name: 'Blu', desc: 'Bank digital BCA' },
      { name: 'Jago', desc: 'Bank digital' },
      { name: 'Flip', desc: 'Transfer gratis' },
      { name: 'Dana', desc: 'Dompet digital' },
      { name: 'BibitPlus', desc: 'Investasi pemula' },
      { name: 'RuangGuru', desc: 'Edukasi online' },
      { name: 'Sekolah.mu', desc: 'Belajar online' },
      { name: 'CoLearn', desc: 'Bimbel masuk PTN' },
      { name: 'Pahamify', desc: 'Belajar SMA' },
      { name: 'Kalananti', desc: 'Coding untuk anak' },
      { name: 'Cakap', desc: 'Bahasa asing online' },
    ],
  },
  {
    tier: 'Media Partner', slot: 8,
    sponsors: [
      { name: 'DailySocial.id', desc: 'Tech & startup' },
      { name: 'Tech in Asia ID', desc: 'Media tech Asia' },
      { name: 'Tek.id', desc: 'Berita teknologi' },
      { name: 'Dailytek.id', desc: 'Gadget & review' },
      { name: 'kumparanTECH', desc: 'Teknologi kumparan' },
      { name: 'IDN Times Tech', desc: 'Tech Gen Z' },
      { name: 'Vice ID', desc: 'Budaya & tech' },
      { name: 'Hyperlink ID', desc: 'Podcast tech' },
    ],
  },
]

// ============================================================
// .ICS CALENDAR
// ============================================================
function downloadIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DevTalk 2026//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:DevTalk 2026',
    'X-WR-TIMEZONE:Asia/Jakarta',
  ]

  const days = [
    { start: '20260917T090000', end: '20260917T180000', summary: 'DevTalk 2026 Hari 1: Backend & Frontend' },
    { start: '20260918T090000', end: '20260918T180000', summary: 'DevTalk 2026 Hari 2: AI, ML, & DevOps' },
    { start: '20260919T090000', end: '20260919T180000', summary: 'DevTalk 2026 Hari 3: Mobile, Security, & Product' },
  ]

  days.forEach((d, i) => {
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Jakarta:${d.start}`,
      `DTEND;TZID=Asia/Jakarta:${d.end}`,
      `SUMMARY:${d.summary}`,
      'LOCATION:JIExpo Kemayoran\\, Jakarta',
      `UID:devtalk-2026-day${i + 1}@ajoclub.id`,
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'devtalk-2026.ics'
  a.click()
  URL.revokeObjectURL(url)
}

const googleCalUrl = computed(() => {
  const text = encodeURIComponent('DevTalk 2026: Konferensi Developer Indonesia')
  const dates = '20260917T020000Z/20260919T110000Z'
  const location = encodeURIComponent('JIExpo Kemayoran, Jakarta')
  const details = encodeURIComponent('Konferensi developer independen, tiga hari, satu ruangan. 14 pembicara, 8 track, 3.000 peserta.')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}`
})
</script>

<template>
  <div class="devtalk" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="DevTalk 2026"
      :links="[
        { label: 'Tiket', href: '#tiket' },
        { label: 'Pembicara', href: '#pembicara' },
        { label: 'Jadwal', href: '#jadwal' },
        { label: 'Lokasi', href: '#lokasi' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. HERO + 3D + MARQUEE          -->
      <!-- ============================== -->
      <section class="devtalk-hero" id="hero">
        <div class="devtalk-hero__3d">
          <TmplExperienceCanvas
            preset="particle-morph"
            :accent="tpl.accentColor"
            intensity="balanced"
          />
        </div>

        <div class="devtalk-hero__content" :class="{ 'devtalk-hero__content--loaded': heroLoaded }">
          <p class="devtalk-hero__eyebrow" :style="monoStyle">17-19 SEPTEMBER 2026 &middot; JIEXPO KEMAYORAN, JAKARTA</p>

          <h1 :style="h1Style" class="devtalk-hero__h1 text-balance">
            DevTalk
          </h1>

          <p class="devtalk-hero__subtitle">
            Konferensi developer independen, tiga hari, satu ruangan. 14 pembicara, 8 track, 3.000 peserta.
          </p>

          <div class="devtalk-hero__cta">
            <a href="#tiket" class="devtalk-btn devtalk-btn--primary">
              Beli tiket
              <UIcon name="i-lucide-arrow-down" class="w-4 h-4" />
            </a>
            <a href="#pembicara" class="devtalk-btn devtalk-btn--ghost">
              Lihat lineup
            </a>
          </div>
        </div>

        <TmplMarquee
          :items="['TIKET', 'LINEUP', 'DAFTAR', 'TIKET', 'LINEUP', 'DAFTAR', 'TIKET', 'LINEUP']"
          accent="var(--tmpl-accent)"
          speed="fast"
          class="devtalk-hero__marquee"
        />
      </section>

      <!-- ============================== -->
      <!-- 2. COUNTDOWN                    -->
      <!-- ============================== -->
      <section class="devtalk-countdown-section" data-reveal="fade-up">
        <TmplCountdown
          target="2026-09-17T09:00:00+07:00"
          label="Pintu dibuka dalam"
          expiredMessage="Sedang berlangsung"
          variant="blocks"
        />
      </section>

      <!-- ============================== -->
      <!-- 3. PEMBICARA (12 speakers)      -->
      <!-- ============================== -->
      <section id="pembicara" class="devtalk-section devtalk-speakers-section">
        <div class="devtalk-section__head">
          <p class="devtalk-eyebrow" :style="monoStyle">PEMBICARA</p>
          <h2 :style="h2Style" class="text-balance">
            Dua belas pembicara. Semua menulis kode untuk hidup.
          </h2>
          <p class="devtalk-section__sub">
            Tidak ada keynote dari orang yang tidak pernah push ke production.
          </p>
        </div>

        <div class="devtalk-speakers-grid" data-reveal="stagger-children">
          <div
            v-for="sp in speakers"
            :key="sp.id"
            class="devtalk-speaker-card"
          >
            <div class="devtalk-speaker-card__avatar">
              <span class="devtalk-speaker-card__initial">{{ sp.name.charAt(0) }}</span>
            </div>
            <div class="devtalk-speaker-card__info">
              <p class="devtalk-speaker-card__name">{{ sp.name }}</p>
              <p class="devtalk-speaker-card__role" :style="monoStyle">{{ sp.role }} @ {{ sp.company }}</p>
              <p class="devtalk-speaker-card__talk">{{ sp.talk }}</p>
              <p class="devtalk-speaker-card__time" :style="monoStyle">{{ sp.time }} WIB &middot; {{ sp.track }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 4-6. DAY TABS + SCHEDULE        -->
      <!-- ============================== -->
      <section id="jadwal" class="devtalk-section devtalk-schedule-section">
        <div class="devtalk-section__head">
          <p class="devtalk-eyebrow" :style="monoStyle">JADWAL</p>
          <h2 :style="h2Style" class="text-balance">
            Tiga hari, empat slot, satu panggung utama.
          </h2>
          <p class="devtalk-section__sub">
            Klik sel untuk melihat detail talk.
          </p>
        </div>

        <!-- Day tabs -->
        <div class="devtalk-day-tabs" role="tablist">
          <button
            v-for="(day, i) in dayThemes"
            :key="i"
            role="tab"
            :aria-selected="activeDay === i"
            class="devtalk-day-tab"
            :class="{ 'devtalk-day-tab--active': activeDay === i }"
            @click="activeDay = i"
          >
            <span class="devtalk-day-tab__label" :style="monoStyle">{{ day.label }}</span>
            <span class="devtalk-day-tab__theme">{{ day.theme }}</span>
            <span class="devtalk-day-tab__date" :style="monoStyle">{{ day.date }}</span>
          </button>
        </div>

        <!-- Day theme line -->
        <p class="devtalk-schedule-theme" :style="monoStyle">
          {{ dayThemes[activeDay].label }}. {{ dayThemes[activeDay].theme }}. {{ dayThemes[activeDay].date }}.
        </p>

        <!-- Schedule grid -->
        <div class="devtalk-schedule-grid" data-reveal="stagger-children">
          <!-- Header row -->
          <div class="devtalk-schedule-header" :style="monoStyle">
            <span class="devtalk-schedule-time-label">Waktu</span>
            <span v-for="track in trackNames" :key="track" class="devtalk-schedule-track-label">{{ track }}</span>
          </div>

          <!-- Rows -->
          <div
            v-for="(row, ri) in scheduleGrid"
            :key="ri"
            class="devtalk-schedule-row"
          >
            <span class="devtalk-schedule-time" :style="monoStyle">{{ row.time }} WIB</span>
            <button
              v-for="(cell, ci) in row.cells"
              :key="ci"
              class="devtalk-schedule-cell"
              :class="{ 'devtalk-schedule-cell--empty': !cell, 'devtalk-schedule-cell--selected': selectedTalk === cell?.speaker?.id }"
              @click="cell && (selectedTalk = selectedTalk === cell.speaker.id ? null : cell.speaker.id)"
            >
              <template v-if="cell">
                <p class="devtalk-schedule-cell__title">{{ cell.title }}</p>
                <p class="devtalk-schedule-cell__speaker" :style="monoStyle">{{ cell.speaker.name }}</p>
                <p class="devtalk-schedule-cell__company" :style="monoStyle">{{ cell.speaker.company }}</p>
              </template>
              <span v-else class="devtalk-schedule-cell__empty-label" :style="monoStyle">&mdash;</span>
            </button>
          </div>
        </div>

        <!-- Detail panel -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-4"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div v-if="selectedTalk" class="devtalk-detail-panel">
            <template v-for="sp in speakers" :key="sp.id">
              <div v-if="sp.id === selectedTalk" class="devtalk-detail-panel__inner">
                <button type="button" class="devtalk-detail-panel__close" @click="selectedTalk = null" aria-label="Tutup">
                  <UIcon name="i-lucide-x" class="w-4 h-4" />
                </button>
                <p class="devtalk-detail-panel__time" :style="monoStyle">{{ sp.time }} WIB &middot; {{ dayThemes[sp.day].label }} &middot; {{ sp.track }}</p>
                <h3 :style="h2Style" class="devtalk-detail-panel__title">{{ sp.talk }}</h3>
                <p class="devtalk-detail-panel__speaker">{{ sp.name }}, {{ sp.role }} di {{ sp.company }}</p>
                <p class="devtalk-detail-panel__bio">{{ sp.bio }}</p>
              </div>
            </template>
          </div>
        </Transition>
      </section>

      <!-- ============================== -->
      <!-- 7. TICKET TIERS                 -->
      <!-- ============================== -->
      <section id="tiket" class="devtalk-section devtalk-tickets-section">
        <div class="devtalk-section__head">
          <p class="devtalk-eyebrow" :style="monoStyle">TIKET</p>
          <h2 :style="h2Style" class="text-balance">
            Empat tingkatan, satu untuk setiap situasi.
          </h2>
        </div>

        <div class="devtalk-tiers">
          <div
            v-for="tier in tiers"
            :key="tier.key"
            class="devtalk-tier"
            :class="{ 'devtalk-tier--selected': selectedTier === tier.key, 'devtalk-tier--vip': tier.key === 'vip' }"
            role="radio"
            :aria-checked="selectedTier === tier.key"
            tabindex="0"
            @click="selectTier(tier.key)"
            @keydown.enter.space.prevent="selectTier(tier.key)"
          >
            <span v-if="tier.key === 'vip'" class="devtalk-tier__ribbon" :style="monoStyle">TERBATAS</span>
            <p class="devtalk-tier__name" :style="monoStyle">{{ tier.name.toUpperCase() }}</p>
            <p class="devtalk-tier__price">
              <span :style="h1Style">{{ tier.priceLabel }}</span>
            </p>
            <p class="devtalk-tier__desc">{{ tier.desc }}</p>
            <ul class="devtalk-tier__features">
              <li v-for="(f, fi) in tier.features" :key="fi">
                <UIcon name="i-lucide-check" class="w-3 h-3 devtalk-tier__check" />
                {{ f }}
              </li>
            </ul>
            <div
              v-if="tier.key === 'earlybird'"
              class="devtalk-tier__spots"
              :style="monoStyle"
              @mouseenter="animateSpots"
              @mouseleave="resetSpots"
            >
              Sisa {{ spotsLeft }} tiket
            </div>
            <button
              type="button"
              class="devtalk-tier__cta"
              :class="{ 'devtalk-tier__cta--active': selectedTier === tier.key }"
              @click.stop="selectTier(tier.key)"
            >
              {{ selectedTier === tier.key ? 'Dipilih' : 'Pilih' }}
            </button>
          </div>
        </div>

        <!-- CTA -->
        <div class="devtalk-tickets-cta">
          <a
            :href="buildUrl(waMessage)"
            target="_blank"
            rel="noopener"
            class="devtalk-btn devtalk-btn--primary devtalk-btn--lg"
          >
            Beli tiket {{ selectedTierData.name }} via WhatsApp
            <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4" />
          </a>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 8. ADD TO CALENDAR              -->
      <!-- ============================== -->
      <section class="devtalk-section devtalk-calendar-section" data-reveal="fade-up">
        <div class="devtalk-calendar">
          <p class="devtalk-eyebrow" :style="monoStyle">TAMBAH KE KALENDER</p>
          <p class="devtalk-calendar__dates" :style="monoStyle">2026-09-17 &rarr; 2026-09-19, WIB</p>
          <div class="devtalk-calendar__actions">
            <button type="button" class="devtalk-btn devtalk-btn--primary" @click="downloadIcs">
              <UIcon name="i-lucide-download" class="w-4 h-4" />
              .ics
            </button>
            <a :href="googleCalUrl" target="_blank" rel="noopener" class="devtalk-btn devtalk-btn--ghost">
              <UIcon name="i-lucide-calendar" class="w-4 h-4" />
              Google Calendar
            </a>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 9. SPONSORS (5 tiers)           -->
      <!-- ============================== -->
      <section class="devtalk-section devtalk-sponsors-section" data-reveal="fade-up">
        <div class="devtalk-section__head">
          <p class="devtalk-eyebrow" :style="monoStyle">MITRA</p>
          <h2 :style="h2Style" class="text-balance">
            Terima kasih kepada mitra DevTalk 2026.
          </h2>
        </div>

        <div class="devtalk-sponsor-tiers">
          <div
            v-for="(group, gi) in sponsorTiers"
            :key="gi"
            class="devtalk-sponsor-group"
          >
            <p class="devtalk-sponsor-group__label" :style="monoStyle">{{ group.tier }}</p>
            <div class="devtalk-sponsor-group__logos">
              <div
                v-for="(s, si) in group.sponsors"
                :key="si"
                class="devtalk-sponsor-logo"
              >
                <span class="devtalk-sponsor-logo__name">{{ s.name }}</span>
                <span class="devtalk-sponsor-logo__desc">{{ s.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 10. LOKASI + FOOTER             -->
      <!-- ============================== -->
      <section id="lokasi" class="devtalk-section devtalk-location-section">
        <div class="devtalk-section__head">
          <p class="devtalk-eyebrow" :style="monoStyle">LOKASI</p>
          <h2 :style="h2Style" class="text-balance">
            JIExpo Kemayoran, Jakarta.
          </h2>
        </div>

        <div class="devtalk-location-grid" data-reveal="stagger-children">
          <TmplMap
            label="JIExpo Kemayoran"
            address="Jl. Benyamin Suaeb, Kemayoran"
            city="Jakarta Pusat 10620"
            :lat="-6.1577"
            :lng="106.8444"
            :accent="tpl.accentColor"
            google-maps-url="https://maps.google.com/?q=JIExpo+Kemayoran+Jakarta"
          />
          <div class="devtalk-location-info">
            <p class="devtalk-location-info__venue">JIExpo Kemayoran</p>
            <address class="devtalk-location-info__addr">
              Jl. Benyamin Suaeb, Kemayoran,<br>Jakarta Pusat 10620
            </address>
            <p class="devtalk-location-info__transit">
              Transit: KRL Stasiun Kemayoran (5 menit jalan kaki), TransJakarta Halte JIExpo.
            </p>
            <a href="https://maps.google.com/?q=JIExpo+Kemayoran+Jakarta" target="_blank" rel="noopener" class="devtalk-btn devtalk-btn--ghost devtalk-btn--sm">
              Buka di Maps
              <UIcon name="i-lucide-arrow-up-right" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Sponsor CTA -->
        <div class="devtalk-sponsor-cta">
          <h3 :style="h2Style">Ingin jadi sponsor?</h3>
          <p>Hubungi kami untuk paket sponsorship.</p>
          <TmplForm
            :fields="[
              { key: 'company', label: 'Nama perusahaan', required: true },
              { key: 'email', label: 'Email', type: 'email', required: true },
              { key: 'message', label: 'Pesan', type: 'textarea', placeholder: 'Tier yang diminati, pertanyaan, dll.' },
            ]"
            submit-label="Kirim ke WhatsApp"
            :whatsapp-phone="'6285188627365'"
            whatsapp-message-prefix="Halo, saya ingin bertanya tentang sponsorship DevTalk 2026:"
            :accent="tpl.accentColor"
          />
        </div>
      </section>

    </main>

    <!-- Footer -->
    <TmplFooter data-reveal="fade-up" brand-name="DevTalk 2026"
      variant="columns"
      :accent="tpl.accentColor"
      :links="[
        { label: 'Tentang', href: '#hero' },
        { label: 'Kontak', href: '#lokasi' },
        { label: 'Press kit', href: '#' },
        { label: 'Privasi', href: '#' },
        { label: 'Syarat', href: '#' },
        { label: 'Kode Etik', href: '#' },
      ]"
      signature="Dibuat oleh AjoClub. Dibuat di Jakarta, di-deploy di Singapura."
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="event"
    />
  </div>
</template>

<style scoped>
.devtalk {
  min-height: 100dvh;
  position: relative;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  padding: 0.5rem 1rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  z-index: 100;
  font-size: 14px;
}
.skip-link:focus {
  left: 0;
}

.devtalk-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 1rem;
}

/* === HERO === */
.devtalk-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.devtalk-hero__3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.devtalk-hero__content {
  position: relative;
  z-index: 2;
  max-width: 80rem;
  margin: 0 auto;
  padding: 8rem 1.5rem 4rem;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 800ms ease, transform 800ms ease;
}
.devtalk-hero__content--loaded {
  opacity: 1;
  transform: translateY(0);
}
.devtalk-hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 1.5rem;
}
.devtalk-hero__h1 {
  font-size: var(--tmpl-h1);
  font-weight: var(--tmpl-h1-weight, 500);
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-style: italic;
  margin: 0 0 1.5rem;
  max-width: 14ch;
}
.devtalk-hero__subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  line-height: 1.5;
  max-width: 40ch;
  opacity: 0.75;
  margin: 0 0 2rem;
}
.devtalk-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 3rem;
}
.devtalk-hero__marquee {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

/* === BUTTONS === */
.devtalk-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: background-color 200ms ease, transform 200ms ease, border-color 200ms ease;
}
.devtalk-btn--primary {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
}
.devtalk-btn--primary:hover {
  transform: translateY(-1px);
}
.devtalk-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: color-mix(in oklch, currentColor 25%, transparent);
}
.devtalk-btn--ghost:hover {
  background: color-mix(in oklch, currentColor 5%, transparent);
  border-color: color-mix(in oklch, currentColor 40%, transparent);
}
.devtalk-btn--lg {
  padding: 1rem 2rem;
  font-size: 16px;
}
.devtalk-btn--sm {
  padding: 0.5rem 0.875rem;
  font-size: 12px;
}

/* === COUNTDOWN === */
.devtalk-countdown-section {
  padding: 5rem 1.5rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}

/* === SECTIONS === */
.devtalk-section {
  padding: clamp(4rem, 10vw, 8rem) 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
.devtalk-section__head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: center;
}
.devtalk-section__head h2 {
  font-size: var(--tmpl-h2);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0 0 1rem;
}
.devtalk-section__head h2 em {
  font-style: italic;
  color: var(--tmpl-accent);
}
.devtalk-section__sub {
  font-size: 1rem;
  opacity: 0.65;
  line-height: 1.55;
  margin: 0;
}

/* === SPEAKERS === */
.devtalk-speakers-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1px;
  background: color-mix(in oklch, currentColor 8%, transparent);
  border: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  border-radius: 8px;
  overflow: hidden;
}
.devtalk-speaker-card {
  background: var(--tmpl-bg);
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: background-color 200ms ease;
}
.devtalk-speaker-card:hover {
  background: var(--tmpl-surface);
}
.devtalk-speaker-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: color-mix(in oklch, var(--tmpl-accent) 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.devtalk-speaker-card__initial {
  font-size: 18px;
  font-weight: 700;
  color: var(--tmpl-accent);
  font-family: var(--tmpl-font-display);
  font-style: italic;
}
.devtalk-speaker-card__info {
  flex: 1;
  min-width: 0;
}
.devtalk-speaker-card__name {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 0.15rem;
  letter-spacing: -0.005em;
}
.devtalk-speaker-card__role {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.5rem;
}
.devtalk-speaker-card__talk {
  font-size: 13px;
  line-height: 1.45;
  margin: 0 0 0.35rem;
  opacity: 0.85;
}
.devtalk-speaker-card__time {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.45;
  margin: 0;
}

/* === SCHEDULE === */
.devtalk-schedule-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-day-tabs {
  display: flex;
  gap: 0;
  border: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.devtalk-day-tab {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: 0;
  border-right: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  color: inherit;
  cursor: pointer;
  text-align: center;
  font-family: inherit;
  transition: background-color 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.devtalk-day-tab:last-child {
  border-right: 0;
}
.devtalk-day-tab:hover {
  background: color-mix(in oklch, currentColor 4%, transparent);
}
.devtalk-day-tab--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
}
.devtalk-day-tab__label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 700;
}
.devtalk-day-tab__theme {
  font-size: 13px;
  font-weight: 600;
}
.devtalk-day-tab__date {
  font-size: 10px;
  opacity: 0.6;
  letter-spacing: 0.1em;
}
.devtalk-day-tab--active .devtalk-day-tab__date {
  opacity: 0.8;
}

.devtalk-schedule-theme {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
  text-align: center;
  margin-bottom: 1.5rem;
}

.devtalk-schedule-grid {
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  overflow: hidden;
}
.devtalk-schedule-header {
  display: grid;
  grid-template-columns: 100px repeat(3, 1fr);
  background: color-mix(in oklch, currentColor 4%, transparent);
  border-bottom: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
}
.devtalk-schedule-time-label,
.devtalk-schedule-track-label {
  padding: 0.75rem 1rem;
  opacity: 0.6;
}
.devtalk-schedule-track-label {
  border-left: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  text-align: center;
}

.devtalk-schedule-row {
  display: grid;
  grid-template-columns: 100px repeat(3, 1fr);
  border-bottom: 1px solid color-mix(in oklch, currentColor 6%, transparent);
}
.devtalk-schedule-row:last-child {
  border-bottom: 0;
}
.devtalk-schedule-time {
  padding: 1rem;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.6;
  display: flex;
  align-items: flex-start;
}

.devtalk-schedule-cell {
  padding: 1rem;
  border-left: 1px solid color-mix(in oklch, currentColor 6%, transparent);
  background: transparent;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  color: inherit;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background-color 150ms ease;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.devtalk-schedule-cell:hover:not(.devtalk-schedule-cell--empty) {
  background: color-mix(in oklch, currentColor 4%, transparent);
}
.devtalk-schedule-cell--selected {
  background: color-mix(in oklch, var(--tmpl-accent) 10%, transparent);
  border-left: 2px solid var(--tmpl-accent);
}
.devtalk-schedule-cell--empty {
  cursor: default;
  opacity: 0.3;
}
.devtalk-schedule-cell__title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
}
.devtalk-schedule-cell__speaker {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
  margin: 0;
}
.devtalk-schedule-cell__company {
  font-size: 10px;
  letter-spacing: 0.1em;
  opacity: 0.4;
  margin: 0;
}
.devtalk-schedule-cell__empty-label {
  font-size: 14px;
  opacity: 0.3;
}

/* Detail panel */
.devtalk-detail-panel {
  margin-top: 1rem;
  background: var(--tmpl-surface);
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  overflow: hidden;
}
.devtalk-detail-panel__inner {
  padding: 2rem;
  position: relative;
}
.devtalk-detail-panel__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 200ms ease;
  padding: 0.25rem;
}
.devtalk-detail-panel__close:hover {
  opacity: 1;
}
.devtalk-detail-panel__time {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0 0 0.75rem;
}
.devtalk-detail-panel__title {
  margin: 0 0 0.5rem;
}
.devtalk-detail-panel__speaker {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 1rem;
  color: var(--tmpl-accent);
}
.devtalk-detail-panel__bio {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.75;
  margin: 0;
  max-width: 50ch;
}

/* === TICKETS === */
.devtalk-tickets-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.devtalk-tier {
  position: relative;
  padding: 1.75rem 1.5rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  background: var(--tmpl-surface);
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  flex-direction: column;
}
.devtalk-tier:hover {
  border-color: color-mix(in oklch, currentColor 20%, transparent);
  transform: translateY(-2px);
}
.devtalk-tier--selected {
  border-color: var(--tmpl-accent);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--tmpl-accent) 20%, transparent);
}
.devtalk-tier--vip {
  border-color: var(--tmpl-accent);
}
.devtalk-tier__ribbon {
  position: absolute;
  top: -0.6rem;
  left: 1.25rem;
  padding: 0.15rem 0.6rem;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  font-size: 9px;
  letter-spacing: 0.15em;
  font-weight: 700;
  border-radius: 999px;
}
.devtalk-tier__name {
  font-size: 10px;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0.55;
  margin: 0 0 0.5rem;
}
.devtalk-tier__price {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0 0 0.25rem;
}
.devtalk-tier__price span {
  font-variant-numeric: tabular-nums;
}
.devtalk-tier__desc {
  font-size: 12px;
  opacity: 0.6;
  margin: 0 0 1.25rem;
}
.devtalk-tier__features {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.devtalk-tier__features li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 12.5px;
  line-height: 1.45;
}
.devtalk-tier__check {
  color: var(--tmpl-accent);
  flex-shrink: 0;
  margin-top: 3px;
}
.devtalk-tier__spots {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--tmpl-accent);
  margin-bottom: 0.75rem;
  font-weight: 600;
  cursor: default;
}
.devtalk-tier__cta {
  display: flex;
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
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
.devtalk-tier__cta:hover {
  border-color: var(--tmpl-accent);
}
.devtalk-tier__cta--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.devtalk-tickets-cta {
  text-align: center;
}

/* === CALENDAR === */
.devtalk-calendar-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  padding: 5rem 1.5rem;
}
.devtalk-calendar {
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
}
.devtalk-calendar__dates {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 1rem;
}
.devtalk-calendar__actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* === SPONSORS === */
.devtalk-sponsors-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-sponsor-tiers {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.devtalk-sponsor-group {
  text-align: center;
}
.devtalk-sponsor-group__label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.45;
  margin-bottom: 1rem;
}
.devtalk-sponsor-group__logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.devtalk-sponsor-logo {
  position: relative;
  padding: 0.75rem 1.25rem;
  border: 1px solid color-mix(in oklch, currentColor 10%, transparent);
  border-radius: 8px;
  background: var(--tmpl-surface);
  cursor: default;
  transition: all 200ms ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 120px;
}
.devtalk-sponsor-logo:hover {
  border-color: color-mix(in oklch, var(--tmpl-accent) 35%, transparent);
}
.devtalk-sponsor-logo__name {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.devtalk-sponsor-logo__desc {
  font-size: 11px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 200ms ease;
  line-height: 1.35;
  color: var(--tmpl-muted);
}
.devtalk-sponsor-logo:hover .devtalk-sponsor-logo__desc {
  opacity: 1;
  max-height: 40px;
}

/* === LOCATION === */
.devtalk-location-section {
  border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-location-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}
@media (min-width: 768px) {
  .devtalk-location-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}
.devtalk-location-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}
.devtalk-location-info__venue {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.devtalk-location-info__addr {
  font-style: normal;
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
}
.devtalk-location-info__transit {
  font-size: 13px;
  opacity: 0.6;
  line-height: 1.5;
  margin: 0;
}

/* Sponsor CTA */
.devtalk-sponsor-cta {
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
  padding: 5rem 0 0;
  border-top: 1px solid color-mix(in oklch, currentColor 8%, transparent);
}
.devtalk-sponsor-cta h3 {
  margin: 0 0 0.75rem;
}
.devtalk-sponsor-cta > p {
  opacity: 0.7;
  margin: 0 0 2rem;
}

/* === Responsive === */
@media (max-width: 640px) {
  .devtalk-day-tabs {
    flex-direction: column;
  }
  .devtalk-day-tab {
    border-right: 0;
    border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  }
  .devtalk-day-tab:last-child {
    border-bottom: 0;
  }
  .devtalk-schedule-header,
  .devtalk-schedule-row {
    grid-template-columns: 70px repeat(3, 1fr);
  }
  .devtalk-schedule-time-label,
  .devtalk-schedule-track-label,
  .devtalk-schedule-time {
    padding: 0.5rem;
    font-size: 9px;
  }
  .devtalk-schedule-cell {
    padding: 0.5rem;
  }
  .devtalk-schedule-cell__title {
    font-size: 11px;
  }
  .devtalk-speakers-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .devtalk-hero__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
