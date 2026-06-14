<script setup lang="ts">
/**
 * ecommerce-2.vue � SOMETHINC
 * DTC Brand Story. Aesop/Glossier/Allbirds aesthetic, Indonesian skincare.
 *
 * 8 sections: Hero + 3D bottle ? Cerita ? Produk ? Bahan ? Routine Finder ? Testimoni ? FAQ ? Footer
 * slug='ecommerce-2', typo='somethinc', palette='somethinc'
 * Fraunces italic H1, Inter body. Force mode: light.
 * Cream bg, forest + amber accent.
 */
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('ecommerce-2')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme
useScrollReveal('ecommerce-2')

// --- Products ----------------------------------------------------
interface Product {
  id: string
  name: string
  price: number
  description: string
  keyIngredients: string[]
  tags: string[]
  volume: string
}

const products: Product[] = [
  {
    id: 'serum-vitamin-c',
    name: 'Serum Vitamin C 10%',
    price: 129000,
    description: 'L-Ascorbic Acid stabil untuk mencerahkan dan melindungi dari radikal bebas.',
    keyIngredients: ['L-Ascorbic Acid 10%', 'Ferulic Acid 0.5%', 'Vitamin E 1%'],
    tags: ['Bestseller', 'BPOM'],
    volume: '30ml',
  },
  {
    id: 'moisturizer-barrier',
    name: 'Moisturizer Barrier Repair',
    price: 119000,
    description: 'Ceramide NP + Squalane untuk memperbaiki skin barrier. Ringan, cepat meresap.',
    keyIngredients: ['Ceramide NP 2%', 'Squalane 5%', 'Panthenol 2%'],
    tags: ['BPOM', 'Halal'],
    volume: '50ml',
  },
  {
    id: 'sunscreen-spf50',
    name: 'Sunscreen SPF 50+ PA++++',
    price: 89000,
    description: 'Tabir surya hybrid ringan. Tanpa whitecast, cocok untuk kulit berminyak.',
    keyIngredients: ['Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'Niacinamide 2%', 'Centella Asiatica'],
    tags: ['Daily Use', 'BPOM', 'Halal'],
    volume: '50ml',
  },
  {
    id: 'cleanser-gentle',
    name: 'Cleanser Gentle Foam',
    price: 79000,
    description: 'pH 5.5, tidak mengeringkan. Membersihkan tanpa merusak skin barrier.',
    keyIngredients: ['Cocamidopropyl Betaine', 'Sodium Hyaluronate', 'Allantoin'],
    tags: ['BPOM', 'Halal'],
    volume: '100ml',
  },
  {
    id: 'toner-exfoliating',
    name: 'Toner Exfoliating AHA BHA',
    price: 99000,
    description: 'Eksfoliasi lembut untuk pergantian sel kulit. Menyamarkan noda hitam.',
    keyIngredients: ['Glycolic Acid 5%', 'Salicylic Acid 0.5%', 'Centella Asiatica'],
    tags: ['For Night Use', 'BPOM'],
    volume: '100ml',
  },
  {
    id: 'eye-cream-caffeine',
    name: 'Eye Cream Caffeine + Peptide',
    price: 149000,
    description: 'Caffeine + Matrixyl untuk mengurangi lingkaran hitam dan garis halus.',
    keyIngredients: ['Caffeine 3%', 'Matrixyl 2%', 'Niacinamide 3%'],
    tags: ['BPOM', 'Halal'],
    volume: '15ml',
  },
]

// --- Cart --------------------------------------------------------
const cart = reactive<{ items: { product: Product; qty: number }[] }>({ items: [] })
const cartOpen = ref(false)
const toastMsg = ref('')
const toastVisible = ref(false)

function addToCart(product: Product) {
  const existing = cart.items.find(i => i.product.id === product.id)
  if (existing) existing.qty++
  else cart.items.push({ product, qty: 1 })
  showToast(`${product.name} ditambahkan ke keranjang`)
}

function removeFromCart(id: string) {
  cart.items = cart.items.filter(i => i.product.id !== id)
}

function updateQty(id: string, delta: number) {
  const item = cart.items.find(i => i.product.id === id)
  if (!item) return
  item.qty += delta
  if (item.qty < 1) removeFromCart(id)
}

const cartCount = computed(() => cart.items.reduce((s, i) => s + i.qty, 0))
const cartSubtotal = computed(() => cart.items.reduce((s, i) => s + i.product.price * i.qty, 0))

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID').replace(/,/g, '.')
}

