<script setup lang="ts">
/**
 * architecture-1.vue — Archiry
 * Architecture firm. BIG/OMA/Snohetta restraint. Cormorant Garamond italic.
 *
 * 10 sections: 3D Hero, Hero, About, Projects (3-axis filter), Process (5 stages),
 * Team (10), Recognition (12), Press (6), Contact (TmplForm), Footer
 *
 * Palette: archiry (light, brass accent)
 * Typography: archiry (Cormorant Garamond italic + Inter + JetBrains Mono)
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({ layout: false })

const theme = useTemplateTheme('architecture-1')
const { tpl, styles, h1Style, h2Style, monoStyle } = theme
useScrollReveal('architecture-1')

// ============================================================
// STATE
// ============================================================
const heroLoaded = ref(false)
const activeSection = ref('hero')
const filterYears = ref<string[]>([])
const filterTypes = ref<string[]>([])
const filterStatus = ref<string[]>([])
const hoveredProject = ref<number | null>(null)
const hoveredProcess = ref<number | null>(null)
const hoveredTeam = ref<number | null>(null)
const hoveredRecognition = ref<number | null>(null)
const processInView = ref(false)
let scrollSpy: IntersectionObserver | null = null

onMounted(() => {
  setTimeout(() => { heroLoaded.value = true }, 120)
  initScrollSpy()
})

onBeforeUnmount(() => {
  if (scrollSpy) scrollSpy.disconnect()
})

function initScrollSpy() {
  if (typeof window === 'undefined') return
  scrollSpy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          activeSection.value = (e.target as HTMLElement).id || 'hero'
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  )
  document.querySelectorAll('[data-section]').forEach((el) => scrollSpy?.observe(el))
}

// ============================================================
// DATA
// ============================================================
const projects = [
  {
    name: 'KS House',
    slug: 'ks-house',
    year: '2024',
    location: 'Dago Atas, Bandung',
    type: 'Residensial',
    status: 'Terbangun',
    area: '320 m\u00B2',
    desc: 'Rumah tinggal di kontur landai 8 meter, view utara ke hutan kota. Batu paras lokal, kayu jati reclaimed, bata ekspos untuk fasad belakang.',
  },
  {
    name: 'TR Pavilion',
    slug: 'tr-pavilion',
    year: '2023',
    location: 'Ubud, Bali',
    type: 'Residensial',
    status: 'Terbangun',
    area: '180 m\u00B2',
    desc: 'Paviliun terbuka di tepi sawah, struktur bambu petung dan atap alang-alang. Mezzanine 4.2 meter menangkap angin barat, dinding geser kayu meranti buka tutup penuh.',
  },
  {
    name: 'EL Atelier',
    slug: 'el-atelier',
    year: '2025',
    location: 'Pejaten, Jakarta Selatan',
    type: 'Komersial',
    status: 'Dalam proses',
    area: '450 m\u00B2',
    desc: 'Atelier dan showroom 2 lantai, fasad beton cetak dengan bukaan vertikal. Lantai dasar galeri, mezzanine ruang kerja tim 8 orang dengan skylight.',
  },
  {
    name: 'RP Reading Room',
    slug: 'rp-reading-room',
    year: '2022',
    location: 'Salatiga, Jawa Tengah',
    type: 'Publik',
    status: 'Terbangun',
    area: '220 m\u00B2',
    desc: 'Ruang baca komunitas di samping gereja lama, struktur baja ringan dinding kaca penuh. Rak terbuka 18 meter untuk 4.200 buku, furnitur kayu jati Jepara.',
  },
  {
    name: 'ND Guest Wing',
    slug: 'nd-guest-wing',
    year: '2025',
    location: 'Ubud, Bali',
    type: 'Interior',
    status: 'Konsep',
    area: '90 m\u00B2',
    desc: 'Guest wing ke villa existing, 2 suite tidur kamar mandi outdoor. Lantai batu Karangasem, dinding plester tanah liat, skylight timur.',
  },
  {
    name: 'BH Coastal Retreat',
    slug: 'bh-coastal-retreat',
    year: '2024',
    location: 'Pantai Selatan, Lombok',
    type: 'Residensial',
    status: 'Konsep',
    area: '240 m\u00B2',
    desc: 'Vila tepi pantai 5 bungalow terhubung deck kayu ulin. Atap jerami struktur bambu, air sumur dangkal 14 meter, septic biofilter.',
  },
]

const process = [
  {
    step: '01',
    title: 'Brief',
    weeks: 'Minggu 1\u20133',
    desc: 'Kami tidak gambar dulu. Kami datang ke tempat, berjalan keliling, bicara dengan penghuni — menggali rutinitas, bukan selera.',
    deliverables: ['Site visit 2\u20133x', 'Wawancara penghuni', 'Dokumen brief', 'Kajian tapak awal'],
  },
  {
    step: '02',
    title: 'Konsep',
    weeks: 'Minggu 4\u20136',
    desc: 'Dari brief, kami rumuskan orientasi terhadap matahari, hubungan ruang dengan tapak, dan material utama. Bukan moodboard Pinterest.',
    deliverables: ['Tiga keputusan utama', 'Sketsa konsep 5\u20137 halaman', 'Estimasi biaya kasar', 'Pertemuan alignment klien'],
  },
  {
    step: '03',
    title: 'Sketsa',
    weeks: 'Minggu 7\u201312',
    desc: 'Sketsa tangan, bukan render. Gambar tangan masih paling jujur tentang niat. Denah dan potongan direvisi minimal 4 kali.',
    deliverables: ['Sketsa tangan 30\u201350 lembar', 'Denah layout final', 'Potongan arsitektural', 'Material schedule'],
  },
  {
    step: '04',
    title: 'Model',
    weeks: 'Minggu 13\u201320',
    desc: 'Gambar kerja teknis lengkap: struktur, ME, plumbing. Koordinasi insinyur dan kontraktor. Maket fisik A3 presentasi akhir.',
    deliverables: ['Gambar kerja 80\u2013120 halaman', 'Spesifikasi teknis lengkap', 'Maket fisik 1:50', 'RAB detail'],
  },
  {
    step: '05',
    title: 'Konstruksi',
    weeks: 'Bulan 5\u201314',
    desc: 'Supervisi mingguan di lapangan. Kami datang setiap Selasa, bertemu mandor, cek apakah gambar kerja masih relevan.',
    deliverables: ['Supervisi mingguan', 'Site meeting 2x sebulan', 'Laporan progres foto', 'Serah terima final dengan punch list'],
  },
]

const team = [
  { name: 'Rio Hardja, S.T., IAI', role: 'Principal Architect', bio: '15 tahun praktik. Lulusan ITB 2009. Riset material lokal Pulau Jawa dipublikasikan di A+U 2019.' },
  { name: 'Mira Sukma, S.T.', role: 'Design Director', bio: '12 tahun praktik. Lulusan University of Melbourne. Pernah di Denton Corker Marshall dan WOHA Singapura.' },
  { name: 'Bagas Wiratama', role: 'Senior Architect', bio: '9 tahun praktik. Lulusan UNPAR. Sebelumnya di SHAU Bandung. Menangani gambar kerja dan detail konstruksi.' },
  { name: 'Citra Larasati, S.T.', role: 'Interior Lead', bio: '10 tahun praktik. Lulusan ISI Yogyakarta. Setiap interior dimulai dengan riset material dari pengrajin lokal.' },
  { name: 'Doni Saputra, S.T.', role: 'Project Architect', bio: '7 tahun praktik. Lulusan UGM. Koordinasi lapangan dan gambar teknis eksekusi.' },
  { name: 'Hana Pertiwi, S.T., M.Ar.', role: 'Sustainability Lead', bio: '6 tahun praktik. Magister arsitektur dari TU Delft. Riset carbon-storing material untuk bangunan tropis.' },
  { name: 'Reza Maulana', role: 'Visualization', bio: '4 tahun praktik. Lulusan ITENAS. Gambar tangan, model fisik, render. Setiap presentasi pakai maket minimal A3.' },
  { name: 'Aisha Karina', role: 'Junior Architect', bio: '2 tahun praktik. Lulusan ITB 2023. Pertama kali masuk lewat magang. Tugas: gambar kerja, survey lapangan, maket.' },
  { name: 'Yusuf Pratama', role: 'Construction Liaison', bio: '20 tahun di lapangan. Lulusan STM. Pernah mandor di 14 proyek residensial.' },
  { name: 'Sinta Maharani, S.E.', role: 'Studio Manager', bio: '8 tahun praktik. Lulusan Unisba. Anggaran, jadwal, vendor, pembayaran. Yang jaga agar studio tidak telat bayar tukang.' },
]

const recognition = [
  { pub: 'Awwwards', award: 'Site of the Day', year: '2025', project: 'TR Pavilion' },
  { pub: 'ArchDaily', award: 'Building of the Year, Longlist', year: '2024', project: 'KS House' },
  { pub: 'Dezeen', award: 'Awards, Longlist', year: '2024', project: 'RP Reading Room' },
  { pub: 'World Architecture Festival', award: 'Shortlisted, House', year: '2023', project: 'KS House' },
  { pub: 'AD100', award: 'Studio Listing', year: '2024', project: 'Archiry Studio' },
  { pub: 'Indonesia Design', award: 'Best Residential Architecture', year: '2023', project: 'TR Pavilion' },
  { pub: 'Domus', award: 'International Selection', year: '2024', project: 'RP Reading Room' },
  { pub: 'Frame Awards', award: 'Longlist, Civic', year: '2022', project: 'RP Reading Room' },
  { pub: 'IAI', award: 'Award for Emerging Practice', year: '2022', project: 'Archiry Studio' },
  { pub: 'Architecture MasterPrize', award: 'Winner, Restoration', year: '2022', project: 'RP Reading Room' },
  { pub: 'Architizer A+ Awards', award: 'Jury Winner, Private House', year: '2024', project: 'TR Pavilion' },
  { pub: 'Archello', award: 'Featured Project', year: '2023', project: 'BH Coastal Retreat' },
]

const press = [
  { pub: 'ArchDaily', headline: 'KS House, a Bandung residence built around reclaimed teak', year: '2024' },
  { pub: 'Domus', headline: 'Reading Room in Salatiga: civic architecture at 220 m\u00B2', year: '2024' },
  { pub: 'Indonesia Design', headline: 'Studio Arsitektur Bandung yang menolak 80% kliennya', year: '2024' },
  { pub: 'CNN Indonesia', headline: 'Paviliun bambu di Ubud: studi kasus material lokal', year: '2023' },
  { pub: 'Kompas', headline: 'Piala IAI 2022 untuk praktik arsitektur muda Bandung', year: '2022' },
  { pub: 'Tropicalia Magazine', headline: 'Carbon-storing bamboo, case study by Hana Pertiwi', year: '2023' },
]

// Filter data
const filterYearOptions = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
const filterTypeOptions = ['Residensial', 'Komersial', 'Publik', 'Interior']
const filterStatusOptions = ['Terbangun', 'Dalam proses', 'Konsep']

const filteredProjects = computed(() => {
  return projects.filter((p) => {
    if (filterYears.value.length && !filterYears.value.includes(p.year)) return false
    if (filterTypes.value.length && !filterTypes.value.includes(p.type)) return false
    if (filterStatus.value.length && !filterStatus.value.includes(p.status)) return false
    return true
  })
})

const activeFilterCount = computed(() => filterYears.value.length + filterTypes.value.length + filterStatus.value.length)

function toggleFilter(arr: string[], val: string) {
  const idx = arr.indexOf(val)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(val)
}

function clearAllFilters() {
  filterYears.value = []
  filterTypes.value = []
  filterStatus.value = []
}

// Status color helper
function statusColor(status: string) {
  if (status === 'Terbangun') return 'var(--archiry-green)'
  if (status === 'Dalam proses') return 'var(--tmpl-accent)'
  return 'var(--tmpl-muted)'
}

// Team gradient avatars (brass/stone/ink range, unique per person)
const teamGradients = [
  'linear-gradient(135deg, oklch(72% 0.11 80), oklch(58% 0.08 60))',
  'linear-gradient(135deg, oklch(65% 0.09 75), oklch(45% 0.06 250))',
  'linear-gradient(135deg, oklch(78% 0.08 85), oklch(55% 0.10 70))',
  'linear-gradient(135deg, oklch(60% 0.12 78), oklch(80% 0.06 90))',
  'linear-gradient(135deg, oklch(50% 0.08 250), oklch(72% 0.11 80))',
  'linear-gradient(135deg, oklch(84% 0.07 85), oklch(58% 0.13 75))',
  'linear-gradient(135deg, oklch(45% 0.06 60), oklch(72% 0.11 80))',
  'linear-gradient(135deg, oklch(72% 0.11 80), oklch(92% 0.04 85))',
  'linear-gradient(135deg, oklch(38% 0.04 250), oklch(65% 0.09 75))',
  'linear-gradient(135deg, oklch(75% 0.09 82), oklch(50% 0.08 60))',
]

// Contact form fields (TmplForm compatible)
const contactFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text' as const, placeholder: 'Nama Anda', required: true },
  { key: 'email', label: 'Email', type: 'email' as const, placeholder: 'email@anda.com', required: true },
  { key: 'location', label: 'Lokasi proyek', type: 'text' as const, placeholder: 'Kota atau alamat' },
  { key: 'story', label: 'Cerita tempatnya', type: 'textarea' as const, placeholder: 'Apa yang ingin Anda bangun, di mana, untuk siapa.', required: true },
]

const budgetOptions = [
  '< Rp 500 juta',
  'Rp 500 juta \u2013 2 miliar',
  'Rp 2 miliar \u2013 10 miliar',
  '> Rp 10 miliar',
  'Belum tahu',
]
const selectedBudget = ref('')

function handleFormSubmit(values: Record<string, string>) {
  const lines = [
    'Halo Archiry, saya ingin memulai proyek.',
    '',
    `Nama: ${values.name || ''}`,
    `Email: ${values.email || ''}`,
    `Lokasi: ${values.location || ''}`,
    `Anggaran: ${selectedBudget.value || 'Belum ditentukan'}`,
    '',
    `Cerita: ${values.story || ''}`,
  ]
  const msg = lines.join('\n')
  window.open(`https://wa.me/62227204518?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
}

// Nav links
const navLinks = [
  { label: 'Studi', href: '#hero' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Proses', href: '#proses' },
  { label: 'Tim', href: '#tim' },
  { label: 'Pengakuan', href: '#pengakuan' },
  { label: 'Kontak', href: '#kontak' },
]
</script>

<template>
  <div class="archiry" :style="styles">
    <a class="skip-link" href="#main" :style="{ position: 'absolute', left: '-9999px' }">Lewat ke konten</a>

    <TmplBack accent="var(--tmpl-accent)" />

    <TmplNavbar
      brand="Archiry"
      :links="navLinks"
      accent="var(--tmpl-accent)"
      style="glass"
      :show-theme-toggle="false"
      force-mode="light"
    />

    <main id="main">

      <!-- ============================== -->
      <!-- SECTION 1 — 3D + HERO          -->
      <!-- ============================== -->
      <section id="hero" data-section class="archiry-hero" :style="{ minHeight: '100dvh' }">
        <!-- 3D Canvas (background, pointer-events none) -->
        <div class="archiry-hero__3d">
          <TmplExperienceCanvas
            preset="case-timeline"
            :accent="tpl.accentColor"
            intensity="calm"
          />
        </div>

        <!-- Index badge top-left -->
        <p class="archiry-mono-top" :style="monoStyle">01 / 08</p>

        <!-- Metadata top-right -->
        <p class="archiry-mono-top archiry-mono-top--right" :style="monoStyle">
          Studi arsitektur &middot; Bandung &middot; 2018 hingga sekarang
        </p>

        <!-- Hero content -->
        <div class="archiry-hero__content">
          <Transition
            enter-active-class="transition-all duration-700 ease-out"
            enter-from-class="opacity-0 translate-y-6"
          >
            <div v-if="heroLoaded">
              <h1 :style="{ ...h1Style, fontSize: 'clamp(4.5rem, 10vw, 11rem)', lineHeight: '0.95', letterSpacing: '-0.025em' }" class="archiry-h1">
                Rumah yang<br />menghormati<br />tempatnya.
              </h1>

              <p class="archiry-hero__sub">
                Studio kecil 10 orang di Bandung. Residensial, komersial, publik, interior. Seluruh Indonesia sejak 2018.
              </p>

              <div class="archiry-hero__tags" :style="monoStyle">
                Residensial &middot; Komersial &middot; Publik &middot; Interior
              </div>

              <div class="archiry-hero__cta">
                <a href="#proyek" class="archiry-btn archiry-btn--primary">
                  Lihat proyek terpilih
                  <span aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Scroll cue -->
        <div class="archiry-scroll-cue" :style="monoStyle">
          <span class="archiry-scroll-cue__line" />
          <span class="archiry-scroll-cue__dot" />
          <span class="archiry-scroll-cue__label">Scroll</span>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 2 — ABOUT              -->
      <!-- ============================== -->
      <section id="studi" data-section class="archiry-about">
        <p class="archiry-section-label" :style="monoStyle">01 / 06 &middot; Studio</p>
        <h2 :style="h2Style" class="archiry-section-h2">
          Arsitektur<br />yang tumbuh<br />dari tempat.
        </h2>
        <div class="archiry-about__body">
          <p>Arsitektur yang baik tumbuh dari tempat, iklim, dan cara penghuninya hidup. Bentuk bangunan mengikuti matahari, angin, dan kemiringan tanah — bukan estetika dari majalah luar negeri.</p>
          <p>Material lokal bukan gimmick. Batu paras Jawa Tengah, kayu jati Jepara, bambu petung Sumatera. Dipilih karena tahan lama, tersedia di tempat, dan punya cerita.</p>
          <p>Kami menolak 80% klien. Bukan sombong — tapi tidak semua proyek cocok dengan cara kami kerja. Yang kami ambil, kami kerjakan penuh sampai serah terima.</p>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 3 — PROJECTS           -->
      <!-- ============================== -->
      <section id="proyek" data-section class="archiry-projects">
        <p class="archiry-section-label" :style="monoStyle">02 / 06 &middot; Proyek</p>
        <h2 :style="h2Style" class="archiry-section-h2">
          Proyek<br />terpilih.
        </h2>

        <!-- Filter chips (3 axes) -->
        <div class="archiry-filters">
          <div class="archiry-filter-group">
            <p class="archiry-filter-label" :style="monoStyle">Tahun</p>
            <div class="archiry-filter-chips">
              <button
                v-for="y in filterYearOptions"
                :key="y"
                type="button"
                class="archiry-chip"
                :class="{ 'archiry-chip--active': filterYears.includes(y) }"
                @click="toggleFilter(filterYears, y)"
              >{{ y }}</button>
            </div>
          </div>
          <div class="archiry-filter-group">
            <p class="archiry-filter-label" :style="monoStyle">Tipe</p>
            <div class="archiry-filter-chips">
              <button
                v-for="t in filterTypeOptions"
                :key="t"
                type="button"
                class="archiry-chip"
                :class="{ 'archiry-chip--active': filterTypes.includes(t) }"
                @click="toggleFilter(filterTypes, t)"
              >{{ t }}</button>
            </div>
          </div>
          <div class="archiry-filter-group">
            <p class="archiry-filter-label" :style="monoStyle">Status</p>
            <div class="archiry-filter-chips">
              <button
                v-for="s in filterStatusOptions"
                :key="s"
                type="button"
                class="archiry-chip"
                :class="{ 'archiry-chip--active': filterStatus.includes(s) }"
                @click="toggleFilter(filterStatus, s)"
              >{{ s }}</button>
            </div>
          </div>
          <div v-if="activeFilterCount > 0" class="archiry-filter-meta" :style="monoStyle">
            {{ activeFilterCount }} filter aktif &middot; {{ filteredProjects.length }} proyek cocok
            <button type="button" class="archiry-filter-clear" @click="clearAllFilters">Hapus semua</button>
          </div>
        </div>

        <!-- Live counter -->
        <p class="archiry-counter" :style="monoStyle">
          Menampilkan {{ filteredProjects.length }} dari {{ projects.length }} proyek
        </p>

        <!-- Project grid -->
        <div v-if="filteredProjects.length > 0" class="archiry-project-grid">
          <article
            v-for="(p, i) in filteredProjects"
            :key="p.slug"
            class="archiry-project-card"
            :class="{ 'archiry-project-card--hovered': hoveredProject === i }"
            @mouseenter="hoveredProject = i"
            @mouseleave="hoveredProject = null"
          >
            <p class="archiry-project-card__meta" :style="monoStyle">
              {{ p.year }} &middot; {{ p.type }}
            </p>
            <h3 class="archiry-project-card__name">{{ p.name }}</h3>
            <p class="archiry-project-card__desc">{{ p.desc }}</p>
            <div class="archiry-project-card__divider" data-reveal="fade-up" data-reveal-delay="0.1" />
            <p class="archiry-project-card__info" :style="monoStyle">
              {{ p.location }} &middot; {{ p.area }} &middot; <span :style="{ color: statusColor(p.status) }">{{ p.status }}</span>
            </p>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 translate-y-1"
              leave-to-class="opacity-0"
            >
              <p v-if="hoveredProject === i" class="archiry-project-card__cta">
                Baca studi kasus <span aria-hidden="true">&rarr;</span>
              </p>
            </Transition>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="archiry-empty">
          <p>Tidak ada proyek yang cocok dengan filter ini. Coba kurangi satu filter.</p>
          <button type="button" class="archiry-btn archiry-btn--ghost" @click="clearAllFilters">Hapus semua filter</button>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 4 — PROCESS            -->
      <!-- ============================== -->
      <section id="proses" data-section class="archiry-process" ref="processSection">
        <p class="archiry-section-label" :style="monoStyle">03 / 06 &middot; Proses</p>
        <h2 :style="h2Style" class="archiry-section-h2">
          Lima tahap.<br />Tidak ada<br />jalan pintas.
        </h2>

        <div class="archiry-process-list">
          <div
            v-for="(stage, i) in process"
            :key="stage.step"
            class="archiry-process-stage"
            :class="{ 'archiry-process-stage--hovered': hoveredProcess === i }"
            @mouseenter="hoveredProcess = i"
            @mouseleave="hoveredProcess = null"
          >
            <div class="archiry-process-stage__num" :style="{ ...monoStyle, color: 'var(--tmpl-accent)' }">
              {{ stage.step }}
            </div>
            <div class="archiry-process-stage__body">
              <h3 class="archiry-process-stage__title">{{ stage.title }}</h3>
              <p class="archiry-process-stage__weeks" :style="monoStyle">{{ stage.weeks }}</p>
              <p class="archiry-process-stage__desc">{{ stage.desc }}</p>
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 max-h-0"
                leave-to-class="opacity-0 max-h-0"
              >
                <ul v-if="hoveredProcess === i" class="archiry-process-stage__deliverables">
                  <li v-for="d in stage.deliverables" :key="d">{{ d }}</li>
                </ul>
              </Transition>
            </div>
          </div>
        </div>

        <p class="archiry-process-footer" :style="monoStyle">
          5 tahap. Tidak ada jalan pintas. Tidak ada desain dari foto.
        </p>
        <p class="archiry-process-note">
          Setelah serah terima, kami kembali 3 bulan kemudian untuk foto. Arsitektur yang bagus baru terlihat setelah dipakai.
        </p>
      </section>

      <!-- ============================== -->
      <!-- SECTION 5 — TEAM               -->
      <!-- ============================== -->
      <section id="tim" data-section class="archiry-team">
        <p class="archiry-section-label" :style="monoStyle">04 / 06 &middot; Tim</p>
        <h2 :style="h2Style" class="archiry-section-h2">
          10 orang.<br />Bandung.<br />Bukan 50. Bukan 5.
        </h2>

        <div class="archiry-team-grid" data-reveal="stagger-children">
          <div
            v-for="(member, i) in team"
            :key="member.name"
            class="archiry-team-card"
            :class="{ 'archiry-team-card--hovered': hoveredTeam === i }"
            @mouseenter="hoveredTeam = i"
            @mouseleave="hoveredTeam = null"
          >
            <div class="archiry-team-card__avatar" :style="{ background: teamGradients[i] }" />
            <p class="archiry-team-card__name">{{ member.name }}</p>
            <p class="archiry-team-card__role" :style="monoStyle">{{ member.role }}</p>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              leave-to-class="opacity-0 max-h-0"
            >
              <p v-if="hoveredTeam === i" class="archiry-team-card__bio">{{ member.bio }}</p>
            </Transition>
          </div>
        </div>

        <p class="archiry-team-footer">
          Cukup untuk dengerin, mikir, dan nge-ship. Kami rekrut untuk masa bakti panjang, bukan presentasi.
        </p>
      </section>

      <!-- ============================== -->
      <!-- SECTION 6 — RECOGNITION        -->
      <!-- ============================== -->
      <section id="pengakuan" data-section class="archiry-recognition">
        <p class="archiry-section-label" :style="monoStyle">05 / 06 &middot; Pengakuan</p>
        <h2 :style="h2Style" class="archiry-section-h2">
          Diterima oleh<br />publikasi yang<br />kami hormati.
        </h2>

        <div class="archiry-recog-grid" data-reveal="stagger-children">
          <div
            v-for="(r, i) in recognition"
            :key="`${r.pub}-${r.year}`"
            class="archiry-recog-tile"
            :class="{ 'archiry-recog-tile--hovered': hoveredRecognition === i }"
            @mouseenter="hoveredRecognition = i"
            @mouseleave="hoveredRecognition = null"
          >
            <p class="archiry-recog-tile__pub">{{ r.pub }}</p>
            <p class="archiry-recog-tile__award" :style="monoStyle">{{ r.award }}</p>
            <p class="archiry-recog-tile__year" :style="monoStyle">{{ r.year }}</p>
            <p class="archiry-recog-tile__project">{{ r.project }}</p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 7 — PRESS              -->
      <!-- ============================== -->
      <section class="archiry-press">
        <p class="archiry-section-label" :style="monoStyle">Liputan dan tulisan</p>

        <div class="archiry-press-list">
          <div v-for="item in press" :key="`${item.pub}-${item.year}`" class="archiry-press-row">
            <span class="archiry-press-row__pub" :style="monoStyle">{{ item.pub }}</span>
            <span class="archiry-press-row__headline">{{ item.headline }}</span>
            <span class="archiry-press-row__year" :style="monoStyle">{{ item.year }}</span>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- SECTION 8 — CONTACT            -->
      <!-- ============================== -->
      <section id="kontak" data-section class="archiry-contact">
        <p class="archiry-section-label" :style="monoStyle">06 / 06 &middot; Kontak</p>
        <h2 :style="{ ...h2Style, fontSize: 'clamp(3rem, 7vw, 6rem)' }" class="archiry-section-h2">
          Mulai dari<br />cerita tempat.
        </h2>
        <p class="archiry-contact__sub">
          Balas dalam 48 jam. WhatsApp, email, atau ketemu langsung di studio. Konsultasi pertama gratis.
        </p>

        <div class="archiry-contact-grid" data-reveal="stagger-children">
          <!-- Form -->
          <div class="archiry-contact-form">
            <TmplForm
              :fields="contactFields"
              submit-label="Kirim cerita &rarr;"
              whatsapp-phone="62227204518"
              whatsapp-message-prefix="Halo Archiry, saya ingin memulai proyek."
              accent="var(--tmpl-accent)"
              @submit="handleFormSubmit"
            />
            <!-- Budget radio chips (outside TmplForm since it doesn't support radio) -->
            <div class="archiry-budget">
              <p class="archiry-budget__label">Perkiraan anggaran</p>
              <div class="archiry-budget__chips">
                <button
                  v-for="opt in budgetOptions"
                  :key="opt"
                  type="button"
                  class="archiry-chip"
                  :class="{ 'archiry-chip--active': selectedBudget === opt }"
                  @click="selectedBudget = opt"
                >{{ opt }}</button>
              </div>
            </div>
          </div>

          <!-- Info column -->
          <aside class="archiry-contact-info">
            <div class="archiry-contact-info__item">
              <p class="archiry-contact-info__label" :style="monoStyle">WhatsApp</p>
              <p class="archiry-contact-info__value">+62 22 720 4518</p>
            </div>
            <div class="archiry-contact-info__item">
              <p class="archiry-contact-info__label" :style="monoStyle">Email</p>
              <p class="archiry-contact-info__value">halo@archiry.id</p>
            </div>
            <div class="archiry-contact-info__item">
              <p class="archiry-contact-info__label" :style="monoStyle">Studio</p>
              <p class="archiry-contact-info__value">Jl. Sumatera 21, Bandung</p>
            </div>
            <div class="archiry-contact-info__item">
              <p class="archiry-contact-info__label" :style="monoStyle">Bekerja di</p>
              <p class="archiry-contact-info__value">Seluruh Indonesia, fokus Jawa dan Bali</p>
            </div>
            <div class="archiry-contact-info__item">
              <p class="archiry-contact-info__label" :style="monoStyle">Sosial</p>
              <p class="archiry-contact-info__value">
                Instagram @archiry.studio<br />Are.na @archiry &middot; 500px @archiry
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <TmplFooter data-reveal="fade-up" brand-name="Archiry"
      variant="signoff"
      signoff="Arsitektur yang menghormati tempatnya."
      accent="var(--tmpl-accent)"
      signature="&copy; 2018\u20132026 Archiry Studio. Bandung. Bekerja di seluruh Indonesia."
    />

    <!-- WhatsApp FAB -->
    <TmplWhatsAppFab
      :template-name="tpl.brand"
      template-category="architecture"
    />
  </div>
</template>

<style scoped>
/* ============================================================
   CSS CUSTOM PROPERTIES (archiry palette overrides)
   ============================================================ */
