<script setup lang="ts">
/**
 * restaurant-3.vue
 * Sate Madura Pak Karto — Warung Hyperlocal
 * slug='restaurant-3', typo='sate', palette='sate'
 * Bebas Neue H1, Inter body. Force mode: light. Burnt orange accent.
 */
definePageMeta({ layout: false })

const theme = useTemplateTheme('restaurant-3')
const { tpl, palette, styles, h1Style, h2Style } = theme
const { buildUrl } = useWhatsApp()

const isLoaded = ref(false)
onMounted(() => { setTimeout(() => { isLoaded.value = true }, 300) })

const accentCss = computed(() => 'oklch(55% 0.20 35)')

const navLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Pesan', href: '#pesan' },
]

const categories = ['Semua', 'Sate', 'Nasi & Mie', 'Minuman']
const activeCategory = ref('Semua')

interface MenuItem {
  name: string
  desc: string
  price: string
  priceNum: number
  category: string
}

const menuItems: MenuItem[] = [
  { name: 'Sate Ayam', desc: '10 tusuk. Bumbu kacang khas Madura.', price: 'Rp 25.000', priceNum: 25000, category: 'Sate' },
  { name: 'Sate Kambing', desc: '10 tusuk. Bumbu kecap pedas.', price: 'Rp 30.000', priceNum: 30000, category: 'Sate' },
  { name: 'Nasi Goreng Spesial', desc: 'Telur, ayam suwir, kerupuk.', price: 'Rp 22.000', priceNum: 22000, category: 'Nasi & Mie' },
  { name: 'Mie Ayam', desc: 'Ayam cincang, pangsit goreng.', price: 'Rp 20.000', priceNum: 20000, category: 'Nasi & Mie' },
  { name: 'Es Teh Manis', desc: 'Teh poci dingin. Gula asli.', price: 'Rp 5.000', priceNum: 5000, category: 'Minuman' },
  { name: 'Es Jeruk', desc: 'Jeruk peras segar.', price: 'Rp 7.000', priceNum: 7000, category: 'Minuman' },
  { name: 'Bakso Spesial', desc: '4 butir bakso sapi. Kuah kaldu.', price: 'Rp 18.000', priceNum: 18000, category: 'Nasi & Mie' },
  { name: 'Lontong Sayur', desc: 'Labu, telur, sambal goreng.', price: 'Rp 15.000', priceNum: 15000, category: 'Nasi & Mie' },
]

const filteredMenu = computed(() => {
  if (activeCategory.value === 'Semua') return menuItems
  return menuItems.filter(i => i.category === activeCategory.value)
})

const cartItems = reactive<Record<string, number>>({})

function addToCart(name: string) {
  cartItems[name] = (cartItems[name] || 0) + 1
}

function removeFromCart(name: string) {
  if (cartItems[name] > 1) cartItems[name]--
  else delete cartItems[name]
}

const cartCount = computed(() => Object.values(cartItems).reduce((a, b) => a + b, 0))
const cartTotal = computed(() => {
  let total = 0
  for (const item of menuItems) {
    total += (cartItems[item.name] || 0) * item.priceNum
  }
  return total
})

const whatsappOrderUrl = computed(() => {
  const lines = Object.entries(cartItems).map(([name, qty]) => {
    const item = menuItems.find(i => i.name === name)
    return `${qty}x ${name} (${item?.price})`
  })
  const text = `Halo Sate Madura Pak Karto, saya mau pesan:\n\n${lines.join('\n')}\n\nTotal: Rp ${cartTotal.value.toLocaleString('id-ID')}\n\nMohon konfirmasi ya.`
  return buildUrl(text)
})

