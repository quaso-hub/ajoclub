<script setup lang="ts">
/**
 * event-2.vue: NadaFest 2026
 * The Sound of the Archipelago.
 * 3 nights, 4 stages, 16 acts. GWK Cultural Park, Bali.
 * Audio-reactive icosahedron + 5k particle cloud. Anton H1, Inter body.
 * Hot magenta accent. Force dark.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('event-2')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme
useScrollReveal('event-2')
const { buildUrl } = useWhatsApp()

const ACCENT = 'oklch(68% 0.28 350)'
const ACCENT_HEX = '#FF3E66'

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeNight = ref(0)
const selectedTier = ref('regular')
const openFaq = ref<number | null>(null)

onMounted(() => { setTimeout(() => { heroLoaded.value = true }, 120) })

// ============================================================
// LINEUP — 16 acts, real Indonesian indie/DJ names
// ============================================================
interface Act {
  id: number
  name: string
  genre: string
  stage: string
  stageShort: string
  night: number
  time: string
  isHeadliner: boolean
}

const acts: Act[] = [
  { id: 1, name: 'Sal Priadi', genre: 'Singer-songwriter', stage: 'Panggung Utama', stageShort: 'PU', night: 0, time: '21:30', isHeadliner: true },
  { id: 2, name: '.Feast', genre: 'Post-punk / Rock', stage: 'Panggung Utama', stageShort: 'PU', night: 1, time: '22:00', isHeadliner: true },
  { id: 3, name: 'Hindia', genre: 'Indie pop / R&B', stage: 'Panggung Utama', stageShort: 'PU', night: 2, time: '21:00', isHeadliner: true },
  { id: 4, name: 'Nadin Amizah', genre: 'Indie folk', stage: 'Panggung Kecil', stageShort: 'PK', night: 0, time: '19:30', isHeadliner: false },
  { id: 5, name: 'Barasuara', genre: 'Post-rock / Math rock', stage: 'Panggung Utama', stageShort: 'PU', night: 0, time: '19:00', isHeadliner: false },
  { id: 6, name: 'Pamungkas', genre: 'Indie pop', stage: 'Panggung Kecil', stageShort: 'PK', night: 1, time: '20:00', isHeadliner: false },
  { id: 7, name: 'Fourtwnty', genre: 'Folk / Reggae', stage: 'Panggung Utama', stageShort: 'PU', night: 1, time: '19:00', isHeadliner: false },
  { id: 8, name: 'Tulus', genre: 'Pop / Jazz', stage: 'Panggung Utama', stageShort: 'PU', night: 2, time: '22:30', isHeadliner: true },
  { id: 9, name: 'Reality Club', genre: 'Indie rock', stage: 'Panggung Kecil', stageShort: 'PK', night: 0, time: '20:30', isHeadliner: false },
  { id: 10, name: 'Danilla', genre: 'Jazz / Pop', stage: 'Akustik', stageShort: 'AK', night: 1, time: '18:30', isHeadliner: false },
  { id: 11, name: 'Burgerkill', genre: 'Metalcore', stage: 'Panggung Utama', stageShort: 'PU', night: 2, time: '19:30', isHeadliner: false },
  { id: 12, name: 'Ardhito Pramono', genre: 'Jazz / Pop', stage: 'Akustik', stageShort: 'AK', night: 0, time: '18:00', isHeadliner: false },
  { id: 13, name: 'Diskoria', genre: 'Disco / Funk', stage: 'DJ Booth', stageShort: 'DJ', night: 1, time: '23:00', isHeadliner: false },
  { id: 14, name: 'HMGNC', genre: 'Synthpop / Electronic', stage: 'DJ Booth', stageShort: 'DJ', night: 0, time: '23:30', isHeadliner: false },
  { id: 15, name: 'Nosstress', genre: 'Folk / Comedy', stage: 'Akustik', stageShort: 'AK', night: 2, time: '18:00', isHeadliner: false },
  { id: 16, name: 'Stand Here Alone', genre: 'Pop punk', stage: 'Panggung Kecil', stageShort: 'PK', night: 2, time: '20:00', isHeadliner: false },
]

const stages = ['Panggung Utama', 'Panggung Kecil', 'DJ Booth', 'Akustik']
const stageShort: Record<string, string> = {
  'Panggung Utama': 'PU',
  'Panggung Kecil': 'PK',
  'DJ Booth': 'DJ',
  'Akustik': 'AK',
}

const nights = [
  { label: 'Jumat', date: '7 Agustus', short: 'Jumat 7/8' },
  { label: 'Sabtu', date: '8 Agustus', short: 'Sabtu 8/8' },
  { label: 'Minggu', date: '9 Agustus', short: 'Minggu 9/8' },
]

const lineupByNight = computed(() => {
  return acts.filter(a => a.night === activeNight.value).sort((a, b) => {
    if (a.isHeadliner !== b.isHeadliner) return a.isHeadliner ? -1 : 1
    return a.time.localeCompare(b.time)
  })
})

// ============================================================
// SCHEDULE — 3 nights x 4 time slots x 4 stages
// ============================================================
const timeSlots = ['18:00', '19:30', '21:00', '22:30']

interface ScheduleCell {
  act: Act | null
  label: string
}

const scheduleGrid = computed(() => {
  return timeSlots.map(time => {
    const cells = stages.map(stage => {
      const act = acts.find(a => a.night === activeNight.value && a.stage === stage && a.time === time)
      return { act, label: act ? act.name : '-' }
    })
    return { time, cells }
  })
})

// ============================================================
// TICKETS — 4 tiers
// ============================================================
const tiers = [
  {
    id: 'earlybird',
    name: 'Early Bird',
    price: 'Rp 350.000',
    priceNum: 350000,
    desc: 'Akses 1 hari.',
    perks: ['1 hari semua panggung', 'Gelang festival', 'Peta digital'],
    remaining: 420,
    tag: 'Hampir habis',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 'Rp 750.000',
    priceNum: 750000,
    desc: 'Pass 3 hari. Semua panggung.',
    perks: ['3 hari semua panggung', 'Gelang festival', 'Peta digital', 'Food court'],
    remaining: 1800,
    tag: null,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 'Rp 2.500.000',
    priceNum: 2500000,
    desc: 'Area depan panggung + fast-track.',
    perks: ['Semua Regular', 'VIP viewing area', 'Fast-track entry', 'Merch eksklusif', 'Lounge ber-AC'],
    remaining: 340,
    tag: 'Favorit',
  },
  {
    id: 'backstage',
    name: 'Backstage',
    price: 'Rp 5.000.000',
    priceNum: 5000000,
    desc: 'Meet & greet. Tur backstage.',
    perks: ['Semua VIP', 'Meet & greet artis', 'Tur backstage', 'F&B sepuasnya', 'Poster signed'],
    remaining: 50,
    tag: 'Sangat terbatas',
  },
]

// ============================================================
// FAQ
// ============================================================
const faqs = [
  { q: 'Tiket bisa dipindahtangankan?', a: 'Bisa. Transfer via dashboard pembelian maksimal 3 hari sebelum acara. Nama harus sesuai KTP.' },
  { q: 'Anak di bawah umur?', a: 'Di bawah 12 tahun wajib didampingi orang tua. Di bawah 5 tahun gratis. 12–17 tahun wajib tiket + surat izin.' },
  { q: 'Parkir?', a: 'Motor Rp 15.000, mobil Rp 30.000/hari. Shuttle tersedia dari Kuta & Seminyak.' },
  { q: 'Boleh bawa kamera?', a: 'Pocket & HP boleh. DSLR/mirrorless butuh akreditasi media. GoPro boleh.' },
  { q: 'Kalau hujan?', a: 'Tetap jalan. Semua panggung beratap. Jas hujan boleh, payung dilarang.' },
  { q: 'Makanan halal?', a: 'Semua vendor wajib halal atau non-babi. Ada area vegetarian & vegan.' },
]

// ============================================================
// SPONSORS
// ============================================================
const sponsors = {
  platinum: ['Bintang', 'Gojek'],
  gold: ['Tokopedia', 'Wardah', 'Dunlop Audio'],
  silver: ['Shopee', 'DANA', 'Pioneer DJ'],
}

// ============================================================
// COUNTDOWN
// ============================================================
const festivalDate = new Date('2026-08-07T16:00:00+08:00')
const now = ref(Date.now())
let raf = 0

const countdown = computed(() => {
  const diff = Math.max(0, festivalDate.getTime() - now.value)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)
  return { d, h, m, s }
})

function pad(n: number) { return n.toString().padStart(2, '0') }

onMounted(() => {
  raf = requestAnimationFrame(function tick() {
    now.value = Date.now()
    raf = requestAnimationFrame(tick)
  })
})
onBeforeUnmount(() => { if (raf) cancelAnimationFrame(raf) })

// ============================================================
// WA
// ============================================================
const waUrl = buildUrl('Halo, saya mau tanya soal NadaFest 2026.')
</script>

<template>
  <div :style="styles" class="min-h-screen antialiased selection:bg-[var(--tmpl-accent)] selection:text-white">

    <!-- ============================================================
         NAV
    ============================================================ -->
    <TmplNavbar
      brand="NadaFest"
      :links="[
        { label: 'Lineup', href: '#lineup' },
        { label: 'Jadwal', href: '#jadwal' },
        { label: 'Tiket', href: '#tiket' },
        { label: 'Venue', href: '#venue' },
        { label: 'FAQ', href: '#faq' },
      ]"
      :accent="ACCENT_HEX"
      style="glass"
      force-mode="dark"
      :show-whatsapp-cta="true"
      whatsapp-message="Halo, saya mau tanya soal NadaFest 2026."
    />

    <!-- ============================================================
         SECTION 1 — HERO + 3D
    ============================================================ -->
    <section id="top" class="relative min-h-[100dvh] flex items-center overflow-hidden">
      <!-- 3D Canvas -->
      <ClientOnly>
        <TmplExperienceCanvas
          preset="shader-portal"
          :accent="ACCENT_HEX"
          intensity="immersive"
          label="NadaFest audio-reactive icosahedron"
          class="absolute inset-0 z-0 opacity-40"
        />
      </ClientOnly>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 z-[1] pointer-events-none" style="background: linear-gradient(to bottom, transparent 30%, var(--tmpl-bg) 95%);" />

      <!-- Content -->
      <div class="relative z-10 w-full max-w-6xl mx-auto px-6 py-28 text-center">
        <!-- Skeleton -->
        <template v-if="!heroLoaded">
          <div class="h-4 w-56 bg-white/10 rounded mb-6 mx-auto animate-pulse" />
          <div class="h-24 w-full bg-white/10 rounded mb-8 animate-pulse" />
          <div class="h-5 w-2/3 bg-white/10 rounded mb-10 mx-auto animate-pulse" />
          <div class="h-14 w-56 bg-white/10 rounded-full mx-auto animate-pulse" />
        </template>

        <template v-else>
          <!-- Eyebrow -->
          <p class="text-[11px] tracking-[0.35em] uppercase mb-6" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">
            GWK Cultural Park, Bali &middot; 7&ndash;9 Agustus 2026
          </p>

          <!-- H1 -->
          <h1 :style="h1Style" class="mb-4">
            <span style="background: linear-gradient(135deg, oklch(70% 0.25 25), oklch(68% 0.28 350), oklch(60% 0.30 305)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              NadaFest
            </span>
          </h1>
          <p class="text-xl md:text-2xl font-light tracking-tight mb-2" style="color: var(--tmpl-fg); font-family: var(--tmpl-font-display);">
            The Sound of the Archipelago
          </p>
          <p class="text-sm mb-10 max-w-md mx-auto leading-relaxed italic" style="color: var(--tmpl-muted);">
            Musik yang tidak bisa dideskripsikan.
          </p>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#tiket"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              :style="{ background: ACCENT }"
            >
              Beli Tiket &mdash; Rp 750.000
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a
              href="#lineup"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium border transition-colors"
              style="border-color: color-mix(in srgb, currentColor 20%, transparent); color: var(--tmpl-fg);"
            >
              Lihat Lineup
            </a>
          </div>

          <!-- Countdown blocks -->
          <div class="flex items-end justify-center gap-3" style="font-family: var(--tmpl-font-mono);">
            <div class="flex flex-col items-center min-w-[3.5rem] px-3 py-2 rounded-lg" style="background: color-mix(in srgb, var(--tmpl-fg) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
              <span class="text-2xl font-bold tabular-nums" style="color: var(--tmpl-fg);">{{ pad(countdown.d) }}</span>
              <span class="text-[9px] tracking-[0.2em] uppercase mt-0.5" style="color: var(--tmpl-muted);">hari</span>
            </div>
            <span class="text-xl font-bold mb-2 opacity-30">:</span>
            <div class="flex flex-col items-center min-w-[3.5rem] px-3 py-2 rounded-lg" style="background: color-mix(in srgb, var(--tmpl-fg) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
              <span class="text-2xl font-bold tabular-nums" style="color: var(--tmpl-fg);">{{ pad(countdown.h) }}</span>
              <span class="text-[9px] tracking-[0.2em] uppercase mt-0.5" style="color: var(--tmpl-muted);">jam</span>
            </div>
            <span class="text-xl font-bold mb-2 opacity-30">:</span>
            <div class="flex flex-col items-center min-w-[3.5rem] px-3 py-2 rounded-lg" style="background: color-mix(in srgb, var(--tmpl-fg) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
              <span class="text-2xl font-bold tabular-nums" style="color: var(--tmpl-fg);">{{ pad(countdown.m) }}</span>
              <span class="text-[9px] tracking-[0.2em] uppercase mt-0.5" style="color: var(--tmpl-muted);">menit</span>
            </div>
            <span class="text-xl font-bold mb-2 opacity-30">:</span>
            <div class="flex flex-col items-center min-w-[3.5rem] px-3 py-2 rounded-lg" style="background: color-mix(in srgb, var(--tmpl-fg) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
              <span class="text-2xl font-bold tabular-nums" style="color: var(--tmpl-fg);">{{ pad(countdown.s) }}</span>
              <span class="text-[9px] tracking-[0.2em] uppercase mt-0.5" style="color: var(--tmpl-muted);">detik</span>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Marquee band -->
    <TmplMarquee
      :items="['NadaFest 2026', 'GWK Cultural Park', 'Bali', '7-9 Agustus', '4 Panggung', '16 Artis', '3 Malam']"
      separator="&#x2022;"
      speed="slow"
      :accent="ACCENT_HEX"
      class="py-4 border-y"
      style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);"
    />

    <!-- ============================================================
         SECTION 2 — LINEUP
    ============================================================ -->
    <section id="lineup" class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Header -->
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">Lineup</p>
        <h2 :style="h2Style" class="mb-4" style="color: var(--tmpl-fg);">Siapa yang main.</h2>
        <p class="text-sm mb-10 max-w-md" style="color: var(--tmpl-muted);">
          16 artis. Folk ke metalcore. Singer-songwriter ke DJ.
        </p>

        <!-- Night tabs -->
        <div class="flex gap-2 mb-10">
          <button
            v-for="(night, i) in nights"
            :key="i"
            @click="activeNight = i"
            class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            :style="activeNight === i
              ? { background: ACCENT, color: '#fff' }
              : { background: 'color-mix(in srgb, var(--tmpl-fg) 6%, transparent)', color: 'var(--tmpl-muted)', border: '1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent)' }
            "
          >
            {{ night.label }} {{ night.date }}
          </button>
        </div>

        <!-- Lineup list -->
        <div class="border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
          <div
            v-for="act in lineupByNight"
            :key="act.id"
            class="group grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_140px_80px_80px] gap-4 md:gap-6 items-center py-5 border-b transition-colors cursor-pointer -mx-2 px-2 rounded-lg"
            style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);"
            @mouseenter="$event.currentTarget.style.background = 'color-mix(in srgb, var(--tmpl-accent) 5%, transparent)'"
            @mouseleave="$event.currentTarget.style.background = 'transparent'"
          >
            <!-- Name + genre -->
            <div>
              <p
                class="text-lg md:text-xl font-bold transition-colors group-hover:text-[var(--tmpl-accent)]"
                :style="{ color: act.isHeadliner ? 'var(--tmpl-accent)' : 'var(--tmpl-fg)' }"
              >
                {{ act.name }}
                <span v-if="act.isHeadliner" class="ml-2 text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full font-semibold" :style="{ background: ACCENT, color: '#fff' }">Headliner</span>
              </p>
              <p class="text-xs mt-0.5" style="color: var(--tmpl-muted);">{{ act.genre }}</p>
            </div>

            <!-- Stage (desktop) -->
            <p class="hidden md:block text-[11px] tracking-[0.15em] uppercase text-right" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">
              {{ act.stage }}
            </p>

            <!-- Time -->
            <p class="text-[11px] tracking-[0.1em] uppercase text-right" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">
              {{ act.time }}
            </p>

            <!-- Audio hint (desktop) -->
            <div class="hidden md:flex items-center justify-end">
              <span class="text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-60 transition-opacity" style="font-family: var(--tmpl-font-mono);">
                &#9835; preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 3 — JADWAL (Schedule Grid)
    ============================================================ -->
    <section id="jadwal" class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent); background: var(--tmpl-surface);">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">Jadwal</p>
        <h2 :style="h2Style" class="mb-4" style="color: var(--tmpl-fg);">Tiga malam, empat panggung.</h2>
        <p class="text-sm mb-10 max-w-lg" style="color: var(--tmpl-muted);">
          Pilih malam. Gerbang buka 16.00 WITA.
        </p>

        <!-- Night selector -->
        <div class="flex gap-2 mb-8">
          <button
            v-for="(night, i) in nights"
            :key="i"
            @click="activeNight = i"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            :style="activeNight === i
              ? { background: ACCENT, color: '#fff' }
              : { background: 'color-mix(in srgb, var(--tmpl-fg) 5%, transparent)', color: 'var(--tmpl-muted)', border: '1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent)' }
            "
          >
            {{ night.short }}
          </button>
        </div>

        <!-- Grid -->
        <div class="overflow-x-auto -mx-6 px-6">
          <div class="min-w-[640px]">
            <!-- Header row -->
            <div class="grid gap-2 mb-2" data-reveal="stagger-children" style="grid-template-columns: 72px repeat(4, 1fr);">
              <div />
              <div
                v-for="stage in stages"
                :key="stage"
                class="text-[10px] tracking-[0.2em] uppercase text-center py-2 rounded-t-lg font-semibold"
                style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono); background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent);"
              >
                {{ stageShort[stage] }}
              </div>
            </div>

            <!-- Rows -->
            <div
              v-for="row in scheduleGrid"
              :key="row.time"
              class="grid gap-2 mb-2"
              style="grid-template-columns: 72px repeat(4, 1fr);"
            >
              <!-- Time rail -->
              <div
                class="flex items-center justify-center text-xs font-semibold rounded-lg"
                style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono); background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent);"
              >
                {{ row.time }}
              </div>

              <!-- Cells -->
              <div
                v-for="(cell, ci) in row.cells"
                :key="ci"
                class="rounded-lg px-3 py-3 text-center transition-colors cursor-default"
                :style="cell.act
                  ? { background: cell.act.isHeadliner ? 'color-mix(in srgb, var(--tmpl-accent) 15%, transparent)' : 'color-mix(in srgb, var(--tmpl-fg) 6%, transparent)', border: cell.act.isHeadliner ? '1px solid color-mix(in srgb, var(--tmpl-accent) 30%, transparent)' : '1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent)' }
                  : { background: 'color-mix(in srgb, var(--tmpl-fg) 2%, transparent)', border: '1px solid color-mix(in srgb, var(--tmpl-fg) 5%, transparent)' }
                "
              >
                <p v-if="cell.act" class="text-sm font-semibold" :style="{ color: cell.act.isHeadliner ? 'var(--tmpl-accent)' : 'var(--tmpl-fg)' }">
                  {{ cell.act.name }}
                </p>
                <p v-if="cell.act" class="text-[10px] mt-0.5" style="color: var(--tmpl-muted);">{{ cell.act.genre }}</p>
                <p v-if="!cell.act" class="text-xs opacity-30">&mdash;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 4 — TIKET
    ============================================================ -->
    <section id="tiket" class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">Tiket</p>
        <h2 :style="h2Style" class="mb-4" style="color: var(--tmpl-fg);">Pilih tier kamu.</h2>
        <p class="text-sm mb-10 max-w-lg" style="color: var(--tmpl-muted);">
          Semua tier akses semua panggung. Yang beda pengalamannya.
        </p>

        <div class="grid md:grid-cols-2 gap-4" data-reveal="stagger-children">
          <div
            v-for="tier in tiers"
            :key="tier.id"
            @click="selectedTier = tier.id"
            class="relative rounded-lg p-6 md:p-8 cursor-pointer transition-all"
            :style="selectedTier === tier.id
              ? { background: 'color-mix(in srgb, var(--tmpl-accent) 8%, transparent)', border: '2px solid color-mix(in srgb, var(--tmpl-accent) 40%, transparent)', transform: 'scale(1.01)' }
              : { background: 'var(--tmpl-surface)', border: '1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent)' }
            "
          >
            <!-- Tag -->
            <span
              v-if="tier.tag"
              class="absolute top-4 right-4 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-semibold"
              :style="{ background: ACCENT, color: '#fff' }"
            >
              {{ tier.tag }}
            </span>

            <p class="text-sm font-semibold mb-1" :style="{ color: selectedTier === tier.id ? 'var(--tmpl-accent)' : 'var(--tmpl-muted)' }">
              {{ tier.name }}
            </p>
            <p class="text-3xl md:text-4xl font-bold mb-2" :style="h1Style" style="font-size: clamp(1.75rem, 4vw, 2.5rem); line-height: 1.1; color: var(--tmpl-fg);">
              {{ tier.price }}
            </p>
            <p class="text-sm mb-5" style="color: var(--tmpl-muted);">{{ tier.desc }}</p>

            <!-- Perks -->
            <ul class="space-y-2 mb-6">
              <li v-for="perk in tier.perks" :key="perk" class="flex items-start gap-2 text-sm" style="color: var(--tmpl-fg);">
                <svg class="w-4 h-4 mt-0.5 shrink-0" :style="{ color: 'var(--tmpl-accent)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                {{ perk }}
              </li>
            </ul>

            <!-- Remaining -->
            <p class="text-[11px] font-mono tracking-wider" style="color: var(--tmpl-muted);">
              Sisa {{ tier.remaining.toLocaleString('id-ID') }} tiket
            </p>

            <!-- CTA -->
            <a
              href="#"
              class="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.98]"
              :style="selectedTier === tier.id
                ? { background: ACCENT, color: '#fff' }
                : { background: 'color-mix(in srgb, var(--tmpl-fg) 8%, transparent)', color: 'var(--tmpl-fg)', border: '1px solid color-mix(in srgb, var(--tmpl-fg) 15%, transparent)' }
              "
            >
              Beli {{ tier.name }}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 5 — VENUE + MAP
    ============================================================ -->
    <section id="venue" class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent); background: var(--tmpl-surface);">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">Venue</p>
        <h2 :style="h2Style" class="mb-4" style="color: var(--tmpl-fg);">GWK Cultural Park, Bali.</h2>
        <p class="text-sm mb-10 max-w-xl" style="color: var(--tmpl-muted);">
          60 hektar di Jimbaran. 4 panggung terbuka dengan patung GWK setinggi 121m.
        </p>

        <div class="grid md:grid-cols-[3fr_2fr] gap-8" data-reveal="stagger-children">
          <!-- Map placeholder -->
          <div class="aspect-[4/3] rounded-lg overflow-hidden" style="background: color-mix(in srgb, var(--tmpl-fg) 5%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent);">
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <p class="text-xs" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">-8.8106, 115.1674</p>
                <p class="text-[10px] mt-1 opacity-50">GWK Cultural Park, Jimbaran</p>
              </div>
            </div>
          </div>

          <!-- Stage breakdown -->
          <div class="space-y-4">
            <div
              v-for="stage in stages"
              :key="stage"
              class="flex items-start gap-4 p-4 rounded-lg"
              style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style="background: color-mix(in srgb, var(--tmpl-accent) 15%, transparent); color: var(--tmpl-accent); font-family: var(--tmpl-font-mono);">
                {{ stageShort[stage] }}
              </div>
              <div>
                <p class="text-sm font-semibold" style="color: var(--tmpl-fg);">{{ stage }}</p>
                <p class="text-xs mt-0.5" style="color: var(--tmpl-muted);">
                  <template v-if="stage === 'Panggung Utama'">4.500 kapasitas. Headliner.</template>
                  <template v-else-if="stage === 'Panggung Kecil'">2.000 kapasitas. Indie & emerging.</template>
                  <template v-else-if="stage === 'DJ Booth'">1.200 kapasitas. Electronic & dance.</template>
                  <template v-else>800 kapasitas. Intimate & akustik.</template>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Practical info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12" data-reveal="stagger-children">
          <div class="p-4 rounded-lg text-center" style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
            <p class="text-2xl font-bold" style="color: var(--tmpl-accent); font-family: var(--tmpl-font-mono);">16.00</p>
            <p class="text-[10px] tracking-[0.15em] uppercase mt-1" style="color: var(--tmpl-muted);">Gates buka (WITA)</p>
          </div>
          <div class="p-4 rounded-lg text-center" style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
            <p class="text-2xl font-bold" style="color: var(--tmpl-accent); font-family: var(--tmpl-font-mono);">02.00</p>
            <p class="text-[10px] tracking-[0.15em] uppercase mt-1" style="color: var(--tmpl-muted);">Gates tutup (WITA)</p>
          </div>
          <div class="p-4 rounded-lg text-center" style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
            <p class="text-2xl font-bold" style="color: var(--tmpl-accent); font-family: var(--tmpl-font-mono);">8.500</p>
            <p class="text-[10px] tracking-[0.15em] uppercase mt-1" style="color: var(--tmpl-muted);">Kapasitas per malam</p>
          </div>
          <div class="p-4 rounded-lg text-center" style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
            <p class="text-2xl font-bold" style="color: var(--tmpl-accent); font-family: var(--tmpl-font-mono);">25.500</p>
            <p class="text-[10px] tracking-[0.15em] uppercase mt-1" style="color: var(--tmpl-muted);">Total 3 hari</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 6 — SPONSOR GRID
    ============================================================ -->
    <section class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">Didukung oleh</p>
        <h2 :style="h2Style" class="mb-10" style="color: var(--tmpl-fg);">Partner kami.</h2>

        <!-- Platinum -->
        <p class="text-[10px] tracking-[0.25em] uppercase mb-4 font-semibold" style="color: var(--tmpl-accent);">Platinum</p>
        <div class="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div
            v-for="s in sponsors.platinum"
            :key="s"
            class="px-8 py-4 rounded-lg text-lg font-bold tracking-tight transition-all hover:scale-105"
            style="background: color-mix(in srgb, var(--tmpl-fg) 6%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 10%, transparent); color: var(--tmpl-fg);"
          >
            {{ s }}
          </div>
        </div>

        <!-- Gold -->
        <p class="text-[10px] tracking-[0.25em] uppercase mb-4 font-semibold" style="color: var(--tmpl-muted);">Gold</p>
        <div class="flex flex-wrap items-center justify-center gap-4 mb-10">
          <div
            v-for="s in sponsors.gold"
            :key="s"
            class="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105"
            style="background: color-mix(in srgb, var(--tmpl-fg) 4%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent); color: var(--tmpl-muted);"
          >
            {{ s }}
          </div>
        </div>

        <!-- Silver -->
        <p class="text-[10px] tracking-[0.25em] uppercase mb-4 font-semibold" style="color: var(--tmpl-muted);">Silver</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <div
            v-for="s in sponsors.silver"
            :key="s"
            class="px-5 py-2.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style="background: color-mix(in srgb, var(--tmpl-fg) 3%, transparent); border: 1px solid color-mix(in srgb, var(--tmpl-fg) 6%, transparent); color: var(--tmpl-muted);"
          >
            {{ s }}
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 7 — FAQ
    ============================================================ -->
    <section id="faq" class="py-24 md:py-32 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent); background: var(--tmpl-surface);">
      <div class="max-w-3xl mx-auto px-6">
        <p class="text-[11px] tracking-[0.35em] uppercase mb-3" style="color: var(--tmpl-muted); font-family: var(--tmpl-font-mono);">FAQ</p>
        <h2 :style="h2Style" class="mb-10" style="color: var(--tmpl-fg);">Pertanyaan umum.</h2>

        <div class="space-y-2">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="rounded-lg overflow-hidden transition-colors"
            style="border: 1px solid color-mix(in srgb, var(--tmpl-fg) 8%, transparent);"
            :style="openFaq === i ? { background: 'color-mix(in srgb, var(--tmpl-fg) 4%, transparent)' } : {}"
          >
            <button
              @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
              style="color: var(--tmpl-fg);"
            >
              <span>{{ faq.q }}</span>
              <svg
                class="w-4 h-4 shrink-0 transition-transform"
                :style="{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--tmpl-muted)' }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaq === i" class="overflow-hidden">
                <p class="px-5 pb-4 text-sm leading-relaxed" style="color: var(--tmpl-muted);">
                  {{ faq.a }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 8 — FOOTER
    ============================================================ -->
    <footer class="py-16 border-t" data-reveal="fade-up" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-10 mb-12" data-reveal="stagger-children">
          <!-- Brand -->
          <div>
            <p class="text-2xl font-bold mb-3" style="font-family: var(--tmpl-font-display); color: var(--tmpl-fg);">NadaFest</p>
            <p class="text-sm leading-relaxed" style="color: var(--tmpl-muted);">
              Musik yang tidak bisa dideskripsikan. GWK Cultural Park, Bali.
            </p>
          </div>

          <!-- Links -->
          <div>
            <p class="text-[10px] tracking-[0.25em] uppercase font-semibold mb-4" style="color: var(--tmpl-muted);">Navigasi</p>
            <div class="space-y-2">
              <a href="#lineup" class="block text-sm transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">Lineup</a>
              <a href="#jadwal" class="block text-sm transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">Jadwal</a>
              <a href="#tiket" class="block text-sm transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">Tiket</a>
              <a href="#venue" class="block text-sm transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">Venue</a>
              <a href="#faq" class="block text-sm transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">FAQ</a>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <p class="text-[10px] tracking-[0.25em] uppercase font-semibold mb-4" style="color: var(--tmpl-muted);">Hubungi kami</p>
            <a :href="waUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-fg);">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat WhatsApp
            </a>
            <p class="text-xs mt-4" style="color: var(--tmpl-muted);">
              <a href="mailto:info@nadafest.id" class="hover:text-[var(--tmpl-accent)] transition-colors">info@nadafest.id</a>
            </p>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t" style="border-color: color-mix(in srgb, var(--tmpl-fg) 8%, transparent);">
          <p class="text-xs" style="color: var(--tmpl-muted);">&copy; 2026 NadaFest. Hak cipta dilindungi.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-xs transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-muted);">Instagram</a>
            <a href="#" class="text-xs transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-muted);">TikTok</a>
            <a href="#" class="text-xs transition-colors hover:text-[var(--tmpl-accent)]" style="color: var(--tmpl-muted);">Twitter</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="event"
    />

  </div>
</template>