.archiry {
  --archiry-green: oklch(58% 0.10 145);
  --archiry-brass: oklch(72% 0.11 80);
  --archiry-paper-2: oklch(95% 0.008 90);
  --archiry-paper-3: oklch(91% 0.01 88);
  --archiry-ink-soft: oklch(38% 0.012 250);
  --archiry-ink-mute: oklch(58% 0.01 250);
  --archiry-border: oklch(18% 0.012 250 / 0.12);
  min-height: 100dvh;
  position: relative;
}

/* ============================================================
   TYPOGRAPHY BASE
   ============================================================ */
.archiry :deep(p) {
  max-width: 70ch;
}
.archiry :deep(a) {
  color: inherit;
}

/* ============================================================
   MONO LABELS (top-left/right in hero)
   ============================================================ */
.archiry-mono-top {
  position: absolute;
  top: 5.5rem;
  left: 2rem;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  z-index: 2;
}
.archiry-mono-top--right {
  left: auto;
  right: 2rem;
  display: none;
}
@media (min-width: 768px) {
  .archiry-mono-top--right { display: block; }
}

/* ============================================================
   HERO
   ============================================================ */
.archiry-hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}
.archiry-hero__3d {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.45;
}
.archiry-hero__content {
  position: relative;
  z-index: 2;
  max-width: 65vw;
}
@media (max-width: 767px) {
  .archiry-hero__content { max-width: 100%; }
}
.archiry-h1 {
  font-style: italic;
  margin: 0 0 2.5rem;
}
.archiry-hero__sub {
  font-size: clamp(1.0625rem, 1.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 32ch;
  margin: 0 0 1.5rem;
  opacity: 0.78;
}
.archiry-hero__tags {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin-bottom: 2rem;
}
.archiry-hero__cta {
  display: flex;
  gap: 0.75rem;
}

/* Scroll cue */
.archiry-scroll-cue {
  position: absolute;
  bottom: 2.5rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}
.archiry-scroll-cue__line {
  width: 1px;
  height: 40px;
  background: var(--archiry-border);
  position: relative;
  overflow: hidden;
}
.archiry-scroll-cue__line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--tmpl-accent);
  animation: scroll-line 2.5s ease-in-out infinite;
}
@keyframes scroll-line {
  0% { top: -100%; }
  50% { top: 100%; }
  100% { top: 100%; }
}
.archiry-scroll-cue__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tmpl-accent);
}
.archiry-scroll-cue__label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
}

