const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'cookie',
  },

  app: {
    head: {
      title: 'AjoClub - Jasa Bikin Website',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Jasa bikin website: landing page, company profile, SaaS, dashboard. Satu tim, satu stack.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  routeRules: {
    '/': { ssr: true },
    '/api/**': { cors: true },
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      // Allow Prisma in dev
    },
  },

  runtimeConfig: {
    databaseUrl: env.DATABASE_URL,
    supabaseUrl: env.SUPABASE_URL || '',
    supabaseAnonKey: env.SUPABASE_ANON_KEY || '',
    adminAuthToken: env.ADMIN_AUTH_TOKEN || '',
    adminEmail: env.ADMIN_EMAIL || '',
    public: {
      appName: env.NUXT_PUBLIC_APP_NAME || 'AjoClub',
      whatsappPhone: env.NUXT_PUBLIC_WHATSAPP_PHONE || '6285188627365',
    },
  },
})
