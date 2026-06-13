<script setup lang="ts">
/**
 * saas-2.vue — Kas
 * Dashboard-First SaaS. Linear/Vercel/Stripe aesthetic.
 * Interactive product UI as hero. Dark theme, electric blue.
 *
 * 8 sections: Hero → Pricing → Features → Kenapa Kas → Integrations → FAQ → CTA → Footer
 * 6+ working interactions beyond hero
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('saas-2')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme

const accentColor = computed(() => {
  const a = palette.accent
  return `oklch(${a.l}% ${a.c} ${a.h})`
})

// ============================================================
// REDUCED MOTION
// ============================================================
const isReducedMotion = ref(false)

// ============================================================
// DASHBOARD STATE
// ============================================================
type TimeRange = 'hari' | 'minggu' | 'bulan' | 'custom'
const activeTimeRange = ref<TimeRange>('bulan')
const activeSidebar = ref('beranda')
const cmdOpen = ref(false)
const cmdQuery = ref('')
const cmdSelected = ref(0)
const notifOpen = ref(false)
const profileOpen = ref(false)
const toastMsg = ref('')
let toastTimer: number | null = null

function showToast(msg: string) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toastMsg.value = '' }, 3500)
}

// ============================================================
// KPI DATA (per time range)
// ============================================================
interface KpiData {
  pendapatan: number
  pendapatanDelta: string
  faktur: number
  fakturCount: number
  fakturDelta: string
  proyek: number
  proyekSub: string
  klien: number
  klienSub: string
}

const kpiMap: Record<TimeRange, KpiData> = {
  hari: {
    pendapatan: 4825000, pendapatanDelta: '+12,5%',
    faktur: 1250000, fakturCount: 2, fakturDelta: '-1',
    proyek: 5, proyekSub: '2 deadline hari ini',
    klien: 1, klienSub: 'dari Jakarta',
  },
  minggu: {
    pendapatan: 28450000, pendapatanDelta: '+9,8%',
    faktur: 8200000, fakturCount: 4, fakturDelta: '-2',
    proyek: 9, proyekSub: '4 deadline minggu ini',
    klien: 3, klienSub: 'dari 3 kota',
  },
  bulan: {
    pendapatan: 247500000, pendapatanDelta: '+18,2%',
    faktur: 38200000, fakturCount: 12, fakturDelta: '-3',
    proyek: 12, proyekSub: '3 deadline minggu ini',
    klien: 8, klienSub: 'dari 4 kota',
  },
  custom: {
    pendapatan: 182300000, pendapatanDelta: '+14,1%',
    faktur: 22800000, fakturCount: 8, fakturDelta: '-1',
    proyek: 10, proyekSub: '5 deadline dekat',
    klien: 6, klienSub: 'dari 3 kota',
  },
}

const kpi = computed(() => kpiMap[activeTimeRange.value])

// ============================================================
// TABLE DATA
// ============================================================
interface TableRow {
  proyek: string
  sub: string
  klien: string
  nilai: number
  status: 'BERJALAN' | 'REVIEW' | 'MULAI' | 'LUNAS'
  deadline: string
  kota: string
}

const tableHari: TableRow[] = [
  { proyek: 'Desain Menu Baru', sub: 'Desain grafis', klien: 'Kedai Kopi Tjap', nilai: 2500000, status: 'BERJALAN', deadline: 'Hari ini', kota: 'Surabaya' },
  { proyek: 'Laporan Pajak Bulanan', sub: 'Konsultasi', klien: 'PT Surya Abadi', nilai: 1500000, status: 'REVIEW', deadline: 'Hari ini', kota: 'Jakarta' },
  { proyek: 'Update Stok Gudang', sub: 'Inventori', klien: 'Garuda Digital Printing', nilai: 850000, status: 'BERJALAN', deadline: 'Besok', kota: 'Medan' },
  { proyek: 'Kirim Invoice INV-092', sub: 'Faktur', klien: 'Bilik Kreasi', nilai: 4500000, status: 'MULAI', deadline: 'Hari ini', kota: 'Yogyakarta' },
  { proyek: 'Follow-up Pembayaran', sub: 'Tagihan', klien: 'FintechCo Indonesia', nilai: 12500000, status: 'REVIEW', deadline: 'Besok', kota: 'Bandung' },
]

const tableMinggu: TableRow[] = [
  { proyek: 'Website Korporat PT Surya', sub: 'Web development', klien: 'PT Surya Abadi', nilai: 45000000, status: 'BERJALAN', deadline: '28 Jun 2026', kota: 'Jakarta' },
  { proyek: 'Branding Kedai Tjap', sub: 'Branding', klien: 'Kedai Kopi Tjap', nilai: 18500000, status: 'REVIEW', deadline: '5 Jul 2026', kota: 'Surabaya' },
  { proyek: 'Company Profile Video', sub: 'Video produksi', klien: 'Bilik Kreasi', nilai: 12500000, status: 'MULAI', deadline: '22 Jul 2026', kota: 'Yogyakarta' },
  { proyek: 'Audit Keuangan Q2', sub: 'Konsultansi', klien: 'Bank Mitra Jaya', nilai: 34500000, status: 'REVIEW', deadline: '18 Jul 2026', kota: 'Surabaya' },
  { proyek: 'Event Bazaar Jakarta', sub: 'Event management', klien: 'Komunitas Kreatif Jakarta', nilai: 8200000, status: 'MULAI', deadline: '1 Agt 2026', kota: 'Jakarta' },
  { proyek: 'Maintenance Website', sub: 'Web maintenance', klien: 'Lumina Works', nilai: 3500000, status: 'BERJALAN', deadline: '30 Jun 2026', kota: 'Surabaya' },
  { proyek: 'Desain Kemasan Produk', sub: 'Desain grafis', klien: 'Rumah Reka', nilai: 7800000, status: 'BERJALAN', deadline: '10 Jul 2026', kota: 'Surabaya' },
  { proyek: 'Social Media Setup', sub: 'Digital marketing', klien: 'Aksara Co.', nilai: 5200000, status: 'MULAI', deadline: '8 Jul 2026', kota: 'Jakarta' },
]

const tableBulan: TableRow[] = [
  { proyek: 'Website Korporat PT Surya', sub: 'Web development', klien: 'PT Surya Abadi', nilai: 45000000, status: 'BERJALAN', deadline: '28 Jun 2026', kota: 'Jakarta' },
  { proyek: 'Branding Kedai Tjap', sub: 'Branding', klien: 'Kedai Kopi Tjap', nilai: 18500000, status: 'REVIEW', deadline: '5 Jul 2026', kota: 'Surabaya' },
  { proyek: 'Kampanye Ramadan 2026', sub: 'Campaign', klien: 'PT XYZ Indonesia', nilai: 125000000, status: 'LUNAS', deadline: 'Selesai', kota: 'Jakarta' },
  { proyek: 'Mobile App Dashboard', sub: 'App development', klien: 'FintechCo Indonesia', nilai: 89000000, status: 'BERJALAN', deadline: '15 Jul 2026', kota: 'Bandung' },
  { proyek: 'Company Profile Video', sub: 'Video produksi', klien: 'Bilik Kreasi', nilai: 12500000, status: 'MULAI', deadline: '22 Jul 2026', kota: 'Yogyakarta' },
  { proyek: 'Company Profile Garuda', sub: 'Web development', klien: 'Garuda Digital Printing', nilai: 67000000, status: 'BERJALAN', deadline: '30 Jun 2026', kota: 'Medan' },
  { proyek: 'Event Bazaar Jakarta 2026', sub: 'Event management', klien: 'Komunitas Kreatif Jakarta', nilai: 8200000, status: 'MULAI', deadline: '1 Agt 2026', kota: 'Jakarta' },
  { proyek: 'Audit Keuangan Q2', sub: 'Konsultansi', klien: 'Bank Mitra Jaya', nilai: 34500000, status: 'REVIEW', deadline: '18 Jul 2026', kota: 'Surabaya' },
]

const tableCustom: TableRow[] = [
  { proyek: 'Rebranding Sasana Visual', sub: 'Branding', klien: 'Sasana Visual', nilai: 22000000, status: 'BERJALAN', deadline: '20 Jul 2026', kota: 'Bandung' },
  { proyek: 'Aplikasi POS Warung', sub: 'App development', klien: 'Kedai Kopi Tjap', nilai: 15000000, status: 'MULAI', deadline: '25 Jul 2026', kota: 'Surabaya' },
  { proyek: 'Video Profil Garuda', sub: 'Video produksi', klien: 'Garuda Digital Printing', nilai: 18000000, status: 'REVIEW', deadline: '12 Jul 2026', kota: 'Medan' },
  { proyek: 'Laporan Q1 FintechCo', sub: 'Konsultansi', klien: 'FintechCo Indonesia', nilai: 9500000, status: 'LUNAS', deadline: 'Selesai', kota: 'Bandung' },
  { proyek: 'Desain Booth Pameran', sub: 'Desain interior', klien: 'Komunitas Kreatif Jakarta', nilai: 28000000, status: 'BERJALAN', deadline: '5 Agt 2026', kota: 'Jakarta' },
  { proyek: 'Foto Produk Katalog', sub: 'Fotografi', klien: 'Rumah Reka', nilai: 6500000, status: 'MULAI', deadline: '18 Jul 2026', kota: 'Surabaya' },
]

const tableData = computed(() => {
  switch (activeTimeRange.value) {
    case 'hari': return tableHari
    case 'minggu': return tableMinggu
    case 'bulan': return tableBulan
    case 'custom': return tableCustom
  }
})

// ============================================================
// SIDEBAR MENU
// ============================================================
const sidebarItems = [
  { key: 'beranda', label: 'Beranda', icon: 'i-lucide-layout-dashboard', count: 0 },
  { key: 'transaksi', label: 'Transaksi', icon: 'i-lucide-arrow-left-right', count: 89 },
  { key: 'klien', label: 'Klien', icon: 'i-lucide-users', count: 47 },
  { key: 'laporan', label: 'Laporan', icon: 'i-lucide-bar-chart-3', count: 0 },
  { key: 'tim', label: 'Tim', icon: 'i-lucide-user-cog', count: 5 },
  { key: 'pengaturan', label: 'Pengaturan', icon: 'i-lucide-settings', count: 0 },
]

// ============================================================
// COMMAND PALETTE
// ============================================================
const cmdItems = [
  { section: 'AKSI CEPAT', items: [
    { label: 'Tambah Proyek Baru', shortcut: 'P', icon: 'i-lucide-plus' },
    { label: 'Buat Faktur Baru', shortcut: 'F', icon: 'i-lucide-file-text' },
    { label: 'Undang Anggota Tim', shortcut: 'T', icon: 'i-lucide-user-plus' },
    { label: 'Buka Laporan Bulanan', shortcut: 'L', icon: 'i-lucide-bar-chart-3' },
  ]},
  { section: 'HALAMAN', items: [
    { label: 'Beranda', shortcut: '', icon: 'i-lucide-layout-dashboard' },
    { label: 'Transaksi', shortcut: '', icon: 'i-lucide-arrow-left-right' },
    { label: 'Klien', shortcut: '', icon: 'i-lucide-users' },
  ]},
  { section: 'TERAKHIR', items: [
    { label: 'Mobile App Dashboard - FintechCo', shortcut: '', icon: 'i-lucide-folder' },
    { label: 'INV-2026-089 - PT Surya Abadi', shortcut: '', icon: 'i-lucide-receipt' },
  ]},
]

const cmdFiltered = computed(() => {
  if (!cmdQuery.value) return cmdItems
  const q = cmdQuery.value.toLowerCase()
  return cmdItems
    .map(g => ({
      section: g.section,
      items: g.items.filter(i => i.label.toLowerCase().includes(q)),
    }))
    .filter(g => g.items.length > 0)
})

const cmdAllItems = computed(() => cmdFiltered.value.flatMap(g => g.items))

function openCmd() {
  cmdOpen.value = true
  cmdQuery.value = ''
  cmdSelected.value = 0
  nextTick(() => {
    const inp = document.getElementById('kas-cmd-input') as HTMLInputElement | null
    inp?.focus()
  })
}

function closeCmd() {
  cmdOpen.value = false
}

function cmdKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { closeCmd(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelected.value = Math.min(cmdSelected.value + 1, cmdAllItems.value.length - 1); return }
  if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelected.value = Math.max(cmdSelected.value - 1, 0); return }
  if (e.key === 'Enter') {
    const item = cmdAllItems.value[cmdSelected.value]
    if (item) { showToast(`Membuka ${item.label}`); closeCmd() }
  }
}

function cmdItemClick(label: string) {
  showToast(`Membuka ${label}`)
  closeCmd()
}

// Global keyboard listener
function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    cmdOpen.value ? closeCmd() : openCmd()
  }
}

// ============================================================
// PRICING
// ============================================================
const pricingTiers = [
  {
    key: 'pemula', name: 'Pemula', price: 0, suffix: '/bulan',
    desc: 'Untuk freelancer & UMKM 1 orang',
    features: ['1 pengguna', '100 transaksi/bulan', 'QRIS', 'Dashboard dasar', 'Laporan bulanan', 'Email support'],
    cta: 'Mulai Gratis', ctaStyle: 'ghost' as const,
  },
  {
    key: 'berkembang', name: 'Berkembang', price: 149000, suffix: '/bulan',
    desc: 'Untuk studio 3-15 orang', recommended: true,
    features: ['5 pengguna', 'Transaksi tak terbatas', 'QRIS + BI-FAST', 'Multi-cabang (2)', 'Laporan custom', 'WhatsApp support', '2 integrasi custom'],
    cta: 'Mulai 14 Hari', ctaStyle: 'primary' as const,
  },
  {
    key: 'skala', name: 'Skala', price: 449000, suffix: '/bulan',
    desc: 'Untuk agensi 15+ orang',
    features: ['Unlimited user', 'Multi-cabang unlimited', 'Custom domain', 'API + webhook', 'SSO', 'Account manager', 'SLA 99,9%', 'Semua integrasi'],
    cta: 'Hubungi Kami', ctaStyle: 'ghost' as const,
  },
]

const selectedTier = ref('berkembang')

// ============================================================
// FEATURES (3 interactive, 3 static)
// ============================================================
// Feature 1: Calculator
const calcUsers = ref(5)
const calcTx = ref(1200)
const calcCost = computed(() => {
  if (calcUsers.value <= 1 && calcTx.value <= 100) return { price: 0, tier: 'Pemula' }
  if (calcUsers.value <= 5 && calcTx.value <= 5000) return { price: 149000, tier: 'Berkembang' }
  if (calcUsers.value <= 15) return { price: 449000, tier: 'Skala' }
  return { price: 449000 + (calcUsers.value - 15) * 25000, tier: 'Skala' }
})

// Feature 2: QRIS
const qrisActive = ref(true)

// Feature 3: Integrations toggle
const integrationStates = ref<Record<string, boolean>>({
  QRIS: true, 'BI-FAST': true, BCA: true, Mandiri: true,
  GoPay: true, OVO: true, DANA: false, ShopeePay: true,
  Tokopedia: true, Shopee: false, WhatsApp: true, 'Google Sheets': true,
})

let integrationToggleCount = 0
function toggleIntegration(key: string) {
  integrationStates.value[key] = !integrationStates.value[key]
  integrationToggleCount++
  if (integrationToggleCount >= 3) {
    showToast('3 integrasi diperbarui')
    integrationToggleCount = 0
  }
}

// ============================================================
// FAQ
// ============================================================
const openFaq = ref<number | null>(0)
const faqs = [
  { q: 'Apa itu Kas?', a: 'Kas adalah aplikasi kasir, faktur, inventori, dan laporan untuk UMKM Indonesia. Bahasa Indonesia penuh, support lokal 7 hari.' },
  { q: 'Berapa harganya?', a: 'Mulai dari Rp 0 per bulan untuk Pemula. Berkembang Rp 149.000/bulan. Skala Rp 449.000/bulan. Tidak ada tier Enterprise misterius.' },
  { q: 'Bisa coba gratis?', a: 'Ya, semua paket bisa dicoba 14 hari gratis. Tidak perlu kartu kredit. Tidak perlu install apa-apa.' },
  { q: 'Bagaimana dengan data saya?', a: 'Disimpan di server Jakarta. Enkripsi TLS 1.3. Backup harian. Tidak dijual ke pihak ketiga. Tidak dipakai untuk training AI.' },
  { q: 'Bisa integrasi dengan Tokopedia/Shopee?', a: 'Ya. Paket Berkembang punya 2 integrasi marketplace. Paket Skala unlimited.' },
  { q: 'Kalau saya non-teknis?', a: 'Setup 7 menit, dipandu via WhatsApp. Atau telepon kami, bukan chatbot, manusia.' },
]

// ============================================================
// TESTIMONIALS
// ============================================================
const testimonials = [
  {
    name: 'Aditya Pratama', role: 'Owner', company: 'Kreasiku Studio, Jakarta',
    quote: 'Sebelum pakai Kas, kami pakai 4 aplikasi berbeda untuk invoicing, inventori, laporan, dan chat klien. Sekarang semuanya di Kas. Tim kami hemat 6 jam per minggu.',
    stars: 5,
  },
  {
    name: 'Sari Wijaya', role: 'Pemilik', company: 'Kedai Kopi Tjap, Surabaya',
    quote: 'Laporan bulanan dulu butuh 2 hari, sekarang 10 menit. Klien lebih cepat bayar karena invoice langsung masuk ke WhatsApp mereka.',
    stars: 5,
  },
  {
    name: 'Bayu Hartono', role: 'Direktur', company: 'Garuda Digital Printing, Medan',
    quote: 'Cabang Surabaya dan Bandung terhubung real-time. Tidak perlu telepon setiap sore untuk rekonsiliasi. Cash flow naik 22% di Q1.',
    stars: 5,
  },
]

// ============================================================
// KPI COUNTER ANIMATION
// ============================================================
const kpiRefs = ref<HTMLElement[]>([])
const kpiAnimated = ref([false, false, false, false])
let kpiObserver: IntersectionObserver | null = null

function animateCounter(el: HTMLElement, target: number, duration: number, prefix = '', suffix = '') {
  if (isReducedMotion.value) {
    el.textContent = prefix + formatNumber(target) + suffix
    return
  }
  const start = performance.now()
  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    const current = Math.round(target * eased)
    el.textContent = prefix + formatNumber(current) + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.', ',') + 'jt'
  return n.toLocaleString('id-ID')
}

function triggerKpiAnimation() {
  const els = kpiRefs.value
  if (!els.length) return
  const targets = [
    { val: kpi.value.pendapatan, prefix: 'Rp ', suffix: '' },
    { val: kpi.value.faktur, prefix: 'Rp ', suffix: '' },
    { val: kpi.value.proyek, prefix: '', suffix: '' },
    { val: kpi.value.klien, prefix: '', suffix: '' },
  ]
  els.forEach((el, i) => {
    if (el && targets[i]) {
      animateCounter(el, targets[i].val, 1200, targets[i].prefix, targets[i].suffix)
    }
  })
}

// ============================================================
// SORTABLE TABLE
// ============================================================
const sortKey = ref<string>('deadline')
const sortDir = ref<'asc' | 'desc'>('asc')

const sortedTable = computed(() => {
  const data = [...tableData.value]
  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    if (key === 'nilai') return (a.nilai - b.nilai) * dir
    if (key === 'klien') return a.klien.localeCompare(b.klien) * dir
    if (key === 'proyek') return a.proyek.localeCompare(b.proyek) * dir
    if (key === 'status') return a.status.localeCompare(b.status) * dir
    return 0
  })
})

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

// ============================================================
// FORMAT RP
// ============================================================
function fmtRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function fmtRpAbbr(n: number): string {
  if (n >= 1000000000) return 'Rp ' + (n / 1000000000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.', ',') + 'jt'
  return fmtRp(n)
}

// ============================================================
// WHATSAPP
// ============================================================
const { buildUrl } = useWhatsApp()

// ============================================================
// NOTIFICATIONS
// ============================================================
const notifications = [
  { color: 'var(--kas-success)', text: 'Faktur INV-2026-089 sudah dibayar', meta: 'PT Surya Abadi - Rp 45.000.000 - 2 menit lalu' },
  { color: 'var(--kas-danger)', text: 'Faktur INV-2026-085 overdue (15 hari)', meta: 'Kedai Kopi Tjap - Rp 8.500.000 - 1 jam lalu' },
  { color: 'var(--kas-accent)', text: 'Klien baru terdaftar: Garuda Digital Printing', meta: 'Medan - 3 jam lalu' },
]

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('keydown', onGlobalKey)

  // KPI observer
  if ('IntersectionObserver' in window) {
    kpiObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.kpiIdx)
          if (!isNaN(idx) && !kpiAnimated.value[idx]) {
            kpiAnimated.value[idx] = true
            triggerKpiAnimation()
          }
        }
      })
    }, { threshold: 0.3 })
    nextTick(() => {
      kpiRefs.value.forEach(el => { if (el) kpiObserver?.observe(el) })
    })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKey)
  if (kpiObserver) kpiObserver.disconnect()
})

// Re-animate KPIs on tab change
watch(activeTimeRange, () => {
  kpiAnimated.value = [false, false, false, false]
  nextTick(() => { triggerKpiAnimation() })
})
</script>

<template>
  <div class="kas" :style="styles">
    <a class="kas-skip" href="#kas-main">Lewat ke dashboard</a>

    <TmplBack accent="var(--kas-accent)" />

    <!-- ============================== -->
    <!-- SECTION 1 — HERO (Dashboard)   -->
    <!-- ============================== -->
    <section class="kas-hero" id="top">
      <!-- 3D Particles behind dashboard -->
      <div class="kas-hero__3d" aria-hidden="true">
        <TmplExperienceCanvas preset="particle-morph" :accent="accentColor" intensity="immersive" />
      </div>

      <!-- Hero text overlay -->
      <div class="kas-hero__text">
        <p class="kas-eyebrow" :style="monoStyle">v3.2 - QRIS & BI-FAST READY</p>
        <h1 :style="h1Style" class="kas-h1">
          Kelola bisnis tanpa spreadsheet.<br>
          <span class="kas-h1__accent">5 menit setup.</span>
        </h1>
        <p class="kas-hero__sub">Kasir, faktur, inventori, dan laporan, terhubung otomatis.</p>
        <div class="kas-hero__ctas">
          <a href="#kas-pricing" class="kas-btn kas-btn--primary">Buka Dashboard</a>
          <a :href="buildUrl('Halo, saya mau lihat demo Kas.')" target="_blank" rel="noopener" class="kas-btn kas-btn--ghost">
            Lihat Harga
          </a>
        </div>
      </div>

      <!-- Dashboard Panel -->
      <div class="kas-dash" id="kas-main">
        <!-- Top bar -->
        <div class="kas-dash__topbar">
          <div class="kas-dash__logo">
            <span class="kas-dash__logo-dot" />
            <span>Kas.</span>
          </div>
          <button class="kas-dash__search" type="button" @click="openCmd">
            <UIcon name="i-lucide-search" class="w-3.5 h-3.5" />
            <span>Cari transaksi, klien, laporan...</span>
            <kbd :style="monoStyle" class="kas-dash__kbd">&#8984;K</kbd>
          </button>
          <div class="kas-dash__topbar-right">
            <button class="kas-dash__icon-btn" @click="notifOpen = !notifOpen" aria-label="Notifikasi">
              <UIcon name="i-lucide-bell" class="w-4 h-4" />
              <span class="kas-dash__badge">3</span>
            </button>
            <button class="kas-dash__avatar" @click="profileOpen = !profileOpen" aria-label="Profil">
              <span>AP</span>
            </button>
          </div>

          <!-- Notification dropdown -->
          <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 -translate-y-1 scale-95" leave-to-class="opacity-0 -translate-y-1 scale-95">
            <div v-if="notifOpen" class="kas-dash__notif-panel">
              <p class="kas-dash__notif-title" :style="monoStyle">NOTIFIKASI</p>
              <div v-for="(n, i) in notifications" :key="i" class="kas-dash__notif-item">
                <span class="kas-dash__notif-dot" :style="{ background: n.color }" />
                <div>
                  <p class="kas-dash__notif-text">{{ n.text }}</p>
                  <p class="kas-dash__notif-meta">{{ n.meta }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Profile dropdown -->
          <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 -translate-y-1 scale-95" leave-to-class="opacity-0 -translate-y-1 scale-95">
            <div v-if="profileOpen" class="kas-dash__profile-panel">
              <div class="kas-dash__profile-header">
                <span class="kas-dash__avatar kas-dash__avatar--sm">AP</span>
                <div>
                  <p class="kas-dash__profile-name">Aditya Pratama</p>
                  <p class="kas-dash__profile-email">aditya@kreasiku.id</p>
                </div>
              </div>
              <div class="kas-dash__profile-divider" />
              <button class="kas-dash__profile-item" type="button">Profil Saya</button>
              <button class="kas-dash__profile-item" type="button">Pengaturan</button>
              <button class="kas-dash__profile-item kas-dash__profile-item--muted" type="button">Tema: Gelap</button>
              <div class="kas-dash__profile-divider" />
              <button class="kas-dash__profile-item kas-dash__profile-item--danger" type="button">Keluar</button>
            </div>
          </Transition>
        </div>

        <!-- Body: sidebar + content -->
        <div class="kas-dash__body">
          <!-- Sidebar -->
          <aside class="kas-dash__sidebar">
            <div v-for="item in sidebarItems" :key="item.key"
              class="kas-dash__sidebar-item"
              :class="{ 'kas-dash__sidebar-item--active': activeSidebar === item.key }"
              @click="activeSidebar = item.key"
            >
              <UIcon :name="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
              <span v-if="item.count" class="kas-dash__sidebar-count" :style="monoStyle">{{ item.count }}</span>
            </div>
          </aside>

          <!-- Main content -->
          <div class="kas-dash__content">
            <!-- Time range tabs -->
            <div class="kas-dash__tabs">
              <button v-for="tab in ([
                { key: 'hari', label: 'Hari ini' },
                { key: 'minggu', label: 'Minggu ini' },
                { key: 'bulan', label: 'Bulan ini' },
                { key: 'custom', label: 'Custom' },
              ] as const)" :key="tab.key"
                class="kas-dash__tab"
                :class="{ 'kas-dash__tab--active': activeTimeRange === tab.key }"
                @click="activeTimeRange = tab.key"
              >
                {{ tab.label }}
              </button>
              <span class="kas-dash__tab-hint" :style="monoStyle">Tab &#8633;</span>
            </div>

            <!-- KPI tiles -->
            <div class="kas-dash__kpis">
              <div v-for="(tile, i) in [
                { label: 'PENDAPATAN BULAN INI', value: kpi.pendapatan, delta: kpi.pendapatanDelta, deltaUp: true, abbr: true },
                { label: 'FAKTUR BELUM DIBAYAR', value: kpi.faktur, delta: kpi.fakturDelta, deltaUp: false, abbr: true, sub: kpi.fakturCount + ' faktur' },
                { label: 'PROYEK AKTIF', value: kpi.proyek, delta: '', deltaUp: false, abbr: false, sub: kpi.proyekSub },
                { label: 'KLIEN BARU (30 HARI)', value: kpi.klien, delta: '', deltaUp: false, abbr: false, sub: kpi.klienSub },
              ]" :key="i"
                class="kas-dash__kpi"
                :data-kpi-idx="i"
                :ref="(el) => { if (el) kpiRefs[i] = el as HTMLElement }"
              >
                <p class="kas-dash__kpi-label" :style="monoStyle">{{ tile.label }}</p>
                <p class="kas-dash__kpi-value" :ref="(el) => { if (el && !kpiAnimated[i]) { (el as HTMLElement).textContent = (tile.abbr ? 'Rp 0' : '0') } }">
                  {{ tile.abbr ? fmtRpAbbr(tile.value) : tile.value }}
                </p>
                <div class="kas-dash__kpi-meta">
                  <span v-if="tile.delta" class="kas-dash__kpi-delta" :class="{ 'kas-dash__kpi-delta--up': tile.deltaUp }">
                    <UIcon :name="tile.deltaUp ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="w-3 h-3" />
                    {{ tile.delta }}
                  </span>
                  <span v-if="tile.sub" class="kas-dash__kpi-sub">{{ tile.sub }}</span>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="kas-dash__table-wrap">
              <div class="kas-dash__table-toolbar">
                <div class="kas-dash__table-filter">
                  <UIcon name="i-lucide-search" class="w-3.5 h-3.5" />
                  <span>Filter...</span>
                </div>
                <div class="kas-dash__table-actions">
                  <button class="kas-dash__table-action" aria-label="Filter"><UIcon name="i-lucide-sliders-horizontal" class="w-3.5 h-3.5" /></button>
                  <button class="kas-dash__table-action" aria-label="Sort"><UIcon name="i-lucide-arrow-up-down" class="w-3.5 h-3.5" /></button>
                  <button class="kas-dash__table-action" aria-label="Kolom"><UIcon name="i-lucide-columns-3" class="w-3.5 h-3.5" /></button>
                  <button class="kas-dash__table-action" aria-label="Export" @click="showToast('Mengekspor data...')"><UIcon name="i-lucide-download" class="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <table class="kas-dash__table">
                <thead>
                  <tr>
                    <th v-for="col in [
                      { key: 'proyek', label: 'Proyek' },
                      { key: 'klien', label: 'Klien' },
                      { key: 'nilai', label: 'Nilai' },
                      { key: 'status', label: 'Status' },
                      { key: 'deadline', label: 'Deadline' },
                    ]" :key="col.key"
                      class="kas-dash__th"
                      :class="{ 'kas-dash__th--active': sortKey === col.key }"
                      @click="toggleSort(col.key)"
                      :aria-sort="sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
                    >
                      <span :style="monoStyle">{{ col.label }}</span>
                      <span v-if="sortKey === col.key" class="kas-dash__sort-arrow">{{ sortDir === 'asc' ? '&#9650;' : '&#9660;' }}</span>
                    </th>
                    <th class="kas-dash__th"><span :style="monoStyle">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in sortedTable" :key="i" class="kas-dash__tr">
                    <td class="kas-dash__td">
                      <p class="kas-dash__td-title">{{ row.proyek }}</p>
                      <p class="kas-dash__td-sub">{{ row.sub }}</p>
                    </td>
                    <td class="kas-dash__td kas-dash__td--secondary">{{ row.klien }}</td>
                    <td class="kas-dash__td kas-dash__td--mono">{{ fmtRp(row.nilai) }}</td>
                    <td class="kas-dash__td">
                      <span class="kas-dash__status" :class="'kas-dash__status--' + row.status.toLowerCase()">
                        <span class="kas-dash__status-dot" />
                        {{ row.status }}
                      </span>
                    </td>
                    <td class="kas-dash__td kas-dash__td--secondary">{{ row.deadline }}</td>
                    <td class="kas-dash__td kas-dash__td--action">
                      <button class="kas-dash__row-action" aria-label="Aksi"><UIcon name="i-lucide-more-horizontal" class="w-4 h-4" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="kas-dash__table-footer">
                <span>Menampilkan 1-{{ sortedTable.length }} dari {{ tableData.length }} proyek</span>
                <div class="kas-dash__pagination">
                  <button class="kas-dash__page-btn" disabled>&#9664;</button>
                  <button class="kas-dash__page-btn kas-dash__page-btn--active">1</button>
                  <button class="kas-dash__page-btn">2</button>
                  <button class="kas-dash__page-btn">&#9654;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 2 — PRICING            -->
    <!-- ============================== -->
    <section id="kas-pricing" class="kas-section">
      <div class="kas-section__inner">
        <p class="kas-eyebrow" :style="monoStyle">HARGA</p>
        <h2 :style="h2Style" class="kas-section__h2">Tiga paket. Tanpa biaya tersembunyi.</h2>
        <p class="kas-section__sub">Paket disesuaikan untuk UMKM Indonesia. Bayar per bulan, batal kapan saja.</p>

        <div class="kas-pricing">
          <div v-for="tier in pricingTiers" :key="tier.key"
            class="kas-pricing__card"
            :class="{ 'kas-pricing__card--recommended': tier.recommended, 'kas-pricing__card--selected': selectedTier === tier.key }"
            @click="selectedTier = tier.key"
          >
            <span v-if="tier.recommended" class="kas-pricing__ribbon" :style="monoStyle">&#9733; Direkomendasikan</span>
            <p class="kas-pricing__name" :style="monoStyle">{{ tier.name.toUpperCase() }}</p>
            <div class="kas-pricing__price">
              <span class="kas-pricing__currency">Rp</span>
              <span class="kas-pricing__amount">{{ tier.price === 0 ? '0' : tier.price.toLocaleString('id-ID') }}</span>
              <span class="kas-pricing__period">{{ tier.suffix }}</span>
            </div>
            <p class="kas-pricing__desc">{{ tier.desc }}</p>
            <ul class="kas-pricing__features">
              <li v-for="(f, fi) in tier.features" :key="fi">
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 kas-pricing__check" />
                {{ f }}
              </li>
            </ul>
            <button class="kas-btn" :class="tier.ctaStyle === 'primary' ? 'kas-btn--primary' : 'kas-btn--ghost'" type="button">
              {{ tier.cta }}
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 3 — FEATURES           -->
    <!-- ============================== -->
    <section class="kas-section">
      <div class="kas-section__inner">
        <p class="kas-eyebrow" :style="monoStyle">FITUR</p>
        <h2 :style="h2Style" class="kas-section__h2">Semua yang Anda butuhkan, di satu tempat.</h2>

        <div class="kas-features">
          <!-- Feature 1: Calculator (interactive) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-calculator" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">Kalkulator Harga</h3>
            <p class="kas-feature__desc">Berapa biaya untuk tim Anda?</p>
            <div class="kas-feature__calc">
              <label class="kas-feature__calc-label">
                <span :style="monoStyle">Jumlah pengguna: <strong>{{ calcUsers }}</strong></span>
                <input v-model.number="calcUsers" type="range" min="1" max="50" step="1" class="kas-feature__slider" />
              </label>
              <label class="kas-feature__calc-label">
                <span :style="monoStyle">Transaksi/bulan: <strong>{{ calcTx.toLocaleString('id-ID') }}</strong></span>
                <input v-model.number="calcTx" type="range" min="10" max="10000" step="10" class="kas-feature__slider" />
              </label>
              <div class="kas-feature__calc-result">
                <p class="kas-feature__calc-price">{{ fmtRp(calcCost.price) }}</p>
                <p class="kas-feature__calc-tier" :style="monoStyle">Paket {{ calcCost.tier }}</p>
              </div>
            </div>
          </div>

          <!-- Feature 2: QRIS Generator (interactive) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-qr-code" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">QRIS Generator</h3>
            <p class="kas-feature__desc">Terima pembayaran via QRIS</p>
            <div class="kas-feature__qris">
              <div class="kas-feature__qris-qr" :class="{ 'kas-feature__qris-qr--off': !qrisActive }">
                <svg viewBox="0 0 21 21" width="120" height="120">
                  <rect v-for="(r, ri) in (qrisActive ? [
                    [0,0,3,3],[6,0,1,1],[8,0,1,1],[10,0,1,1],[12,0,1,1],[14,0,1,1],[16,0,1,1],[18,0,3,3],
                    [0,6,1,1],[3,6,1,1],[5,6,1,1],[8,6,1,1],[11,6,1,1],[14,6,1,1],[17,6,1,1],[20,6,1,1],
                    [0,8,1,1],[2,8,1,1],[5,8,1,1],[7,8,1,1],[9,8,1,1],[12,8,1,1],[15,8,1,1],[18,8,1,1],
                    [0,10,1,1],[3,10,1,1],[6,10,1,1],[9,10,1,1],[12,10,1,1],[15,10,1,1],[18,10,3,3],
                    [0,12,1,1],[2,12,1,1],[4,12,1,1],[7,12,1,1],[10,12,1,1],[13,12,1,1],[16,12,1,1],
                    [0,14,1,1],[3,14,1,1],[6,14,1,1],[8,14,1,1],[11,14,1,1],[14,14,1,1],[17,14,1,1],
                    [0,16,1,1],[2,16,1,1],[5,16,1,1],[8,16,1,1],[11,16,1,1],[14,16,1,1],[16,16,1,1],
                    [0,18,3,3],[6,18,1,1],[8,18,1,1],[10,18,1,1],[12,18,1,1],[14,18,1,1],[18,18,3,3],
                  ] : [])" :key="ri"
                    :x="r[0]" :y="r[1]" :width="r[2]" :height="r[3]"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div class="kas-feature__qris-info">
                <button class="kas-feature__qris-toggle" :class="{ 'kas-feature__qris-toggle--on': qrisActive }" @click="qrisActive = !qrisActive" type="button">
                  <span class="kas-feature__qris-toggle-dot" />
                  <span>{{ qrisActive ? 'AKTIF' : 'NON-AKTIF' }}</span>
                </button>
                <p class="kas-feature__qris-detail" :style="monoStyle">Nominal: Rp 250.000</p>
                <p class="kas-feature__qris-detail" :style="monoStyle">Ref: INV-2026-089</p>
                <p class="kas-feature__qris-hint">Klien tinggal scan, otomatis masuk ke Kas</p>
              </div>
            </div>
          </div>

          <!-- Feature 3: Integrations (interactive) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-plug" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">Integrasi</h3>
            <p class="kas-feature__desc">Terhubung dengan yang Anda sudah pakai</p>
            <div class="kas-feature__integrations">
              <button v-for="(active, key) in integrationStates" :key="key"
                class="kas-feature__integ-tile"
                :class="{ 'kas-feature__integ-tile--on': active }"
                @click="toggleIntegration(key)"
                type="button"
              >
                <span class="kas-feature__integ-name">{{ key }}</span>
                <span class="kas-feature__integ-dot" />
              </button>
            </div>
          </div>

          <!-- Feature 4: Laporan Real-Time (static) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-bar-chart-3" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">Laporan Real-Time</h3>
            <p class="kas-feature__desc">Setiap transaksi yang masuk, langsung mengubah laporan. Tidak perlu ekspor, tidak perlu sinkronisasi manual.</p>
            <div class="kas-feature__chart">
              <svg viewBox="0 0 240 80" width="100%" height="80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="kas-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--kas-accent)" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="var(--kas-accent)" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 L30,50 L60,55 L90,35 L120,40 L150,25 L180,30 L210,15 L240,20 L240,80 L0,80 Z" fill="url(#kas-chart-fill)" />
                <polyline points="0,60 30,50 60,55 90,35 120,40 150,25 180,30 210,15 240,20" fill="none" stroke="var(--kas-accent)" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- Feature 5: Multi-Cabang (static) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-map-pin" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">Multi-Cabang</h3>
            <p class="kas-feature__desc">Kelola semua cabang dari satu dashboard. Lihat performa per kota, transfer stok antar cabang, dan laporan terkonsolidasi.</p>
            <div class="kas-feature__cities">
              <span v-for="city in ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta']" :key="city" class="kas-feature__city">
                <span class="kas-feature__city-dot" />
                {{ city }}
              </span>
            </div>
          </div>

          <!-- Feature 6: Keamanan (static) -->
          <div class="kas-feature">
            <div class="kas-feature__icon"><UIcon name="i-lucide-shield-check" class="w-5 h-5" /></div>
            <h3 class="kas-feature__title">Keamanan</h3>
            <p class="kas-feature__desc">Data disimpan di server Jakarta. Enkripsi TLS 1.3. Backup harian. Tidak dijual ke pihak ketiga. Tidak dipakai untuk training AI.</p>
            <span class="kas-feature__badge" :style="monoStyle">GDPR-aligned</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 4 — KENAPA KAS         -->
    <!-- ============================== -->
    <section class="kas-section">
      <div class="kas-section__inner">
        <p class="kas-eyebrow" :style="monoStyle">KENAPA KAS</p>
        <h2 :style="h2Style" class="kas-section__h2">UMKM, agency, dan freelancer Indonesia. Dari warung kopi di Surabaya sampai agency di Jakarta.</h2>

        <div class="kas-testimonials">
          <div v-for="(t, i) in testimonials" :key="i" class="kas-testimonial">
            <div class="kas-testimonial__stars">
              <UIcon v-for="s in t.stars" :key="s" name="i-lucide-star" class="w-3.5 h-3.5 kas-testimonial__star" />
            </div>
            <blockquote class="kas-testimonial__quote">&ldquo;{{ t.quote }}&rdquo;</blockquote>
            <div class="kas-testimonial__author">
              <span class="kas-testimonial__avatar">{{ t.name.split(' ').map(w => w[0]).join('') }}</span>
              <div>
                <p class="kas-testimonial__name">{{ t.name }}</p>
                <p class="kas-testimonial__meta">{{ t.role }} - {{ t.company }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 5 — INTEGRATIONS       -->
    <!-- ============================== -->
    <section class="kas-section">
      <div class="kas-section__inner">
        <p class="kas-eyebrow" :style="monoStyle">INTEGRASI</p>
        <h2 :style="h2Style" class="kas-section__h2">Terhubung dengan yang Anda sudah pakai.</h2>
        <p class="kas-section__sub">12 integrasi aktif di dashboard Anda. QRIS, BI-FAST, marketplace, payment gateway, semuanya otomatis.</p>

        <div class="kas-integrations">
          <div v-for="integ in ['QRIS', 'BI-FAST', 'BCA', 'Mandiri', 'BRI', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'Tokopedia', 'Shopee', 'WhatsApp']" :key="integ"
            class="kas-integrations__tile"
          >
            <span class="kas-integrations__name">{{ integ }}</span>
            <span class="kas-integrations__dot kas-integrations__dot--on" />
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 6 — FAQ                -->
    <!-- ============================== -->
    <section class="kas-section">
      <div class="kas-section__inner">
        <p class="kas-eyebrow" :style="monoStyle">FAQ</p>
        <h2 :style="h2Style" class="kas-section__h2">Pertanyaan yang sering ditanya.</h2>

        <ul class="kas-faq">
          <li v-for="(faq, i) in faqs" :key="i" class="kas-faq__item" :class="{ 'kas-faq__item--open': openFaq === i }">
            <h3 class="kas-faq__h">
              <button type="button" class="kas-faq__btn"
                :aria-expanded="openFaq === i"
                :aria-controls="'faq-' + i"
                @click="openFaq = openFaq === i ? null : i"
              >
                <span class="kas-faq__q">{{ faq.q }}</span>
                <UIcon :name="openFaq === i ? 'i-lucide-minus' : 'i-lucide-plus'" class="kas-faq__icon w-4 h-4" />
              </button>
            </h3>
            <Transition enter-active-class="transition-all duration-300 ease-out overflow-hidden" leave-active-class="transition-all duration-200 ease-in overflow-hidden" enter-from-class="opacity-0 max-h-0" leave-to-class="opacity-0 max-h-0">
              <p v-if="openFaq === i" :id="'faq-' + i" class="kas-faq__a">{{ faq.a }}</p>
            </Transition>
          </li>
        </ul>
        <p class="kas-faq__closing">Tidak menemukan jawaban Anda? <a :href="buildUrl('Halo, saya punya pertanyaan tentang Kas.')" target="_blank" rel="noopener" class="kas-faq__wa-link">Chat via WhatsApp</a> - 7 hari - Bahasa Indonesia.</p>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 7 — FINAL CTA          -->
    <!-- ============================== -->
    <section class="kas-cta-section">
      <div class="kas-cta-section__inner">
        <h2 :style="h1Style" class="kas-cta-section__h2">Cukup lihat. Coba langsung.</h2>
        <p class="kas-cta-section__sub">Tanpa kartu kredit. Setup 7 menit. Bahasa Indonesia.</p>
        <div class="kas-cta-section__btns">
          <a href="#top" class="kas-btn kas-btn--primary kas-btn--lg">Buka Dashboard Anda</a>
          <a :href="buildUrl('Halo, saya mau tanya soal Kas.')" target="_blank" rel="noopener" class="kas-btn kas-btn--ghost kas-btn--lg">
            Atau chat via WhatsApp
          </a>
        </div>
      </div>
    </section>

    <!-- ============================== -->
    <!-- SECTION 8 — FOOTER             -->
    <!-- ============================== -->
    <TmplFooter
      :brand-name="tpl.brand"
      variant="columns"
      :accent="accentColor"
      :bg="'var(--kas-surface)'"
      :text="'var(--kas-fg)'"
      signature="Dirancang di Jakarta, dibuat untuk UMKM Indonesia"
      :links="[
        { label: 'Fitur', href: '#kas-pricing' },
        { label: 'Harga', href: '#kas-pricing' },
        { label: 'FAQ', href: '#faq-0' },
        { label: 'Privasi', href: '#' },
        { label: 'Ketentuan', href: '#' },
        { label: 'Kontak', href: '#' },
      ]"
    />

    <!-- ============================== -->
    <!-- COMMAND K MODAL                -->
    <!-- ============================== -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-150" leave-active-class="transition-opacity duration-100" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="cmdOpen" class="kas-cmd-backdrop" @click="closeCmd" />
      </Transition>
      <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0 scale-95">
        <div v-if="cmdOpen" class="kas-cmd" role="dialog" aria-modal="true" aria-label="Command palette" @keydown="cmdKeydown">
          <div class="kas-cmd__input-wrap">
            <UIcon name="i-lucide-search" class="w-4 h-4 kas-cmd__search-icon" />
            <input id="kas-cmd-input" v-model="cmdQuery" class="kas-cmd__input" placeholder="Cari aksi, halaman, proyek..." autocomplete="off" spellcheck="false" />
          </div>
          <div class="kas-cmd__results">
            <template v-for="(group, gi) in cmdFiltered" :key="gi">
              <p class="kas-cmd__section" :style="monoStyle">{{ group.section }}</p>
              <button v-for="(item, ii) in group.items" :key="ii"
                class="kas-cmd__item"
                :class="{ 'kas-cmd__item--selected': cmdAllItems.indexOf(item) === cmdSelected }"
                @click="cmdItemClick(item.label)"
                @mouseenter="cmdSelected = cmdAllItems.indexOf(item)"
              >
                <UIcon :name="item.icon" class="w-4 h-4 kas-cmd__item-icon" />
                <span>{{ item.label }}</span>
                <kbd v-if="item.shortcut" :style="monoStyle" class="kas-cmd__shortcut">&#8984;{{ item.shortcut }}</kbd>
              </button>
            </template>
            <p v-if="cmdAllItems.length === 0" class="kas-cmd__empty">Tidak ada hasil untuk "{{ cmdQuery }}"</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST -->
    <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 translate-y-2" leave-to-class="opacity-0 translate-y-2">
      <div v-if="toastMsg" class="kas-toast" :style="monoStyle">
        {{ toastMsg }}
      </div>
    </Transition>

    <!-- WHATSAPP FAB -->
    <TmplWhatsAppFab
      :accent="accentColor"
      :actions="[
        { label: 'Minta demo live 30 menit', detail: 'Lewat Zoom, pakai data contoh', icon: 'i-lucide-calendar', message: 'Halo, saya mau minta demo live Kas selama 30 menit.' },
        { label: 'Bandingkan tier Berkembang vs Skala', detail: 'Rincian fitur per paket', icon: 'i-lucide-scale', message: 'Halo, saya mau bandingkan paket Berkembang dan Skala di Kas.' },
        { label: 'Minta proposal untuk klien korporat', detail: 'PDF + rincian fitur', icon: 'i-lucide-file-text', message: 'Halo, saya minta proposal Kas untuk klien korporat. Boleh versi PDF?' },
        { label: 'Bicara langsung dengan salah satu pendiri', detail: 'Bukan bot, bukan sales', icon: 'i-lucide-phone', message: 'Halo, saya mau bicara langsung dengan pendiri Kas. Kapan bisa?' },
      ]"
    />
  </div>
</template>

<style scoped>
/* ============================================================
   KAS — Dashboard-First SaaS Template
   Dark theme, electric blue accent, OKLCH
   ============================================================ */