function showToast(msg: string) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3000)
}

// --- Quiz --------------------------------------------------------
type QuizStep = 'idle' | 'q1' | 'q2' | 'q3' | 'q4' | 'result'
const quizStep = ref<QuizStep>('idle')
const quizAnswers = reactive<string[]>([])

const quizQuestions = [
  { id: 'concern', text: 'Apa masalah kulit utama yang ingin kamu atasi?', options: ['Jerawat & bruntusan', 'Kulit kusam & noda hitam', 'Kulit kering & dehidrasi', 'Garis halus & penuaan'] },
  { id: 'age', text: 'Berapa rentang usia kamu?', options: ['18 - 24 tahun', '25 - 34 tahun', '35 - 44 tahun', '45 tahun ke atas'] },
  { id: 'freq', text: 'Seberapa sering kamu pakai skincare saat ini?', options: ['Setiap hari, sudah punya rutinitas', 'Hampir setiap hari', 'Kadang-kadang, tidak rutin', 'Baru mulai, masih coba-coba'] },
  { id: 'budget', text: 'Budget skincare per bulan?', options: ['Di bawah Rp 200.000', 'Rp 200.000 - Rp 500.000', 'Di atas Rp 500.000'] },
]

const quizRecommendation = computed(() => {
  if (quizStep.value !== 'result') return null
  const concern = quizAnswers[0]
  if (concern?.includes('Jerawat')) return { names: ['Serum Vitamin C 10%', 'Sunscreen SPF 50+ PA++++', 'Cleanser Gentle Foam'], note: 'Kombinasi pencerah + perlindungan harian untuk kulit berjerawat.' }
  if (concern?.includes('kusam')) return { names: ['Serum Vitamin C 10%', 'Toner Exfoliating AHA BHA', 'Moisturizer Barrier Repair'], note: 'Eksfoliasi + pencerah untuk mengembalikan cahaya kulit.' }
  if (concern?.includes('kering')) return { names: ['Moisturizer Barrier Repair', 'Eye Cream Caffeine + Peptide', 'Cleanser Gentle Foam'], note: 'Hidrasi intensif untuk kulit kering dan dehidrasi.' }
  return { names: ['Eye Cream Caffeine + Peptide', 'Serum Vitamin C 10%', 'Moisturizer Barrier Repair'], note: 'Rutinitas anti-penuaan untuk kulit 35+.' }
})

const quizRecommendedProducts = computed(() => {
  if (!quizRecommendation.value) return []
  return products.filter(p => quizRecommendation.value!.names.includes(p.name))
})

function startQuiz() { quizStep.value = 'q1'; quizAnswers.length = 0 }
function answerQuiz(answer: string) {
  quizAnswers.push(answer)
  const steps: QuizStep[] = ['q1', 'q2', 'q3', 'q4']
  const idx = steps.indexOf(quizStep.value)
  if (idx < 3) quizStep.value = steps[idx + 1]
  else quizStep.value = 'result'
}
function resetQuiz() { quizStep.value = 'idle'; quizAnswers.length = 0 }

