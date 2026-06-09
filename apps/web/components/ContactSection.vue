<script setup lang="ts">
const form = reactive({ name: '', email: '', project: '', message: '' })
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch('/api/contact', { method: 'POST', body: form })
    if (res.success) {
      isSubmitted.value = true
      form.name = ''; form.email = ''; form.project = ''; form.message = ''
    }
  }
  catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMessage.value = err.data?.message || 'Something went wrong.'
  }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <section id="contact" class="py-32 bg-zinc-950 relative">
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-16">
        <div>
          <p class="text-rose-400 text-sm font-mono tracking-widest uppercase mb-4 contact-title">Get in Touch</p>
          <h2 class="text-4xl md:text-5xl font-bold text-zinc-100 mb-6 contact-title">
            Let's build<br /><span class="text-zinc-500">something great.</span>
          </h2>
          <p class="text-zinc-400 mb-12 max-w-md contact-title">
            Landing page, SaaS platform, or mobile app. One team, one stack, fast delivery.
          </p>

          <div class="space-y-6 contact-info">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-zinc-500">Email</p>
                <p class="text-zinc-200">hello@ajoclub.dev</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-zinc-500">Location</p>
                <p class="text-zinc-200">Remote / Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <div v-if="isSubmitted" class="p-8 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
            <svg class="w-12 h-12 text-rose-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-zinc-100 mb-2">Message Sent</h3>
            <p class="text-zinc-400">We'll get back to you within 24 hours.</p>
            <button class="mt-6 px-6 py-2 text-sm text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/10 transition-colors" @click="isSubmitted = false">
              Send another
            </button>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm text-zinc-400 mb-2">Name</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-2">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors" placeholder="you@company.com" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-2">Project Type</label>
              <select v-model="form.project" class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-rose-500 transition-colors">
                <option value="" disabled>Select type</option>
                <option value="landing">Landing Page</option>
                <option value="saas">SaaS Application</option>
                <option value="mobile">Mobile App</option>
                <option value="pwa">PWA</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-2">Message</label>
              <textarea v-model="form.message" rows="4" required class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors resize-none" placeholder="Tell us about your project..." />
            </div>
            <p v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</p>
            <button type="submit" :disabled="isSubmitting" class="w-full px-8 py-4 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