const orderFormFields = [
  { key: 'nama', label: 'Nama', type: 'text' as const, placeholder: 'Nama kamu', required: true },
  { key: 'hp', label: 'No. WhatsApp', type: 'tel' as const, placeholder: '08xxxxxxxxxx', required: true },
  { key: 'alamat', label: 'Alamat antar / ambil di cabang', type: 'text' as const, placeholder: 'Jl. Senopati / Tebet / BSD', required: true },
  { key: 'catatan', label: 'Catatan', type: 'textarea' as const, placeholder: 'Extra sambal, tanpa bawang, dll.' },
]

const galleryPhotos = [
  { alt: 'Sate ayam dibakar di arang', aspect: 'aspect-square' },
  { alt: 'Bumbu kacang khas Madura', aspect: 'aspect-square' },
  { alt: 'Suasana warung malam hari', aspect: 'aspect-[4/5]' },
  { alt: 'Lontong sayur dan sambal', aspect: 'aspect-square' },
  { alt: 'Es teh manis dan kerupuk', aspect: 'aspect-[4/5]' },
  { alt: 'Pak Karto lagi bakar sate', aspect: 'aspect-square' },
  { alt: 'Nasi goreng spesial porsi besar', aspect: 'aspect-square' },
  { alt: 'Bakso sapi kuah kaldu', aspect: 'aspect-[4/5]' },
  { alt: 'Antrian warung jam makan siang', aspect: 'aspect-square' },
]

const branches = [
  { name: 'Senopati', address: 'Jl. Senopati No. 45, Kebayoran Baru', hours: '10:00 - 22:00', phone: '0812-3456-7890' },
  { name: 'Tebet', address: 'Jl. Tebet Raya No. 12, Tebet', hours: '10:00 - 22:00', phone: '0812-3456-7891' },
  { name: 'Bendungan Hilir', address: 'Jl. Benhil Raya No. 88, Tanah Abang', hours: '10:00 - 21:00', phone: '0812-3456-7892' },
  { name: 'BSD', address: 'Jl. Pahlawan Seribu No. 7, BSD City', hours: '10:00 - 22:00', phone: '0812-3456-7893' },
]
const activeBranch = ref(0)

const currentHour = new Date().getHours()
const isOpen = currentHour >= 10 && currentHour < 22
</script>

