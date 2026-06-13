<script setup lang="ts">
/**
 * membership-2.vue — Sinau Koding
 * Indonesian developer community platform. Dark night bg, coral accent.
 * Geist + Geist Mono. 120-node 3D constellation (case-timeline, balanced).
 *
 * 8 sections: Hero+3D, Spaces, Events, Diskusi, Tier, Tim, FAQ, Footer
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('membership-2')
const { tpl, styles, h1Style, h2Style, monoStyle, palette } = theme

const toCssSafe = (t: { l: number, c: number, h: number }, alpha = 1) => {
  if (alpha < 1) return `oklch(${t.l}% ${t.c} ${t.h} / ${alpha})`
  return `oklch(${t.l}% ${t.c} ${t.h})`
}

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeSpaceFilter = ref('Semua')
const faqOpen = ref<number | null>(null)
const memberCount = ref(0)
const onlineCount = ref(0)
const isReducedMotion = ref(false)

// ============================================================
// DATA
// ============================================================
const spaces = [
  { name: 'Frontend', icon: '⚡', desc: 'React, Vue, Next.js. UI dan performa.', members: 1840, color: '#38bdf8' },
  { name: 'Backend', icon: '🔧', desc: 'Node, Go, Rust. API dan database.', members: 1520, color: '#a78bfa' },
  { name: 'Mobile', icon: '📱', desc: 'Flutter, React Native. Cross-platform.', members: 980, color: '#34d399' },
  { name: 'DevOps', icon: '☁️', desc: 'Docker, K8s, CI/CD. Local ke production.', members: 720, color: '#fb923c' },
  { name: 'AI/ML', icon: '🤖', desc: 'LLM, vision, pipeline. Eksperimen ke deploy.', members: 1100, color: '#f472b6' },
  { name: 'Desain', icon: '🎨', desc: 'UI/UX, Figma. Produk yang enak dipakai.', members: 640, color: '#fbbf24' },
]

const events = [
  { date: 'SAB, 21 JUN', time: '09:00 WIB', title: 'Workshop: Deploy Next.js ke Vercel', speaker: 'Hasan Fadilah', rsvp: 124 },
  { date: 'SEL, 24 JUN', time: '19:30 WIB', title: 'Code Review Night #47', speaker: 'Komunitas', rsvp: 89 },
  { date: 'KAM, 26 JUN', time: '20:00 WIB', title: 'Sharing: Dari Freelance ke Full-time', speaker: 'Rina Maharani', rsvp: 156 },
  { date: 'SAB, 28 JUN', time: '10:00 WIB', title: 'Hackathon: Build API dalam 4 Jam', speaker: 'Budi Santoso', rsvp: 203 },
]

const threads = [
  { author: 'Hasan Fadilah', avatar: 'H', time: '12 menit lalu', title: 'State management terbaik untuk Nuxt 3 di 2026?', replies: 23, reactions: 45, space: 'Frontend' },
  { author: 'Rina Maharani', avatar: 'R', time: '1 jam lalu', title: 'Pengalaman migrasi dari REST ke tRPC di production', replies: 18, reactions: 32, space: 'Backend' },
  { author: 'Budi Santoso', avatar: 'B', time: '2 jam lalu', title: 'Tips hemat cost AWS untuk side project', replies: 31, reactions: 67, space: 'DevOps' },
  { author: 'Sinta Dewi', avatar: 'S', time: '3 jam lalu', title: 'Fine-tuning Llama 3 di dataset lokal bahasa Indonesia', replies: 14, reactions: 28, space: 'AI/ML' },
  { author: 'Adi Prasetyo', avatar: 'A', time: '5 jam lalu', title: 'Flutter vs React Native: benchmark update Juni 2026', replies: 42, reactions: 89, space: 'Mobile' },
]

const tiers = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: '',
    desc: 'Coba tanpa biaya.',
    features: ['3 space', 'Baca thread', 'Event publik', 'Profil anggota'],
    cta: 'Gabung Gratis',
    popular: false,
  },
  {
    name: 'Komunitas',
    price: 'Rp 49rb',
    period: '/bulan',
    desc: 'Akses penuh.',
    features: ['Semua space', 'Post & reply', 'Event eksklusif', 'Badge anggota', 'Direct message'],
    cta: 'Mulai Komunitas',
    popular: true,
  },
  {
    name: 'Studio',
    price: 'Rp 149rb',
    period: '/bulan',
    desc: 'Untuk yang serius.',
    features: ['Mentoring 1-on-1', '#pro channel', 'Portfolio review', 'Job referral', 'Custom badge'],
    cta: 'Mulai Studio',
    popular: false,
  },
]

const team = [
  { name: 'Hasan Fadilah', role: 'Founder & Lead', avatar: 'H', bio: 'Full-stack. 8 tahun. Gojek, Tokopedia.' },
  { name: 'Rina Maharani', role: 'Community Manager', avatar: 'R', bio: 'Komunitas sejak 2021. Engagement & mentoring.' },
  { name: 'Budi Santoso', role: 'DevOps Lead', avatar: 'B', bio: 'Infrastructure. AWS certified. Docker & K8s.' },
  { name: 'Sinta Dewi', role: 'AI/ML Lead', avatar: 'S', bio: 'Data scientist. NLP bahasa Indonesia. ITB.' },
]

const faqs = [
  { q: 'Apakah Sinau Koding gratis?', a: 'Ya. 3 space, baca thread, event publik — tanpa biaya.' },
  { q: 'Bedanya Komunitas dan Studio?', a: 'Komunitas buka semua 6 space + post. Studio tambah mentoring 1-on-1, portfolio review, job referral.' },
  { q: 'Saya pemula, cocok nggak?', a: 'Cocok. Ada thread khusus pertanyaan dasar. Tidak ada pertanyaan bodoh.' },
  { q: 'Event diadakan di mana?', a: 'Online via Zoom/Discord. Beberapa offline di Jakarta, Bandung, Surabaya.' },
  { q: 'Bisa cancel kapan saja?', a: 'Bisa. Tidak ada kontrak. Akses sampai akhir periode.' },
]

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setTimeout(() => { heroLoaded.value = true }, 400)

  // Animated counters
  const memberTarget = 4820
  const onlineTarget = 1210
  const duration = 1600
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = ease(progress)
    memberCount.value = Math.round(eased * memberTarget)
    onlineCount.value = Math.round(eased * onlineTarget)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <div class="min-h-screen antialiased" :style="styles">
    <!-- ============================================================ -->
    <!-- NAV -->
    <!-- ============================================================ -->
    <nav
      class="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b"
      :style="{
        background: toCssSafe(palette.bg, 0.85),
        borderColor: toCssSafe(palette.border, 0.3),
      }"
    >
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span
            class="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold"
            :style="{ background: toCssSafe(palette.accent), color: toCssSafe(palette.accentFg) }"
          >SK</span>
          <span class="text-sm font-bold" :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }">Sinau Koding</span>
        </div>
        <div class="hidden md:flex items-center gap-7 text-[13px]" :style="{ color: toCssSafe(palette.muted) }">
          <a href="#spaces" class="hover:opacity-100 opacity-70 transition-opacity">Spaces</a>
          <a href="#events" class="hover:opacity-100 opacity-70 transition-opacity">Event</a>
          <a href="#diskusi" class="hover:opacity-100 opacity-70 transition-opacity">Diskusi</a>
          <a href="#tier" class="hover:opacity-100 opacity-70 transition-opacity">Harga</a>
        </div>
        <a
          href="#tier"
          class="text-[12px] px-4 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-90"
          :style="{ background: toCssSafe(palette.accent), color: toCssSafe(palette.accentFg) }"
        >Gabung</a>
      </div>
    </nav>

    <!-- ============================================================ -->
    <!-- 1. HERO + 3D CONSTELLATION -->
    <!-- ============================================================ -->
    <section class="relative pt-24 pb-24 overflow-hidden">
      <!-- 3D Canvas Background -->
      <div class="absolute inset-0 z-0 opacity-60">
        <TmplExperienceCanvas
          preset="case-timeline"
          :accent="toCssSafe(palette.accent)"
          intensity="balanced"
          label="Konstelasi anggota Sinau Koding"
        />
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <template v-if="!heroLoaded">
          <div class="h-6 w-48 rounded-full mb-8 mx-auto animate-pulse" :style="{ background: toCssSafe(palette.accentSoft) }" />
          <div class="h-14 w-full rounded mb-4 animate-pulse" :style="{ background: toCssSafe(palette.surface) }" />
          <div class="h-14 w-3/4 rounded mb-6 mx-auto animate-pulse" :style="{ background: toCssSafe(palette.surface) }" />
          <div class="h-5 w-full rounded mb-8 mx-auto animate-pulse" :style="{ background: toCssSafe(palette.surface) }" />
        </template>

        <template v-else>
          <!-- Status badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 text-[12px]"
            :style="{
              fontFamily: 'var(--tmpl-font-mono)',
              background: toCssSafe(palette.accentSoft),
              color: toCssSafe(palette.accent),
              border: `1px solid ${toCssSafe(palette.accent, 0.2)}`,
            }"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {{ onlineCount.toLocaleString('id-ID') }} online sekarang
          </div>

          <!-- H1 -->
          <h1 :style="{ ...h1Style, marginBottom: '1.5rem' }">
            Belajar bareng,<br />
            <span :style="{ color: toCssSafe(palette.accent) }">tumbuh bareng.</span>
          </h1>

          <!-- Subhead -->
          <p
            class="text-lg max-w-xl mx-auto leading-relaxed mb-4"
            :style="{ color: toCssSafe(palette.muted) }"
          >
            Komunitas developer Indonesia. {{ spaces.length }} space, {{ events.length }} event, 0 spam.
          </p>

          <!-- Member counter -->
          <p
            class="text-sm mb-8"
            :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.muted, 0.7) }"
          >
            <span class="font-bold" :style="{ color: toCssSafe(palette.fg) }">{{ memberCount.toLocaleString('id-ID') }}</span> anggota
            &middot;
            <span class="font-bold" :style="{ color: toCssSafe(palette.fg) }">{{ spaces.length }}</span> space
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#tier"
              class="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              :style="{ background: toCssSafe(palette.accent), color: toCssSafe(palette.accentFg) }"
            >Gabung Gratis</a>
            <a
              href="#spaces"
              class="px-6 py-3 border rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              :style="{ borderColor: toCssSafe(palette.border), color: toCssSafe(palette.fg, 0.8) }"
            >Lihat Space</a>
          </div>
        </template>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 2. SPACES (6 community spaces) -->
    <!-- ============================================================ -->
    <section
      id="spaces"
      class="pt-24 pb-20 border-t"
      :style="{ borderColor: toCssSafe(palette.border, 0.3), background: toCssSafe(palette.surface) }"
    >
      <div class="max-w-6xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >SPACES</p>
        <h2 :style="{ ...h2Style, marginBottom: '0.5rem' }">Tempat ngobrol.</h2>
        <p class="mb-16" :style="{ color: toCssSafe(palette.muted) }">Pilih topik, gabung.</p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="space in spaces"
            :key="space.name"
            class="rounded-lg p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            :style="{
              background: toCssSafe(palette.surfaceElevated),
              border: `1px solid ${toCssSafe(palette.border, 0.3)}`,
            }"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ space.icon }}</span>
                <h3 class="text-base font-semibold" :style="{ color: toCssSafe(palette.fg) }">{{ space.name }}</h3>
              </div>
              <span
                class="text-[11px] font-medium"
                :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.muted, 0.7) }"
              >{{ space.members.toLocaleString('id-ID') }} anggota</span>
            </div>
            <p class="text-sm leading-relaxed mb-4" :style="{ color: toCssSafe(palette.muted) }">{{ space.desc }}</p>
            <div class="flex items-center justify-between">
              <div class="flex -space-x-2">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                  :style="{
                    background: toCssSafe(palette.surface),
                    borderColor: toCssSafe(palette.surfaceElevated),
                    color: toCssSafe(palette.muted),
                  }"
                >{{ String.fromCharCode(64 + i + spaces.indexOf(space)) }}</div>
              </div>
              <button
                class="text-[11px] font-semibold px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
                :style="{ background: toCssSafe(palette.accentSoft), color: toCssSafe(palette.accent) }"
              >Gabung</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 3. EVENTS (4 upcoming events) -->
    <!-- ============================================================ -->
    <section id="events" class="pt-24 pb-20 border-t" :style="{ borderColor: toCssSafe(palette.border, 0.3) }">
      <div class="max-w-5xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >EVENT</p>
        <h2 :style="{ ...h2Style, marginBottom: '0.5rem' }">Yang akan datang.</h2>
        <p class="mb-16" :style="{ color: toCssSafe(palette.muted) }">Online dan offline. Gratis.</p>

        <div class="space-y-3">
          <article
            v-for="event in events"
            :key="event.title"
            class="rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
            :style="{
              background: toCssSafe(palette.surface),
              border: `1px solid ${toCssSafe(palette.border, 0.3)}`,
            }"
          >
            <div class="flex items-start gap-4">
              <div
                class="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                :style="{ background: toCssSafe(palette.accentSoft) }"
              >
                <span class="text-[10px] font-bold" :style="{ color: toCssSafe(palette.accent), fontFamily: 'var(--tmpl-font-mono)' }">{{ event.date.split(',')[0] }}</span>
                <span class="text-[10px]" :style="{ color: toCssSafe(palette.muted, 0.7), fontFamily: 'var(--tmpl-font-mono)' }">{{ event.date.split(', ')[1] }}</span>
              </div>
              <div>
                <h3 class="text-base font-semibold mb-1" :style="{ color: toCssSafe(palette.fg) }">{{ event.title }}</h3>
                <p class="text-sm" :style="{ color: toCssSafe(palette.muted) }">{{ event.speaker }} &middot; {{ event.time }}</p>
              </div>
            </div>
            <button
              class="shrink-0 text-sm font-medium px-4 py-1.5 rounded-lg border transition-opacity hover:opacity-80"
              :style="{ borderColor: toCssSafe(palette.accent, 0.4), color: toCssSafe(palette.accent) }"
            >RSVP &middot; {{ event.rsvp }}</button>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 4. DISKUSI (5 thread previews) -->
    <!-- ============================================================ -->
    <section
      id="diskusi"
      class="pt-24 pb-20 border-t"
      :style="{ borderColor: toCssSafe(palette.border, 0.3), background: toCssSafe(palette.surface) }"
    >
      <div class="max-w-5xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >DISKUSI</p>
        <h2 :style="{ ...h2Style, marginBottom: '0.5rem' }">Thread terbaru.</h2>
        <p class="mb-16" :style="{ color: toCssSafe(palette.muted) }">Dari semua space.</p>

        <div class="space-y-3">
          <article
            v-for="thread in threads"
            :key="thread.title"
            class="rounded-lg p-5 transition-all duration-200 cursor-pointer"
            :style="{
              background: toCssSafe(palette.surfaceElevated),
              border: `1px solid ${toCssSafe(palette.border, 0.2)}`,
            }"
          >
            <div class="flex items-start gap-3">
              <div
                class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                :style="{ background: toCssSafe(palette.accentSoft), color: toCssSafe(palette.accent) }"
              >{{ thread.avatar }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="text-sm font-semibold" :style="{ color: toCssSafe(palette.fg) }">{{ thread.author }}</span>
                  <span
                    class="text-[10px] px-2 py-0.5 rounded-full"
                    :style="{ background: toCssSafe(palette.accentSoft, 0.5), color: toCssSafe(palette.accent), fontFamily: 'var(--tmpl-font-mono)' }"
                  >{{ thread.space }}</span>
                  <span class="text-[11px]" :style="{ color: toCssSafe(palette.muted, 0.5), fontFamily: 'var(--tmpl-font-mono)' }">{{ thread.time }}</span>
                </div>
                <h3 class="text-[15px] font-medium mb-2" :style="{ color: toCssSafe(palette.fg) }">{{ thread.title }}</h3>
                <div class="flex items-center gap-4 text-[12px]" :style="{ color: toCssSafe(palette.muted, 0.7) }">
                  <span>{{ thread.replies }} balasan</span>
                  <span>{{ thread.reactions }} reaksi</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 5. TIER (3 pricing tiers) -->
    <!-- ============================================================ -->
    <section id="tier" class="pt-24 pb-20 border-t" :style="{ borderColor: toCssSafe(palette.border, 0.3) }">
      <div class="max-w-5xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase text-center mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >TIER</p>
        <h2 :style="{ ...h2Style, marginBottom: '0.5rem', textAlign: 'center' }">Pilih yang cocok.</h2>
        <p class="mb-16 text-center" :style="{ color: toCssSafe(palette.muted) }">Mulai gratis. Upgrade kapan saja.</p>

        <div class="grid md:grid-cols-3 gap-4">
          <div
            v-for="tier in tiers"
            :key="tier.name"
            class="rounded-lg p-6 relative flex flex-col"
            :style="{
              background: tier.popular ? toCssSafe(palette.surfaceElevated) : toCssSafe(palette.surface),
              border: tier.popular
                ? `2px solid ${toCssSafe(palette.accent)}`
                : `1px solid ${toCssSafe(palette.border, 0.3)}`,
            }"
          >
            <span
              v-if="tier.popular"
              class="absolute -top-2.5 left-6 px-2 py-0.5 text-[10px] font-bold rounded"
              :style="{ background: toCssSafe(palette.accent), color: toCssSafe(palette.accentFg) }"
            >PALING POPULER</span>

            <p class="text-sm mb-2" :style="{ color: toCssSafe(palette.muted) }">{{ tier.name }}</p>
            <p class="text-3xl font-semibold mb-1" :style="{ color: toCssSafe(palette.fg) }">
              {{ tier.price }}
              <span v-if="tier.period" class="text-sm font-normal" :style="{ color: toCssSafe(palette.muted, 0.6) }">{{ tier.period }}</span>
            </p>
            <p class="text-sm mb-6" :style="{ color: toCssSafe(palette.muted) }">{{ tier.desc }}</p>

            <ul class="space-y-2.5 mb-8 flex-1">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-2 text-sm"
                :style="{ color: toCssSafe(palette.fg, 0.85) }"
              >
                <span class="mt-0.5 shrink-0" :style="{ color: toCssSafe(palette.accent) }">&#10003;</span>
                {{ feature }}
              </li>
            </ul>

            <button
              class="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              :style="{
                background: tier.popular ? toCssSafe(palette.accent) : 'transparent',
                color: tier.popular ? toCssSafe(palette.accentFg) : toCssSafe(palette.accent),
                border: tier.popular ? 'none' : `1px solid ${toCssSafe(palette.accent, 0.4)}`,
              }"
            >{{ tier.cta }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 6. TIM (4 community leaders) -->
    <!-- ============================================================ -->
    <section
      class="pt-24 pb-20 border-t"
      :style="{ borderColor: toCssSafe(palette.border, 0.3), background: toCssSafe(palette.surface) }"
    >
      <div class="max-w-5xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >TIM</p>
        <h2 :style="{ ...h2Style, marginBottom: '0.5rem' }">Yang menggerakkan.</h2>
        <p class="mb-16" :style="{ color: toCssSafe(palette.muted) }">Volunteer yang menjaga komunitas.</p>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <article
            v-for="person in team"
            :key="person.name"
            class="rounded-lg p-5 text-center"
            :style="{
              background: toCssSafe(palette.surfaceElevated),
              border: `1px solid ${toCssSafe(palette.border, 0.2)}`,
            }"
          >
            <div
              class="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold"
              :style="{ background: toCssSafe(palette.accentSoft), color: toCssSafe(palette.accent) }"
            >{{ person.avatar }}</div>
            <h3 class="text-sm font-semibold mb-0.5" :style="{ color: toCssSafe(palette.fg) }">{{ person.name }}</h3>
            <p class="text-[11px] font-medium mb-2" :style="{ color: toCssSafe(palette.accent), fontFamily: 'var(--tmpl-font-mono)' }">{{ person.role }}</p>
            <p class="text-[13px] leading-relaxed" :style="{ color: toCssSafe(palette.muted) }">{{ person.bio }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 7. FAQ -->
    <!-- ============================================================ -->
    <section class="pt-24 pb-20 border-t" :style="{ borderColor: toCssSafe(palette.border, 0.3) }">
      <div class="max-w-3xl mx-auto px-6">
        <p
          class="text-[11px] tracking-[0.2em] uppercase text-center mb-3"
          :style="{ fontFamily: 'var(--tmpl-font-mono)', color: toCssSafe(palette.accent) }"
        >FAQ</p>
        <h2 :style="{ ...h2Style, marginBottom: '3rem', textAlign: 'center' }">Pertanyaan umum.</h2>

        <div class="space-y-2">
          <div
            v-for="(item, index) in faqs"
            :key="index"
            class="rounded-lg overflow-hidden transition-colors"
            :style="{
              background: toCssSafe(palette.surface),
              border: `1px solid ${toCssSafe(palette.border, 0.2)}`,
            }"
          >
            <button
              class="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              @click="faqOpen = faqOpen === index ? null : index"
            >
              <span class="text-sm font-medium" :style="{ color: toCssSafe(palette.fg) }">{{ item.q }}</span>
              <span
                class="shrink-0 text-lg transition-transform duration-200"
                :style="{ color: toCssSafe(palette.muted), transform: faqOpen === index ? 'rotate(45deg)' : 'rotate(0deg)' }"
              >+</span>
            </button>
            <div
              v-if="faqOpen === index"
              class="px-5 pb-4 text-sm leading-relaxed"
              :style="{ color: toCssSafe(palette.muted) }"
            >{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================ -->
    <!-- 8. FOOTER -->
    <!-- ============================================================ -->
    <TmplFooter
      brand-name="Sinau Koding"
      variant="columns"
      :accent="toCssSafe(palette.accent)"
      :bg="toCssSafe(palette.surface)"
      :text="toCssSafe(palette.fg)"
      signature="Komunitas developer Indonesia sejak 2021"
      :links="[
        { label: 'Spaces', href: '#spaces' },
        { label: 'Event', href: '#events' },
        { label: 'Diskusi', href: '#diskusi' },
        { label: 'Harga', href: '#tier' },
      ]"
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="membership"
    />
  </div>
</template>
