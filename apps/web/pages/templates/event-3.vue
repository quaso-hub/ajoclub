<script setup lang="ts">
import { getPalette, toCss } from '~/utils/palettes'
import { getTypography } from '~/utils/typography'

definePageMeta({ layout: false })

const slug = 'event-3'
const palette = getPalette('forumid')
const typo = getTypography('forumid')

useHead({
  title: 'ForumID 2026 — Festival Desain & Kreatif Indonesia',
  htmlAttrs: { lang: 'id' },
  link: [
    ...typo.preconnect.map((href: string) => ({ rel: 'preconnect', href })),
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: typo.allCss },
  ],
  meta: [
    { name: 'description', content: 'ForumID edisi kedelapan. 64 desainer. 4 hari. Museum MACAN + Pos Bloc, Jakarta. 8-11 Oktober 2026.' },
    { property: 'og:title', content: 'ForumID 2026' },
    { property: 'og:type', content: 'website' },
    { name: 'theme-color', content: toCss(palette.accent) },
  ],
})

const accent = toCss(palette.accent)
const accentSoft = toCss(palette.accentSoft)
const bg = toCss(palette.bg)
const fg = toCss(palette.fg)
const muted = toCss(palette.muted)
const border = toCss(palette.border)
const surface = toCss(palette.surface)
const surfaceElevated = toCss(palette.surfaceElevated)

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 300) })

const activeDay = ref(1)
const activeTrack = ref('semua')

const days = [
  { num: 1, label: 'Kamis', date: '8 Okt' },
  { num: 2, label: 'Jumat', date: '9 Okt' },
  { num: 3, label: 'Sabtu', date: '10 Okt' },
  { num: 4, label: 'Minggu', date: '11 Okt' },
]

const tracks = ['semua', 'Desain', 'Teknologi', 'Bisnis']

const speakers = [
  { name: 'Pandu C. Sukarya', role: 'Kurator Utama', company: 'Museum MACAN', talk: 'Material sebagai memori: 10 tahun ke depan desain Indonesia', day: 1, track: 'Desain' },
  { name: 'Radhiah Khalik', role: 'Desainer Tipografi', company: 'Independen, Malaysia', talk: 'Tipe yang melawan: tipografi di bawah tekanan', day: 1, track: 'Desain' },
  { name: 'Irwan Ahmett', role: 'Seniman', company: 'Taring Padi', talk: 'Banner dan barikade: seni sebagai protes, 25 tahun', day: 1, track: 'Desain' },
  { name: 'Riri Rengganis', role: 'Arsitek Interior', company: 'Studio Riri', talk: 'Mendesain museum di gedung heritage', day: 1, track: 'Teknologi' },
  { name: 'Rio Dewantara', role: 'UX Lead', company: 'independust.id', talk: 'Miliaran layar: UX mobile Indonesia', day: 2, track: 'Teknologi' },
  { name: 'Erika Karunia', role: 'Type Designer', company: 'Beetalker Studio', talk: 'Variable fonts untuk Bahasa Indonesia', day: 2, track: 'Desain' },
  { name: 'Wicaksono Hendro', role: 'Editorial Designer', company: 'Halaman Belakang', talk: 'Desain editorial 2026: apa yang masih penting', day: 2, track: 'Desain' },
  { name: 'At-Sunrise', role: 'Generative Artist', company: 'Tokyo, Jepang', talk: 'Poster generatif untuk musik ambient', day: 2, track: 'Teknologi' },
  { name: 'Arief Budiman', role: 'Seniman Instalasi', company: 'Studio Antaran', talk: 'Instalasi: dari galeri ke ruang publik', day: 3, track: 'Desain' },
  { name: 'Monita Soemantri', role: 'Desainer Budaya', company: 'Independen', talk: 'Desain dan adat: sistem desain 1000 tahun', day: 3, track: 'Bisnis' },
  { name: 'Gilang Widya Pratama', role: 'Direktur Kreatif', company: 'RuangRupa', talk: 'Kolektif seni Indonesia: retrospektif 25 tahun', day: 3, track: 'Bisnis' },
  { name: 'Narenda Dewanata', role: 'Brand Strategist', company: 'Versa Studio', talk: 'Merek Indonesia yang tidak malu jadi lokal', day: 3, track: 'Bisnis' },
  { name: 'M. Irfan Ramli', role: 'Type Designer', company: 'Studiofu', talk: 'Tipografi bencana: visual Gunung Bromo', day: 4, track: 'Desain' },
  { name: 'Octaviani Pratama', role: 'UX Researcher', company: 'Independen, Sydney', talk: 'Desain untuk Asia Tenggara multibahasa', day: 4, track: 'Teknologi' },
  { name: 'Luthfi Rinaldi', role: 'Motion Designer', company: 'Videokid', talk: 'Kenapa motion design Indonesia terlihat seperti itu', day: 4, track: 'Teknologi' },
  { name: 'Saras Dewi', role: 'Product Designer', company: 'GoTo Financial', talk: 'Mendesain untuk 50 juta pengguna pertama', day: 4, track: 'Bisnis' },
]

