# AjoClub

[![Workspace](https://img.shields.io/badge/workspace-private-101827?style=for-the-badge)](#)
[![Stage](https://img.shields.io/badge/stage-foundation-14532d?style=for-the-badge)](#roadmap)
[![Stack](https://img.shields.io/badge/stack-Nuxt.js%20%2F%20TypeScript-111827?style=for-the-badge)](#technical-base)
[![License](https://img.shields.io/badge/license-proprietary-7f1d1d?style=for-the-badge)](#license)
[![Last Commit](https://img.shields.io/github/last-commit/quaso-hub/ajoclub?style=for-the-badge&color=0f766e)](https://github.com/quaso-hub/ajoclub/commits)
[![Contributors](https://img.shields.io/github/contributors/quaso-hub/ajoclub?style=for-the-badge&color=334155)](#contributors)

AjoClub is a private digital agency workspace. We build landing pages, company
profiles, SaaS applications, PWAs, and hybrid mobile apps for clients using a
unified TypeScript stack.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build for production
pnpm build

# Docker
docker compose up -d
```

## Technical Base

| Area | Choice |
| --- | --- |
| Framework | Nuxt.js 3 (Vue 3) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Nuxt UI |
| State | Pinia |
| Backend | Nitro (built-in) or NestJS |
| Database | PostgreSQL via Supabase or Neon |
| ORM | Prisma or Drizzle |
| Auth | Supabase Auth (JWT + RBAC) |
| Mobile | Capacitor.js |
| PWA | @vite-pwa/nuxt |
| Containers | Docker + Docker Compose |
| Reverse Proxy | Nginx Proxy Manager |
| Monitoring | Portainer |
| CDN/Security | Cloudflare |
| OS | Ubuntu Server 24.04 LTS |

## Repository Shape

```txt
ajoclub/
  apps/
    web/                    main Nuxt.js application
  packages/
    ui/                     shared interface primitives
    config/                 shared tooling config
  docker/
    Dockerfile              multi-stage production build
    docker-compose.yml      local development stack
    docker-compose.prod.yml production deployment
  docs/
    business/               positioning, offers, pricing notes
    product/                roadmap, flows, milestones
    technical/              architecture, deployment, decisions
    assets/                 README visuals and documentation media
  AGENTS.md                 AI agent instructions
  README.md
```

## Docker

### Development

```bash
docker compose up -d
```

### Production (DigitalOcean VPS)

```bash
# Pull pre-built image
docker pull quasohub/ajoclub-web:latest

# Run with docker-compose
docker compose -f docker-compose.prod.yml up -d
```

### Multi-Client Hosting

Each client site runs in its own container with resource limits:

```yaml
# Example: Client SaaS container
services:
  client-saas:
    image: quasohub/client-app:latest
    mem_limit: 512m
    cpus: 1.0
    networks:
      - proxy
```

Static sites share a single Nginx container (50+ sites, ~30MB RAM).

## Architecture

```txt
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
  │   └── Container: Backend API (if needed)
  └── Ubuntu Server 24.04 LTS minimal CLI

[Supabase / Neon] ─── PostgreSQL (free tier)
  ├── Auth (JWT + RBAC)
  ├── Storage (file uploads)
  └── Database (multitenancy with client_id)
```

## Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| 0. Foundation | Repo setup, Docker, Nuxt scaffold | Active |
| 1. Web foundation | Base layout, routing, design system | Planned |
| 2. First client | Static site deployment proof of concept | Planned |
| 3. SaaS foundation | Auth, RBAC, database, multitenancy | Planned |
| 4. Mobile | Capacitor.js integration, Android build | Planned |
| 5. Scale | Multiple clients, monitoring, automation | Later |

## Documentation

| Document | Location |
| --- | --- |
| Business context | `docs/business/` |
| Product scope | `docs/product/` |
| Technical notes | `docs/technical/` |
| AI agent rules | `AGENTS.md` |

## Contributors

[![AjoClub contributors](https://contrib.rocks/image?repo=quaso-hub/ajoclub)](https://github.com/quaso-hub/ajoclub/graphs/contributors)

Maintained by [`quaso-hub`](https://github.com/quaso-hub).

## Working Agreements

| Topic | Agreement |
| --- | --- |
| Branches | Short names: `feat/web-foundation`, `fix/auth-bug` |
| PRs | One feature per PR |
| Language | TypeScript everywhere |
| Commits | Conventional commits (`feat:`, `fix:`, `docs:`) |
| Secrets | Never in Git. Use `.env` files. |
| Client stacks | Can vary. AjoClub default is Nuxt.js. |

## License

Private proprietary project. No open-source license is assigned.