// --- Ingredients glossary ----------------------------------------
const glossaryOpen = ref(false)
const ingredients = [
  { name: 'Niacinamide', inci: 'Niacinamide', aka: 'Vitamin B3', benefit: 'Mencerahkan, mengontrol minyak, memperkuat skin barrier.', cocok: 'Semua jenis kulit' },
  { name: 'Vitamin C', inci: 'L-Ascorbic Acid', aka: 'Askorbat', benefit: 'Antioksidan kuat, mencerahkan noda hitam, merangsang kolagen.', cocok: 'Kusam, noda hitam' },
  { name: 'Hyaluronic Acid', inci: 'Sodium Hyaluronate', aka: 'HA', benefit: 'Menarik air ke kulit, hidrasi hingga lapisan dalam.', cocok: 'Kering, dehidrasi' },
  { name: 'Retinol', inci: 'Retinol', aka: 'Vitamin A', benefit: 'Mempercepat pergantian sel, mengurangi garis halus dan kerutan.', cocok: 'Penuaan, tekstur tidak rata' },
  { name: 'Ceramide', inci: 'Ceramide NP', aka: 'Lipid alami', benefit: 'Memperbaiki dan melindungi skin barrier dari iritasi.', cocok: 'Sensitif, rusak barrier' },
  { name: 'AHA', inci: 'Glycolic Acid', aka: 'Alpha Hydroxy Acid', benefit: 'Eksfoliasi permukaan kulit, menyamarkan noda dan bekas jerawat.', cocok: 'Kusam, bekas jerawat' },
  { name: 'BHA', inci: 'Salicylic Acid', aka: 'Beta Hydroxy Acid', benefit: 'Menembus pori-pori, membersihkan komedo dan mengontrol minyak.', cocok: 'Berminyak, berjerawat' },
  { name: 'Centella Asiatica', inci: 'Centella Asiatica Extract', aka: 'Cica', benefit: 'Menenangkan kulit iritasi, mempercepat penyembuhan luka.', cocok: 'Sensitif, berjerawat' },
  { name: 'Squalane', inci: 'Squalane', aka: 'Emolien nabati', benefit: 'Melembapkan tanpa menyumbat pori, meniru minyak alami kulit.', cocok: 'Semua jenis kulit' },
  { name: 'Caffeine', inci: 'Caffeine', aka: 'Stimulan', benefit: 'Mengurangi bengkak dan lingkaran hitam di area mata.', cocok: 'Mata lelah, lingkaran hitam' },
  { name: 'Panthenol', inci: 'D-Panthenol', aka: 'Pro-Vitamin B5', benefit: 'Menenangkan, melembapkan, dan mempercepat pemulihan kulit.', cocok: 'Iritasi, kering' },
  { name: 'Peptide', inci: 'Palmitoyl Pentapeptide-4', aka: 'Matrixyl', benefit: 'Merangsang produksi kolagen, mengurangi kedalaman kerutan.', cocok: 'Penuaan, garis halus' },
]

// --- Refill toggle -----------------------------------------------
const refillActive = ref(false)

// --- FAQ ---------------------------------------------------------
const faqOpen = ref<number | null>(null)
const faqs = [
  { q: 'Apakah produk SOMETHINC sudah terdaftar BPOM?', a: 'Semua produk SOMETHINC sudah terdaftar di BPOM dengan nomor registrasi yang bisa kamu cek langsung di situs resmi BPOM.' },
  { q: 'Apakah produk ini halal?', a: 'Ya, semua produk SOMETHINC sudah bersertifikat Halal dari MUI. Kami tidak menggunakan bahan dari hewan yang dilarang.' },
  { q: 'Berapa lama pengiriman?', a: 'Pengiriman 2-5 hari kerja ke seluruh Indonesia. Gratis ongkir untuk pembelian di atas Rp 150.000.' },
  { q: 'Bisa retur jika tidak cocok?', a: 'Bisa. Kami menerima retur dalam 30 hari setelah pembelian jika produk tidak cocok untuk kulitmu. Hubungi kami via WhatsApp.' },
  { q: 'Bagaimana cara kerja langganan refill?', a: 'Kamu akan menerima isi ulang setiap 60 hari. Botol kosong bisa ditukarkan dengan botol isi ulang baru, hemat 20%. Batalkan kapan saja via WhatsApp.' },
  { q: 'Apakah aman untuk ibu hamil?', a: 'Beberapa produk aman untuk ibu hamil, namun kami sarankan konsultasi dengan dokter kandungan terlebih dahulu. Hindari produk dengan Retinol dan AHA/BHA tinggi.' },
]

// --- 3D Bottle (client-only placeholder) -------------------------
const canvasRef = ref<HTMLCanvasElement | null>(null)
const sceneReady = ref(false)
let animFrame = 0

