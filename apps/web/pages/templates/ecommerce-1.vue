<script setup lang="ts">
/**
 * ecommerce-1.vue — Erigo Goods
 * Premium product e-commerce. Apple/B&O/Hermes aesthetic.
 *
 * 8 sections: Hero + 3D → Featured → Categories → Product Detail → Cart → Testimonials → FAQ → Footer
 * 7+ working interactions: category filter, cart add/remove/qty, variant selector, color picker, 3D drag, TmplForm, WhatsApp checkout
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { CartItem } from '~/components/TmplCart.vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('ecommerce-1')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme

// ============================================================
// PRODUCTS
// ============================================================
interface Product {
  id: string
  name: string
  category: 'Pakaian' | 'Tas' | 'Aksesori'
  categoryTag: string
  price: number
  colors: { name: string; hex: string }[]
  sizes: string[]
  description: string
  gradient: string
}

const products: Product[] = [
  {
    id: 'kaos-oversize',
    name: 'Kaos Oversize Heavyweight',
    category: 'Pakaian',
    categoryTag: 'PAKAIAN',
    price: 285000,
    colors: [
      { name: 'Cream', hex: '#F5F0E8' },
      { name: 'Slate', hex: '#6B7280' },
      { name: 'Sage', hex: '#9CAF88' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Katun 24s, potongan oversize. Jahitan rantai di keliman.',
    gradient: 'linear-gradient(145deg, #F5F0E8 0%, #E8E0D0 40%, #D4C9B5 100%)',
  },
  {
    id: 'hoodie-terry',
    name: 'Hoodie Loop Terry',
    category: 'Pakaian',
    categoryTag: 'PAKAIAN',
    price: 480000,
    colors: [
      { name: 'Natural', hex: '#F0EBE0' },
      { name: 'Coal', hex: '#3A3A3A' },
      { name: 'Olive', hex: '#6B7B4A' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Loop terry katun 460gsm. Kantong kanguru, tali katun tebal.',
    gradient: 'linear-gradient(145deg, #F0EBE0 0%, #D9D0C0 40%, #C4BAA8 100%)',
  },
  {
    id: 'tote-kanvas',
    name: 'Tote Kanvas 16oz',
    category: 'Tas',
    categoryTag: 'TAS',
    price: 350000,
    colors: [
      { name: 'Natural', hex: '#EDE8DC' },
      { name: 'Hitam', hex: '#1A1A1A' },
      { name: 'Sage', hex: '#9CAF88' },
    ],
    sizes: ['One Size'],
    description: 'Kanvas lokal 16oz. Jahitan ganda, kantong laptop 14".',
    gradient: 'linear-gradient(145deg, #EDE8DC 0%, #D8D0BE 40%, #C2B8A4 100%)',
  },
  {
    id: 'selempang-kulit',
    name: 'Selempang Kulit Sapi',
    category: 'Tas',
    categoryTag: 'TAS',
    price: 920000,
    colors: [
      { name: 'Tan', hex: '#C4956A' },
      { name: 'Cokelat', hex: '#6B4226' },
      { name: 'Hitam', hex: '#1A1A1A' },
    ],
    sizes: ['One Size'],
    description: 'Kulit sapi lokal. Hardware kuningan, tali 90-130cm.',
    gradient: 'linear-gradient(145deg, #C4956A 0%, #A87D58 40%, #8C6540 100%)',
  },
  {
    id: 'topi-barelang',
    name: 'Topi Barelang 5-Panel',
    category: 'Aksesori',
    categoryTag: 'AKSESORI',
    price: 195000,
    colors: [
      { name: 'Natural', hex: '#F0EBE0' },
      { name: 'Olive', hex: '#6B7B4A' },
      { name: 'Navy', hex: '#1E2A3A' },
    ],
    sizes: ['One Size'],
    description: 'Katun twill 5-panel. Bordir Erigo, strap adjustable.',
    gradient: 'linear-gradient(145deg, #F0EBE0 0%, #DED5C4 40%, #CCBFA8 100%)',
  },
  {
    id: 'syal-wol',
    name: 'Syal Wol Lambung',
    category: 'Aksesori',
    categoryTag: 'AKSESORI',
    price: 425000,
    colors: [
      { name: 'Cream', hex: '#F5F0E8' },
      { name: 'Charcoal', hex: '#4A4A4A' },
      { name: 'Terracotta', hex: '#C0704A' },
    ],
    sizes: ['One Size'],
    description: 'Wol 100% dari Biak. Tenunan tangan 4 minggu per piece.',
    gradient: 'linear-gradient(145deg, #F5F0E8 0%, #E0D5C5 40%, #CBBAA5 100%)',
  },
]

// ============================================================
// STATE
// ============================================================
const activeCategory = ref<string | null>(null)
const selectedProduct = ref<Product | null>(null)
const selectedColor = ref<Record<string, string>>({})
const selectedSize = ref<Record<string, string>>({})
const cartOpen = ref(false)
const cartItems = ref<CartItem[]>([])
const openFaq = ref<number | null>(0)
const heroLoaded = ref(false)
const consultOpen = ref(false)

// Init selections
for (const p of products) {
  selectedColor.value[p.id] = p.colors[0].name
  selectedSize.value[p.id] = p.sizes[0]
}

// Load cart from localStorage
onMounted(() => {
  setTimeout(() => { heroLoaded.value = true }, 100)
  try {
    const saved = localStorage.getItem('erigo-cart')
    if (saved) cartItems.value = JSON.parse(saved)
  } catch { /* ignore */ }
})