/* === CSS Variables (derived from palette) === */
.kas {
  --kas-bg: var(--tmpl-bg);
  --kas-fg: var(--tmpl-fg);
  --kas-muted: var(--tmpl-muted);
  --kas-border: var(--tmpl-border);
  --kas-surface: var(--tmpl-surface);
  --kas-surface-2: var(--tmpl-surface-elevated);
  --kas-accent: var(--tmpl-accent);
  --kas-accent-soft: var(--tmpl-accent-soft);
  --kas-accent-fg: var(--tmpl-accent-fg);
  --kas-success: oklch(72% 0.18 152);
  --kas-warning: oklch(78% 0.16 75);
  --kas-danger: oklch(68% 0.22 25);
  --kas-info: oklch(72% 0.14 230);
  min-height: 100dvh;
  position: relative;
  font-variant-numeric: tabular-nums;
}

.kas-skip {
  position: fixed;
  top: -100px;
  left: 1rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: var(--kas-accent);
  color: var(--kas-accent-fg);
  border-radius: 0 0 8px 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: top 200ms ease;
}
.kas-skip:focus { top: 0; }

/* === Eyebrow === */
.kas-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kas-accent);
  margin-bottom: 1rem;
}

/* === H1 === */
.kas-h1 {
  font-size: var(--tmpl-h1);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin: 0 0 1rem;
  font-variant-numeric: normal;
}
.kas-h1__accent {
  color: var(--kas-accent);
}