<template>
  <div :style="styles" class="sate-page">
    <TmplNavbar
      brand="Pak Karto"
      :links="navLinks"
      :accent="accentCss"
      style="transparent"
      :show-theme-toggle="false"
      :show-whatsapp-c-t-a="true"
      whatsapp-message="Halo Sate Madura Pak Karto, saya mau tanya menu."
      force-mode="light"
    />

    <!-- ====== HERO ====== -->
    <section id="top" class="sate-hero">
      <div class="sate-hero__bg">
        <div class="sate-hero__photo" aria-hidden="true">
          <div class="sate-hero__photo-inner" />
        </div>
        <div class="sate-hero__overlay" />
        <div class="sate-hero__canvas-wrap">
          <ClientOnly>
            <TmplExperienceCanvas
              preset="cinematic-scroll"
              :accent="accentCss"
              intensity="calm"
              label="Asap sate dari bara arang"
            />
          </ClientOnly>
        </div>
      </div>

      <div class="sate-hero__content">
        <template v-if="isLoaded">
          <div class="sate-hero__badge">
            <span class="sate-hero__dot" :class="isOpen ? 'sate-hero__dot--open' : 'sate-hero__dot--closed'" />
            <span class="sate-hero__badge-text">{{ isOpen ? 'Sedang bakar' : 'Tutup, buka besok 10:00' }}</span>
          </div>
          <h1 :style="h1Style" class="sate-hero__title">
            Sate Madura Pak Karto
          </h1>
          <p class="sate-hero__sub">
            Sate ayam bumbu kacang khas Madura. Dibakar pakai arang batok kelapa. Sejak 1998, dari Bangkalan untuk Jakarta.
          </p>
          <div class="sate-hero__cta-row">
            <a
              :href="buildUrl('Halo, saya mau pesan sate.')"
              target="_blank"
              rel="noopener"
              class="sate-btn sate-btn--primary"
            >
              Pesan via WhatsApp
            </a>
            <a href="#menu" class="sate-btn sate-btn--ghost">Lihat Menu</a>
          </div>
        </template>
      </div>
    </section>

    <!-- ====== MENU ====== -->
    <section id="menu" class="sate-section">
      <div class="sate-container">
        <p class="sate-label">Menu</p>
        <h2 :style="h2Style" class="sate-h2">Mau makan apa?</h2>

        <div class="sate-filter-row">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="sate-filter-pill"
            :class="{ 'sate-filter-pill--active': activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="sate-menu-grid">
          <div
            v-for="item in filteredMenu"
            :key="item.name"
            class="sate-menu-card"
          >
            <div class="sate-menu-card__body">
              <h3 class="sate-menu-card__name">{{ item.name }}</h3>
              <p class="sate-menu-card__desc">{{ item.desc }}</p>
              <div class="sate-menu-card__bottom">
                <span class="sate-menu-card__price">{{ item.price }}</span>
                <div class="sate-menu-card__actions">
                  <button
                    v-if="cartItems[item.name]"
                    type="button"
                    class="sate-cart-btn"
                    @click="removeFromCart(item.name)"
                  >
                    -
                  </button>
                  <span v-if="cartItems[item.name]" class="sate-cart-qty">{{ cartItems[item.name] }}</span>
                  <button
                    type="button"
                    class="sate-cart-btn sate-cart-btn--add"
                    @click="addToCart(item.name)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cartCount > 0" class="sate-cart-bar">
          <div class="sate-cart-bar__info">
            <span class="sate-cart-bar__count">{{ cartCount }} item</span>
            <span class="sate-cart-bar__total">Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
          </div>
          <a
            :href="whatsappOrderUrl"
            target="_blank"
            rel="noopener"
            class="sate-btn sate-btn--primary sate-btn--sm"
          >
            Pesan Sekarang
          </a>
        </div>
      </div>
    </section>

    <!-- ====== TENTANG ====== -->
    <section id="tentang" class="sate-section sate-section--alt">
      <div class="sate-container sate-container--narrow">
        <p class="sate-label">Tentang</p>
        <h2 :style="h2Style" class="sate-h2">Dari gerobak ke 4 cabang.</h2>
        <div class="sate-story">
          <p>
            Pak Karto mulai jualan sate tahun 1998 di Bangkalan. Resep bumbu kacang turun-temurun dari almarhum bapaknya. Sekarang ada 4 cabang dan 1 dapur pusat di Ciputat — semua masih dibakar pakai arang batok kelapa.
          </p>
          <p>
            Bumbu kacang diulek manual setiap pagi. Kecap racikan sendiri. Lontong daun pisang. Kalau habis, ya habis. Besok bakar lagi.
          </p>
        </div>
      </div>
    </section>

    <!-- ====== JAM BUKA ====== -->
    <section class="sate-section">
      <div class="sate-container">
        <p class="sate-label">Jam Buka</p>
        <h2 :style="h2Style" class="sate-h2">Buka setiap hari.</h2>
        <div class="sate-hours-grid">
          <div class="sate-hours-card">
            <span class="sate-hours-card__day">Senin - Jumat</span>
            <span class="sate-hours-card__time">10:00 - 22:00</span>
            <span class="sate-hours-card__note">Dapur pusat mulai bakar jam 09:00</span>
          </div>
          <div class="sate-hours-card">
            <span class="sate-hours-card__day">Sabtu - Minggu</span>
            <span class="sate-hours-card__time">10:00 - 22:00</span>
            <span class="sate-hours-card__note">Kalau habis lebih awal, tutup</span>
          </div>
          <div class="sate-hours-card">
            <span class="sate-hours-card__day">Hari Libur Nasional</span>
            <span class="sate-hours-card__time">10:00 - 21:00</span>
            <span class="sate-hours-card__note">Libur Idul Fitri tutup 3 hari</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== LOKASI ====== -->
    <section id="lokasi" class="sate-section sate-section--alt">
      <div class="sate-container">
        <p class="sate-label">Lokasi</p>
        <h2 :style="h2Style" class="sate-h2">4 cabang di Jakarta.</h2>

        <div class="sate-branch-tabs">
          <button
            v-for="(b, i) in branches"
            :key="b.name"
            type="button"
            class="sate-branch-tab"
            :class="{ 'sate-branch-tab--active': activeBranch === i }"
            @click="activeBranch = i"
          >
            {{ b.name }}
          </button>
        </div>

        <div class="sate-branch-detail">
          <div class="sate-branch-info">
            <h3 class="sate-branch-info__name">{{ branches[activeBranch].name }}</h3>
            <p class="sate-branch-info__addr">{{ branches[activeBranch].address }}</p>
            <p class="sate-branch-info__hours">Buka: {{ branches[activeBranch].hours }}</p>
            <div class="sate-branch-info__actions">
              <a
                :href="`tel:${branches[activeBranch].phone.replace(/-/g, '')}`"
                class="sate-btn sate-btn--outline sate-btn--sm"
              >
                {{ branches[activeBranch].phone }}
              </a>
              <a
                :href="`https://maps.google.com/?q=${encodeURIComponent(branches[activeBranch].address)}`"
                target="_blank"
                rel="noopener"
                class="sate-btn sate-btn--outline sate-btn--sm"
              >
                Buka Maps
              </a>
            </div>
          </div>
          <div class="sate-branch-map">
            <TmplMap
              :label="`Pak Karto ${branches[activeBranch].name}`"
              :address="branches[activeBranch].address"
              city="Jakarta"
              :accent="accentCss"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ====== GALERI ====== -->
    <section id="galeri" class="sate-section">
      <div class="sate-container">
        <p class="sate-label">Galeri</p>
        <h2 :style="h2Style" class="sate-h2">Foto dari dapur dan warung.</h2>

        <div class="sate-gallery">
          <div
            v-for="(photo, i) in galleryPhotos"
            :key="i"
            class="sate-gallery__item"
            :class="photo.aspect"
          >
            <div class="sate-gallery__ph" :aria-label="photo.alt">
              <span class="sate-gallery__ph-text">{{ photo.alt }}</span>
            </div>
          </div>
        </div>

        <p class="sate-gallery-follow">
          Ikuti kami di
          <a href="https://instagram.com/satekartoid" target="_blank" rel="noopener" class="sate-link">@satekartoid</a>
        </p>
      </div>
    </section>

    <!-- ====== PESAN VIA WHATSAPP ====== -->
    <section id="pesan" class="sate-section sate-section--alt">
      <div class="sate-container sate-container--narrow">
        <p class="sate-label">Pesan</p>
        <h2 :style="h2Style" class="sate-h2">Langsung ke dapur.</h2>
        <p class="sate-pesan-sub">Isi form, langsung buka WhatsApp.</p>

        <TmplForm
          :fields="orderFormFields"
          submit-label="Kirim Pesan via WhatsApp"
          whatsapp-phone="6281234567890"
          :whatsapp-message-prefix="'Halo Sate Madura Pak Karto, saya mau pesan:'"
          :accent="accentCss"
        />
      </div>
    </section>

    <!-- ====== FOOTER ====== -->
    <TmplFooter
      brand-name="Sate Madura Pak Karto"
      variant="columns"
      :accent="accentCss"
      :links="[
        { label: 'Menu', href: '#menu' },
        { label: 'Tentang', href: '#tentang' },
        { label: 'Lokasi', href: '#lokasi' },
        { label: 'Galeri', href: '#galeri' },
        { label: 'Pesan', href: '#pesan' },
      ]"
      signature="Sejak 1998. Dari Bangkalan, untuk Jakarta."
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="restaurant"
    />
  </div>
