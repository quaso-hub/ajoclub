# Dokumentasi Produk

Scope, roadmap, dan catatan delivery AjoClub.

## Apa yang Kami Bangun

| Tipe Produk | Pendekatan Teknis | Target |
|-------------|------------------|--------|
| Landing Page | Nuxt SSG (static export) | UMKM, startup |
| Company Profile | Nuxt SSG + CMS | Perusahaan |
| SaaS Application | Nuxt SSR + Supabase | Startup, enterprise |
| PWA | Nuxt + @vite-pwa/nuxt | Klien yang butuh installable app |
| Mobile App | Nuxt + Capacitor.js | Klien yang butuh Android/iOS |

## Pendekatan Teknis Per Produk

### Landing Page / Company Profile

- Build dengan `nuxt generate` (SSG)
- Output: file HTML/CSS/JS statis
- Host di satu container Nginx (50+ site, ~30MB RAM total)
- Custom domain per klien via Nginx Proxy Manager
- Auto SSL via Let's Encrypt
- Target load time: < 1 detik

### SaaS Application

- Build dengan `nuxt build` (SSR)
- Setiap SaaS dapat container Docker sendiri
- Limit RAM per container: 256-512MB
- Auth: Supabase Auth (JWT di HttpOnly cookies)
- RBAC: role-based access control
- Database: PostgreSQL via Supabase/Neon
- Multitenancy: isolasi `tenant_id`

### Mobile App

- Build Nuxt app seperti biasa
- Wrap dengan Capacitor.js
- Output: Android APK/IPA
- Akses fitur native: kamera, GPS, push notifications
- Single codebase untuk web + mobile

### PWA

- Install modul @vite-pwa/nuxt
- Konfigurasi service worker
- Aktifkan offline caching
- Bisa diinstall di HP tanpa app store

## Roadmap

| Fase | Tujuan | Status |
|------|--------|--------|
| 0. Foundation | Repo, Docker, Nuxt scaffold, landing page | Aktif |
| 1. Design System | Tailwind config, komponen library, typography | Rencana |
| 2. Client Pertama | Deploy static site sebagai proof of concept | Rencana |
| 3. SaaS Foundation | Auth, RBAC, database, multitenancy | Rencana |
| 4. Mobile | Capacitor.js integrasi, Android build | Rencana |
| 5. Scale | Multi-client, monitoring, otomasi | Nanti |

## Alur Onboarding Klien

1. Brief klien -> estimasi scope
2. Desain di Figma (atau langsung kode untuk site sederhana)
3. Build dengan Nuxt.js + Tailwind CSS
4. Deploy ke container Docker di VPS
5. Konfigurasi custom domain + SSL
6. Handoff: kredensial akses, dokumentasi

## Standar Kualitas

- Skor Lighthouse: 90+ di semua metrik
- Mobile-first responsive design
- Aksesibilitas: WCAG 2.1 AA minimum
- Performa: < 2s load time untuk SSR, < 1s untuk SSG
- Keamanan: JWT HttpOnly, RBAC, HTTPS, Cloudflare proxy