/* === Buttons === */
.kas-btn {
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
  border: 1px solid transparent;
  transition: background 200ms ease, transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
  font-family: inherit;
  color: var(--kas-fg);
  background: transparent;
}
.kas-btn--primary {
  background: var(--kas-accent);
  color: var(--kas-accent-fg);
  border-color: var(--kas-accent);
}
.kas-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px oklch(72% 0.18 235 / 0.3), 0 8px 24px -8px oklch(72% 0.18 235 / 0.25);
}
.kas-btn--ghost {
  border-color: oklch(100% 0 0 / 0.12);
  color: var(--kas-fg);
}
.kas-btn--ghost:hover {
  background: var(--kas-surface-2);
  border-color: oklch(100% 0 0 / 0.2);
}
.kas-btn--lg {
  padding: 1rem 1.75rem;
  font-size: 15px;
}

/* === Section === */
.kas-section {
  padding: 100px 1.5rem;
  border-top: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-section__inner {
  max-width: 72rem;
  margin: 0 auto;
}
.kas-section__h2 {
  font-size: var(--tmpl-h2);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 0.75rem;
}
.kas-section__sub {
  font-size: 15px;
  color: var(--kas-muted);
  line-height: 1.55;
  margin: 0 0 2.5rem;
  max-width: 48rem;
}

/* ============================================================
   HERO
   ============================================================ */
.kas-hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 1.5rem 4rem;
  overflow: hidden;
  background: var(--kas-bg);
}
.kas-hero__3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 20%, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 20%, black 0%, transparent 70%);
  opacity: 0.5;
}
.kas-hero__text {
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
}
.kas-hero__sub {
  font-size: 18px;
  color: var(--kas-muted);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}
