<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  project: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    })

    if (response.success) {
      isSubmitted.value = true
      form.name = ''
      form.email = ''
      form.project = ''
      form.message = ''
    }
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    errorMessage.value = err.data?.message || 'Something went wrong. Please try again.'
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="contact" class="py-32 bg-[var(--background)] relative">
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-16">
        <div>
          <p class="text-[var(--primary)] text-sm font-mono tracking-widest uppercase mb-4 contact-title">
            Get in Touch
          </p>
          <h2 class="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 contact-title">
            Let's build
            <br />
            <span class="text-[var(--muted-foreground)]">something great.</span>
          </h2>
          <p class="text-[var(--muted-foreground)] mb-12 max-w-md contact-title">
            Whether you need a landing page, a full SaaS platform, or a mobile app, we can help. One team, one stack, fast delivery.
          </p>

          <div class="space-y-6 contact-info">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-[var(--radius)] bg-[var(--primary)]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-[var(--muted-foreground)]">Email</p>
                <p class="text-[var(--foreground)]">hello@ajoclub.dev</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-[var(--radius)] bg-[var(--primary)]/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-[var(--muted-foreground)]">Location</p>
                <p class="text-[var(--foreground)]">Remote / Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <div
            v-if="isSubmitted"
            class="p-8 rounded-[var(--radius)] border border-[var(--primary)]/20 bg-[var(--primary)]/5 text-center"
          >
            <svg class="w-12 h-12 text-[var(--primary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-[var(--foreground)] mb-2">Message Sent</h3>
            <p class="text-[var(--muted-foreground)]">We'll get back to you within 24 hours.</p>
            <button
              class="mt-6 px-6 py-2 text-sm text-[var(--primary)] border border-[var(--primary)]/30 rounded-[var(--radius)] hover:bg-[var(--primary)]/10 transition-colors"
              @click="isSubmitted = false"
            >
              Send another message
            </button>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm text-[var(--muted-foreground)] mb-2">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label class="block text-sm text-[var(--muted-foreground)] mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label class="block text-sm text-[var(--muted-foreground)] mb-2">Project Type</label>
              <select
                v-model="form.project"
                class="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none"
              >
                <option value="" disabled>Select a project type</option>
                <option value="landing">Landing Page</option>
                <option value="saas">SaaS Application</option>
                <option value="mobile">Mobile App</option>
                <option value="pwa">PWA</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-[var(--muted-foreground)] mb-2">Message</label>
              <textarea
                v-model="form.message"
                rows="4"
                required
                class="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <p v-if="errorMessage" class="text-[var(--destructive)] text-sm">
              {{ errorMessage }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-8 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