const filteredSpeakers = computed(() => {
  return speakers.filter(s => {
    const dayMatch = activeDay.value === 0 || s.day === activeDay.value
    const trackMatch = activeTrack.value === 'semua' || s.track === activeTrack.value
    return dayMatch && trackMatch
  })
})

const schedule = computed(() => {
  const d = activeDay.value
  const base = [
    { time: '09:00', end: '10:00', title: 'Registrasi & Kopi', track: 'semua', type: 'break' },
    { time: '10:00', end: '11:30', title: speakers.filter(s => s.day === d)[0]?.talk || 'Keynote', track: 'Desain', type: 'talk', speaker: speakers.filter(s => s.day === d)[0]?.name },
    { time: '10:00', end: '11:30', title: speakers.filter(s => s.day === d)[1]?.talk || 'Sesi Teknologi', track: 'Teknologi', type: 'talk', speaker: speakers.filter(s => s.day === d)[1]?.name },
    { time: '10:00', end: '11:30', title: speakers.filter(s => s.day === d)[2]?.talk || 'Sesi Bisnis', track: 'Bisnis', type: 'talk', speaker: speakers.filter(s => s.day === d)[2]?.name },
    { time: '11:30', end: '13:00', title: 'Makan Siang & Pameran', track: 'semua', type: 'break' },
    { time: '13:00', end: '14:30', title: speakers.filter(s => s.day === d)[3]?.talk || 'Workshop', track: 'Desain', type: 'workshop', speaker: speakers.filter(s => s.day === d)[3]?.name },
    { time: '13:00', end: '14:30', title: 'Diskusi Panel: Masa Depan Studio Desain', track: 'Teknologi', type: 'talk', speaker: 'Panel' },
    { time: '13:00', end: '14:30', title: 'Workshop: Bisnis Kreatif 101', track: 'Bisnis', type: 'workshop', speaker: 'Tim ForumID' },
    { time: '15:00', end: '16:30', title: 'Open Mic: Portofolio Kilat (5 menit per orang)', track: 'semua', type: 'talk' },
    { time: '17:00', end: '18:00', title: 'Jaringan Sore & Tur Pameran', track: 'semua', type: 'break' },
  ]
  if (activeTrack.value === 'semua') return base
  return base.filter(s => s.track === 'semua' || s.track === activeTrack.value)
})

const ticketTiers = [
  {
    name: 'Desainer',
    price: 'Rp 800.000',
    perks: ['Akses semua talk 4 hari', 'Materi digital', 'Sertifikat', 'Makan siang & kopi'],
    remaining: 180,
    total: 300,
    accent: false,
  },
  {
    name: 'Studio',
    price: 'Rp 2.000.000',
    perks: ['Semua di Desainer', 'Workshop eksklusif', 'Akses ruang kerja bersama', 'Networking dinner', 'Materi cetak'],
    remaining: 45,
    total: 80,
    accent: true,
  },
  {
    name: 'Korporat',
    price: 'Rp 5.000.000',
    perks: ['Semua di Studio', 'Kursi prioritas', 'Sesi 1-on-1 dengan kurator', 'Laporan riset desain', '5 tiket tim'],
    remaining: 12,
    total: 20,
    accent: false,
  },
]

