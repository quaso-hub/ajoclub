# Product Documentation

Scope, roadmap, and delivery notes for AjoClub.

## What We Build

| Product Type | Tech Approach | Target |
|-------------|--------------|--------|
| Landing Pages | Nuxt SSG (static export) | SMBs, startups |
| Company Profiles | Nuxt SSG + CMS | Corporate clients |
| SaaS Applications | Nuxt SSR + Supabase | Startups, enterprises |
| PWA | Nuxt + @vite-pwa/nuxt | Any client needing installable app |
| Mobile Apps | Nuxt + Capacitor.js | Clients needing Android/iOS |

## Technical Approach Per Product

### Landing Pages / Company Profiles

- Build with `nuxt generate` (SSG)
- Output: static HTML/CSS/JS files
- Host in single Nginx container (50+ sites, ~30MB RAM total)
- Custom domain per client via Nginx Proxy Manager
- Auto SSL via Let's Encrypt
- Load time target: < 1 second

### SaaS Applications

- Build with `nuxt build` (SSR)
- Each SaaS gets own Docker container
- RAM limit per container: 256-512MB
- Auth: Supabase Auth (JWT in HttpOnly cookies)
- RBAC: role-based access control
- Database: PostgreSQL via Supabase/Neon
- Multitenancy: `client_id` column isolation

### Mobile Apps

- Build Nuxt app normally
- Wrap with Capacitor.js
- Output: Android APK/IPA
- Access native features: camera, GPS, push notifications
- Single codebase for web + mobile

### PWA

- Install @vite-pwa/nuxt module
- Configure service worker
- Enable offline caching
- Installable on mobile without app store

## Roadmap

| Phase | Goal | Status |
|-------|------|--------|
| 0. Foundation | Repo, Docker, Nuxt scaffold, landing page | Active |
| 1. Design System | Tailwind config, component library, typography | Planned |
| 2. First Client | Deploy static site as proof of concept | Planned |
| 3. SaaS Foundation | Auth, RBAC, database, multitenancy | Planned |
| 4. Mobile | Capacitor.js integration, Android build | Planned |
| 5. Scale | Multiple clients, monitoring, automation | Later |

## Client Onboarding Flow

1. Client brief -> scope estimate
2. Design in Figma (or direct to code for simple sites)
3. Build with Nuxt.js + Tailwind CSS
4. Deploy to VPS Docker container
5. Configure custom domain + SSL
6. Handoff: access credentials, documentation

## Quality Standards

- Lighthouse score: 90+ on all metrics
- Mobile-first responsive design
- Accessibility: WCAG 2.1 AA minimum
- Performance: < 2s load time for SSR, < 1s for SSG
- Security: JWT HttpOnly, RBAC, HTTPS, Cloudflare proxy
