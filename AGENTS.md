# AGENTS.md — AI Agent Instructions

## Project Context
AjoClub is a 4-person digital agency building client websites and SaaS apps.
Read `.local/handoff.md` for current state before starting work.

## Tech Stack (DO NOT CHANGE without team consensus)
- **Framework:** Nuxt.js 3 (Vue 3) — NOT Next.js
- **Language:** TypeScript everywhere
- **Styling:** Tailwind CSS + Nuxt UI
- **Database:** PostgreSQL via Supabase or Neon (free tier)
- **Auth:** Supabase Auth (JWT + RBAC)
- **Mobile:** Capacitor.js (not Flutter, not React Native)
- **Container:** Docker + Docker Compose
- **OS:** Ubuntu Server 24.04 LTS minimal CLI

## Code Conventions
- Use `<script setup lang="ts">` in Vue components
- Use auto-imports (Nuxt convention) — no manual imports for Vue/Nuxt APIs
- Use `server/api/` for backend endpoints (Nitro)
- Use Prisma or Drizzle for database access
- Store JWT in HttpOnly cookies, never localStorage
- Enforce RBAC at both middleware and API level

## File Rules
- Source code goes in `apps/web/`
- Docker configs go in `docker/`
- Documentation goes in `docs/`
- Planning/memory goes in `.local/` (NEVER commit)
- Environment variables use `.env` files (NEVER commit)

## What NOT to Do
- Do not use Next.js, React, or JSX
- Do not use Flutter or React Native
- Do not store secrets in code
- Do not commit `.local/` directory
- Do not use Kubernetes (Docker only for now)
- Do not install GUI panels on VPS (CLI only)
- Do not build on VPS — build locally or in CI, pull images on VPS

## Docker Conventions
- Multi-stage builds (build → production)
- Use `node:20-alpine` as base image
- Static sites: single Nginx container, multiple server blocks
- SSR apps: individual containers with `mem_limit`
- Always use `docker-compose.yml` for local dev
- Use `docker-compose.prod.yml` for VPS deployment

## When Working on Client Projects
- Each client gets own Docker container
- Use `client_id` column for multitenancy isolation
- Always filter queries by `client_id`
- Separate static sites from SSR apps
- Use Nginx Proxy Manager for domain routing

## Git Workflow
- Branch from `main`
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- One feature per PR
- Delete branches after merge

## Infrastructure Notes
- VPS is DigitalOcean Droplet ($48/mo, 8GB RAM)
- Database is external (Supabase/Neon), not on VPS
- Cloudflare handles DNS, SSL, CDN, DDoS protection
- Account relay strategy: migrate when credits deplete
- Backup: DO snapshots + pg_dump cron job
