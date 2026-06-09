# Dokumentasi Bisnis

Positioning, layanan, dan catatan operasional AjoClub.

## Tentang

AjoClub adalah agensi digital 4 orang. Kami bikin website, web app, mobile app, dan platform SaaS untuk klien. Stack kami terunifikasi di sekitar TypeScript, yang memungkinkan delivery cepat di frontend, backend, dan mobile.

## Layanan

### Web Development

- Landing page dan marketing site
- Company profile dan website corporate
- E-commerce storefront
- Content management systems

### Application Development

- Platform SaaS dengan arsitektur multi-tenant
- Dashboard dan analytics tools
- Internal business tools
- API development dan integrasi

### Mobile Development

- Hybrid mobile apps (Android + iOS dari single codebase)
- Progressive Web Apps (installable, offline-capable)
- Push notifications dan akses fitur native

### Infrastructure

- Setup dan manajemen VPS
- Docker containerization
- Domain dan SSL configuration
- CDN dan keamanan (Cloudflare)

## Model Pricing

| Layanan | Pendekatan |
|---------|-----------|
| Landing Page | Harga tetap, berdasarkan kompleksitas |
| Company Profile | Harga tetap, termasuk CMS jika perlu |
| SaaS MVP | Per-project, phased delivery |
| Mobile App | Per-project, share codebase dengan web |
| Maintenance | Retainer bulanan |

## Model Operasional

```
Brief Klien
    │
    ▼
Scope & Estimasi
    │
    ▼
Desain & Build (Nuxt.js + TypeScript)
    │
    ▼
Deploy (Docker di DigitalOcean VPS)
    │
    ▼
Domain + SSL + Cloudflare
    │
    ▼
Handoff & Maintenance
```

## Budget Infrastruktur

- Total kredit: $800 (4 x $200 GitHub Student Developer Pack)
- Strategi: relay satu akun sekaligus (~22 bulan gratis)
- Burn bulanan: ~$60/bulan (VPS $48 + DB $12 atau free tier)
- Tanpa biaya di muka selama fase development

## Tim

| Role | Fokus |
|------|-------|
| Frontend | Vue.js, Nuxt.js, Tailwind CSS, UI/UX |
| Backend | Nitro, NestJS, API design, database |
| DevOps | Docker, VPS, CI/CD, monitoring |
| Desain / Client | Hubungan klien, desain, manajemen project |

## Working Agreements

- Conventional commits: feat:, fix:, docs:, chore:
- Satu fitur per PR
- TypeScript di mana-mana
- Rahasia tidak boleh masuk git
- Stack klien bisa bervariasi; default AjoClub adalah Nuxt.js
