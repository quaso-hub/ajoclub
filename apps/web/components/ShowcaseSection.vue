<script setup lang="ts">
const categories = [
  { id: 'all', label: 'All' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'creative', label: 'Creative' },
  { id: 'events', label: 'Events' },
  { id: 'saas', label: 'SaaS' },
]

const activeCategory = ref('all')

const templates = [
  {
    id: 1,
    title: 'Company Profile',
    category: 'corporate',
    description: 'Clean, professional presence for established businesses.',
    gradient: 'from-blue-600 to-indigo-700',
    icon: 'i-lucide-building-2',
    tags: ['Corporate', 'Professional'],
  },
  {
    id: 2,
    title: 'Landing Page',
    category: 'creative',
    description: 'High-conversion pages that turn visitors into leads.',
    gradient: 'from-rose-500 to-orange-500',
    icon: 'i-lucide-rocket',
    tags: ['Marketing', 'Conversion'],
  },
  {
    id: 3,
    title: 'Wedding Page',
    category: 'events',
    description: 'Elegant celebration pages with RSVP and photo galleries.',
    gradient: 'from-pink-400 to-rose-500',
    icon: 'i-lucide-heart',
    tags: ['Wedding', 'Celebration'],
  },
  {
    id: 4,
    title: 'SaaS Dashboard',
    category: 'saas',
    description: 'Data-rich interfaces with real-time updates and charts.',
    gradient: 'from-violet-500 to-purple-600',
    icon: 'i-lucide-bar-chart-3',
    tags: ['SaaS', 'Dashboard'],
  },
  {
    id: 5,
    title: 'Restaurant',
    category: 'creative',
    description: 'Appetizing menus, online ordering, and reservation systems.',
    gradient: 'from-amber-500 to-orange-600',
    icon: 'i-lucide-utensils',
    tags: ['Food', 'Hospitality'],
  },
  {
    id: 6,
    title: 'Portfolio',
    category: 'creative',
    description: 'Showcase work with interactive galleries and case studies.',
    gradient: 'from-emerald-500 to-teal-600',
    icon: 'i-lucide-palette',
    tags: ['Creative', 'Portfolio'],
  },
  {
    id: 7,
    title: 'Event / Brochure',
    category: 'events',
    description: 'Information-rich pages for conferences, festivals, and launches.',
    gradient: 'from-cyan-500 to-blue-600',
    icon: 'i-lucide-calendar',
    tags: ['Event', 'Info'],
  },
  {
    id: 8,
    title: 'Hajatan / Celebration',
    category: 'events',
    description: 'Festive pages for graduations, birthdays, and milestones.',
    gradient: 'from-yellow-500 to-amber-600',
    icon: 'i-lucide-party-popper',
    tags: ['Celebration', 'Personal'],
  },
]

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates
  return templates.filter(t => t.category === activeCategory.value)
})
</script>

<template>
  <section id="showcase" class="py-32 bg-(--ui-bg) relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-(--ui-primary)/3 rounded-full blur-[150px]" />

    <UContainer class="relative">
      <div class="mb-16">
        <p class="text-(--ui-primary) text-sm font-mono tracking-widest uppercase mb-4 showcase-title">
          Our Work
        </p>
        <h2 class="text-4xl md:text-5xl font-bold showcase-title">
          Every business is different.<br />
          <span class="text-(--ui-text-muted)">Your website should be too.</span>
        </h2>
        <p class="text-(--ui-text-muted) mt-4 max-w-xl showcase-title">
          Browse what we've built. Each project is tailored to the client's needs, not a template with their logo pasted on.
        </p>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2 mb-12">
        <UButton
          v-for="cat in categories"
          :key="cat.id"
          :variant="activeCategory === cat.id ? 'solid' : 'outline'"
          :color="activeCategory === cat.id ? 'primary' : 'neutral'"
          size="sm"
          @click="activeCategory = cat.id"
        >
          {{ cat.label }}
        </UButton>
      </div>

      <!-- Template Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="group glass-card overflow-hidden hover:scale-[1.03] transition-all duration-300 cursor-pointer showcase-card"
        >
          <div class="h-48 bg-gradient-to-br flex items-center justify-center relative" :class="template.gradient">
            <div class="absolute inset-0 bg-black/10" />
            <UIcon :name="template.icon" class="relative w-16 h-16 text-white/80" />
          </div>
          <div class="p-5">
            <h3 class="font-semibold mb-2">{{ template.title }}</h3>
            <p class="text-(--ui-text-muted) text-sm mb-4 leading-relaxed">{{ template.description }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="tag in template.tags" :key="tag" variant="soft" color="primary" size="sm">
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-16">
        <p class="text-(--ui-text-muted) mb-6">Don't see what you need? We build custom solutions too.</p>
        <UButton size="xl" @click="document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })">
          Let's talk about your project
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