function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem('erigo-cart', JSON.stringify(items))
  } catch { /* ignore */ }
}

// ============================================================
// FILTERED PRODUCTS
// ============================================================
const filteredProducts = computed(() => {
  if (!activeCategory.value) return products
  return products.filter(p => p.category === activeCategory.value)
})

// ============================================================
// CART OPERATIONS
// ============================================================
const cartCount = computed(() => cartItems.value.reduce((s, it) => s + it.qty, 0))

function addToCart(product: Product) {
  const color = selectedColor.value[product.id]
  const size = selectedSize.value[product.id]
  const variant = size === 'One Size' ? color : `${color} / ${size}`
  const cartId = `${product.id}-${color}-${size}`

  const existing = cartItems.value.find(it => it.id === cartId)
  if (existing) {
    existing.qty += 1
    cartItems.value = [...cartItems.value]
  } else {
    cartItems.value.push({
      id: cartId,
      name: product.name,
      price: product.price,
      qty: 1,
      variant,
    })
  }
  persistCart(cartItems.value)
  cartOpen.value = true
}

function updateCartItems(items: CartItem[]) {
  cartItems.value = items
  persistCart(items)
}

// ============================================================
// FAQ
// ============================================================
const faqs = [
  { q: 'Berapa lama pengiriman?', a: '3-5 hari kerja (Jawa), 5-7 hari (luar Jawa). Dikirim dari Bandung.' },
  { q: 'Bisa tukar ukuran?', a: 'Bisa, 7 hari setelah terima. Belum dicuci, tag terpasang. Ongkir tukar ditanggung pembeli.' },
  { q: 'Bahan dan perawatan?', a: 'Semua bahan lokal. Cuci air dingin, jangan pengering. Setrika suhu rendah.' },
  { q: 'Ada toko fisik?', a: 'Belum. Langsung dari workshop Bandung. Bisa janjian ke workshop untuk lihat langsung.' },
  { q: 'Cara pesan custom order?', a: 'Hubungi WhatsApp. Tim desainer merespons 1-2 hari kerja.' },
]

// ============================================================
// FORMATTERS
// ============================================================
function fmtRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

// ============================================================
// TOAST
// ============================================================
const toastMessage = ref('')
let toastTimer: number | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toastMessage.value = '' }, 1800)
}
</script>

