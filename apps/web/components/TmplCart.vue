<script setup lang="ts">
/**
 * TmplCart.vue
 *
 * Drawer-style cart for e-commerce. Slide-in from right.
 * - Quantity +/- with debounce
 * - Remove item
 * - Subtotal, shipping, total
 * - "Proceed to WhatsApp" -> opens WA with order details
 * - Persists to localStorage
 * - "Empty state" if no items
 */
export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  variant?: string
  image?: string
}

const props = withDefaults(defineProps<{
  open: boolean
  items: CartItem[]
  storageKey?: string
  currency?: string
  shippingFlat?: number
  whatsappPhone?: string
  whatsappMessagePrefix?: string
  accent?: string
}>(), {
  storageKey: 'tmpl-cart',
  currency: 'Rp ',
  shippingFlat: 0,
  whatsappPhone: '6285188627365',
  whatsappMessagePrefix: 'Halo, saya mau pesan:',
  accent: '#0A0A0A',
})

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'update:items', v: CartItem[]): void
  (e: 'checkout', message: string): void
}>()

const localItems = ref<CartItem[]>([])

watch(() => props.items, (v) => {
  localItems.value = [...v]
}, { immediate: true, deep: true })

const subtotal = computed(() => {
  return localItems.value.reduce((sum, it) => sum + it.price * it.qty, 0)
})
const total = computed(() => subtotal.value + (props.shippingFlat || 0))

function setQty(id: string, qty: number) {
  if (qty < 1) return removeItem(id)
  const next = localItems.value.map((it) => (it.id === id ? { ...it, qty } : it))
  localItems.value = next
  emit('update:items', next)
  persist(next)
}
function removeItem(id: string) {
  const next = localItems.value.filter((it) => it.id !== id)
  localItems.value = next
  emit('update:items', next)
  persist(next)
}
function clear() {
  localItems.value = []
  emit('update:items', [])
  persist([])
}
function close() {
  emit('update:open', false)
}

function persist(items: CartItem[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(items))
  }
  catch { /* ignore quota */ }
}

function buildOrderMessage() {
  const lines = [props.whatsappMessagePrefix, '']
  for (const it of localItems.value) {
    const variant = it.variant ? ` (${it.variant})` : ''
    lines.push(`- ${it.name}${variant} x${it.qty} — ${props.currency}${(it.price * it.qty).toLocaleString('id-ID')}`)
  }
  lines.push('', `Subtotal: ${props.currency}${subtotal.value.toLocaleString('id-ID')}`)
  if (props.shippingFlat) {
    lines.push(`Ongkir: ${props.currency}${props.shippingFlat.toLocaleString('id-ID')}`)
  }
  lines.push(`Total: ${props.currency}${total.value.toLocaleString('id-ID')}`)
  lines.push('', 'Mohon konfirmasi ketersediaan dan ongkir ke alamat saya. Terima kasih!')
  return lines.join('\n')
}

