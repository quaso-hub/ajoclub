# Dokumentasi Teknis

Arsitektur, infrastruktur, dan keputusan teknis AjoClub.

## Stack

| Layer | Teknologi | Versi | Alasan |
|-------|-----------|-------|--------|
| Runtime | Node.js | 20 LTS | Stabil, ekosistem luas |
| Framework | Nuxt.js | 3.21.x | Vue ecosystem, opinionated, RAM lebih rendah dari Next |
| UI Library | Vue.js | 3.5.x | Reactive, composition API |
| Bahasa | TypeScript | 5.8.x | Type safety, support IDE |
| CSS | Tailwind CSS | 4.3.x | Utility-first, CSS-first config (v4) |
| Komponen | @nuxt/ui | 3.3.x | Reka UI + Tailwind Variants + dark mode |
| State | Pinia | 3.0.x | SSR-safe, DevTools, modular |
| ORM | Prisma | 6.19.x | Type-safe, migrations, multi-DB |
| Database | PostgreSQL | 15+ | JSONB, RLS, terbukti di skala besar |
| Auth | Supabase Auth | latest | JWT + RBAC + social login |
| 3D | Three.js | 0.175.x | WebGL partikel effects |
| Animasi | GSAP | 3.13.x | ScrollTrigger, production-grade |
| Testing | Vitest + Playwright | latest | Unit + E2E |
| Container | Docker | 24+ | Multi-stage builds |
| Proxy | Nginx Proxy Manager | latest | Domain routing + auto SSL |
| Monitoring | Portainer | latest | Docker dashboard |
| CDN | Cloudflare | free | DNS, SSL, DDoS, edge caching |

## Struktur Project

```
apps/web/
  app.vue              Root component (useHead, NuxtLayout, NuxtPage)
  app.config.ts        Konfigurasi tema @nuxt/ui
  nuxt.config.ts       Konfigurasi Nuxt (modules, routeRules, runtimeConfig)
  pages/               File-based routing
  components/          Auto-imported Vue components
  composables/         Auto-imported logic (useState, useFetch, custom)
  layouts/             Layout shells
  server/api/          Nitro API endpoints
  server/middleware/    Auth, headers, rate limiting
  middleware/          Client+server route middleware
  plugins/             One per cross-cutting concern
  utils/               Auto-imported pure functions
  assets/css/          CSS (processed by Vite)
  public/              Served as-is
  prisma/              Database schema + migrations
```

## Rendering Strategy

Gunakan hybrid rendering per route:

```ts
// nuxt.config.ts
routeRules: {
  '/':              { prerender: true },      // SSG - CDN cepat
  '/about':         { prerender: true },      // SSG
  '/blog/**':       { prerender: true },      // SSG
  '/dashboard/**':  { ssr: true },            // SSR - per-user
  '/admin/**':      { ssr: false },           // SPA - tidak perlu SEO
  '/api/**':        { cors: true },           // API
}
```

| Tipe Konten | Mode | Alasan |
|-------------|------|--------|
| Marketing, docs, blog | SSG (`prerender: true`) | CDN-cepat, hosting gratis |
| Product pages, news | ISR/SWR | Cukup segar, CDN-cepat |
| Dashboard, akun | SSR | Personalized, per-user |
| Admin tools | SPA (`ssr: false`) | Skip SEO, skip render cost |

## Database

### Multitenancy

Pakai shared schema + `tenant_id` di setiap tabel domain:

```prisma
model Project {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")    // wajib, NOT NULL
  name      String
  // ...
}
```

Aturan:
1. Setiap tabel domain punya `tenant_id` (NOT NULL)
2. DB trigger: error jika `tenant_id IS NULL` saat INSERT
3. App middleware: `SET LOCAL app.tenant_id = :tenantId` per request
4. Setiap query includes `WHERE tenant_id = :tenantId`

### Soft Delete

```prisma
model Project {
  // ...
  deletedAt DateTime? @map("deleted_at")
}
```

- Filter default: `WHERE deleted_at IS NULL`
- Partial index: `CREATE INDEX ... ON projects(id) WHERE deleted_at IS NULL`
- Retention: hard delete setelah 30-90 hari tergantung tipe data

### Connection Pooling

- Supabase: pakai Supavisor di port 6543 (bukan 5432)
- Pool size: 15-20 untuk 8GB RAM VPS
- Prisma: `connection_limit = 10` per instance

## Security

### JWT

- Access token: 15 menit, HttpOnly cookie
- Refresh token: 7 hari, HttpOnly + SameSite=Strict
- Rotation: setiap refresh generate token baru
- Reuse detection: jika token yang sudah dipakai dipresentasikan, revoke seluruh family

### RBAC

- Role: Owner > Admin > Manager > Member
- Permission: granular key (e.g., `invoice:read`, `user:invite`)
- Tenant isolation: `tenant_id` di setiap query

### Security Headers

```ts
// server/middleware/security.ts
setResponseHeaders(event, {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
})
```

## Testing

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest | Composables, utils, validators |
| Component | Vue Test Utils + Vitest | Komponen kritis |
| Integration | Vitest + Supertest | API routes |
| E2E | Playwright | User flows |
| Visual | Playwright screenshots | Layout regression |
| Performance | Lighthouse CI | Core Web Vitals |

Prioritas test:
1. Input validation (Zod schemas)
2. Auth flows (login, refresh, logout)
3. Data access (tenant isolation, CRUD)
4. Critical user flows (contact form, project creation)
5. Components (hanya yang kompleks)

## Docker

### Multi-stage Build

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nuxt build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001
COPY --from=build --chown=nuxt:nodejs /app/.output ./.output
USER nuxt
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Health Check

```ts
// server/api/health.get.ts
export default defineEventHandler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}))
```

## Keputusan Teknis

| Keputusan | Alasan |
|-----------|--------|
| Nuxt.js over Next.js | RAM lebih rendah, SSG lebih baik, convention over configuration |
| Capacitor over Flutter | Single codebase, tidak perlu native overhead |
| Docker over K8s | K8s terlalu mahal untuk free credits |
| External DB | Hemat RAM VPS, free tier cukup |
| GSAP over Framer Motion | Scroll-driven animations lebih baik, framework agnostic |
| Shared schema multitenancy | Biaya terendah, cukup untuk <10k tenant |
| Soft delete + retention | Bisa restore, compliance-friendly |