const archiveYears = [
  { year: 2018, theme: 'Origin', edition: 'Pertama', colors: ['#1573FF', '#F7F4EC'] },
  { year: 2019, theme: 'Craft', edition: 'Kedua', colors: ['#8B6914', '#2C1810'] },
  { year: 2020, theme: 'Pivot', edition: 'Ketiga', colors: ['#00FF88', '#0A0A0A'] },
  { year: 2021, theme: 'Adapt', edition: 'Keempat', colors: ['#1573FF', '#E8E8E8'] },
  { year: 2022, theme: 'Materiality', edition: 'Kelima', colors: ['#FF7B00', '#F7F4EC'] },
  { year: 2023, theme: 'Sisterhood', edition: 'Keenam', colors: ['#E84393', '#FFF5F5'] },
  { year: 2024, theme: 'Publik', edition: 'Ketujuh', colors: ['#00B894', '#FFFFFF'] },
  { year: 2025, theme: 'Bahasa', edition: 'Kedelapan', colors: ['#FF7B00', '#F7F4EC'] },
  { year: 2026, theme: 'Material', edition: 'Kesembilan', colors: ['#1573FF', '#FF7B00'] },
]

const faqs = [
  { q: 'Apakah ForumID cocok untuk mahasiswa?', a: 'Ya. ForumID terbuka untuk semua level, dari mahasiswa sampai praktisi senior. Tiket Desainer mencakup akses penuh ke semua talk dan pameran.' },
  { q: 'Bisa beli tiket di tempat?', a: 'Tidak. Semua tiket dijual online sampai habis. Kami tidak menjual tiket di lokasi acara.' },
  { q: 'Apakah ada diskon grup?', a: 'Tiket Studio sudah termasuk 3 orang. Tiket Korporat mencakup 5 orang. Untuk rombongan lebih besar, hubungi kami langsung.' },
  { q: 'Bagaimana cara ke Museum MACAN?', a: 'Museum MACAN di Kembangan, Jakarta Barat. Bisa dicapai dengan MRT (stasiun terdekat: Istora) lalu ojek online, atau langsung naik Transjakarta.' },
  { q: 'Apakah acara ini bilingual?', a: 'Semua talk utama dalam Bahasa Indonesia. Beberapa talk tamu internasional menggunakan bahasa Inggris dengan subtitle.' },
  { q: 'Bolehkah merekam sesi talk?', a: 'Tidak. Semua sesi direkam oleh tim ForumID dan akan tersedia 2 minggu setelah acara untuk peserta.' },
]

const openFaq = ref<number | null>(null)

const fabOpen = ref(false)
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan ForumID 2026. Bisa diskusi?')
</script>