/* ============================================================
   BUTTONS
   ============================================================ */
.archiry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: background-color 350ms ease, border-color 350ms ease;
}
.archiry-btn--primary {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
}
.archiry-btn--primary:hover {
  background: var(--archiry-brass);
}
.archiry-btn--ghost {
  background: transparent;
  color: var(--tmpl-fg);
  border-color: var(--archiry-border);
}
.archiry-btn--ghost:hover {
  border-color: var(--tmpl-accent);
  color: var(--tmpl-accent);
}

/* ============================================================
   SECTION LABELS + HEADINGS
   ============================================================ */
.archiry-section-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin-bottom: 1.5rem;
}
.archiry-section-h2 {
  font-style: italic;
  margin: 0 0 3rem;
}

/* ============================================================
   ABOUT
   ============================================================ */
.archiry-about {
  padding: 8rem 8vw;
  max-width: 65%;
}
@media (max-width: 767px) {
  .archiry-about { max-width: 100%; padding: 5rem 1.5rem; }
}
.archiry-about__body {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.archiry-about__body p {
  font-size: clamp(1.0625rem, 1.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 70ch;
  margin: 0;
}
.archiry-about__interrupt {
  margin-top: 3rem;
  font-style: italic;
  font-size: 1rem;
  max-width: 40ch;
  text-align: left;
  opacity: 0.75;
}

/* ============================================================
   PROJECTS
   ============================================================ */
.archiry-projects {
  padding: 5rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
}

/* Filters */
.archiry-filters {
  margin-bottom: 1.5rem;
}
.archiry-filter-group {
  margin-bottom: 1rem;
}
.archiry-filter-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin-bottom: 0.5rem;
}
.archiry-filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.archiry-chip {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--archiry-border);
  border-radius: 6px;
  background: transparent;
  color: var(--tmpl-fg);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}