.kas-hero__ctas {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
.kas-dash {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 12px;
  overflow: hidden;
  background: var(--kas-surface);
  box-shadow: 0 24px 64px -16px oklch(0% 0 0 / 0.5);
}

/* Top bar */
.kas-dash__topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.25rem;
  height: 52px;
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
  background: var(--kas-surface);
  position: relative;
}
.kas-dash__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.kas-dash__logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kas-accent);
}
.kas-dash__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 320px;
  height: 32px;
  padding: 0 0.75rem;
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 8px;
  font-size: 13px;
  color: var(--kas-muted);
  cursor: pointer;
  transition: border-color 200ms ease;
  font-family: inherit;
}
.kas-dash__search:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-dash__kbd {
  margin-left: auto;
  font-size: 11px;
  padding: 1px 5px;
  background: var(--kas-surface);
  border-radius: 4px;
  color: var(--kas-muted);
}
.kas-dash__topbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}
.kas-dash__icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--kas-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: background 150ms ease;
}
.kas-dash__icon-btn:hover { background: var(--kas-surface-2); color: var(--kas-fg); }
.kas-dash__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--kas-accent);
  color: white;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kas-dash__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: box-shadow 150ms ease;
}
.kas-dash__avatar:hover { box-shadow: 0 0 0 2px var(--kas-accent); }
.kas-dash__avatar--sm { width: 24px; height: 24px; font-size: 10px; }