</template>

<style scoped>
.sate-page {
  min-height: 100vh;
  font-family: var(--tmpl-font-body), 'Inter', system-ui, sans-serif;
  background: var(--tmpl-bg);
  color: var(--tmpl-fg);
  -webkit-font-smoothing: antialiased;
}

/* === HERO === */
.sate-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.sate-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.sate-hero__photo {
  position: absolute;
  inset: 0;
}
.sate-hero__photo-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    160deg,
    oklch(25% 0.04 50) 0%,
    oklch(35% 0.06 40) 40%,
    oklch(20% 0.03 55) 100%
  );
}
.sate-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    oklch(96% 0.02 60 / 0.95) 0%,
    oklch(96% 0.02 60 / 0.6) 35%,
    oklch(96% 0.02 60 / 0.15) 65%,
    transparent 100%
  );
  z-index: 1;
}
.sate-hero__canvas-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 2;
  pointer-events: none;
}
.sate-hero__content {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 8rem 1.5rem 4rem;
}
@media (min-width: 768px) {
  .sate-hero__content {
    padding: 10rem 2.5rem 5rem;
  }
}
.sate-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: oklch(96% 0.02 60 / 0.8);
  backdrop-filter: blur(8px);
  margin-bottom: 1.25rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--tmpl-fg);
}
.sate-hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  animation: pulse-dot 1.6s ease-in-out infinite;
}
.sate-hero__dot--open {
  background: #16a34a;
}
.sate-hero__dot--closed {
  background: #dc2626;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.sate-hero__title {
  max-width: 14ch;
  margin-bottom: 1rem;
  color: var(--tmpl-fg);
}
.sate-hero__sub {
  max-width: 44ch;
  margin-bottom: 2rem;
  font-size: var(--tmpl-body-size);
  line-height: 1.6;
  color: var(--tmpl-muted);
}
.sate-hero__cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* === BUTTONS === */
.sate-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 0;
  font-family: inherit;
}
.sate-btn:active {
  transform: scale(0.97);
}
.sate-btn--primary {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
}
.sate-btn--primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.sate-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border: 1px solid var(--tmpl-border);
}
.sate-btn--ghost:hover {
  background: var(--tmpl-surface);
}
.sate-btn--outline {
  background: transparent;
  color: var(--tmpl-accent);
  border: 1px solid var(--tmpl-accent);
}
.sate-btn--outline:hover {
  background: var(--tmpl-accent-soft);
}
.sate-btn--sm {
  height: 40px;
  padding: 0 1rem;
  font-size: 13px;
  border-radius: 8px;
}