function initBottleScene() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = 320
  const h = 400
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  ctx.scale(dpr, dpr)

  let time = 0
  function draw() {
    time += 0.02
    ctx!.clearRect(0, 0, w, h)

    // Bottle body (glass)
    const bx = w / 2, by = h * 0.48
    const bw = 80, bh = 180
    ctx!.beginPath()
    ctx!.moveTo(bx - bw * 0.35, by - bh * 0.5)
    ctx!.quadraticCurveTo(bx - bw * 0.35, by - bh * 0.55, bx - bw * 0.25, by - bh * 0.58)
    ctx!.lineTo(bx - bw * 0.15, by - bh * 0.7)
    ctx!.quadraticCurveTo(bx - bw * 0.12, by - bh * 0.75, bx - bw * 0.12, by - bh * 0.82)
    ctx!.lineTo(bx + bw * 0.12, by - bh * 0.82)
    ctx!.quadraticCurveTo(bx + bw * 0.12, by - bh * 0.75, bx + bw * 0.15, by - bh * 0.7)
    ctx!.lineTo(bx + bw * 0.25, by - bh * 0.58)
    ctx!.quadraticCurveTo(bx + bw * 0.35, by - bh * 0.55, bx + bw * 0.35, by - bh * 0.5)
    ctx!.lineTo(bx + bw * 0.38, by + bh * 0.45)
    ctx!.quadraticCurveTo(bx + bw * 0.38, by + bh * 0.5, bx + bw * 0.3, by + bh * 0.5)
    ctx!.lineTo(bx - bw * 0.3, by + bh * 0.5)
    ctx!.quadraticCurveTo(bx - bw * 0.38, by + bh * 0.5, bx - bw * 0.38, by + bh * 0.45)
    ctx!.closePath()
    ctx!.fillStyle = 'rgba(255,255,255,0.12)'
    ctx!.fill()
    ctx!.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx!.lineWidth = 1.5
    ctx!.stroke()

    // Cap
    ctx!.beginPath()
    ctx!.roundRect(bx - 14, by - bh * 0.85, 28, 18, 8)
    ctx!.fillStyle = '#b8944a'
    ctx!.fill()

    // Liquid (sloshing)
    ctx!.save()
    ctx!.beginPath()
    ctx!.moveTo(bx - bw * 0.32, by + bh * 0.15)
    ctx!.quadraticCurveTo(bx, by + bh * 0.15 + Math.sin(time * 1.8) * 6, bx + bw * 0.32, by + bh * 0.15)
    ctx!.lineTo(bx + bw * 0.36, by + bh * 0.44)
    ctx!.quadraticCurveTo(bx + bw * 0.36, by + bh * 0.48, bx + bw * 0.28, by + bh * 0.48)
    ctx!.lineTo(bx - bw * 0.28, by + bh * 0.48)
    ctx!.quadraticCurveTo(bx - bw * 0.36, by + bh * 0.48, bx - bw * 0.36, by + bh * 0.44)
    ctx!.closePath()
    const lGrad = ctx!.createLinearGradient(bx - 40, by + bh * 0.15, bx + 40, by + bh * 0.48)
    lGrad.addColorStop(0, 'rgba(180,140,60,0.55)')
    lGrad.addColorStop(1, 'rgba(200,165,80,0.4)')
    ctx!.fillStyle = lGrad
    ctx!.fill()
    ctx!.restore()

    // Glass highlight
    ctx!.beginPath()
    ctx!.moveTo(bx - bw * 0.2, by - bh * 0.45)
    ctx!.lineTo(bx - bw * 0.25, by + bh * 0.2)
    ctx!.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx!.lineWidth = 3
    ctx!.stroke()

    // Label
    ctx!.fillStyle = 'rgba(255,255,255,0.7)'
    ctx!.font = '500 10px Inter, sans-serif'
    ctx!.textAlign = 'center'
    ctx!.fillText('SOMETHINC', bx, by + 20)
    ctx!.font = '400 8px Inter, sans-serif'
    ctx!.fillText('Vitamin C 10%', bx, by + 34)

    // Shadow
    ctx!.beginPath()
    ctx!.ellipse(bx, by + bh * 0.55, bw * 0.35, 8, 0, 0, Math.PI * 2)
    ctx!.fillStyle = 'rgba(0,0,0,0.06)'
    ctx!.fill()

    animFrame = requestAnimationFrame(draw)
  }
  draw()
  sceneReady.value = true
}

onMounted(() => {
  setTimeout(() => initBottleScene(), 200)
})

onBeforeUnmount(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})

// --- Nav links ---------------------------------------------------
const navLinks = [
  { label: 'Cerita', href: '#cerita' },
  { label: 'Produk', href: '#produk' },
  { label: 'Bahan', href: '#bahan' },
  { label: 'Quiz', href: '#quiz' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'FAQ', href: '#faq' },
]
</script>

