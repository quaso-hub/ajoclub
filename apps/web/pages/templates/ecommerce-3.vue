<script setup lang="ts">
/**
 * ecommerce-3.vue � Bazaar Marketplace
 * Multi-vendor marketplace. Newsreader italic H1, Inter body.
 * 8 sections: Hero+3D ? Kategori ? Produk ? Penjual ? Promo ? Testimoni ? FAQ ? Footer
 * 3D: 60-icon category sphere morph (case-timeline, balanced)
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { CartItem } from '~/components/TmplCart.vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('ecommerce-3')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme
useScrollReveal('ecommerce-3')

// ============================================================
// DATA: Categories
// ============================================================
const categories = [
  { id: 'pakaian', name: 'Pakaian', icon: '??', count: 312, color: 'terracotta' },
  { id: 'tas', name: 'Tas', icon: '??', count: 198, color: 'mustard' },
  { id: 'aksesori', name: 'Aksesori', icon: '??', count: 245, color: 'sage' },
  { id: 'rumah', name: 'Rumah', icon: '??', count: 487, color: 'clay' },
  { id: 'elektronik', name: 'Elektronik', icon: '??', count: 134, color: 'terracotta' },
  { id: 'makanan', name: 'Makanan', icon: '??', count: 276, color: 'mustard' },
]

const activeCategory = ref<string | null>(null)

// ============================================================
// DATA: Products (12)
// ============================================================
interface Product {
  id: string
  name: string
  seller: string
  sellerId: string
  price: number
  rating: number
  reviewCount: number
  sold: number
  category: string
  freeShipping: boolean
  badge?: string
  gradient: string
}

const products: Product[] = [
  { id: 'p1', name: 'Batik Tulis Madura � Motif Parang', seller: 'Kain Warisan', sellerId: 'kain-warisan', price: 385000, rating: 4.9, reviewCount: 124, sold: 487, category: 'pakaian', freeShipping: true, badge: 'Terlaris', gradient: 'linear-gradient(145deg, #E8D5C0 0%, #D4B896 50%, #C09A6B 100%)' },
  { id: 'p2', name: 'Tas Rajut Tali Kur � Cokelat Tanah', seller: 'Rajut Nusantara', sellerId: 'rajut-nusantara', price: 165000, rating: 4.8, reviewCount: 89, sold: 312, category: 'tas', freeShipping: true, gradient: 'linear-gradient(145deg, #D4C4A8 0%, #B8A88C 50%, #9C8C70 100%)' },
  { id: 'p3', name: 'Kalung Perak Bali � Ukiran Naga', seller: 'Perak Celuk', sellerId: 'perak-celuk', price: 425000, rating: 5.0, reviewCount: 56, sold: 178, category: 'aksesori', freeShipping: false, badge: 'Verified', gradient: 'linear-gradient(145deg, #C8C8C8 0%, #A8A8A8 50%, #888888 100%)' },
  { id: 'p4', name: 'Mangkuk Keramik Tangan � Biru Indigo', seller: 'Tanah Liat Studio', sellerId: 'tanah-liat-studio', price: 85000, rating: 4.9, reviewCount: 87, sold: 312, category: 'rumah', freeShipping: true, badge: 'Bisa Custom', gradient: 'linear-gradient(145deg, #B8C8D8 0%, #8CA0B8 50%, #607898 100%)' },
  { id: 'p5', name: 'Speaker Bluetooth Kayu Jati', seller: 'Audio Kayu', sellerId: 'audio-kayu', price: 275000, rating: 4.7, reviewCount: 43, sold: 156, category: 'elektronik', freeShipping: true, gradient: 'linear-gradient(145deg, #C8B090 0%, #A88860 50%, #886840 100%)' },
  { id: 'p6', name: 'Kopi Gayo Arabika � Roasted Bean 250g', seller: 'Kopi Gayo Asli', sellerId: 'kopi-gayo', price: 95000, rating: 4.8, reviewCount: 201, sold: 834, category: 'makanan', freeShipping: true, badge: 'Terlaris', gradient: 'linear-gradient(145deg, #6B4226 0%, #4A2E1A 50%, #2D1B0E 100%)' },
  { id: 'p7', name: 'Kemeja Linen � Warna Tanah Liat', seller: 'Linen Archipelago', sellerId: 'linen-archipelago', price: 320000, rating: 4.6, reviewCount: 67, sold: 203, category: 'pakaian', freeShipping: false, gradient: 'linear-gradient(145deg, #D4C0A8 0%, #B8A080 50%, #9C8060 100%)' },
  { id: 'p8', name: 'Dompet Kulit Sapi � Cokelat Natural', seller: 'Kulit Garut', sellerId: 'kulit-garut', price: 185000, rating: 4.9, reviewCount: 112, sold: 445, category: 'aksesori', freeShipping: true, gradient: 'linear-gradient(145deg, #A07848 0%, #806030 50%, #604820 100%)' },
  { id: 'p9', name: 'Lilin Soya Aroma Kopi', seller: 'Api Kecil', sellerId: 'api-kecil', price: 65000, rating: 4.8, reviewCount: 134, sold: 478, category: 'rumah', freeShipping: true, gradient: 'linear-gradient(145deg, #F0E0C8 0%, #E0C8A0 50%, #D0B080 100%)' },
  { id: 'p10', name: 'Charger USB-C Kayu � 20W Fast', seller: 'Tech Lokal', sellerId: 'tech-lokal', price: 145000, rating: 4.5, reviewCount: 38, sold: 124, category: 'elektronik', freeShipping: false, gradient: 'linear-gradient(145deg, #A89070 0%, #887050 50%, #685030 100%)' },
  { id: 'p11', name: 'Sambal Roa Manado � Botol 200ml', seller: 'Rasa Manado', sellerId: 'rasa-manado', price: 48000, rating: 4.9, reviewCount: 178, sold: 623, category: 'makanan', freeShipping: true, badge: 'Terlaris', gradient: 'linear-gradient(145deg, #C83030 0%, #A02020 50%, #781818 100%)' },
  { id: 'p12', name: 'Tas Tote � Canvas Polos', seller: 'Kain & Co', sellerId: 'kain-co', price: 55000, rating: 5.0, reviewCount: 203, sold: 712, category: 'tas', freeShipping: true, gradient: 'linear-gradient(145deg, #E8E0D0 0%, #D0C8B0 50%, #B8B098 100%)' },
]

const filteredProducts = computed(() => {
  if (!activeCategory.value) return products
  return products.filter(p => p.category === activeCategory.value)
})

// ============================================================
// DATA: Sellers (4)
// ============================================================
interface Seller {
  id: string
  name: string
  location: string
  productCount: number
  rating: number
  since: number
  verified: boolean
  description: string
  gradient: string
}

const sellers: Seller[] = [
  { id: 'kain-warisan', name: 'Kain Warisan', location: 'Solo, Jawa Tengah', productCount: 45, rating: 4.9, since: 2018, verified: true, description: 'Batik tulis asli Solo. Dikerjakan tangan oleh pengrajin generasi ketiga.', gradient: 'linear-gradient(135deg, #E8D5C0 0%, #C09A6B 100%)' },
  { id: 'rajut-nusantara', name: 'Rajut Nusantara', location: 'Bandung, Jawa Barat', productCount: 32, rating: 4.8, since: 2020, verified: true, description: 'Tas rajut handmade dari tali kur dan benang katun lokal.', gradient: 'linear-gradient(135deg, #D4C4A8 0%, #9C8C70 100%)' },
  { id: 'tanah-liat-studio', name: 'Tanah Liat Studio', location: 'Cirebon, Jawa Barat', productCount: 34, rating: 4.9, since: 2019, verified: true, description: 'Keramik fungsional buatan tangan di roda tradisional.', gradient: 'linear-gradient(135deg, #B8C8D8 0%, #607898 100%)' },
  { id: 'kopi-gayo', name: 'Kopi Gayo Asli', location: 'Aceh Tengah, Aceh', productCount: 18, rating: 4.8, since: 2017, verified: true, description: 'Kopi arabika Gayo langsung dari kebun petani. Roasted fresh setiap minggu.', gradient: 'linear-gradient(135deg, #6B4226 0%, #2D1B0E 100%)' },
]

// ============================================================
// DATA: Flash Deals (3)
// ============================================================
interface FlashDeal {
  id: string
  name: string
  seller: string
  originalPrice: number
  dealPrice: number
  discount: number
  sold: number
  stock: number
  endsIn: string
  gradient: string
}

const flashDeals: FlashDeal[] = [
  { id: 'fd1', name: 'Sabun Kopi & Susu � Set 3 Batang', seller: 'Sabun Desa', originalPrice: 75000, dealPrice: 45000, discount: 40, sold: 89, stock: 30, endsIn: '12:34:56', gradient: 'linear-gradient(145deg, #D4C4A8 0%, #A88860 100%)' },
  { id: 'fd2', name: 'Notebook Kulit � 100 Halaman', seller: 'Buku Tangan', originalPrice: 120000, dealPrice: 72000, discount: 40, sold: 56, stock: 18, endsIn: '08:12:33', gradient: 'linear-gradient(145deg, #A07848 0%, #604820 100%)' },
  { id: 'fd3', name: 'Gantungan Kunci Tembaga � Custom Nama', seller: 'Logam Studio', originalPrice: 55000, dealPrice: 35000, discount: 36, sold: 134, stock: 45, endsIn: '05:47:21', gradient: 'linear-gradient(145deg, #C8A878 0%, #886840 100%)' },
]

// ============================================================
// DATA: Testimonials
// ============================================================
const testimonials = [
  { name: 'Rina S.', location: 'Jakarta', text: 'Batik tulis online pertama. Kualitas lebih bagus dari foto � kain tebal, warna tajam.', rating: 5, product: 'Batik Tulis Madura' },
  { name: 'Dimas P.', location: 'Bandung', text: 'Keramik jadi hadiah ulang tahun istri. Packaging aman, sampai utuh.', rating: 5, product: 'Mangkuk Keramik Tangan' },
  { name: 'Sari W.', location: 'Yogyakarta', text: 'Sambal roa bikin nagih. Sudah 3 kali repeat order. Pengiriman cepat.', rating: 5, product: 'Sambal Roa Manado' },
]

// ============================================================
// DATA: FAQ
// ============================================================
const faqs = [
  { q: 'Bagaimana beli dari beberapa penjual?', a: 'Tambah ke keranjang. Checkout otomatis terpisah per penjual. Chat penjual via WhatsApp untuk konfirmasi.' },
  { q: 'Apakah semua produk handmade?', a: 'Sebagian besar dibuat tangan oleh pengrajin lokal. Produk non-handmade sudah diverifikasi kualitasnya.' },
  { q: 'Produk yang diterima rusak?', a: 'Hubungi penjual via WhatsApp dalam 3 hari. Penjual wajib ganti atau refund. Bazaar bantu mediasi.' },
  { q: 'Bisa custom order?', a: 'Banyak penjual menerima custom. Cari badge "Bisa Custom" atau chat penjual langsung.' },
]

const openFaq = ref<number | null>(null)

// ============================================================
// CART STATE
// ============================================================
const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)
const cartCount = computed(() => cartItems.value.reduce((sum, it) => sum + it.qty, 0))

function addToCart(product: Product) {
  const existing = cartItems.value.find(it => it.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cartItems.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      variant: product.seller,
    })
  }
  showToast(`${product.name} ditambahkan ke keranjang`)
}

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

// ============================================================
// TOAST
// ============================================================
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 2500)
}

// ============================================================
// SEARCH
// ============================================================
const searchQuery = ref('')
const searchFocused = ref(false)
const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  const q = searchQuery.value.toLowerCase()
  return products.filter(p => p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q)).slice(0, 5)
})

// ============================================================
// 3D SPHERE (client-only canvas placeholder)
// ============================================================
const sphereCanvas = ref<HTMLCanvasElement | null>(null)
const sphereReady = ref(false)

onMounted(() => {
  if (!sphereCanvas.value) return
  const canvas = sphereCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const w = 400
  const h = 400
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)

  const icons = categories.flatMap(c => Array.from({ length: 10 }, (_, i) => ({
    icon: c.icon,
    color: c.color,
    angle: Math.random() * Math.PI * 2,
    phi: Math.acos(2 * Math.random() - 1),
    radius: 140,
    size: 16 + Math.random() * 8,
  })))

  let rotY = 0
  let frame = 0

  function draw() {
    ctx!.clearRect(0, 0, w, h)
    ctx!.save()
    ctx!.translate(w / 2, h / 2)

    for (const dot of icons) {
      const x = dot.radius * Math.sin(dot.phi) * Math.cos(dot.angle + rotY)
      const y = dot.radius * Math.cos(dot.phi)
      const z = dot.radius * Math.sin(dot.phi) * Math.sin(dot.angle + rotY)
      const scale = (z + dot.radius) / (dot.radius * 2)
      const alpha = 0.3 + scale * 0.7

      ctx!.globalAlpha = alpha
      ctx!.font = `${dot.size * scale}px serif`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText(dot.icon, x, y)
    }

    ctx!.restore()
    rotY += 0.003
    frame = requestAnimationFrame(draw)
  }

  draw()
  sphereReady.value = true

  onBeforeUnmount(() => cancelAnimationFrame(frame))
})

// ============================================================
// NAV SCROLL STATE
// ============================================================
const scrolled = ref(false)
function onScroll() { scrolled.value = window.scrollY > 30 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// WhatsApp
const waUrl = 'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya tertarik dengan marketplace Bazaar. Bisa diskusi?')
</script>

<template>
  <div :style="styles" class="min-h-screen antialiased">
    <!-- ============================================================ -->
    <!-- NAVBAR -->
    <!-- ============================================================ -->
    <TmplNavbar
      brand="Bazaar"
      :links="[
        { label: 'Kategori', href: '#kategori' },
        { label: 'Produk', href: '#produk' },
        { label: 'Penjual', href: '#penjual' },
        { label: 'Promo', href: '#promo' },
        { label: 'FAQ', href: '#faq' },
      ]"
      :accent="toCss(palette.accent)"
      :bg="toCss(palette.bg)"
      :text="toCss(palette.fg)"
      style="glass"
      :show-theme-toggle="false"
      force-mode="light"
    />

    <!-- ============================================================ -->
    <!-- TOAST -->
    <!-- ============================================================ -->
    <Transition enter-active-class="transition-all duration-300 ease-out" leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 -translate-y-4" leave-to-class="opacity-0 -translate-y-4">
      <div v-if="toastVisible" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg border" :style="{ background: toCss(palette.surfaceElevated), borderColor: toCss(palette.border), color: toCss(palette.fg) }">
        <span class="mr-2" :style="{ color: toCss(palette.accent) }">&#10003;</span>{{ toastMessage }}
      </div>
    </Transition>

    <!-- ============================================================ -->
    <!-- HERO + 3D SPHERE -->
    <!-- ============================================================ -->
    <section class="pt-24 pb-20 md:pt-32 md:pb-28">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center" data-reveal="stagger-children">
          <!-- Left: Copy -->
          <div class="lg:col-span-3">
            <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-4" :style="{ color: toCss(palette.accent) }">Temukan kerajinan dari 38 kota</p>
            <h1 :style="{ ...h1Style, color: toCss(palette.fg) }" class="mb-5">
              Semua ada. Dari semua penjual.
            </h1>
            <p class="text-base md:text-lg max-w-xl mb-8" :style="{ color: toCss(palette.muted), lineHeight: '1.6' }">
              2.400+ produk dari penjual independen Indonesia. Setiap item punya cerita, punya pembuat.
            </p>

            <!-- Search -->
            <div class="relative max-w-lg">
              <div class="flex items-center rounded-lg border px-4 py-3 gap-3 transition-all" :style="{ background: toCss(palette.surface), borderColor: searchFocused ? toCss(palette.accent) : toCss(palette.border) }">
                <svg class="w-5 h-5 flex-shrink-0" :style="{ color: toCss(palette.muted) }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari produk, penjual, atau kategori..."
                  class="flex-1 bg-transparent outline-none text-sm"
                  :style="{ color: toCss(palette.fg) }"
                  @focus="searchFocused = true"
                  @blur="setTimeout(() => searchFocused = false, 200)"
                >
              </div>
              <!-- Search dropdown -->
              <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 -translate-y-2" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="searchFocused && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-xl z-30 overflow-hidden" :style="{ background: toCss(palette.surfaceElevated), borderColor: toCss(palette.border) }">
                  <button
                    v-for="r in searchResults"
                    :key="r.id"
                    type="button"
                    class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-black/5 transition-colors"
                    @click="activeCategory = r.category; searchQuery = ''"
                  >
                    <div class="w-10 h-10 rounded-lg flex-shrink-0" :style="{ background: r.gradient }" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate" :style="{ color: toCss(palette.fg) }">{{ r.name }}</p>
                      <p class="text-xs" :style="{ color: toCss(palette.muted) }">{{ r.seller }} &middot; {{ formatRp(r.price) }}</p>
                    </div>
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Stats -->
            <div class="flex gap-8 mt-8">
              <div>
                <p class="text-2xl font-bold" :style="{ color: toCss(palette.fg) }">2.400+</p>
                <p class="text-xs" :style="{ color: toCss(palette.muted) }">Produk aktif</p>
              </div>
              <div>
                <p class="text-2xl font-bold" :style="{ color: toCss(palette.fg) }">340</p>
                <p class="text-xs" :style="{ color: toCss(palette.muted) }">Penjual terverifikasi</p>
              </div>
              <div>
                <p class="text-2xl font-bold" :style="{ color: toCss(palette.fg) }">38</p>
                <p class="text-xs" :style="{ color: toCss(palette.muted) }">Kota di Indonesia</p>
              </div>
            </div>
          </div>

          <!-- Right: 3D Sphere -->
          <div class="hidden lg:flex lg:col-span-2 items-center justify-center">
            <div class="relative w-[400px] h-[400px]">
              <canvas ref="sphereCanvas" class="w-full h-full" />
              <div v-if="!sphereReady" class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full animate-pulse" :style="{ background: toCss(palette.accentSoft) }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- KATEGORI (6 categories) -->
    <!-- ============================================================ -->
    <section id="kategori" class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border) }">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Jelajahi</p>
            <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Kategori</h2>
          </div>
          <button
            v-if="activeCategory"
            type="button"
            class="text-xs font-medium underline underline-offset-4"
            :style="{ color: toCss(palette.muted) }"
            @click="activeCategory = null"
          >
            Lihat semua
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" data-reveal="stagger-children">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="group flex flex-col items-center gap-3 p-6 rounded-lg border transition-all cursor-pointer"
            :style="{
              background: activeCategory === cat.id ? toCss(palette.accentSoft) : toCss(palette.surface),
              borderColor: activeCategory === cat.id ? toCss(palette.accent) : toCss(palette.border),
            }"
            @click="activeCategory = activeCategory === cat.id ? null : cat.id"
          >
            <span class="text-3xl">{{ cat.icon }}</span>
            <span class="text-sm font-semibold" :style="{ color: toCss(palette.fg) }">{{ cat.name }}</span>
            <span class="text-[11px]" :style="{ color: toCss(palette.muted) }">{{ cat.count }} produk</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PRODUK TERBARU (12 products) -->
    <!-- ============================================================ -->
    <section id="produk" class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border), background: toCss(palette.surface) }">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Katalog</p>
            <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Produk Terbaru</h2>
          </div>
          <p class="text-sm" :style="{ color: toCss(palette.muted) }">{{ filteredProducts.length }} produk</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6" data-reveal="stagger-children">
          <article
            v-for="(p, i) in filteredProducts"
            :key="p.id"
            class="group cursor-pointer"
            :class="{ 'lg:col-span-2 lg:row-span-2': i === 0 }"
          >
            <!-- Image -->
            <div class="relative aspect-[3/4] rounded-lg mb-3 overflow-hidden" :style="{ background: p.gradient }">
              <div class="absolute inset-0 flex items-center justify-center opacity-20 text-6xl select-none">
                {{ categories.find(c => c.id === p.category)?.icon || '??' }}
              </div>
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span v-if="p.badge" class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white" :style="{ background: toCss(palette.accent) }">{{ p.badge }}</span>
                <span v-if="p.freeShipping" class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide" :style="{ background: toCss(palette.accentSoft), color: toCss(palette.accent) }">Gratis Ongkir</span>
              </div>
              <!-- Wishlist -->
              <button type="button" class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Tambahkan ke wishlist">
                <svg class="w-4 h-4" :style="{ color: toCss(palette.fg) }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
              <!-- Quick add -->
              <button
                type="button"
                class="absolute bottom-3 left-3 right-3 py-2.5 rounded-lg text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                :style="{ background: toCss(palette.accent) }"
                @click.stop="addToCart(p)"
              >
                Tambah ke Keranjang
              </button>
            </div>
            <!-- Info -->
            <p class="text-xs font-medium mb-1 italic" :style="{ color: toCss(palette.muted) }">{{ p.seller }}</p>
            <h3 class="text-sm font-semibold mb-1 leading-tight group-hover:underline underline-offset-2" :style="{ color: toCss(palette.fg) }">{{ p.name }}</h3>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-bold" :style="{ color: toCss(palette.fg) }">{{ formatRp(p.price) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="flex items-center gap-0.5 text-xs" :style="{ color: toCss(palette.muted) }">
                <svg class="w-3 h-3" :style="{ color: toCss(palette.accent) }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ p.rating }}
              </span>
              <span class="text-xs" :style="{ color: toCss(palette.muted) }">&middot;</span>
              <span class="text-xs" :style="{ color: toCss(palette.muted) }">Terjual {{ p.sold }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PENJUAL TERATAS (4 sellers) -->
    <!-- ============================================================ -->
    <section id="penjual" class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border) }">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="mb-10">
          <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Komunitas</p>
          <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Penjual Teratas</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-reveal="stagger-children">
          <article v-for="s in sellers" :key="s.id" class="group rounded-lg border overflow-hidden transition-all hover:shadow-lg cursor-pointer" :style="{ borderColor: toCss(palette.border) }">
            <!-- Banner -->
            <div class="h-28 relative" :style="{ background: s.gradient }">
              <div class="absolute -bottom-8 left-5 w-16 h-16 rounded-lg border-4 flex items-center justify-center text-2xl" :style="{ background: toCss(palette.surfaceElevated), borderColor: toCss(palette.surfaceElevated) }">
                {{ s.name.charAt(0) }}
              </div>
            </div>
            <!-- Info -->
            <div class="pt-10 px-5 pb-5">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-base font-bold" :style="{ color: toCss(palette.fg) }">{{ s.name }}</h3>
                <svg v-if="s.verified" class="w-4 h-4 flex-shrink-0" :style="{ color: toCss(palette.accent) }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </div>
              <p class="text-xs mb-3" :style="{ color: toCss(palette.muted) }">{{ s.location }}</p>
              <p class="text-xs mb-4 leading-relaxed" :style="{ color: toCss(palette.muted) }">{{ s.description }}</p>
              <div class="flex items-center gap-4 text-xs" :style="{ color: toCss(palette.muted) }">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" :style="{ color: toCss(palette.accent) }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {{ s.rating }}
                </span>
                <span>{{ s.productCount }} produk</span>
                <span>Sejak {{ s.since }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- PROMO (3 flash deals) -->
    <!-- ============================================================ -->
    <section id="promo" class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border), background: toCss(palette.surface) }">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Flash Sale</p>
            <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Promo Hari Ini</h2>
          </div>
          <TmplCountdown target="2026-06-15T23:59:59" variant="inline" label="" expired-message="Promo berakhir" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5" data-reveal="stagger-children">
          <article v-for="d in flashDeals" :key="d.id" class="group rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-lg" :style="{ borderColor: toCss(palette.border) }">
            <!-- Image -->
            <div class="aspect-[16/9] relative" :style="{ background: d.gradient }">
              <div class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white" :style="{ background: toCss(palette.accent) }">-{{ d.discount }}%</div>
              <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-medium backdrop-blur-sm bg-white/80" :style="{ color: toCss(palette.fg) }">Sisa {{ d.stock }}</div>
            </div>
            <!-- Info -->
            <div class="p-4">
              <h3 class="text-sm font-semibold mb-1 leading-tight" :style="{ color: toCss(palette.fg) }">{{ d.name }}</h3>
              <p class="text-xs italic mb-2" :style="{ color: toCss(palette.muted) }">{{ d.seller }}</p>
              <div class="flex items-center gap-2 mb-3">
                <span class="text-base font-bold" :style="{ color: toCss(palette.accent) }">{{ formatRp(d.dealPrice) }}</span>
                <span class="text-xs line-through" :style="{ color: toCss(palette.muted) }">{{ formatRp(d.originalPrice) }}</span>
              </div>
              <!-- Progress bar -->
              <div class="h-1.5 rounded-lg overflow-hidden mb-2" :style="{ background: toCss(palette.border) }">
                <div class="h-full rounded-lg" :style="{ width: `${(d.sold / (d.sold + d.stock)) * 100}%`, background: toCss(palette.accent) }" />
              </div>
              <p class="text-[11px]" :style="{ color: toCss(palette.muted) }">{{ d.sold }} terjual</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- TESTIMONI -->
    <!-- ============================================================ -->
    <section class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border) }">
      <div class="max-w-7xl mx-auto px-5 md:px-8">
        <div class="mb-10">
          <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Ulasan</p>
          <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Kata Pembeli</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-5" data-reveal="stagger-children">
          <article v-for="(t, i) in testimonials" :key="i" class="rounded-lg border p-6" :class="{ 'md:col-span-3': i === 0, 'md:col-span-2': i === 1, 'md:col-span-5 md:grid md:grid-cols-2 md:gap-5': i === 2 }" :style="{ borderColor: toCss(palette.border), background: toCss(palette.surface) }">
            <!-- Stars -->
            <div class="flex gap-0.5 mb-4">
              <svg v-for="s in t.rating" :key="s" class="w-4 h-4" :style="{ color: toCss(palette.accent) }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-sm leading-relaxed mb-4" :style="{ color: toCss(palette.fg) }">"{{ t.text }}"</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold" :style="{ color: toCss(palette.fg) }">{{ t.name }}</p>
                <p class="text-xs" :style="{ color: toCss(palette.muted) }">{{ t.location }}</p>
              </div>
              <p class="text-[10px] tracking-wider uppercase" :style="{ color: toCss(palette.muted) }">{{ t.product }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- FAQ -->
    <!-- ============================================================ -->
    <section id="faq" class="py-20 md:py-28 border-t" :style="{ borderColor: toCss(palette.border), background: toCss(palette.surface) }">
      <div class="max-w-3xl mx-auto px-5 md:px-8">
        <div class="mb-10 text-center">
          <p class="text-[11px] tracking-[0.14em] uppercase font-medium mb-2" :style="{ color: toCss(palette.accent) }">Bantuan</p>
          <h2 :style="{ ...h2Style, color: toCss(palette.fg) }">Pertanyaan Umum</h2>
        </div>

        <div class="space-y-3">
          <div v-for="(f, i) in faqs" :key="i" class="rounded-lg border overflow-hidden" :style="{ borderColor: toCss(palette.border) }">
            <button
              type="button"
              class="flex items-center justify-between w-full px-5 py-4 text-left"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="text-sm font-semibold pr-4" :style="{ color: toCss(palette.fg) }">{{ f.q }}</span>
              <svg class="w-5 h-5 flex-shrink-0 transition-transform" :style="{ color: toCss(palette.muted), transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <Transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 max-h-0" leave-to-class="opacity-0 max-h-0">
              <div v-if="openFaq === i" class="px-5 pb-4">
                <p class="text-sm leading-relaxed" :style="{ color: toCss(palette.muted) }">{{ f.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- FOOTER -->
    <!-- ============================================================ -->
    <TmplFooter data-reveal="fade-up" brand-name="Bazaar"
      variant="columns"
      :accent="toCss(palette.accent)"
      :bg="toCss(palette.fg)"
      :text="toCss(palette.bg)"
      signature="Marketplace kerajinan Indonesia"
      :links="[
        { label: 'Kategori', href: '#kategori' },
        { label: 'Produk', href: '#produk' },
        { label: 'Penjual', href: '#penjual' },
        { label: 'Promo', href: '#promo' },
        { label: 'FAQ', href: '#faq' },
      ]"
    />

    <!-- ============================================================ -->
    <!-- CART DRAWER -->
    <!-- ============================================================ -->
    <TmplCart
      v-model:open="cartOpen"
      v-model:items="cartItems"
      :accent="toCss(palette.accent)"
      storage-key="bazaar-cart"
    />

    <!-- Cart FAB (mobile) -->
    <button
      v-if="cartCount > 0"
      type="button"
      class="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-lg shadow-xl flex items-center justify-center transition-transform hover:scale-105 lg:hidden"
      :style="{ background: toCss(palette.accent), color: toCss(palette.accentFg) }"
      @click="cartOpen = true"
      aria-label="Buka keranjang"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span class="absolute -top-1 -right-1 w-5 h-5 rounded-lg text-[10px] font-bold flex items-center justify-center" :style="{ background: toCss(palette.accentFg), color: toCss(palette.accent) }">{{ cartCount }}</span>
    </button>

    <!-- Desktop cart button in nav area -->
    <button
      v-if="cartCount > 0"
      type="button"
      class="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-3 px-5 py-3 rounded-lg shadow-xl transition-transform hover:scale-105"
      :style="{ background: toCss(palette.accent), color: toCss(palette.accentFg) }"
      @click="cartOpen = true"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span class="text-sm font-semibold">Keranjang ({{ cartCount }})</span>
    </button>

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="e-commerce"
    />
  </div>
</template>