/* === SECTIONS === */
.sate-section {
  padding: 5rem 1.5rem;
}
.sate-section--alt {
  background: var(--tmpl-surface);
}
@media (min-width: 768px) {
  .sate-section {
    padding: 6rem 2.5rem;
  }
}
.sate-container {
  max-width: 1320px;
  margin: 0 auto;
}
.sate-container--narrow {
  max-width: 720px;
}
.sate-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin-bottom: 0.75rem;
}
.sate-h2 {
  margin-bottom: 2.5rem;
  color: var(--tmpl-fg);
}

/* === MENU FILTER === */
.sate-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.sate-filter-pill {
  padding: 0.5rem 1.15rem;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.sate-filter-pill:hover {
  border-color: var(--tmpl-accent);
}
.sate-filter-pill--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}

/* === MENU GRID === */
.sate-menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .sate-menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .sate-menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.sate-menu-card {
  background: var(--tmpl-surface-elevated);
  border: 1px solid var(--tmpl-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.sate-menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px oklch(0% 0 0 / 0.08);
}
.sate-menu-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 160px;
}
.sate-menu-card__name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--tmpl-fg);
  margin: 0;
}
.sate-menu-card__desc {
  font-size: 13px;
  line-height: 1.55;
  color: var(--tmpl-muted);
  margin: 0;
  flex: 1;
}
.sate-menu-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--tmpl-border);
}
.sate-menu-card__price {
  font-size: 16px;
  font-weight: 700;
  color: var(--tmpl-accent);
  font-variant-numeric: tabular-nums;
}
.sate-menu-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sate-cart-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-fg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}
.sate-cart-btn:hover {
  background: var(--tmpl-surface);
}
.sate-cart-btn--add {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.sate-cart-btn--add:hover {
  opacity: 0.9;
}
.sate-cart-qty {
  font-size: 14px;
  font-weight: 700;
  min-width: 1.5ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* === CART BAR === */
.sate-cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--tmpl-surface-elevated);
  border-top: 1px solid var(--tmpl-border);
  backdrop-filter: blur(16px);
  box-shadow: 0 -4px 24px oklch(0% 0 0 / 0.08);
}
@media (min-width: 768px) {
  .sate-cart-bar {
    padding: 1rem 2.5rem;
  }
}
.sate-cart-bar__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.sate-cart-bar__count {
  font-size: 12px;
  color: var(--tmpl-muted);
}
.sate-cart-bar__total {
  font-size: 18px;
  font-weight: 700;
  color: var(--tmpl-accent);
  font-variant-numeric: tabular-nums;
}