/* Notification panel */
.kas-dash__notif-panel,
.kas-dash__profile-panel {
  position: absolute;
  top: 100%;
  right: 0.75rem;
  margin-top: 0.5rem;
  width: 320px;
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  z-index: 50;
  box-shadow: 0 16px 48px -12px oklch(0% 0 0 / 0.6);
}
.kas-dash__notif-title {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kas-muted);
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}
.kas-dash__notif-item {
  display: flex;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 120ms ease;
}
.kas-dash__notif-item:hover { background: oklch(100% 0 0 / 0.04); }
.kas-dash__notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.kas-dash__notif-text {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 2px;
  color: var(--kas-fg);
}
.kas-dash__notif-meta {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 0;
}

/* Profile panel */
.kas-dash__profile-panel {
  width: 240px;
  padding: 0.5rem;
}
.kas-dash__profile-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
}
.kas-dash__profile-name {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.kas-dash__profile-email {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 0;
}
.kas-dash__profile-divider {
  height: 1px;
  background: oklch(100% 0 0 / 0.06);
  margin: 0.25rem 0;
}
.kas-dash__profile-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.625rem;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--kas-fg);
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease;
  font-family: inherit;
}
.kas-dash__profile-item:hover { background: oklch(100% 0 0 / 0.04); }
.kas-dash__profile-item--muted { color: var(--kas-muted); }
.kas-dash__profile-item--danger { color: var(--kas-danger); }

