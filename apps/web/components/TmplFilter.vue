<script setup lang="ts">
/**
 * TmplFilter.vue
 *
 * Faceted filter for portfolio / e-commerce / marketplace.
 * Multi-select chips, range slider, sort.
 * Two-way bindable via v-model:filtered.
 */
export interface FilterGroup {
  key: string
  label: string
  options: string[]
}
export interface FilterState {
  groups: Record<string, string[]>
  priceMin?: number
  priceMax?: number
  sort: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

const props = withDefaults(defineProps<{
  groups: FilterGroup[]
  showPriceRange?: boolean
  showSort?: boolean
  priceMin?: number
  priceMax?: number
  priceStep?: number
  /** Currency prefix (e.g. 'Rp ') */
  currency?: string
  modelValue: FilterState
  accent?: string
}>(), {
  showPriceRange: false,
  showSort: true,
  priceMin: 0,
  priceMax: 1000000,
  priceStep: 10000,
  currency: 'Rp ',
  accent: '#0A0A0A',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterState): void
  (e: 'reset'): void
}>()

const isOpen = ref(false)

function toggleOption(groupKey: string, option: string) {
  const current = [...(props.modelValue.groups[groupKey] || [])]
  const idx = current.indexOf(option)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(option)
  const next: FilterState = {
    ...props.modelValue,
    groups: { ...props.modelValue.groups, [groupKey]: current },
  }
  emit('update:modelValue', next)
}

function setPrice(min: number, max: number) {
  emit('update:modelValue', { ...props.modelValue, priceMin: min, priceMax: max })
}

function setSort(sort: FilterState['sort']) {
  emit('update:modelValue', { ...props.modelValue, sort })
}

function reset() {
  emit('update:modelValue', {
    groups: {},
    priceMin: props.priceMin,
    priceMax: props.priceMax,
    sort: 'newest',
  })
  emit('reset')
}

function fmtPrice(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}jt`
  if (n >= 1000) return `${Math.round(n / 1000)}rb`
  return n.toString()
}
</script>

<template>
  <div class="tmpl-filter" :style="{ '--accent': accent }">
    <div class="tmpl-filter__bar">
      <button
        type="button"
        class="tmpl-filter__toggle"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4" />
        <span>Filter</span>
        <span class="tmpl-filter__count">
          {{ Object.values(modelValue.groups).flat().length + (showPriceRange && (modelValue.priceMin !== priceMin || modelValue.priceMax !== priceMax) ? 1 : 0) }}
        </span>
        <UIcon :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="w-4 h-4" />
      </button>

      <select
        v-if="showSort"
        :value="modelValue.sort"
        class="tmpl-filter__sort"
        @change="setSort(($event.target as HTMLSelectElement).value as FilterState['sort'])"
      >
        <option value="newest">Terbaru</option>
        <option value="popular">Paling populer</option>
        <option value="price-asc">Harga terendah</option>
        <option value="price-desc">Harga tertinggi</option>
      </select>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isOpen" class="tmpl-filter__panel">
        <section
          v-for="group in groups"
          :key="group.key"
          class="tmpl-filter__group"
        >
          <h4 class="tmpl-filter__group-title">{{ group.label }}</h4>
          <div class="tmpl-filter__chips">
            <button
              v-for="option in group.options"
              :key="option"
              type="button"
              class="tmpl-filter__chip"
              :class="{ 'tmpl-filter__chip--active': (modelValue.groups[group.key] || []).includes(option) }"
              @click="toggleOption(group.key, option)"
            >
              {{ option }}
            </button>
          </div>
        </section>

        <section v-if="showPriceRange" class="tmpl-filter__group">
          <h4 class="tmpl-filter__group-title">Harga</h4>
          <div class="tmpl-filter__range">
            <label class="tmpl-filter__range-label">
              <span>Min</span>
              <span class="tmpl-filter__range-val">{{ currency }}{{ fmtPrice(modelValue.priceMin ?? priceMin) }}</span>
            </label>
            <input
              type="range"
              :min="priceMin"
              :max="priceMax"
              :step="priceStep"
              :value="modelValue.priceMin ?? priceMin"
              class="tmpl-filter__range-input"
              @input="setPrice(Number(($event.target as HTMLInputElement).value), modelValue.priceMax ?? priceMax)"
            />
            <label class="tmpl-filter__range-label">
              <span>Max</span>
              <span class="tmpl-filter__range-val">{{ currency }}{{ fmtPrice(modelValue.priceMax ?? priceMax) }}</span>
            </label>
            <input
              type="range"
              :min="priceMin"
              :max="priceMax"
              :step="priceStep"
              :value="modelValue.priceMax ?? priceMax"
              class="tmpl-filter__range-input"
              @input="setPrice(modelValue.priceMin ?? priceMin, Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </section>

        <button
          type="button"
          class="tmpl-filter__reset"
          @click="reset"
        >
          Reset filter
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tmpl-filter {
  width: 100%;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 2%, transparent);
  overflow: hidden;
}
.tmpl-filter__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1rem;
}
.tmpl-filter__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
  font-size: 14px;
  font-weight: 600;
}
.tmpl-filter__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 0.4rem;
  background: var(--accent, currentColor);
  color: var(--tmpl-bg, white);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.tmpl-filter__sort {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 8px;
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.tmpl-filter__panel {
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  padding: 1.25rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.tmpl-filter__group-title {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.5;
  margin-bottom: 0.5rem;
}
.tmpl-filter__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tmpl-filter__chip {
  padding: 0.4rem 0.85rem;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 999px;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.tmpl-filter__chip:hover {
  border-color: color-mix(in srgb, currentColor 35%, transparent);
}
.tmpl-filter__chip--active {
  background: var(--accent, currentColor);
  color: var(--tmpl-bg, white);
  border-color: var(--accent, currentColor);
}
.tmpl-filter__range {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tmpl-filter__range-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}
.tmpl-filter__range-val {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  opacity: 1;
}
.tmpl-filter__range-input {
  width: 100%;
  accent-color: var(--accent, currentColor);
}
.tmpl-filter__reset {
  align-self: flex-start;
  padding: 0.5rem 0.875rem;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 8px;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms ease;
}
.tmpl-filter__reset:hover {
  background: color-mix(in srgb, currentColor 5%, transparent);
}
</style>
