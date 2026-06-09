<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
  email: v.pipe(v.string(), v.email('Invalid email')),
  project: v.optional(v.string()),
  message: v.pipe(v.string(), v.minLength(1, 'Message is required')),
})
type Schema = v.InferOutput<typeof schema>

const state = reactive({ name: '', email: '', project: '', message: '' })
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  try {
    const res = await $fetch('/api/contact', { method: 'POST', body: event.data })
    if (res.success) {
      isSubmitted.value = true
      state.name = ''; state.email = ''; state.project = ''; state.message = ''
      toast.add({ title: 'Message sent!', color: 'success' })
    }
  }
  catch {
    toast.add({ title: 'Something went wrong. Please try again.', color: 'error' })
  }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <section id="contact" class="py-32 bg-(--ui-bg) relative">
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-(--ui-border) to-transparent" />

    <UContainer>
      <div class="grid md:grid-cols-2 gap-16">
        <div>
          <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 contact-title">Get in Touch</p>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 contact-title">
            Let's build<br /><span class="text-(--ui-text-muted)">something great.</span>
          </h2>
          <p class="text-(--ui-text-muted) mb-12 max-w-md contact-title">
            Landing page, SaaS platform, or mobile app. One team, one stack, fast delivery.
          </p>

          <div class="space-y-6 contact-info">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
                <UIcon name="i-lucide-mail" class="w-5 h-5 text-(--ui-primary)" />
              </div>
              <div>
                <p class="text-sm text-(--ui-text-muted)">Email</p>
                <p>hello@ajoclub.dev</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
                <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-(--ui-primary)" />
              </div>
              <div>
                <p class="text-sm text-(--ui-text-muted)">Location</p>
                <p>Remote / Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <UCard v-if="isSubmitted" :ui="{ body: 'p-8 text-center' }">
            <UIcon name="i-lucide-check-circle" class="w-12 h-12 text-(--ui-primary) mx-auto mb-4" />
            <h3 class="text-xl font-semibold mb-2">Message Sent</h3>
            <p class="text-(--ui-text-muted)">We'll get back to you within 24 hours.</p>
            <UButton variant="outline" class="mt-6" @click="isSubmitted = false">Send another</UButton>
          </UCard>

          <UForm v-else :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormField label="Name" name="name" required>
              <UInput v-model="state.name" placeholder="Your name" />
            </UFormField>
            <UFormField label="Email" name="email" required>
              <UInput v-model="state.email" type="email" placeholder="you@company.com" />
            </UFormField>
            <UFormField label="Project Type" name="project">
              <USelect
                v-model="state.project"
                :items="[
                  { label: 'Landing Page', value: 'landing' },
                  { label: 'SaaS Application', value: 'saas' },
                  { label: 'Mobile App', value: 'mobile' },
                  { label: 'PWA', value: 'pwa' },
                  { label: 'Other', value: 'other' },
                ]"
                placeholder="Select type"
              />
            </UFormField>
            <UFormField label="Message" name="message" required>
              <UTextarea v-model="state.message" :rows="4" placeholder="Tell us about your project..." />
            </UFormField>
            <UButton type="submit" block :loading="isSubmitting" size="xl">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </UButton>
          </UForm>
        </div>
      </div>
    </UContainer>
  </section>
</template>