.archiry-chip:hover {
  border-color: color-mix(in srgb, currentColor 35%, transparent);
}
.archiry-chip--active {
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-color: var(--tmpl-fg);
}
.archiry-filter-meta {
  font-size: 11px;
  color: var(--archiry-ink-mute);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.archiry-filter-clear {
  background: none;
  border: none;
  color: var(--tmpl-accent);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.archiry-counter {
  font-size: 11px;
  color: var(--archiry-ink-mute);
  margin-bottom: 2rem;
}

/* Project grid */
.archiry-project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: var(--archiry-border);
  border: 1px solid var(--archiry-border);
}
@media (min-width: 768px) {
  .archiry-project-grid { grid-template-columns: 1fr 1fr; }
}
.archiry-project-card {
  padding: 2rem;
  background: var(--tmpl-bg);
  transition: background-color 350ms ease;
  cursor: pointer;
  position: relative;
}
.archiry-project-card--hovered {
  background: var(--archiry-paper-2);
}
.archiry-project-card__meta {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin-bottom: 0.75rem;
}
.archiry-project-card__name {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 0.75rem;
  color: var(--archiry-ink-soft);
  transition: color 350ms ease;
}
.archiry-project-card--hovered .archiry-project-card__name {
  color: var(--tmpl-fg);
}
.archiry-project-card__desc {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.7;
  margin: 0 0 1rem;
  max-width: 50ch;
}
.archiry-project-card__divider {
  height: 1px;
  background: var(--archiry-border);
  margin-bottom: 0.75rem;
}
.archiry-project-card__info {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin: 0;
}
.archiry-project-card__cta {
  margin-top: 0.75rem;
  font-style: italic;
  font-size: 0.875rem;
  color: var(--tmpl-accent);
}

/* Empty state */
.archiry-empty {
  text-align: center;
  padding: 4rem 2rem;
  opacity: 0.6;
}
.archiry-empty p {
  margin: 0 0 1rem;
  max-width: 100%;
}

/* ============================================================
   PROCESS
   ============================================================ */
.archiry-process {
  padding: 5rem 2rem;
  max-width: 56rem;
  margin: 0 auto;
}
.archiry-process-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 1px solid var(--archiry-border);
  margin-left: 1.5rem;
}
.archiry-process-stage {
  display: flex;
  gap: 1.5rem;
  padding: 2rem 0 2rem 1.5rem;
  position: relative;
  transition: background-color 350ms ease;
}
.archiry-process-stage--hovered {
  background: color-mix(in srgb, var(--tmpl-accent) 3%, transparent);
}
.archiry-process-stage__num {
  font-family: var(--tmpl-font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 500;
  font-style: italic;
  line-height: 1;
  flex-shrink: 0;
  min-width: 3rem;
}
.archiry-process-stage__body {
  flex: 1;
}
.archiry-process-stage__title {
  font-family: var(--tmpl-font-display);
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  margin: 0 0 0.25rem;
}
.archiry-process-stage__weeks {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin: 0 0 0.75rem;
}
.archiry-process-stage__desc {
  font-size: 1rem;
  line-height: 1.6;
  max-width: 55ch;
  margin: 0;
  opacity: 0.75;
}
.archiry-process-stage__deliverables {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.archiry-process-stage__deliverables li {
  font-size: 11px;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--archiry-border);
  border-radius: 6px;
  color: var(--archiry-ink-mute);
}
.archiry-process-footer {
  font-size: 11px;
  text-align: left;
  color: var(--archiry-ink-mute);
  margin: 3rem 0 1rem;
  max-width: 60ch;
  letter-spacing: 0.04em;
}
.archiry-process-note {
  font-style: italic;
  font-size: 0.875rem;
  text-align: left;
  max-width: 50ch;
  opacity: 0.65;
}

/* ============================================================
   TEAM
   ============================================================ */
.archiry-team {
  padding: 5rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
}
.archiry-team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--archiry-border);
  border: 1px solid var(--archiry-border);
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .archiry-team-grid { grid-template-columns: repeat(5, 1fr); }
}
.archiry-team-card {
  padding: 1.5rem;
  background: var(--tmpl-bg);
  text-align: center;
  transition: background-color 350ms ease;
  cursor: default;
}
.archiry-team-card--hovered {
  background: var(--archiry-paper-2);
}
.archiry-team-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 1rem;
}
.archiry-team-card__name {
  font-size: 1.0625rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  letter-spacing: -0.01em;
}
.archiry-team-card__role {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin: 0;
}
.archiry-team-card__bio {
  font-style: italic;
  font-size: 0.875rem;
  line-height: 1.4;
  max-width: 28ch;
  margin: 0.5rem auto 0;
  opacity: 0.7;
}
.archiry-team-footer {
  font-style: italic;
  font-size: 0.875rem;
  text-align: left;
  max-width: 50ch;
  opacity: 0.65;
}