<template>
  <div class="erigo" :style="styles">
    <a class="skip-link" href="#main">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Erigo Goods"
      :links="[
        { label: 'Produk', href: '#produk' },
        { label: 'Kategori', href: '#kategori' },
        { label: 'Testimoni', href: '#testimoni' },
        { label: 'FAQ', href: '#faq' },
      ]"
      accent="var(--tmpl-accent)"
      style="glass"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- 1. HERO                        -->
      <!-- ============================== -->
      <section class="erigo-hero" :style="{ minHeight: '100dvh' }">
        <div class="erigo-hero__3d">
          <TmplExperienceCanvas
            preset="orbit-product"
            :accent="tpl.accentColor"
            intensity="balanced"
          />
        </div>

        <div class="erigo-hero__content" :class="{ 'erigo-hero__content--loaded': heroLoaded }">
          <p class="erigo-eyebrow" :style="monoStyle">DIRANCANG, BUKAN DIBUAT</p>

          <h1 :style="h1Style" class="erigo-h1 text-balance">
            <span class="erigo-h1__line">Erigo Goods.</span>
            <span class="erigo-h1__line erigo-h1__line--sub">Objek yang tenang.</span>
          </h1>

          <p class="erigo-lede">Katun lokal, jahitan dipikirkan, harga masuk akal.</p>

          <div class="erigo-cta">
            <a href="#produk" class="erigo-btn erigo-btn--primary">
              Lihat semua
              <UIcon name="i-lucide-arrow-down" class="w-4 h-4" />
            </a>
            <button type="button" class="erigo-btn erigo-btn--ghost" @click="consultOpen = true">Konsultasi</button>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 2. MARQUEE                     -->
      <!-- ============================== -->
      <TmplMarquee
        :items="['Dibuat di Bandung', 'Katun Lokal', 'Jahitan Rantai', 'Dikirim 3-5 Hari', 'Tukar dalam 7 Hari', 'Dibuat di Bandung', 'Katun Lokal', 'Jahitan Rantai', 'Dikirim 3-5 Hari', 'Tukar dalam 7 Hari']"
        accent="var(--tmpl-accent)"
      />

      <!-- ============================== -->
      <!-- 3. KATEGORI (filter chips)     -->
      <!-- ============================== -->
      <section id="kategori" class="erigo-section erigo-categories">
        <div class="erigo-section-head">
          <p class="erigo-eyebrow" :style="monoStyle">01 / KATEGORI</p>
          <h2 :style="h2Style" class="text-balance">Tiga kategori.</h2>
        </div>

        <div class="erigo-chips">
          <button
            type="button"
            class="erigo-chip"
            :class="{ 'erigo-chip--active': !activeCategory }"
            @click="activeCategory = null"
          >
            Semua
          </button>
          <button
            v-for="cat in ['Pakaian', 'Tas', 'Aksesori']"
            :key="cat"
            type="button"
            class="erigo-chip"
            :class="{ 'erigo-chip--active': activeCategory === cat }"
            @click="activeCategory = activeCategory === cat ? null : cat"
          >
            {{ cat }}
          </button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 4. PRODUK (grid)               -->
      <!-- ============================== -->
      <section id="produk" class="erigo-section erigo-products">
        <div class="erigo-section-head">
          <p class="erigo-eyebrow" :style="monoStyle">02 / PRODUK</p>
          <h2 :style="h2Style" class="text-balance">Yang kami <em>pakai.</em></h2>
        </div>

        <div class="erigo-product-grid">
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="erigo-product-card"
            @click="selectedProduct = selectedProduct?.id === product.id ? null : product"
          >
            <!-- Image placeholder -->
            <div class="erigo-product-card__img" :style="{ background: product.gradient }">
              <span class="erigo-product-card__tag" :style="monoStyle">{{ product.categoryTag }}</span>
            </div>

            <div class="erigo-product-card__body">
              <p class="erigo-product-card__name">{{ product.name }}</p>
              <p class="erigo-product-card__price" :style="monoStyle">{{ fmtRp(product.price) }}</p>
            </div>

            <!-- Inline expansion: product detail -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="selectedProduct?.id === product.id" class="erigo-product-detail" @click.stop>
                <p class="erigo-product-detail__desc">{{ product.description }}</p>

                <!-- Color picker -->
                <div class="erigo-detail-row">
                  <span class="erigo-detail-label" :style="monoStyle">Warna</span>
                  <div class="erigo-color-picker">
                    <button
                      v-for="c in product.colors"
                      :key="c.name"
                      type="button"
                      class="erigo-color-swatch"
                      :class="{ 'erigo-color-swatch--active': selectedColor[product.id] === c.name }"
                      :style="{ '--swatch-bg': c.hex }"
                      :aria-label="c.name"
                      :title="c.name"
                      @click="selectedColor[product.id] = c.name"
                    >
                      <span class="erigo-color-swatch__check">
                        <UIcon v-if="selectedColor[product.id] === c.name" name="i-lucide-check" class="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                  <span class="erigo-color-name" :style="monoStyle">{{ selectedColor[product.id] }}</span>
                </div>

                <!-- Size selector -->
                <div v-if="product.sizes.length > 1" class="erigo-detail-row">
                  <span class="erigo-detail-label" :style="monoStyle">Ukuran</span>
                  <div class="erigo-size-picker">
                    <button
                      v-for="s in product.sizes"
                      :key="s"
                      type="button"
                      class="erigo-size-btn"
                      :class="{ 'erigo-size-btn--active': selectedSize[product.id] === s }"
                      @click="selectedSize[product.id] = s"
                    >
                      {{ s }}
                    </button>
                  </div>
                </div>

                <!-- Add to cart -->
                <button
                  type="button"
                  class="erigo-add-btn"
                  @click="addToCart(product)"
                >
                  Tambah ke keranjang
                  <UIcon name="i-lucide-shopping-bag" class="w-4 h-4" />
                </button>
              </div>
            </Transition>
          </article>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 5. TESTIMONI                   -->
      <!-- ============================== -->
      <section id="testimoni" class="erigo-section erigo-testimonials">
        <div class="erigo-section-head">
          <p class="erigo-eyebrow" :style="monoStyle">03 / DARI PEMBELI</p>
          <h2 :style="h2Style" class="text-balance">Yang mereka <em>rasakan.</em></h2>
        </div>

        <div class="erigo-testimonial-grid">
          <blockquote class="erigo-testimonial">
            <p class="erigo-testimonial__text">
              "Tote kanvas dan selempang kulit, sampai sebelum puasa. Jahitan bagus, strap tidak tipis. Pakai tiap hari ke kantor."
            </p>
            <footer class="erigo-testimonial__footer">
              <div>
                <cite class="erigo-testimonial__name">Putri Larasati</cite>
                <p class="erigo-testimonial__loc" :style="monoStyle">Jakarta</p>
              </div>
            </footer>
          </blockquote>

          <blockquote class="erigo-testimonial">
            <p class="erigo-testimonial__text">
              "Hoodie tebal tapi breathable. Beli tiga warna setelah coba satu."
            </p>
            <footer class="erigo-testimonial__footer">
              <div>
                <cite class="erigo-testimonial__name">Bima A. Wicaksono</cite>
                <p class="erigo-testimonial__loc" :style="monoStyle">Bandung</p>
              </div>
            </footer>
          </blockquote>

          <blockquote class="erigo-testimonial">
            <p class="erigo-testimonial__text">
              "Detail kecil yang terasa 'dirancang', bukan 'dibuat'. Klaim 'made in Indonesia' sering dilebih-lebihkan, tapi Erigo bener-bener."
            </p>
            <footer class="erigo-testimonial__footer">
              <div>
                <cite class="erigo-testimonial__name">Ratna Kusuma</cite>
                <p class="erigo-testimonial__loc" :style="monoStyle">Yogyakarta</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      <!-- ============================== -->
      <!-- 6. FAQ                         -->
      <!-- ============================== -->
      <section id="faq" class="erigo-section erigo-faq-section">
        <div class="erigo-section-head">
          <p class="erigo-eyebrow" :style="monoStyle">04 / PERTANYAAN</p>
          <h2 :style="h2Style" class="text-balance">Yang sering <em>ditanya.</em></h2>
        </div>

        <ul class="erigo-faq">
          <li
            v-for="(item, i) in faqs"
            :key="i"
            class="erigo-faq__item"
            :class="{ 'erigo-faq__item--open': openFaq === i }"
          >
            <h3 class="erigo-faq__h">
              <button
                type="button"
                class="erigo-faq__btn"
                :aria-expanded="openFaq === i"
                :aria-controls="`faq-${i}`"
                @click="openFaq = openFaq === i ? null : i"
              >
                <span class="erigo-faq__q">{{ item.q }}</span>
                <UIcon
                  :name="openFaq === i ? 'i-lucide-minus' : 'i-lucide-plus'"
                  class="erigo-faq__icon w-4 h-4"
                />
              </button>
            </h3>
            <Transition
              enter-active-class="transition-all duration-300 ease-out overflow-hidden"
              leave-active-class="transition-all duration-200 ease-in overflow-hidden"
              enter-from-class="opacity-0 max-h-0"
              leave-to-class="opacity-0 max-h-0"
            >
              <p v-if="openFaq === i" :id="`faq-${i}`" class="erigo-faq__a">
                {{ item.a }}
              </p>
            </Transition>
          </li>
        </ul>
      </section>

      <!-- ============================== -->
      <!-- 7. FOOTER (signoff)            -->
      <!-- ============================== -->
      <TmplFooter
        brand-name="Erigo Goods"
        variant="signoff"
        signoff="Objek yang tenang, dari Bandung."
        signature="Dibuat di Bandung"
        accent="var(--tmpl-accent)"
        bg="var(--tmpl-bg)"
        text="var(--tmpl-fg)"
      />
    </main>

    <!-- ============================== -->
    <!-- CART DRAWER                     -->
    <!-- ============================== -->
    <TmplCart
      :open="cartOpen"
      :items="cartItems"
      storage-key="erigo-cart"
      currency="Rp "
      whatsapp-phone="6285188627365"
      whatsapp-message-prefix="Halo Erigo, saya mau pesan:"
      :accent="tpl.accentColor"
      @update:open="cartOpen = $event"
      @update:items="updateCartItems"
    />

    <!-- ============================== -->
    <!-- CONSULT FORM MODAL              -->
    <!-- ============================== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="consultOpen" class="erigo-modal-backdrop" @click="consultOpen = false" />
      </Transition>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="consultOpen" class="erigo-modal" role="dialog" aria-label="Konsultasi desainer">
          <button type="button" class="erigo-modal__close" @click="consultOpen = false" aria-label="Tutup">
            <UIcon name="i-lucide-x" class="w-4 h-4" />
          </button>
          <h3 :style="h2Style" class="erigo-modal__title">Konsultasi</h3>
          <p class="erigo-modal__sub">Kebutuhan custom order, respons 1-2 hari kerja.</p>

          <TmplForm
            :fields="[
              { key: 'name', label: 'Nama', type: 'text', placeholder: 'Nama kamu', required: true },
              { key: 'city', label: 'Kota', type: 'text', placeholder: 'Misal: Jakarta' },
              { key: 'message', label: 'Kebutuhan', type: 'textarea', placeholder: 'Ceritakan apa yang kamu butuhkan...', required: true },
            ]"
            submit-label="Kirim via WhatsApp"
            whatsapp-phone="6285188627365"
            whatsapp-message-prefix="Halo Erigo, saya mau konsultasi custom order:"
            :accent="tpl.accentColor"
            @success="consultOpen = false"
          />
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="toastMessage" class="erigo-toast" :style="monoStyle">
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- ============================== -->
    <!-- WHATSAPP FAB                    -->
    <!-- ============================== -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="e-commerce"
    />
  </div>
