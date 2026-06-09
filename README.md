# AjoClub

[![Stack](https://img.shields.io/badge/stack-Nuxt.js%203%20%2F%20TypeScript-111827?style=for-the-badge)](#stack)
[![License](https://img.shields.io/badge/license-proprietary-7f1d1d?style=for-the-badge)](#license)
[![Last Commit](https://img.shields.io/github/last-commit/quaso-hub/ajoclub?style=for-the-badge&color=0f766e)](https://github.com/quaso-hub/ajoclub/commits)

Digital agency. We build landing pages, SaaS apps, and mobile experiences.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Nuxt.js 3 | 3.17.x |
| UI Library | Vue.js | 3.5.x |
| Language | TypeScript | 5.8.x |
| CSS | Tailwind CSS | 3.4.x |
| Components | @nuxt/ui | 3.1.x |
| State | Pinia | 3.0.x |
| 3D | Three.js | 0.175.x |
| Animation | GSAP | 3.13.x |
| ORM | Prisma | 6.9.x |
| Database | SQLite (dev) / PostgreSQL (prod) | - |
| Backend | Nitro (built-in) | - |
| Containers | Docker + Docker Compose | - |
| CDN | Cloudflare | free tier |

## Quick Start

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000.

## Project Structure

```
apps/web/
  components/          Vue components
  composables/         Shared logic (Three.js, GSAP)
  server/api/          Backend API endpoints
  prisma/              Database schema
  pages/               Route pages
  layouts/             Page layouts
  assets/css/          Global styles
docker/
  Dockerfile           Multi-stage production build
  docker-compose.yml   Local development
  docker-compose.prod.yml  Production deployment
docs/
  business/            Services, pricing, positioning
  product/             Scope, roadmap, delivery notes
  technical/           Architecture, infrastructure, stack
```

## Features

- 3D particle hero with Three.js (mouse-reactive, 2000 particles)
- GSAP scroll animations (fade-up, stagger, parallax, text reveal)
- Contact form with SQLite backend (Prisma ORM)
- Responsive design (mobile/tablet/desktop)
- Dark theme with premium typography (Inter + JetBrains Mono)

## Development

```bash
# Database
npx prisma db push      # Create local database
npx prisma studio       # Browse database

# Build
npm run build           # Production build
npm run preview         # Preview production build
```

## Docker

```bash
# Local
docker compose -f docker/docker-compose.yml up -d

# Production
docker compose -f docker/docker-compose.prod.yml up -d
```

## Documentation

| Document | Location |
|----------|----------|
| Business | `docs/business/` |
| Product | `docs/product/` |
| Technical | `docs/technical/` |

## License

Private. No open-source license.