/* === STORY === */
.sate-story {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.sate-story p {
  font-size: var(--tmpl-body-size);
  line-height: 1.7;
  color: var(--tmpl-fg);
  margin: 0;
}

/* === HOURS === */
.sate-hours-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .sate-hours-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.sate-hours-card {
  background: var(--tmpl-surface-elevated);
  border: 1px solid var(--tmpl-border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.sate-hours-card__day {
  font-size: 13px;
  font-weight: 600;
  color: var(--tmpl-accent);
  letter-spacing: 0.02em;
}
.sate-hours-card__time {
  font-size: 24px;
  font-weight: 700;
  font-family: var(--tmpl-font-mono), monospace;
  letter-spacing: -0.02em;
  color: var(--tmpl-fg);
}
.sate-hours-card__note {
  font-size: 12px;
  color: var(--tmpl-muted);
}

/* === BRANCH === */
.sate-branch-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.sate-branch-tab {
  padding: 0.5rem 1.15rem;
  border-radius: 999px;
  border: 1px solid var(--tmpl-border);
  background: transparent;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.sate-branch-tab:hover {
  border-color: var(--tmpl-accent);
}
.sate-branch-tab--active {
  background: var(--tmpl-accent);
  color: var(--tmpl-accent-fg);
  border-color: var(--tmpl-accent);
}
.sate-branch-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .sate-branch-detail {
    grid-template-columns: 1fr 1.2fr;
  }
}
.sate-branch-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.sate-branch-info__name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--tmpl-fg);
}
.sate-branch-info__addr {
  font-size: 14px;
  color: var(--tmpl-muted);
  margin: 0;
}
.sate-branch-info__hours {
  font-size: 14px;
  color: var(--tmpl-muted);
  margin: 0;
}
.sate-branch-info__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* === GALLERY === */
.sate-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
@media (min-width: 640px) {
  .sate-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}
@media (min-width: 1024px) {
  .sate-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}
.sate-gallery__item {
  overflow: hidden;
  border-radius: 8px;
}
.sate-gallery__ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--tmpl-surface);
  border: 1px solid var(--tmpl-border);
  border-radius: 8px;
}
.sate-gallery__ph-text {
  font-size: 11px;
  text-align: center;
  color: var(--tmpl-muted);
  opacity: 0.7;
}
.sate-gallery-follow {
  text-align: left;
  margin-top: 2rem;
  font-size: 14px;
  color: var(--tmpl-muted);
}
.sate-link {
  color: var(--tmpl-accent);
  font-weight: 600;
  text-decoration: none;
}
.sate-link:hover {
  text-decoration: underline;
}

/* === PESAN === */
.sate-pesan-sub {
  font-size: 14px;
  color: var(--tmpl-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .sate-hero__dot { animation: none; }
}
</style>