/* Body: sidebar + content */
.kas-dash__body {
  display: flex;
  min-height: 480px;
}

/* Sidebar */
.kas-dash__sidebar {
  width: 200px;
  flex-shrink: 0;
  padding: 0.75rem;
  border-right: 1px solid oklch(100% 0 0 / 0.06);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kas-dash__sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--kas-muted);
  cursor: pointer;
  transition: all 120ms ease;
}
.kas-dash__sidebar-item:hover {
  background: var(--kas-surface-2);
  color: var(--kas-fg);
}
.kas-dash__sidebar-item--active {
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
}
.kas-dash__sidebar-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--kas-muted);
}

/* Content */
.kas-dash__content {
  flex: 1;
  min-width: 0;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tabs */
.kas-dash__tabs {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-dash__tab {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--kas-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 120ms ease;
  font-family: inherit;
}
.kas-dash__tab:hover { color: var(--kas-fg); }
.kas-dash__tab--active {
  color: var(--kas-fg);
  border-bottom-color: var(--kas-accent);
}
.kas-dash__tab-hint {
  margin-left: auto;
  font-size: 10px;
  color: oklch(100% 0 0 / 0.2);
}

/* KPI tiles */
.kas-dash__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}
.kas-dash__kpi {
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  min-height: 110px;
  transition: border-color 200ms ease, transform 200ms ease;
}
.kas-dash__kpi:hover {
  border-color: oklch(100% 0 0 / 0.12);
  transform: translateY(-1px);
}
.kas-dash__kpi-label {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kas-muted);
  margin: 0 0 0.5rem;
}
.kas-dash__kpi-value {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--kas-fg);
  margin: 0 0 0.375rem;
  font-variant-numeric: tabular-nums;
}
.kas-dash__kpi-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.kas-dash__kpi-delta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 11px;
  font-weight: 600;
  color: var(--kas-success);
}
.kas-dash__kpi-delta--up { color: var(--kas-success); }
.kas-dash__kpi-sub {
  font-size: 11px;
  color: var(--kas-muted);
}