</template>

<style scoped>
.erigo {
  min-height: 100dvh;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  padding: 0.5rem 1rem;
  z-index: 100;
  font-size: 13px;
}
.skip-link:focus {
  top: 0;
}

/* === Eyebrow === */
.erigo-eyebrow {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
}

/* === H1 === */
.erigo-h1 {
  font-size: var(--tmpl-h1);
  line-height: 0.95;
  letter-spacing: -0.025em;
  font-weight: 400;
  margin: 0 0 1.5rem;
}
.erigo-h1__line {
  display: block;
  font-style: italic;
}
.erigo-h1__line--sub {
  font-size: 0.45em;
  font-style: normal;
  letter-spacing: -0.01em;
  opacity: 0.7;
  margin-top: 0.5em;
  font-family: var(--tmpl-font-body);
}

/* === Lede === */
.erigo-lede {
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.55;
  max-width: 42ch;
  opacity: 0.75;
  margin: 0 0 2rem;
}

/* === CTA === */
.erigo-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.erigo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: background-color 200ms ease, transform 200ms ease, border-color 200ms ease;
}
.erigo-btn--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.erigo-btn--primary:hover {
  transform: translateY(-1px);
}
.erigo-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: color-mix(in srgb, currentColor 25%, transparent);
}
.erigo-btn--ghost:hover {
  background: color-mix(in srgb, currentColor 5%, transparent);
  border-color: color-mix(in srgb, currentColor 40%, transparent);
}

