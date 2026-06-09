# Technical Documentation

Architecture, infrastructure, and deployment decisions for AjoClub.

## Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Nuxt.js | 3.17.x |
| UI Library | Vue.js | 3.5.x |
| Language | TypeScript | 5.8.x |
| CSS | Tailwind CSS | 3.4.x |
| Component Lib | @nuxt/ui | 3.1.x |
| State | Pinia | 3.0.x |
| ORM | Prisma | 6.9.x |
| Database | SQLite (dev) / PostgreSQL (prod) | - |
| 3D | Three.js | 0.175.x |
| Animation | GSAP + ScrollTrigger | 3.13.x |
| Container | Docker | 24+ |
| Reverse Proxy | Nginx Proxy Manager | latest |
| Monitoring | Portainer | latest |
| CDN/Security | Cloudflare | free tier |

## Project Structure

```
apps/web/
  components/          Vue components (auto-imported)
    Hero3D.vue         Three.js particle sphere hero
    Navbar.vue         Sticky navigation with scroll effects
    ServicesSection.vue
    WorkSection.vue
    AboutSection.vue
    ContactSection.vue
    FooterSection.vue
  composables/         Vue composables (auto-imported)
    useThreeScene.ts   Three.js scene management
    useGsapScroll.ts   GSAP ScrollTrigger utilities
  server/api/          Nitro API endpoints
    contact.post.ts    Contact form submission
    contacts.get.ts    List contacts
  prisma/
    schema.prisma      Database schema
  assets/css/
    main.css           Global styles + Tailwind
  pages/
    index.vue          Landing page
  layouts/
    default.vue        Default layout
```

## Infrastructure

### Development

```bash
npm install
npm run dev         # http://localhost:3000
```

### Production (DigitalOcean VPS)

- VPS: 4 vCPU / 8GB RAM / 160GB NVMe ($48/mo)
- OS: Ubuntu Server 24.04 LTS minimal CLI
- Docker multi-container: app + Nginx Proxy Manager + Portainer
- Database: Supabase or Neon (free tier), not on VPS
- CDN: Cloudflare proxy (free)

### Docker

```bash
# Local
docker compose -f docker/docker-compose.yml up -d

# Production
docker compose -f docker/docker-compose.prod.yml up -d
```

## Database

### Local Development (SQLite)

```bash
npx prisma db push    # Create/update local database
npx prisma studio     # Open database browser
```

### Production (PostgreSQL)

Use Supabase or Neon free tier. Update DATABASE_URL in .env.

## Key Decisions

- Nuxt.js over Next.js: lower RAM usage, better SSG, opinionated conventions
- Capacitor.js over Flutter/RN: single codebase, no native overhead
- Docker over K8s: K8s too expensive for free credits
- External DB: saves VPS RAM, free tier sufficient
- GSAP over Framer Motion: better scroll-driven animations, framework agnostic
