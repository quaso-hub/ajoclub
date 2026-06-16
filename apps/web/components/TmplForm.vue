<script setup lang="ts">
/**
 * TmplForm.vue
 *
 * Validated form. Zod schema, real-time validation, success state.
 * Submit -> opens WhatsApp or emits event.
 *
 * Used by: RSVP, contact, registration, reservation.
 */
import { z } from 'zod'

const props = withDefaults(defineProps<{
  fields: Array<{
    key: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'number'
    placeholder?: string
    required?: boolean
    options?: string[]
  }>
  /** Submit button label */
  submitLabel?: string
  /** WhatsApp number */
  whatsappPhone?: string
  /** Message prefix (concatenated with field values) */
  whatsappMessagePrefix?: string
  /** Accent color */
  accent?: string
  /** When provided, success emits to WhatsApp with this message */
  successMessage?: string
}>(), {
  submitLabel: 'Kirim',
  whatsappPhone: '6285188627365',
  whatsappMessagePrefix: 'Halo, saya ingin menghubungi Anda:',
  accent: '#0A0A0A',
})

const emit = defineEmits<{
  (e: 'submit', values: Record<string, string>): void
  (e: 'success'): void
}>()

const values = reactive<Record<string, string>>({})
const errors = reactive<Record<string, string>>({})
const submitted = ref(false)
const submitting = ref(false)

for (const f of props.fields) values[f.key] = ''

function validateField(key: string, value: string, field: typeof props.fields[number]): string | null {
  if (field.required && !value.trim()) return 'Wajib diisi.'
  if (field.type === 'email' && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format email tidak valid.'
  }
  if (field.type === 'tel' && value) {
    if (!/^[\d+\-\s()]{6,}$/.test(value)) return 'Nomor telepon tidak valid.'
  }
  if (field.type === 'date' && value) {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'Tanggal tidak valid.'
  }
  return null
}

function validateAll(): boolean {
  let ok = true
  for (const f of props.fields) {
    const err = validateField(f.key, values[f.key], f)
    if (err) {
      errors[f.key] = err
      ok = false
    }
    else {
      delete errors[f.key]
    }
  }
  return ok
}

function onBlur(key: string, field: typeof props.fields[number]) {
  if (!submitted.value) return
  const err = validateField(key, values[key], field)
  if (err) errors[key] = err
  else delete errors[key]
}

function onSubmit(e: Event) {
  e.preventDefault()
  submitted.value = true
  if (!validateAll()) {
    // Scroll to first error
    setTimeout(() => {
      const el = document.querySelector('[data-tmpl-form-error="true"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    return
  }
  submitting.value = true
  emit('submit', { ...values })

  // Build WhatsApp message
  const lines = [props.whatsappMessagePrefix, '']
  for (const f of props.fields) {
    if (values[f.key]) {
      lines.push(`${f.label}: ${values[f.key]}`)
    }
  }
  const msg = lines.join('\n')
  const url = `https://wa.me/${props.whatsappPhone}?text=${encodeURIComponent(msg)}`
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
    submitting.value = false
    submitted.value = false
    emit('success')
  }, 600)
}

function reset() {
  for (const f of props.fields) values[f.key] = ''
  for (const k of Object.keys(errors)) delete errors[k]
  submitted.value = false
}
</script>

<template>
  <form class="tmpl-form" novalidate @submit="onSubmit">
    <div
      v-for="field in fields"
      :key="field.key"
      class="tmpl-form__field"
      :data-tmpl-form-error="!!errors[field.key] ? 'true' : 'false'"
    >
      <label :for="`tf-${field.key}`" class="tmpl-form__label">
        {{ field.label }}
        <span v-if="field.required" class="tmpl-form__req" aria-hidden="true">*</span>
      </label>

      <textarea
        v-if="field.type === 'textarea'"
        :id="`tf-${field.key}`"
        v-model="values[field.key]"
        rows="3"
        :placeholder="field.placeholder"
        :aria-invalid="!!errors[field.key]"
        class="tmpl-form__input tmpl-form__input--textarea micro-focus"
        @blur="onBlur(field.key, field)"
      />

      <select
        v-else-if="field.type === 'select'"
        :id="`tf-${field.key}`"
        v-model="values[field.key]"
        :aria-invalid="!!errors[field.key]"
        class="tmpl-form__input tmpl-form__input--select micro-focus"
        @blur="onBlur(field.key, field)"
      >
        <option value="">{{ field.placeholder || 'Pilih salah satu' }}</option>
        <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>

      <input
        v-else
        :id="`tf-${field.key}`"
        v-model="values[field.key]"
        :type="field.type || 'text'"
        :placeholder="field.placeholder"
        :aria-invalid="!!errors[field.key]"
        :inputmode="field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'"
        class="tmpl-form__input micro-focus"
        @blur="onBlur(field.key, field)"
      >

      <Transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-150"
        enter-from-class="opacity-0 -translate-y-1"
        leave-to-class="opacity-0"
      >
        <p v-if="errors[field.key]" class="tmpl-form__error">
          {{ errors[field.key] }}
        </p>
      </Transition>
    </div>

    <div class="tmpl-form__actions">
      <button
        type="submit"
        :disabled="submitting"
        class="tmpl-form__submit micro-press micro-glow micro-shine"
        :style="{ background: accent }"
        data-micro="ripple"
      >
        <span v-if="submitting">Mengirim…</span>
        <span v-else>{{ submitLabel }}</span>
      </button>
      <button
        type="button"
        class="tmpl-form__reset micro-press micro-focus"
        data-micro="ripple"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <p class="tmpl-form__note">
      Tekan kirim, kami buka WhatsApp dengan pesan terisi otomatis. Tidak ada data yang disimpan.
    </p>
  </form>
</template>

<style scoped>
.tmpl-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tmpl-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.tmpl-form__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  opacity: 0.7;
}
.tmpl-form__req {
  color: #ef4444;
  margin-left: 0.15rem;
}
.tmpl-form__input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 10px;
  color: inherit;
  font: inherit;
  font-size: 14px;
  transition: border-color 200ms ease, background-color 200ms ease;
}
.tmpl-form__input:focus {
  outline: 0;
  border-color: var(--accent, currentColor);
  background: color-mix(in srgb, currentColor 3%, transparent);
}
.tmpl-form__input--textarea {
  resize: vertical;
  min-height: 80px;
}
.tmpl-form__input[aria-invalid="true"] {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 5%, transparent);
}
.tmpl-form__error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
}
.tmpl-form__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.tmpl-form__submit {
  flex: 1;
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
.tmpl-form__submit:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}
.tmpl-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tmpl-form__reset {
  height: 48px;
  padding: 0 1rem;
  background: transparent;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 12px;
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 200ms ease;
}
.tmpl-form__reset:hover {
  background: color-mix(in srgb, currentColor 5%, transparent);
}
.tmpl-form__note {
  font-size: 11px;
  opacity: 0.5;
  text-align: center;
  margin: 0.5rem 0 0;
}
</style>