/* Table */
.kas-dash__table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.kas-dash__table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.kas-dash__table-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  height: 32px;
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 8px;
  font-size: 12px;
  color: var(--kas-muted);
  cursor: pointer;
  transition: border-color 150ms ease;
}
.kas-dash__table-filter:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-dash__table-actions {
  display: flex;
  gap: 0.25rem;
}
.kas-dash__table-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid oklch(100% 0 0 / 0.06);
  background: transparent;
  border-radius: 6px;
  color: var(--kas-muted);
  cursor: pointer;
  transition: all 120ms ease;
}
.kas-dash__table-action:hover {
  background: var(--kas-surface-2);
  border-color: oklch(100% 0 0 / 0.12);
  color: var(--kas-fg);
}

/* Table element */
.kas-dash__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.kas-dash__th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kas-muted);
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color 120ms ease;
}
.kas-dash__th:hover { color: var(--kas-fg); }
.kas-dash__th--active { color: var(--kas-accent); }
.kas-dash__sort-arrow {
  font-size: 8px;
  margin-left: 0.25rem;
  color: var(--kas-accent);
}
.kas-dash__tr {
  border-bottom: 1px solid oklch(100% 0 0 / 0.04);
  transition: background 120ms ease;
}
.kas-dash__tr:hover { background: oklch(100% 0 0 / 0.03); }
.kas-dash__td {
  padding: 0.625rem 0.75rem;
  vertical-align: middle;
}
.kas-dash__td-title {
  font-weight: 600;
  font-size: 13px;
  margin: 0;
  color: var(--kas-fg);
}
.kas-dash__td-sub {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 2px 0 0;
}
.kas-dash__td--secondary {
  font-size: 12px;
  color: var(--kas-muted);
}
.kas-dash__td--mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--kas-fg);
}
.kas-dash__td--action {
  text-align: right;
}
.kas-dash__row-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--kas-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease;
}
.kas-dash__row-action:hover { background: var(--kas-surface-2); color: var(--kas-fg); }

/* Status badges */
.kas-dash__status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.kas-dash__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.kas-dash__status--berjalan {
  background: oklch(30% 0.12 152);
  color: oklch(85% 0.16 152);
}
.kas-dash__status--berjalan .kas-dash__status-dot { background: oklch(85% 0.16 152); }

.kas-dash__status--review {
  background: oklch(32% 0.10 75);
  color: oklch(88% 0.14 75);
}
.kas-dash__status--review .kas-dash__status-dot { background: oklch(88% 0.14 75); }

.kas-dash__status--mulai {
  background: oklch(30% 0.10 230);
  color: oklch(85% 0.14 230);
}
.kas-dash__status--mulai .kas-dash__status-dot { background: oklch(85% 0.14 230); }

.kas-dash__status--lunas {
  background: oklch(22% 0.008 250);
  color: oklch(65% 0.012 250);
}
.kas-dash__status--lunas .kas-dash__status-dot { background: oklch(65% 0.012 250); }

/* Table footer */
.kas-dash__table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--kas-muted);
  padding-top: 0.5rem;
}
.kas-dash__pagination {
  display: flex;
  gap: 0.25rem;
}
.kas-dash__page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid oklch(100% 0 0 / 0.06);
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  color: var(--kas-muted);
  cursor: pointer;
  transition: all 120ms ease;
  font-family: inherit;
}
.kas-dash__page-btn:hover:not(:disabled) {
  background: var(--kas-surface-2);
  color: var(--kas-fg);
}
.kas-dash__page-btn:disabled { opacity: 0.3; cursor: default; }
.kas-dash__page-btn--active {
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  border-color: var(--kas-accent-soft);
}

/* ============================================================
   PRICING
   ============================================================ */
.kas-pricing {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 2.5rem;
}
.kas-pricing__card {
  position: relative;
  background: var(--kas-surface);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 200ms ease;
}
.kas-pricing__card:hover {
  border-color: oklch(100% 0 0 / 0.12);
  transform: translateY(-2px);
}
.kas-pricing__card--recommended {
  border-color: var(--kas-accent);
  background: var(--kas-surface-2);
  transform: scale(1.02);
}
.kas-pricing__card--recommended:hover { transform: scale(1.02) translateY(-2px); }
.kas-pricing__card--selected { border-color: var(--kas-accent); }
.kas-pricing__ribbon {
  position: absolute;
  top: -0.6rem;
  left: 1.25rem;
  padding: 0.2rem 0.75rem;
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  font-size: 10px;
  letter-spacing: 0.06em;
  font-weight: 600;
  border-radius: 999px;
}
.kas-pricing__name {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--kas-muted);
  margin: 0 0 0.75rem;
}
.kas-pricing__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0 0 0.25rem;
}
.kas-pricing__currency {
  font-size: 16px;
  font-weight: 600;
  color: var(--kas-muted);
}
.kas-pricing__amount {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--kas-fg);
  font-variant-numeric: tabular-nums;
}
.kas-pricing__period {
  font-size: 14px;
  color: var(--kas-muted);
}
.kas-pricing__desc {
  font-size: 13px;
  color: var(--kas-muted);
  margin: 0 0 1.25rem;
}
.kas-pricing__features {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.kas-pricing__features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  color: var(--kas-fg);
}
.kas-pricing__check { color: var(--kas-accent); flex-shrink: 0; }

/* ============================================================
   FEATURES
   ============================================================ */
.kas-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 2.5rem;
}
.kas-feature {
  background: var(--kas-surface);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: border-color 200ms ease;
}
.kas-feature:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-feature__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.kas-feature__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 0.375rem;
  letter-spacing: -0.01em;
}
.kas-feature__desc {
  font-size: 13px;
  color: var(--kas-muted);
  line-height: 1.5;
  margin: 0 0 1rem;
}