/* ============================================================
   RECOGNITION
   ============================================================ */
.archiry-recognition {
  padding: 5rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
}
.archiry-recog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--archiry-border);
  border: 1px solid var(--archiry-border);
}
@media (min-width: 768px) {
  .archiry-recog-grid { grid-template-columns: repeat(4, 1fr); }
}
.archiry-recog-tile {
  padding: 1.25rem;
  background: var(--tmpl-bg);
  transition: background-color 350ms ease;
  cursor: default;
}
.archiry-recog-tile--hovered {
  background: var(--archiry-paper-2);
}
.archiry-recog-tile__pub {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  transition: color 350ms ease;
}
.archiry-recog-tile--hovered .archiry-recog-tile__pub {
  color: var(--tmpl-fg);
}
.archiry-recog-tile__award {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tmpl-accent);
  margin: 0 0 0.15rem;
}
.archiry-recog-tile__year {
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--archiry-ink-mute);
  margin: 0 0 0.5rem;
}
.archiry-recog-tile__project {
  font-style: italic;
  font-size: 0.875rem;
  opacity: 0.7;
  margin: 0;
}

/* ============================================================
   PRESS
   ============================================================ */
.archiry-press {
  padding: 5rem 2rem;
  max-width: 56rem;
  margin: 0 auto;
}
.archiry-press-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--archiry-border);
}
.archiry-press-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--archiry-border);
  align-items: baseline;
  transition: color 250ms ease;
}
@media (max-width: 767px) {
  .archiry-press-row { grid-template-columns: 1fr; gap: 0.25rem; }
}
.archiry-press-row:hover {
  color: var(--tmpl-fg);
}
.archiry-press-row__pub {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
}
.archiry-press-row__headline {
  font-size: 1rem;
  line-height: 1.4;
}
.archiry-press-row__year {
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--archiry-ink-mute);
  text-align: right;
}

/* ============================================================
   CONTACT
   ============================================================ */
.archiry-contact {
  padding: 5rem 2rem;
  max-width: 80rem;
  margin: 0 auto;
}
.archiry-contact__sub {
  font-size: clamp(1.0625rem, 1.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 32ch;
  margin: -1.5rem 0 3rem;
  opacity: 0.7;
}
.archiry-contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 768px) {
  .archiry-contact-grid { grid-template-columns: 7fr 5fr; }
}
.archiry-budget {
  margin-top: 1.5rem;
}
.archiry-budget__label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}
.archiry-budget__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.archiry-contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.archiry-contact-info__label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--archiry-ink-mute);
  margin: 0 0 0.25rem;
}
.archiry-contact-info__value {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* ============================================================
   SKIP LINK
   ============================================================ */
.skip-link:focus {
  position: fixed !important;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  padding: 0.75rem 1rem;
  background: var(--tmpl-fg);
  color: var(--tmpl-bg);
  border-radius: 6px;
  font-size: 14px;
}
</style>
