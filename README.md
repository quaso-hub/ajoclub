# AjoClub

[![Stack](https://img.shields.io/badge/stack-Nuxt.js%203%20%2F%20TypeScript-111827?style=for-the-badge)](#teknologi)
[![License](https://img.shields.io/badge/license-proprietary-7f1d1d?style=for-the-badge)](#lisensi)

Agensi digital. Kami bikin landing page, aplikasi SaaS, dan mobile app.

## Teknologi

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Nuxt.js 3 | 3.21.x |
| Bahasa | TypeScript | 5.8.x |
| CSS | Tailwind CSS | 3.4.x |
| Komponen | @nuxt/ui | 3.1.x |
| State | Pinia | 3.0.x |
| 3D | Three.js | 0.175.x |
| Animasi | GSAP | 3.13.x |
| ORM | Prisma | 6.19.x |
| Database | PostgreSQL | 15+ |
| Backend | Nitro (built-in) | - |
| Container | Docker + Docker Compose | - |
| CDN | Cloudflare | free tier |

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
  composables/         Logic berbagi (Three.js, GSAP)
  server/api/          Endpoint backend
  prisma/              Schema database
  pages/               Halaman routing
  layouts/             Layout shell
  assets/css/          Global style
  app.config.ts        Konfigurasi tema @nuxt/ui
docker/
  Dockerfile           Multi-stage production build
  docker-compose.yml   Development lokal
  docker-compose.prod.yml  Deploy produksi
docs/
  business/            Layanan, pricing, positioning
  product/             Scope, roadmap, delivery
  technical/           Arsitektur, infrastruktur, stack
```

## Fitur

- Hero 3D partikel dengan Three.js (2000 partikel, mouse-reactive)
- Animasi scroll GSAP (fade-up, stagger, parallax)
- Form kontak dengan backend SQLite (Prisma ORM)
- Responsive design (mobile/tablet/desktop)
- Dark theme dengan typography premium (Inter + JetBrains Mono)

## Development

```bash
# Database
npx prisma db push      # Buat/update database lokal
npx prisma studio       # Browse database

# Build
npm run build           # Build produksi
npm run preview         # Preview build produksi

# Testing
npx vitest              # Unit tests
npx playwright test     # E2E tests
```

## Docker

```bash
# Lokal
docker compose -f docker/docker-compose.yml up -d

# Produksi
docker compose -f docker/docker-compose.prod.yml up -d
```

## Dokumentasi

| Dokumen | Lokasi |
|---------|--------|
| Bisnis | `docs/business/` |
| Produk | `docs/product/` |
| Teknis | `docs/technical/` |

## Arsitektur

```
[Cloudflare DNS/CDN]
        │
        ▼
[VPS: App Server] ─── 4 vCPU / 8GB RAM / 160GB NVMe
  ├── Docker
  │   ├── Nginx Proxy Manager (routing + SSL)
  │   ├── Portainer (monitoring)
  │   ├── Container: Client A (Nuxt SSR)
  │   ├── Container: Client B (Nuxt SSR)
  │   ├── Container: Static Sites (Nginx)
  │   └── Container: Backend API (jika perlu)
  └── Ubuntu Server 24.04 LTS minimal CLI

[Supabase / Neon] ─── PostgreSQL (free tier)
  ├── Auth (JWT + RBAC)
  ├── Storage (file upload)
  └── Database (multitenancy dengan tenant_id)
```

## Roadmap

| Fase | Tujuan | Status |
|------|--------|--------|
| 0. Foundation | Repo, Docker, Nuxt scaffold, landing page | Aktif |
| 1. Design System | Tailwind config, komponen library, typography | Rencana |
| 2. Client Pertama | Deploy static site sebagai proof of concept | Rencana |
| 3. SaaS Foundation | Auth, RBAC, database, multitenancy | Rencana |
| 4. Mobile | Capacitor.js integrasi, Android build | Rencana |
| 5. Scale | Multi-client, monitoring, otomasi | Nanti |

## Tim

| Role | Fokus |
|------|-------|
| Frontend | Vue.js, Nuxt.js, Tailwind CSS, UI/UX |
| Backend | Nitro, NestJS, API design, database |
| DevOps | Docker, VPS, CI/CD, monitoring |
| Design / Client | Hubungan klien, desain, manajemen project |

## Kontribusi

- Branch: `feat/web-foundation`, `fix/auth-bug`
- PR: satu fitur per PR
- Commit: `feat:`, `fix:`, `docs:`, `chore:`
- Bahasa: TypeScript di mana-mana
- Rahasia: jangan pernah masuk git

## Lisensi

Proprietary. Tidak ada lisensi open-source.