<template>
  <div
    :style="{
      '--t-bg': bg,
      '--t-fg': fg,
      '--t-muted': muted,
      '--t-border': border,
      '--t-surface': surface,
      '--t-surface-elevated': surfaceElevated,
      '--t-accent': accent,
      '--t-accent-soft': accentSoft,
      '--t-font-display': typo.display,
      '--t-font-body': typo.body,
      '--t-font-mono': typo.mono,
      '--t-h1': typo.h1,
      '--t-h2': typo.h2,
      background: bg,
      color: fg,
      fontFamily: typo.body,
      fontSize: typo.bodySize,
      lineHeight: String(typo.bodyLineHeight),
    }"
    class="min-h-screen antialiased"
  >
    <!-- Navbar -->
    <TmplNavbar
      brand="ForumID"
      wordmark="FI"
      :links="[
        { label: 'Lineup', href: '#lineup' },
        { label: 'Jadwal', href: '#jadwal' },
        { label: 'Tiket', href: '#tiket' },
        { label: 'Venue', href: '#venue' },
        { label: 'Arsip', href: '#arsip' },
        { label: 'FAQ', href: '#faq' },
      ]"
      :accent="accent"
      :bg="surfaceElevated"
      :text="fg"
      style="transparent"
      :show-theme-toggle="false"
      force-mode="light"
    />

    <!-- ============ HERO ============ -->
    <section id="top" class="relative overflow-hidden" style="min-height: 100svh; display: flex; align-items: center;">
      <!-- Dot pattern bg -->
      <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;" />

      <div class="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 md:py-0">
        <div class="grid md:grid-cols-12 gap-8 items-center">
          <!-- Left: year + copy -->
          <div class="md:col-span-7">
            <template v-if="!isLoaded">
              <div class="h-6 w-48 rounded mb-8 animate-pulse" :style="{ background: accentSoft }" />
              <div class="h-24 md:h-40 w-full rounded mb-6 animate-pulse" :style="{ background: surface }" />
              <div class="h-6 w-3/4 rounded mb-4 animate-pulse" :style="{ background: surface }" />
            </template>

            <template v-else>
              <p class="text-xs tracking-[0.35em] uppercase mb-6" :style="{ color: accent, fontFamily: typo.mono }">
                Edisi kesembilan &middot; 8&ndash;11 Oktober 2026
              </p>

              <!-- Massive year typography -->
              <h1
                class="leading-[0.85] tracking-[-0.04em] mb-8"
                :style="{
                  fontFamily: typo.display,
                  fontSize: typo.h1,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: fg,
                }"
              >
                2026
              </h1>

              <h2
                class="mb-6"
                :style="{
                  fontFamily: typo.display,
                  fontSize: typo.h2,
                  fontWeight: 600,
                  lineHeight: '1.05',
                  letterSpacing: '-0.02em',
                }"
              >
                Festival Desain<br />& Kreatif Indonesia
              </h2>

              <p class="max-w-lg mb-4" :style="{ color: muted }">
                ForumID edisi kedelapan. 64 desainer dari Indonesia dan Asia Tenggara. 4 hari talk, workshop, pameran, dan studio visit. Museum MACAN + Pos Bloc, Jakarta.
              </p>

              <p class="text-sm mb-10" :style="{ color: muted, fontFamily: typo.mono }">
                Tema tahun ini: <strong :style="{ color: accent }">Material</strong> &mdash; raw material turn dalam seni kontemporer Indonesia
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <a
                  href="#tiket"
                  class="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:translate-y-[-1px]"
                  :style="{ background: accent, color: '#fff' }"
                >
                  Beli tiket &mdash; mulai Rp 800rb
                </a>
                <a
                  href="#lineup"
                  class="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-sm font-medium border transition-colors"
                  :style="{ borderColor: border, color: fg }"
                >
                  Lihat lineup
                </a>
              </div>
            </template>
          </div>

          <!-- Right: year hologram placeholder + archive strip -->
          <div class="md:col-span-5 hidden md:flex flex-col items-center justify-center">
            <div
              class="w-full aspect-square rounded-2xl flex items-center justify-center relative"
              :style="{ background: surface }"
            >
              <!-- 3D year hologram placeholder -->
              <span
                class="select-none"
                :style="{
                  fontFamily: typo.display,
                  fontSize: 'clamp(6rem, 14vw, 12rem)',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  opacity: 0.06,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                }"
              >2026</span>
              <div class="absolute bottom-4 left-4 right-4 text-center">
                <p class="text-[10px] tracking-[0.3em] uppercase" :style="{ color: muted, fontFamily: typo.mono }">
                  Year Hologram &middot; 3D Interactive
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marquee band -->
    <TmplMarquee
      :items="[
        'ForumID 2026',
        'Material',
        'Museum MACAN',
        'Jakarta',
        '8-11 Oktober',
        '64 Desainer',
        '4 Hari',
        'Edisi Kesembilan',
      ]"
      separator="&middot;"
      :accent="accent"
      speed="slow"
    />

    <!-- ============ LINEUP (16 speakers) ============ -->
    <section id="lineup" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}` }">
      <div class="max-w-[1440px] mx-auto px-6 md:px-16">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">Lineup</p>
            <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
              64 desainer. 4 hari.
            </h2>
          </div>
        </div>
        <p class="mb-10" :style="{ color: muted, maxWidth: '36rem' }">
          Desainer, tipografer, seniman, dan strategist dari seluruh Indonesia dan Asia Tenggara.
        </p>

        <!-- Day filter pills -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="d in [{ num: 0, label: 'Semua', date: '' }, ...days]"
            :key="d.num"
            class="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
            :style="{
              background: activeDay === d.num ? accent : 'transparent',
              color: activeDay === d.num ? '#fff' : muted,
              border: `1px solid ${activeDay === d.num ? accent : border}`,
            }"
            @click="activeDay = d.num"
          >
            {{ d.label }} {{ d.date }}
          </button>
        </div>

        <!-- Track filter -->
        <div class="flex flex-wrap gap-2 mb-12">
          <button
            v-for="t in tracks"
            :key="t"
            class="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer"
            :style="{
              background: activeTrack === t ? accentSoft : 'transparent',
              color: activeTrack === t ? accent : muted,
              border: `1px solid ${activeTrack === t ? accent : border}`,
              fontFamily: typo.mono,
            }"
            @click="activeTrack = t"
          >
            {{ t }}
          </button>
        </div>

        <!-- Speaker grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]" :style="{ background: border }">
          <article
            v-for="s in filteredSpeakers"
            :key="s.name"
            class="group p-6 transition-colors duration-200"
            :style="{ background: surface }"
          >
            <!-- B&W portrait placeholder -->
            <div
              class="w-full aspect-[4/3] rounded-lg mb-4 flex items-center justify-center overflow-hidden"
              :style="{ background: surfaceElevated }"
            >
              <span class="text-3xl font-bold opacity-10" :style="{ fontFamily: typo.display, fontStyle: 'italic' }">
                {{ s.name.split(' ').map((n: string) => n[0]).join('') }}
              </span>
            </div>
            <p class="text-[10px] tracking-[0.2em] uppercase mb-1" :style="{ color: accent, fontFamily: typo.mono }">
              {{ s.track }} &middot; Hari {{ s.day }}
            </p>
            <h3 class="text-base font-semibold mb-0.5">{{ s.name }}</h3>
            <p class="text-xs mb-1" :style="{ color: muted }">{{ s.role }}, {{ s.company }}</p>
            <p class="text-sm mt-3 leading-snug" :style="{ color: fg }">{{ s.talk }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ JADWAL ============ -->
    <section id="jadwal" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}`, background: surface }">
      <div class="max-w-[1440px] mx-auto px-6 md:px-16">
        <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">Jadwal</p>
        <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
          4 hari, 3 track.
        </h2>
        <p class="mb-10 mt-3" :style="{ color: muted, maxWidth: '36rem' }">
          Desain, Teknologi, dan Bisnis. Pilih track atau lihat semua.
        </p>

        <!-- Day tabs -->
        <div class="flex gap-1 mb-8 p-1 rounded-lg" :style="{ background: bg }">
          <button
            v-for="d in days"
            :key="d.num"
            class="flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer text-center"
            :style="{
              background: activeDay === d.num ? accent : 'transparent',
              color: activeDay === d.num ? '#fff' : muted,
            }"
            @click="activeDay = d.num"
          >
            <span class="block text-xs opacity-70" :style="{ fontFamily: typo.mono }">{{ d.date }}</span>
            <span class="block font-semibold">{{ d.label }}</span>
          </button>
        </div>

        <!-- Track filter (small) -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="t in tracks"
            :key="t"
            class="px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer"
            :style="{
              background: activeTrack === t ? accentSoft : 'transparent',
              color: activeTrack === t ? accent : muted,
              border: `1px solid ${activeTrack === t ? accent : border}`,
              fontFamily: typo.mono,
            }"
            @click="activeTrack = t"
          >
            {{ t }}
          </button>
        </div>

        <!-- Schedule list -->
        <div class="space-y-0">
          <div
            v-for="(item, i) in schedule"
            :key="i"
            class="grid md:grid-cols-[100px_1fr_120px] gap-4 py-4 items-start"
            :style="{ borderBottom: `1px solid ${border}` }"
          >
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-semibold" :style="{ fontFamily: typo.mono, color: item.type === 'break' ? muted : fg }">
                {{ item.time }}
              </span>
              <span class="text-[10px]" :style="{ color: muted, fontFamily: typo.mono }">{{ item.end }}</span>
            </div>
            <div>
              <p class="text-sm font-medium" :style="{ color: item.type === 'break' ? muted : fg }">{{ item.title }}</p>
              <p v-if="item.speaker" class="text-xs mt-0.5" :style="{ color: muted }">{{ item.speaker }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="item.track !== 'semua'"
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ background: accentSoft, color: accent, fontFamily: typo.mono }"
              >
                {{ item.track }}
              </span>
              <span
                v-if="item.type === 'workshop'"
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ background: surface, color: muted, border: `1px solid ${border}`, fontFamily: typo.mono }"
              >
                Workshop
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ TIKET ============ -->
    <section id="tiket" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}` }">
      <div class="max-w-[1440px] mx-auto px-6 md:px-16">
        <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">Tiket</p>
        <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
          Tiga pilihan.
        </h2>
        <p class="mb-12 mt-3" :style="{ color: muted, maxWidth: '36rem' }">
          Semua tiket mencakup akses 4 hari, makan siang, dan sertifikat.
        </p>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="tier in ticketTiers"
            :key="tier.name"
            class="rounded-xl p-8 flex flex-col transition-all duration-200 hover:translate-y-[-2px]"
            :style="{
              background: tier.accent ? fg : surface,
              color: tier.accent ? bg : fg,
              border: `1px solid ${tier.accent ? fg : border}`,
            }"
          >
            <p class="text-xs tracking-[0.2em] uppercase mb-2" :style="{ fontFamily: typo.mono, opacity: 0.6 }">
              {{ tier.name }}
            </p>
            <p class="text-3xl font-bold mb-6" :style="{ fontFamily: typo.display, fontStyle: 'italic' }">
              {{ tier.price }}
            </p>
            <ul class="space-y-3 mb-8 flex-1">
              <li v-for="perk in tier.perks" :key="perk" class="flex items-start gap-2 text-sm">
                <span :style="{ color: tier.accent ? bg : accent }" class="mt-0.5">&#10003;</span>
                <span :style="{ opacity: 0.85 }">{{ perk }}</span>
              </li>
            </ul>
            <div class="mb-4">
              <div class="h-1 rounded-full overflow-hidden" :style="{ background: tier.accent ? 'rgba(255,255,255,0.2)' : border }">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${((tier.total - tier.remaining) / tier.total) * 100}%`,
                    background: tier.accent ? bg : accent,
                  }"
                />
              </div>
              <p class="text-[11px] mt-2" :style="{ fontFamily: typo.mono, opacity: 0.5 }">
                Tersisa {{ tier.remaining }} dari {{ tier.total }}
              </p>
            </div>
            <a
              href="#"
              class="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
              :style="{
                background: tier.accent ? bg : accent,
                color: tier.accent ? fg : '#fff',
              }"
            >
              Pilih {{ tier.name }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ VENUE ============ -->
    <section id="venue" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}`, background: surface }">
      <div class="max-w-[1440px] mx-auto px-6 md:px-16">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">Venue</p>
            <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
              Museum MACAN<br />+ Pos Bloc
            </h2>
            <p class="mt-4 mb-6" :style="{ color: muted }">
              Museum MACAN (Modern and Contemporary Art in Nusantara) di Kembangan, Jakarta Barat. Ditambah ruang outdoor Pos Bloc untuk pameran dan jaringan.
            </p>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <span :style="{ color: accent }">&#9201;</span>
                <div>
                  <p class="text-sm font-medium">8-11 Oktober 2026</p>
                  <p class="text-xs" :style="{ color: muted }">Kamis sampai Minggu, 09:00-18:00 WIB</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span :style="{ color: accent }">&#9906;</span>
                <div>
                  <p class="text-sm font-medium">Museum MACAN</p>
                  <p class="text-xs" :style="{ color: muted }">Jl. Panjang No.5, Kembangan, Jakarta Barat</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span :style="{ color: accent }">&#9906;</span>
                <div>
                  <p class="text-sm font-medium">Pos Bloc</p>
                  <p class="text-xs" :style="{ color: muted }">Jl. Pos Besar No.2, Glodok, Jakarta Barat</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Map placeholder -->
          <div
            class="w-full aspect-[4/3] rounded-xl flex items-center justify-center"
            :style="{ background: bg, border: `1px solid ${border}` }"
          >
            <div class="text-center">
              <p class="text-sm font-medium mb-1" :style="{ color: muted }">Peta Interaktif</p>
              <p class="text-[10px] tracking-[0.2em] uppercase" :style="{ color: muted, fontFamily: typo.mono }">MapLibre GL &middot; 2 lokasi</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ARSIP (2018-2026) ============ -->
    <section id="arsip" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}` }">
      <div class="max-w-[1440px] mx-auto px-6 md:px-16">
        <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">Arsip</p>
        <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
          9 edisi, sejak 2018.
        </h2>
        <p class="mb-12 mt-3" :style="{ color: muted, maxWidth: '36rem' }">
          Setiap tahun punya tema dan identitas visual sendiri.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[1px]" :style="{ background: border }">
          <div
            v-for="y in archiveYears"
            :key="y.year"
            class="group p-6 flex flex-col justify-between aspect-[3/4] transition-colors duration-200 cursor-pointer"
            :style="{
              background: y.year === 2026 ? fg : surface,
              color: y.year === 2026 ? bg : fg,
            }"
          >
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase mb-2" :style="{ fontFamily: typo.mono, opacity: 0.5 }">
                {{ y.edition }}
              </p>
              <p
                class="text-4xl md:text-5xl font-bold leading-none mb-2"
                :style="{ fontFamily: typo.display, fontStyle: 'italic' }"
              >
                {{ y.year }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium mb-2">{{ y.theme }}</p>
              <div class="flex gap-1">
                <span
                  v-for="(c, ci) in y.colors"
                  :key="ci"
                  class="w-4 h-4 rounded-full border"
                  :style="{ background: c, borderColor: y.year === 2026 ? 'rgba(255,255,255,0.2)' : border }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FAQ ============ -->
    <section id="faq" class="py-20 md:py-28" :style="{ borderTop: `1px solid ${border}`, background: surface }">
      <div class="max-w-3xl mx-auto px-6 md:px-16">
        <p class="text-xs tracking-[0.35em] uppercase mb-3" :style="{ color: accent, fontFamily: typo.mono }">FAQ</p>
        <h2 :style="{ fontFamily: typo.display, fontSize: typo.h2, fontWeight: 700, lineHeight: '1.05', letterSpacing: '-0.02em', fontStyle: 'italic' }">
          Pertanyaan umum.
        </h2>

        <div class="mt-10 space-y-0">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            :style="{ borderBottom: `1px solid ${border}` }"
          >
            <button
              class="w-full flex items-center justify-between py-5 text-left cursor-pointer"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="text-sm font-medium pr-4">{{ faq.q }}</span>
              <span
                class="text-lg flex-shrink-0 transition-transform duration-200"
                :style="{ color: muted, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }"
              >+</span>
            </button>
            <div
              v-if="openFaq === i"
              class="pb-5 -mt-1"
            >
              <p class="text-sm leading-relaxed" :style="{ color: muted }">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <TmplFooter
      brand-name="ForumID"
      variant="columns"
      :accent="accent"
      :bg="fg"
      :text="bg"
      signature="Festival Desain & Kreatif Indonesia"
      :links="[
        { label: 'Lineup', href: '#lineup' },
        { label: 'Jadwal', href: '#jadwal' },
        { label: 'Tiket', href: '#tiket' },
        { label: 'Venue', href: '#venue' },
        { label: 'Arsip', href: '#arsip' },
        { label: 'FAQ', href: '#faq' },
      ]"
    />

    <!-- WhatsApp FAB -->
    <div class="fixed bottom-5 right-5 z-50">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div v-if="fabOpen" class="absolute bottom-full right-0 mb-3 w-72 rounded-xl shadow-2xl p-4" :style="{ background: surfaceElevated, border: `1px solid ${border}` }">
          <p class="text-sm font-semibold mb-2">Tertarik dengan ForumID?</p>
          <p class="text-xs mb-3" :style="{ color: muted }">Chat langsung untuk diskusi tiket, grup, atau sponsorship.</p>
          <a
            :href="waUrl"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
            style="background: #22c55e;"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat WhatsApp
          </a>
        </div>
      </Transition>
      <button
        class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
        style="background: #22c55e;"
        @click="fabOpen = !fabOpen"
      >
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </button>
    </div>
  </div>
</template>