/* === HERO === */
.erigo-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rem 1.5rem 6rem;
  overflow: hidden;
}
.erigo-hero__3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.25;
}
.erigo-hero__content {
  position: relative;
  z-index: 2;
  max-width: 50rem;
  text-align: left;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.erigo-hero__content--loaded {
  opacity: 1;
  transform: translateY(0);
}

/* === SECTIONS === */
.erigo-section {
  padding: 6rem 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}
.erigo-section-head {
  max-width: 50rem;
  margin: 0 auto 3rem;
  text-align: left;
}
.erigo-section-head h2 {
  font-size: var(--tmpl-h2);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0 0 1rem;
}
.erigo-section-head h2 em {
  font-style: italic;
  color: var(--tmpl-accent);
}

/* === CATEGORY CHIPS === */
.erigo-categories {
  padding-bottom: 2rem;
}
.erigo-chips {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.erigo-chip {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.erigo-chip:hover {
  border-color: color-mix(in srgb, currentColor 40%, transparent);
  background: color-mix(in srgb, currentColor 5%, transparent);
}
.erigo-chip--active {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}

/* === PRODUCT GRID === */
.erigo-product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) {
  .erigo-product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .erigo-product-grid { grid-template-columns: repeat(3, 1fr); }
}

/* === PRODUCT CARD === */
.erigo-product-card {
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 8px;
  overflow: hidden;
  background: var(--tmpl-surface);
  cursor: pointer;
  transition: all 250ms ease;
}
.erigo-product-card:hover {
  border-color: color-mix(in srgb, currentColor 20%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px color-mix(in srgb, currentColor 6%, transparent);
}
.erigo-product-card__img {
  aspect-ratio: 4 / 5;
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 1rem;
}
.erigo-product-card__tag {
  font-size: 9px;
  letter-spacing: 0.2em;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tmpl-bg) 85%, transparent);
  color: var(--tmpl-fg);
}
.erigo-product-card__body {
  padding: 1.25rem 1.5rem;
}
.erigo-product-card__name {
  font-family: var(--tmpl-font-display);
  font-size: 1.05rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 0.35rem;
  letter-spacing: -0.01em;
}
.erigo-product-card__price {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
  margin: 0;
}

/* === PRODUCT DETAIL (inline expansion) === */
.erigo-product-detail {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.erigo-product-detail__desc {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.75;
  margin: 1rem 0 0;
}
.erigo-detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.erigo-detail-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.5;
  min-width: 3rem;
}

/* === COLOR PICKER === */
.erigo-color-picker {
  display: flex;
  gap: 0.5rem;
}
.erigo-color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 2px solid transparent;
  background: var(--swatch-bg);
  cursor: pointer;
  position: relative;
  transition: border-color 200ms ease, transform 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.erigo-color-swatch:hover {
  transform: scale(1.1);
}
.erigo-color-swatch--active {
  border-color: var(--tmpl-fg);
  box-shadow: 0 0 0 2px var(--tmpl-bg);
}
.erigo-color-swatch__check {
  color: var(--tmpl-bg);
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
}
.erigo-color-name {
  font-size: 11px;
  opacity: 0.6;
}

/* === SIZE PICKER === */
.erigo-size-picker {
  display: flex;
  gap: 0.375rem;
}
.erigo-size-btn {
  width: 36px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.erigo-size-btn:hover {
  border-color: color-mix(in srgb, currentColor 35%, transparent);
}
.erigo-size-btn--active {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}

/* === ADD TO CART BUTTON === */
.erigo-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border: 0;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 200ms ease, transform 200ms ease;
  width: 100%;
}
.erigo-add-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* === TESTIMONIALS === */
.erigo-testimonials {
  border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}
.erigo-testimonial-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .erigo-testimonial-grid { grid-template-columns: repeat(3, 1fr); }
}
.erigo-testimonial {
  padding: 2rem;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 8px;
  background: var(--tmpl-surface);
  margin: 0;
}
.erigo-testimonial__text {
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 1rem;
  font-style: italic;
  opacity: 0.85;
}
.erigo-testimonial__footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.erigo-testimonial__name {
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  display: block;
}
.erigo-testimonial__loc {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0.15rem 0 0;
}

/* === FAQ === */
.erigo-faq {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.erigo-faq__item {
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.erigo-faq__h {
  margin: 0;
}
.erigo-faq__btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 0.5rem;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.erigo-faq__q {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.4;
}
.erigo-faq__icon {
  flex-shrink: 0;
  color: var(--tmpl-accent);
}
.erigo-faq__a {
  padding: 0 0.5rem 1.5rem;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.75;
}

/* === MODAL === */
.erigo-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.erigo-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 95;
  width: min(520px, calc(100vw - 2rem));
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  background: var(--tmpl-bg);
  color: var(--tmpl-fg);
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.erigo-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  transition: background-color 200ms ease;
}
.erigo-modal__close:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.erigo-modal__title {
  margin: 0 0 0.5rem;
}
.erigo-modal__sub {
  font-size: 14px;
  opacity: 0.7;
  margin: 0 0 1.5rem;
}

/* === TOAST === */
.erigo-toast {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .erigo-hero__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
