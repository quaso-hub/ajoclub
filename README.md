# AjoClub

[![Stack](https://img.shields.io/badge/stack-Nuxt.js%203%20+%20TypeScript-111827?style=for-the-badge)](#teknologi)
[![License](https://img.shields.io/badge/license-proprietary-7f1d1d?style=for-the-badge)](#lisensi)
[![GitHub last commit](https://img.shields.io/github/last-commit/quaso-hub/ajoclub?style=for-the-badge&color=0f766e)](https://github.com/quaso-hub/ajoclub/commits)

Agensi digital 4 orang. Kami bikin landing page, SaaS, dan mobile app.

## Teknologi

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Nuxt.js 3 | 3.21.x |
| UI Library | @nuxt/ui | 3.3.x |
| CSS | Tailwind CSS | 4.3.x |
| Bahasa | TypeScript | 5.8.x |
| 3D | Three.js + GSAP | 0.175.x / 3.13.x |
| ORM | Prisma | 6.19.x |
| Database | SQLite (dev) / PostgreSQL (prod) | - |
| Testing | Vitest | 4.1.x |
| Container | Docker | 24+ |

## Fitur

- **3D Hero**: Three.js partikel sphere (3000 partikel) + UnrealBloomPass post-processing + GSAP scroll-driven animasi
- **Dark/Light Mode**: Auto-detect system preference + manual toggle (sun/moon icon)
- **Glassmorphism Cards**: Backdrop-blur + semi-transparent backgrounds
- **GSAP ScrollTrigger**: Stagger reveals, batch animations, content fade on scroll
- **Form Validation**: Valibot schema + @nuxt/ui UForm
- **Security**: Rate limiting, security headers (CSP, HSTS), CORS restriction, Prisma singleton
- **Testing**: Vitest unit tests (6/6 pass)

## Mulai Development

```bash
cd apps/web
npm install
npm run dev
```

Buka http://localhost:3000.

## Struktur Project

```
apps/web/
  components/          Komponen Vue (auto-import)
    Hero3D.vue         Three.js 3D hero + bloom + scroll
    Navbar.vue         Navigasi + ThemeToggle
    ServicesSection.vue  Glassmorphism service cards
    WorkSection.vue    Project portfolio cards
    AboutSection.vue   Stats + principles
    ContactSection.vue Form kontak + info
    FooterSection.vue  Footer dengan scroll links
    ThemeToggle.vue    Dark/light mode toggle
  composables/         Logic berbagi
    useThreeScene.ts   Three.js scene + bloom + particles
    useGsapScroll.ts   GSAP ScrollTrigger utilities
  server/
    api/               Endpoint backend (health, contact, contacts)
    middleware/         Security headers, rate limiting
    utils/             Prisma singleton, auth helpers
  prisma/              Schema database (Contact, User, Project)
  tests/               Vitest unit tests
  assets/css/          Global styles + glassmorphism utilities
```

## Testing

```bash
npm run test          # Run semua test
npm run test:watch    # Watch mode
```

## Docker

```bash
docker compose -f docker/docker-compose.yml up -d        # Lokal
docker compose -f docker/docker-compose.prod.yml up -d    # Produksi
```

## Dokumentasi

| Dokumen | Lokasi |
|---------|--------|
| Bisnis | `docs/business/` |
| Produk | `docs/product/` |
| Teknis | `docs/technical/` |

## Lisensi

Proprietary. Tidak ada lisensi open-source.