/* Calculator feature */
.kas-feature__calc {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.kas-feature__calc-label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 11px;
  color: var(--kas-muted);
}
.kas-feature__calc-label strong {
  color: var(--kas-accent);
  font-weight: 600;
}
.kas-feature__slider {
  width: 100%;
  accent-color: var(--kas-accent);
  height: 4px;
}
.kas-feature__calc-result {
  padding-top: 0.5rem;
  border-top: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-feature__calc-price {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--kas-fg);
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.kas-feature__calc-tier {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 0;
}

/* QRIS feature */
.kas-feature__qris {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.kas-feature__qris-qr {
  flex-shrink: 0;
  color: var(--kas-fg);
  transition: opacity 300ms ease;
}
.kas-feature__qris-qr--off { opacity: 0.2; }
.kas-feature__qris-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.kas-feature__qris-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid oklch(100% 0 0 / 0.1);
  background: var(--kas-surface-2);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--kas-muted);
  cursor: pointer;
  transition: all 200ms ease;
  font-family: inherit;
}
.kas-feature__qris-toggle--on {
  background: oklch(30% 0.12 152);
  border-color: oklch(30% 0.12 152);
  color: oklch(85% 0.16 152);
}
.kas-feature__qris-toggle-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kas-muted);
}
.kas-feature__qris-toggle--on .kas-feature__qris-toggle-dot {
  background: oklch(85% 0.16 152);
}
.kas-feature__qris-detail {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 0;
}
.kas-feature__qris-hint {
  font-size: 12px;
  color: var(--kas-fg);
  margin: 0.25rem 0 0;
}

/* Integrations feature */
.kas-feature__integrations {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
}
.kas-feature__integ-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.625rem;
  border: 1px solid oklch(100% 0 0 / 0.06);
  background: transparent;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--kas-muted);
  cursor: pointer;
  transition: all 150ms ease;
  font-family: inherit;
}
.kas-feature__integ-tile:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-feature__integ-tile--on {
  color: var(--kas-fg);
  border-color: oklch(100% 0 0 / 0.1);
}
.kas-feature__integ-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--kas-muted);
  opacity: 0.4;
}
.kas-feature__integ-tile--on .kas-feature__integ-dot {
  background: var(--kas-success);
  opacity: 1;
}

/* Chart feature */
.kas-feature__chart {
  margin-top: auto;
  border-radius: 8px;
  overflow: hidden;
}

/* Cities feature */
.kas-feature__cities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
}
.kas-feature__city {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 12px;
  color: var(--kas-fg);
}
.kas-feature__city-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--kas-accent);
  animation: kas-pulse 2s ease-in-out infinite;
}
@keyframes kas-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.8); opacity: 0.4; }
}

/* Badge feature */
.kas-feature__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.25rem 0.625rem;
  margin-top: auto;
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
.kas-testimonials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 2.5rem;
}
.kas-testimonial {
  background: var(--kas-surface);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 200ms ease;
}
.kas-testimonial:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-testimonial__stars {
  display: flex;
  gap: 0.125rem;
}
.kas-testimonial__star { color: var(--kas-warning); }
.kas-testimonial__quote {
  font-size: 14px;
  line-height: 1.55;
  color: var(--kas-fg);
  margin: 0;
  flex: 1;
}
.kas-testimonial__author {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-top: 0.75rem;
  border-top: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-testimonial__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--kas-accent-soft);
  color: var(--kas-accent);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kas-testimonial__name {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.kas-testimonial__meta {
  font-size: 11px;
  color: var(--kas-muted);
  margin: 2px 0 0;
}

/* ============================================================
   INTEGRATIONS GRID
   ============================================================ */
.kas-integrations {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 2.5rem;
}
.kas-integrations__tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--kas-surface);
  border: 1px solid oklch(100% 0 0 / 0.06);
  border-radius: 10px;
  transition: border-color 200ms ease;
}
.kas-integrations__tile:hover { border-color: oklch(100% 0 0 / 0.12); }
.kas-integrations__name {
  font-size: 13px;
  font-weight: 500;
}
.kas-integrations__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.kas-integrations__dot--on { background: var(--kas-success); }

/* ============================================================
   FAQ
   ============================================================ */
.kas-faq {
  list-style: none;
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-faq__item {
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-faq__btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 0.5rem;
  background: transparent;
  border: 0;
  color: var(--kas-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 120ms ease;
}
.kas-faq__btn:hover { color: var(--kas-accent); }
.kas-faq__q {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
}
.kas-faq__icon {
  flex-shrink: 0;
  color: var(--kas-accent);
}
.kas-faq__a {
  padding: 0 0.5rem 1.25rem 0.5rem;
  font-size: 14px;
  color: var(--kas-muted);
  line-height: 1.55;
  margin: 0;
}
.kas-faq__closing {
  font-size: 14px;
  color: var(--kas-muted);
  margin: 2rem 0 0;
  text-align: center;
}
.kas-faq__wa-link {
  color: var(--kas-accent);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 150ms ease;
}
.kas-faq__wa-link:hover { opacity: 0.8; }

/* ============================================================
   CTA SECTION
   ============================================================ */
.kas-cta-section {
  padding: 120px 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.kas-cta-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, oklch(72% 0.18 235 / 0.08) 0%, transparent 70%);
  pointer-events: none;
}
.kas-cta-section__inner {
  position: relative;
  z-index: 1;
  max-width: 40rem;
  margin: 0 auto;
}
.kas-cta-section__h2 {
  margin: 0 0 0.75rem;
}
.kas-cta-section__sub {
  font-size: 18px;
  color: var(--kas-muted);
  margin: 0 0 2rem;
}
.kas-cta-section__btns {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ============================================================
   COMMAND K MODAL
   ============================================================ */
.kas-cmd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: oklch(0% 0 0 / 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.kas-cmd {
  position: fixed;
  top: 25vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 95;
  width: 480px;
  max-width: calc(100vw - 2rem);
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.12);
  border-radius: 12px;
  box-shadow: 0 24px 48px -12px oklch(0% 0 0 / 0.6), 0 0 0 1px oklch(72% 0.18 235 / 0.15);
  overflow: hidden;
}
.kas-cmd__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 1rem;
  border-bottom: 1px solid oklch(100% 0 0 / 0.06);
}
.kas-cmd__search-icon { color: var(--kas-muted); flex-shrink: 0; }
.kas-cmd__input {
  flex: 1;
  height: 48px;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: var(--kas-fg);
  outline: none;
}
.kas-cmd__input::placeholder { color: var(--kas-muted); }
.kas-cmd__results {
  padding: 0.5rem;
  max-height: 320px;
  overflow-y: auto;
}
.kas-cmd__section {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kas-muted);
  padding: 0.5rem 0.625rem 0.25rem;
  margin: 0;
}
.kas-cmd__item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  color: var(--kas-fg);
  cursor: pointer;
  transition: background 80ms ease;
  text-align: left;
  font-family: inherit;
}
.kas-cmd__item:hover,
.kas-cmd__item--selected { background: oklch(100% 0 0 / 0.05); }
.kas-cmd__item-icon { color: var(--kas-muted); flex-shrink: 0; }
.kas-cmd__shortcut {
  margin-left: auto;
  font-size: 10px;
  padding: 1px 5px;
  background: var(--kas-surface);
  border-radius: 4px;
  color: var(--kas-muted);
}
.kas-cmd__empty {
  text-align: center;
  font-size: 13px;
  color: var(--kas-muted);
  padding: 2rem 1rem;
  margin: 0;
}

/* ============================================================
   TOAST
   ============================================================ */
.kas-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: var(--kas-surface-2);
  border: 1px solid oklch(100% 0 0 / 0.12);
  border-radius: 8px;
  font-size: 13px;
  color: var(--kas-fg);
  box-shadow: 0 8px 24px -8px oklch(0% 0 0 / 0.4);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1023px) {
  .kas-dash__kpis { grid-template-columns: repeat(2, 1fr); }
  .kas-pricing { grid-template-columns: 1fr; }
  .kas-features { grid-template-columns: 1fr 1fr; }
  .kas-testimonials { grid-template-columns: 1fr; }
  .kas-integrations { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 767px) {
  .kas-hero { padding: 5rem 1rem 2rem; }
  .kas-dash__sidebar { display: none; }
  .kas-dash__kpis { grid-template-columns: 1fr 1fr; }
  .kas-dash__table-wrap { overflow-x: auto; }
  .kas-dash__table { min-width: 600px; }
  .kas-features { grid-template-columns: 1fr; }
  .kas-pricing { grid-template-columns: 1fr; }
  .kas-pricing__card--recommended { transform: none; }
  .kas-pricing__card--recommended:hover { transform: translateY(-2px); }
  .kas-integrations { grid-template-columns: repeat(2, 1fr); }
  .kas-feature__qris { flex-direction: column; }
  .kas-feature__integrations { grid-template-columns: repeat(2, 1fr); }
  .kas-section { padding: 60px 1rem; }
  .kas-cta-section { padding: 80px 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .kas-feature__city-dot { animation: none; }
  .kas-dash__kpi { transition: none; }
  .kas-pricing__card { transition: none; }
}
</style>