<template>
  <div :style="styles">
    <!-- Navbar -->
    <TmplNavbar
      brand="SOMETHINC"
      :links="navLinks"
      :accent="`oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`"
      :bg="`oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`"
      :text="`oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})`"
      style="glass"
      force-mode="light"
      :show-theme-toggle="false"
    />

    <!-- ============================================================ -->
    <!-- SECTION 1: Hero + 3D Bottle                                   -->
    <!-- ============================================================ -->
    <section id="top" class="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full" data-reveal="stagger-children">
        <!-- 3D Bottle -->
        <div class="flex justify-center order-1 md:order-2">
          <div class="relative w-[320px] h-[400px]">
            <canvas ref="canvasRef" class="w-full h-full cursor-grab active:cursor-grabbing" />
            <div
              v-if="!sceneReady"
              class="absolute inset-0 flex items-center justify-center"
              :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }"
            >
              <span class="text-xs tracking-[0.18em] uppercase" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Memuat...</span>
            </div>
          </div>
        </div>

        <!-- Hero copy -->
        <div class="order-2 md:order-1 text-center md:text-left">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-5" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Skincare Indonesia � Sejak 2015</p>

          <h1 :style="{ ...h1Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">
            Bahan yang jujur.<br>
            <span :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Harga yang jujur.</span>
          </h1>

          <p class="mt-5 text-base leading-relaxed max-w-sm mx-auto md:mx-0" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">
            Bahan aktif yang bisa kamu baca sendiri. Tidak ada proprietary blend.
          </p>

          <div class="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="#quiz"
              class="inline-flex items-center h-11 px-6 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
              :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
            >Mulai Quiz Rutin</a>
            <a
              href="#produk"
              class="inline-flex items-center h-11 px-6 rounded-full text-sm font-medium transition-all duration-200 border hover:scale-[1.03]"
              :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }"
            >Lihat Semua Produk</a>
          </div>

          <div class="mt-6 flex flex-wrap gap-5 justify-center md:justify-start text-[11px] tracking-wide" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">
            <span>BPOM</span>
            <span>Halal MUI</span>
            <span>Refill -20%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 2: Cerita (Brand Story)                                -->
    <!-- ============================================================ -->
    <section id="cerita" class="py-24 md:py-32 border-t" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-12 items-start" data-reveal="stagger-children">
        <div class="md:col-span-2">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-5" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Cerita Kami</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Dari Laboratorium ke Tangan Kamu</h2>
          <p class="mt-6 text-sm font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">� Anne Avianti, Founder</p>
        </div>

        <div class="md:col-span-3 space-y-5 leading-[1.7] text-base" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">
          <p>SOMETHINC dimulai di Jakarta, 2015. Satu serum niacinamide � bahan yang bisa dibaca siapa pun, harga yang jujur.</p>
          <p>Formula itu masih ada di lineup kami. Bukan nostalgia, tapi karena tetap bekerja.</p>
          <p>Tidak ada proprietary blend. Setiap konsentrasi dicantumkan. Setiap bahan punya alasan.</p>
          <p>Dua juta produk sudah terjual. Prinsipnya tetap sama: <strong :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">bahan terbuka, harga jujur.</strong></p>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 3: Produk (6 skincare products)                       -->
    <!-- ============================================================ -->
    <section id="produk" class="py-24 md:py-32" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Produk Kami</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">6 produk. Tidak perlu lebih.</h2>
          <p class="mt-3 text-sm max-w-sm mx-auto" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Satu fungsi spesifik per produk. Tidak ada filler.</p>
        </div>

        <!-- Refill subscription toggle -->
        <div class="max-w-md mx-auto mb-10 p-5 rounded-lg border" :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Langganan Refill</p>
              <p class="text-xs mt-0.5" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Hemat 20%, pengiriman setiap 60 hari</p>
            </div>
            <button
              @click="refillActive = !refillActive"
              class="relative w-12 h-7 rounded-full transition-colors duration-300"
              :style="{ background: refillActive ? `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` : `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }"
              role="switch"
              :aria-checked="refillActive"
            >
              <span class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300" :class="{ 'translate-x-5': refillActive }" />
            </button>
          </div>
        </div>

        <!-- Product grid -->
        <div class="grid md:grid-cols-3 gap-5" data-reveal="stagger-children">
          <article
            v-for="product in products"
            :key="product.id"
            class="group rounded-lg border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }"
          >
            <!-- Product image placeholder -->
            <div class="aspect-[4/3] relative" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-[10px] tracking-[0.14em] uppercase" :style="{ color: `oklch(${palette.border.l + 3}% ${palette.border.c} ${palette.border.h})` }">Foto produk</span>
              </div>
              <!-- Tags -->
              <div class="absolute top-3 left-3 flex gap-1.5">
                <span
                  v-for="tag in product.tags.slice(0, 2)"
                  :key="tag"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide"
                  :style="{
                    background: tag === 'Bestseller' ? `oklch(92% 0.05 75)` : `oklch(${palette.accentSoft.l}% ${palette.accentSoft.c} ${palette.accentSoft.h})`,
                    color: tag === 'Bestseller' ? `oklch(45% 0.12 75)` : `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`,
                  }"
                >{{ tag }}</span>
              </div>
            </div>

            <div class="p-5">
              <p class="text-[10px] tracking-[0.14em] uppercase mb-1" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ product.volume }}</p>
              <h3 class="text-base font-semibold mb-1.5 leading-tight" :style="{ fontFamily: `var(--tmpl-font-display)`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">{{ product.name }}</h3>
              <p class="text-sm leading-relaxed mb-3" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ product.description }}</p>

              <!-- Key ingredients -->
              <div class="mb-3">
                <p class="text-[10px] tracking-[0.14em] uppercase mb-1.5" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Bahan Utama</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="ing in product.keyIngredients"
                    :key="ing"
                    class="px-2 py-0.5 rounded text-[11px] font-mono"
                    :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})`, color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }"
                  >{{ ing }}</span>
                </div>
              </div>

              <!-- Price + Add to cart -->
              <div class="flex items-center justify-between mt-4 pt-3 border-t" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
                <div>
                  <p class="text-lg font-semibold tabular-nums" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})`, fontFeatureSettings: `'tnum' 1, 'ss02' 1` }">{{ formatRp(refillActive ? Math.round(product.price * 0.8) : product.price) }}</p>
                  <p v-if="refillActive" class="text-[11px] line-through" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ formatRp(product.price) }}</p>
                </div>
                <button
                  @click="addToCart(product)"
                  class="h-9 px-4 rounded-full text-xs font-medium transition-all duration-200 hover:scale-[1.04]"
                  :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
                >Tambah</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 4: Bahan (Ingredient Glossary)                        -->
    <!-- ============================================================ -->
    <section id="bahan" class="py-24 md:py-32 border-t" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Bahan Aktif</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">12 bahan. Tidak lebih.</h2>
          <p class="mt-3 text-sm max-w-md mx-auto" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Tanpa wewangian sintetis, pewarna, atau filler.</p>
        </div>

        <!-- Ingredient cards grid -->
        <div class="grid md:grid-cols-3 gap-4" data-reveal="stagger-children">
          <div
            v-for="ing in ingredients"
            :key="ing.inci"
            class="p-5 rounded-lg border transition-all duration-200 hover:-translate-y-0.5"
            :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-sm font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">{{ ing.name }}</h3>
              <span class="text-[10px] px-1.5 py-0.5 rounded" :style="{ background: `oklch(${palette.accentSoft.l}% ${palette.accentSoft.c} ${palette.accentSoft.h})`, color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">{{ ing.cocok }}</span>
            </div>
            <p class="text-xs font-mono mb-2" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ ing.inci }} � {{ ing.aka }}</p>
            <p class="text-sm leading-relaxed" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ ing.benefit }}</p>
          </div>
        </div>

        <!-- BPOM / Halal trust badges -->
        <div class="mt-12 flex flex-wrap justify-center gap-6">
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <svg class="w-4 h-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span class="text-xs font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">BPOM Terdaftar</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <svg class="w-4 h-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" /></svg>
            <span class="text-xs font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Halal MUI</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <svg class="w-4 h-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span class="text-xs font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Refill 20% off</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <svg class="w-4 h-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            <span class="text-xs font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">30 Hari Retur</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 5: Routine Finder (Quiz)                              -->
    <!-- ============================================================ -->
    <section id="quiz" class="py-24 md:py-32" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
      <div class="max-w-xl mx-auto px-6">
        <div class="text-center mb-10">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Cari Rutin Kamu</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Routine Finder</h2>
          <p class="mt-3 text-sm" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">4 pertanyaan. Rekomendasi untuk kulitmu.</p>
        </div>

        <!-- Quiz states -->
        <div v-if="quizStep === 'idle'" class="text-center">
          <button
            @click="startQuiz"
            class="h-12 px-8 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.04]"
            :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
          >Mulai Quiz</button>
        </div>

        <!-- Questions -->
        <div v-if="['q1','q2','q3','q4'].includes(quizStep)">
          <!-- Progress -->
          <div class="mb-6 h-1 rounded-full overflow-hidden" :style="{ background: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${(quizStep === 'q1' ? 25 : quizStep === 'q2' ? 50 : quizStep === 'q3' ? 75 : 100)}%`, background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }"
            />
          </div>

          <div class="mb-4">
            <p class="text-xs mb-1" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Pertanyaan {{ quizStep === 'q1' ? 1 : quizStep === 'q2' ? 2 : quizStep === 'q3' ? 3 : 4 }} dari 4</p>
            <h3 class="text-xl md:text-2xl leading-tight" :style="{ fontFamily: `var(--tmpl-font-display)`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">
              {{ quizQuestions[quizStep === 'q1' ? 0 : quizStep === 'q2' ? 1 : quizStep === 'q3' ? 2 : 3].text }}
            </h3>
          </div>

          <div class="space-y-2.5">
            <button
              v-for="opt in quizQuestions[quizStep === 'q1' ? 0 : quizStep === 'q2' ? 1 : quizStep === 'q3' ? 2 : 3].options"
              :key="opt"
              @click="answerQuiz(opt)"
              class="w-full text-left px-5 py-3.5 rounded-lg border text-sm transition-all duration-200 hover:-translate-y-0.5"
              :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }"
            >{{ opt }}</button>
          </div>
        </div>

        <!-- Result -->
        <div v-if="quizStep === 'result'" class="text-center">
          <div class="mb-6 p-5 rounded-lg" :style="{ background: `oklch(${palette.accentSoft.l}% ${palette.accentSoft.c} ${palette.accentSoft.h})` }">
            <p class="text-sm font-medium mb-1" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Rekomendasi untuk kamu</p>
            <p class="text-sm" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ quizRecommendation?.note }}</p>
          </div>

          <div class="space-y-3 mb-6">
            <div
              v-for="p in quizRecommendedProducts"
              :key="p.id"
              class="flex items-center gap-4 p-4 rounded-lg border text-left"
              :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }"
            >
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
                <span class="text-[8px] uppercase" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">IMG</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">{{ p.name }}</p>
                <p class="text-xs" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ formatRp(p.price) }}</p>
              </div>
              <button
                @click="addToCart(p)"
                class="h-8 px-3 rounded-full text-xs font-medium transition-all hover:scale-[1.04]"
                :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
              >Tambah</button>
            </div>
          </div>

          <button @click="resetQuiz" class="text-xs underline" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Ulangi quiz</button>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 6: Testimoni (3 reviews)                              -->
    <!-- ============================================================ -->
    <section id="testimoni" class="py-24 md:py-32 border-t" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
      <div class="max-w-5xl mx-auto px-6">
        <div class="mb-12">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Testimoni</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Kata mereka yang sudah coba</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-5" data-reveal="stagger-children">
          <!-- Review 1 -->
          <div class="p-6 rounded-lg border" :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <div class="flex gap-0.5 mb-3">
              <svg v-for="n in 5" :key="n" class="w-4 h-4" :style="{ color: `oklch(72% 0.15 75)` }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <p class="text-sm leading-relaxed mb-4" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">"Kulit berubah setelah 2 minggu. Bruntusan hilang, warna kulit lebih rata. Harganya masuk akal."</p>
            <div>
              <p class="text-sm font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Siti Rahmawati</p>
              <p class="text-xs" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Jakarta � Pembeli Terverifikasi</p>
            </div>
          </div>

          <!-- Review 2 -->
          <div class="p-6 rounded-lg border" :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <div class="flex gap-0.5 mb-3">
              <svg v-for="n in 5" :key="n" class="w-4 h-4" :style="{ color: `oklch(72% 0.15 75)` }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <p class="text-sm leading-relaxed mb-4" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">"Harga terjangkau tapi kualitas nyata. Tekstur ringan, cepat meresap, tidak lengket."</p>
            <div>
              <p class="text-sm font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Dinda Permata</p>
              <p class="text-xs" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Bandung � Pembeli Terverifikasi</p>
            </div>
          </div>

          <!-- Review 3 -->
          <div class="p-6 rounded-lg border" :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
            <div class="flex gap-0.5 mb-3">
              <svg v-for="n in 5" :key="n" class="w-4 h-4" :style="{ color: `oklch(72% 0.15 75)` }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <p class="text-sm leading-relaxed mb-4" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">"Tidak whitecast, tidak berminyak. Harganya bikin tidak sayang pakai setiap hari."</p>
            <div>
              <p class="text-sm font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Rina Wulandari</p>
              <p class="text-xs" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Surabaya � Pembeli Terverifikasi</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 7: FAQ                                                -->
    <!-- ============================================================ -->
    <section id="faq" class="py-24 md:py-32" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
      <div class="max-w-2xl mx-auto px-6">
        <div class="text-center mb-10">
          <p class="text-[11px] tracking-[0.18em] uppercase font-medium mb-4" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">Pertanyaan Umum</p>
          <h2 :style="{ ...h2Style, fontStyle: 'italic', color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">FAQ</h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="rounded-lg border overflow-hidden"
            :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }"
          >
            <button
              @click="faqOpen = faqOpen === idx ? null : idx"
              class="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
              :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }"
            >
              <span>{{ faq.q }}</span>
              <svg class="w-4 h-4 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': faqOpen === idx }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 -translate-y-1"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="faqOpen === idx" class="px-5 pb-4 text-sm leading-relaxed" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">
                {{ faq.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- SECTION 8: Footer                                             -->
    <!-- ============================================================ -->
    <TmplFooter data-reveal="fade-up" brand-name="SOMETHINC"
      variant="columns"
      :accent="`oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`"
      :bg="`oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})`"
      :text="`oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})`"
      signature="Skincare Indonesia � Sejak 2015"
      :links="[
        { label: 'Produk', href: '#produk' },
        { label: 'Bahan', href: '#bahan' },
        { label: 'Quiz', href: '#quiz' },
        { label: 'Testimoni', href: '#testimoni' },
        { label: 'FAQ', href: '#faq' },
      ]"
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="e-commerce"
    />

    <!-- Cart drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="cartOpen" class="fixed inset-0 z-50" @click.self="cartOpen = false">
          <div class="absolute inset-0 bg-black/40" />
          <div
            class="absolute right-0 top-0 bottom-0 w-full max-w-sm flex flex-col"
            :style="{ background: `oklch(${palette.surfaceElevated.l}% ${palette.surfaceElevated.c} ${palette.surfaceElevated.h})` }"
          >
            <div class="flex items-center justify-between p-5 border-b" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
              <h3 class="text-base font-semibold" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Keranjang ({{ cartCount }})</h3>
              <button @click="cartOpen = false" class="w-8 h-8 flex items-center justify-center rounded-full" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-5">
              <div v-if="cart.items.length === 0" class="text-center py-12">
                <p class="text-sm" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Keranjang kosong</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="item in cart.items" :key="item.product.id" class="flex gap-3">
                  <div class="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center" :style="{ background: `oklch(${palette.surface.l}% ${palette.surface.c} ${palette.surface.h})` }">
                    <span class="text-[8px] uppercase" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">IMG</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">{{ item.product.name }}</p>
                    <p class="text-xs mt-0.5" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">{{ formatRp(item.product.price) }}</p>
                    <div class="flex items-center gap-2 mt-1.5">
                      <button @click="updateQty(item.product.id, -1)" class="w-6 h-6 rounded border text-xs flex items-center justify-center" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">-</button>
                      <span class="text-xs tabular-nums w-4 text-center" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">{{ item.qty }}</span>
                      <button @click="updateQty(item.product.id, 1)" class="w-6 h-6 rounded border text-xs flex items-center justify-center" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})`, color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">+</button>
                    </div>
                  </div>
                  <button @click="removeFromCart(item.product.id)" class="self-start text-xs" :style="{ color: `oklch(${palette.muted.l}% ${palette.muted.c} ${palette.muted.h})` }">Hapus</button>
                </div>
              </div>
            </div>

            <div v-if="cart.items.length" class="p-5 border-t" :style="{ borderColor: `oklch(${palette.border.l}% ${palette.border.c} ${palette.border.h})` }">
              <div class="flex justify-between mb-4">
                <span class="text-sm font-medium" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})` }">Total</span>
                <span class="text-base font-semibold tabular-nums" :style="{ color: `oklch(${palette.fg.l}% ${palette.fg.c} ${palette.fg.h})`, fontFeatureSettings: `'tnum' 1, 'ss02' 1` }">{{ formatRp(cartSubtotal) }}</span>
              </div>
              <a
                :href="'https://wa.me/6285188627365?text=' + encodeURIComponent('Halo, saya mau pesan: ' + cart.items.map(i => i.product.name + ' x' + i.qty).join(', ') + '. Total: ' + formatRp(cartSubtotal))"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center h-11 rounded-full text-sm font-medium transition-all hover:scale-[1.03] w-full"
                :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
              >Bayar via WhatsApp</a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Cart FAB -->
    <button
      v-if="cartCount > 0 && !cartOpen"
      @click="cartOpen = true"
      class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
      <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-white" :style="{ color: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})` }">{{ cartCount }}</span>
    </button>

    <!-- Toast -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="toastVisible"
          class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
          :style="{ background: `oklch(${palette.accent.l}% ${palette.accent.c} ${palette.accent.h})`, color: `oklch(${palette.accentFg.l}% ${palette.accentFg.c} ${palette.accentFg.h})` }"
        >? {{ toastMsg }}</div>
      </Transition>
    </Teleport>
  </div>
</template>