function checkout() {
  const msg = buildOrderMessage()
  emit('checkout', msg)
  const url = `https://wa.me/${props.whatsappPhone}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function formatRp(n: number) {
  return n.toLocaleString('id-ID')
}

// Escape key closes
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="tmpl-cart-backdrop"
        @click="close"
      />
    </Transition>
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="open"
        class="tmpl-cart"
        role="dialog"
        aria-label="Keranjang"
      >
        <header class="tmpl-cart__head">
          <h3 class="tmpl-cart__title">Keranjang</h3>
          <button
            type="button"
            class="tmpl-cart__close"
            aria-label="Tutup keranjang"
            @click="close"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </header>

        <div v-if="localItems.length === 0" class="tmpl-cart__empty">
          <UIcon name="i-lucide-shopping-bag" class="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p class="text-sm">Keranjang kosong.</p>
          <p class="text-xs opacity-60 mt-1">Pilih produk dulu, baru lanjut ke sini.</p>
        </div>

        <ul v-else class="tmpl-cart__items">
          <li v-for="it in localItems" :key="it.id" class="tmpl-cart__item">
            <div class="tmpl-cart__item-img" :style="{ background: it.image ? `url(${it.image}) center/cover` : undefined }" />
            <div class="tmpl-cart__item-body">
              <p class="tmpl-cart__item-name">{{ it.name }}</p>
              <p v-if="it.variant" class="tmpl-cart__item-variant">{{ it.variant }}</p>
              <p class="tmpl-cart__item-price">{{ currency }}{{ formatRp(it.price * it.qty) }}</p>
              <div class="tmpl-cart__item-qty">
                <button type="button" class="tmpl-cart__qty-btn" aria-label="Kurangi" @click="setQty(it.id, it.qty - 1)">
                  <UIcon name="i-lucide-minus" class="w-3 h-3" />
                </button>
                <span class="tmpl-cart__qty-val">{{ it.qty }}</span>
                <button type="button" class="tmpl-cart__qty-btn" aria-label="Tambah" @click="setQty(it.id, it.qty + 1)">
                  <UIcon name="i-lucide-plus" class="w-3 h-3" />
                </button>
                <button type="button" class="tmpl-cart__item-remove" aria-label="Hapus" @click="removeItem(it.id)">
                  Hapus
                </button>
              </div>
            </div>
          </li>
        </ul>

        <footer v-if="localItems.length > 0" class="tmpl-cart__foot">
          <div class="tmpl-cart__row">
            <span>Subtotal</span>
            <span class="tmpl-cart__row-val">{{ currency }}{{ formatRp(subtotal) }}</span>
          </div>
          <div v-if="shippingFlat" class="tmpl-cart__row">
            <span>Ongkir</span>
            <span class="tmpl-cart__row-val">{{ currency }}{{ formatRp(shippingFlat) }}</span>
          </div>
          <div class="tmpl-cart__row tmpl-cart__row--total">
            <span>Total</span>
            <span class="tmpl-cart__row-val">{{ currency }}{{ formatRp(total) }}</span>
          </div>
          <button
            type="button"
            class="tmpl-cart__checkout"
            :style="{ background: accent }"
            @click="checkout"
          >
            Lanjut ke WhatsApp
          </button>
          <button
            type="button"
            class="tmpl-cart__clear"
            @click="clear"
          >
            Kosongkan keranjang
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tmpl-cart-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.tmpl-cart {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 95;
  width: min(420px, 100vw);
  display: flex;
  flex-direction: column;
  background: var(--tmpl-bg, white);
  color: var(--tmpl-fg, currentColor);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
}
.tmpl-cart__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.tmpl-cart__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.tmpl-cart__close {
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
.tmpl-cart__close:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}
.tmpl-cart__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
}
.tmpl-cart__items {
  list-style: none;
  margin: 0;
  padding: 0.5rem 1.5rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tmpl-cart__item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid color-mix(in srgb, currentColor 6%, transparent);
}
.tmpl-cart__item-img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  flex-shrink: 0;
}
.tmpl-cart__item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tmpl-cart__item-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}
.tmpl-cart__item-variant {
  font-size: 11px;
  opacity: 0.6;
}
.tmpl-cart__item-price {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.tmpl-cart__item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.tmpl-cart__qty-btn {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, currentColor 6%, transparent);
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 6px;
  color: inherit;
  cursor: pointer;
}
.tmpl-cart__qty-val {
  min-width: 1.5rem;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tmpl-cart__item-remove {
  margin-left: auto;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 2px;
  opacity: 0.5;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
}
.tmpl-cart__item-remove:hover {
  opacity: 1;
}
.tmpl-cart__foot {
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tmpl-cart__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
.tmpl-cart__row--total {
  font-size: 16px;
  font-weight: 700;
  opacity: 1;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}
.tmpl-cart__row-val {
  font-weight: 600;
}
.tmpl-cart__row--total .tmpl-cart__row-val {
  font-weight: 700;
}
.tmpl-cart__checkout {
  margin-top: 0.75rem;
  height: 48px;
  border: 0;
  border-radius: 12px;
  color: white;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 200ms ease, transform 200ms ease;
}
.tmpl-cart__checkout:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}
.tmpl-cart__clear {
  align-self: center;
  font-size: 11px;
  background: transparent;
  border: 0;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  font: inherit;
}
.tmpl-cart__clear:hover {
  opacity: 1;
}
</style>
