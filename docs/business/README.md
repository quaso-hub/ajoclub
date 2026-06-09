# Business Documentation

Positioning, services, and operational notes for AjoClub.

## About

AjoClub is a 4-person digital agency. We build websites, web apps, mobile apps, and SaaS platforms for clients. Our stack is unified around TypeScript, which lets us deliver fast across frontend, backend, and mobile.

## Services

### Web Development

- Landing pages and marketing sites
- Company profiles and corporate websites
- E-commerce storefronts
- Content management systems

### Application Development

- SaaS platforms with multi-tenant architecture
- Dashboard and analytics tools
- Internal business tools
- API development and integration

### Mobile Development

- Hybrid mobile apps (Android + iOS from single codebase)
- Progressive Web Apps (installable, offline-capable)
- Push notifications and native feature access

### Infrastructure

- VPS setup and management
- Docker containerization
- Domain and SSL configuration
- CDN and security (Cloudflare)

## Pricing Model

| Service | Approach |
|---------|----------|
| Landing Page | Fixed price, based on complexity |
| Company Profile | Fixed price, includes CMS if needed |
| SaaS MVP | Scoped per project, phased delivery |
| Mobile App | Per-project, shares codebase with web |
| Maintenance | Monthly retainer |

## Operating Model

```
Client Brief
    |
    v
Scope & Estimate
    |
    v
Design & Build (Nuxt.js + TypeScript)
    |
    v
Deploy (Docker on DigitalOcean VPS)
    |
    v
Domain + SSL + Cloudflare
    |
    v
Handoff & Maintenance
```

## Infrastructure Budget

- Total credits: $800 (4 x $200 GitHub Student Developer Pack)
- Strategy: relay one account at a time (~22 months free)
- Monthly burn: ~$60/month (VPS $48 + DB $12 or free tier)
- No upfront cost during development phase

## Team

| Role | Focus |
|------|-------|
| Frontend | Vue.js, Nuxt.js, Tailwind CSS, UI/UX |
| Backend | Nitro, NestJS, API design, database |
| DevOps | Docker, VPS, CI/CD, monitoring |
| Design / Client | Client relations, design, project management |

## Working Agreements

- Conventional commits: feat:, fix:, docs:, chore:
- One feature per PR
- TypeScript everywhere
- No secrets in git
- Client stacks can vary; AjoClub default is Nuxt.js
