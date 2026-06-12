<script setup lang="ts">
interface AdminPortfolioItem {
  id: string
  title: string
  slug: string
  summary: string
  status: string
  source: string
  scenePreset: string
}

definePageMeta({ layout: 'default' })

const token = ref('')
const isLoading = ref(false)
const error = ref('')
const items = ref<AdminPortfolioItem[]>([])
const form = reactive({
  title: '',
  slug: '',
  summary: '',
  source: 'INTERNAL_DEMO',
  scenePreset: 'cinematic-scroll',
})

function adminHeaders(): Record<string, string> {
  return token.value ? { 'x-admin-token': token.value } : {}
}

async function loadItems() {
  error.value = ''
  isLoading.value = true
  try {
    const response = await $fetch<{ items: AdminPortfolioItem[] }>('/api/admin/portfolio', {
      headers: adminHeaders(),
    })
    items.value = response.items
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load admin portfolio'
  }
  finally {
    isLoading.value = false
  }
}

async function createItem() {
  error.value = ''
  isLoading.value = true
  try {
    await $fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: adminHeaders(),
      body: { ...form },
    })
    form.title = ''
    form.slug = ''
    form.summary = ''
    await loadItems()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create portfolio item'
  }
  finally {
    isLoading.value = false
  }
}

async function changeStatus(id: string, action: 'publish' | 'unpublish' | 'archive') {
  error.value = ''
  isLoading.value = true
  try {
    await $fetch(`/api/admin/portfolio/${id}/${action}`, {
      method: 'POST',
      headers: adminHeaders(),
    })
    await loadItems()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : `Failed to ${action} portfolio item`
  }
  finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Portfolio Admin - AjoClub',
})
</script>

<template>
  <UContainer class="py-14">
    <div class="mb-10">
      <UBadge variant="soft" color="primary" class="mb-4">Admin / Portfolio</UBadge>
      <h1 class="text-4xl font-bold mb-4">Portfolio Manager</h1>
      <p class="text-(--ui-text-muted) max-w-2xl">
        Kelola item portfolio dinamis. Untuk production, token development ini diganti Supabase Auth session + RBAC server-side.
      </p>
    </div>

    <div class="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 items-start">
      <form class="glass-card p-6 space-y-4" @submit.prevent="createItem">
        <h2 class="font-semibold text-lg">Create draft</h2>
        <UFormField label="Admin token">
          <UInput v-model="token" type="password" placeholder="ADMIN_AUTH_TOKEN" />
        </UFormField>
        <UFormField label="Title">
          <UInput v-model="form.title" placeholder="Client launch system" required />
        </UFormField>
        <UFormField label="Slug">
          <UInput v-model="form.slug" placeholder="client-launch-system" required />
        </UFormField>
        <UFormField label="Summary">
          <UTextarea v-model="form.summary" placeholder="Short portfolio summary" required />
        </UFormField>
        <div class="grid sm:grid-cols-2 gap-3">
          <UFormField label="Source">
            <USelect
              v-model="form.source"
              :items="['TEMPLATE', 'INTERNAL_DEMO', 'CONCEPT', 'CLIENT_WORK']"
            />
          </UFormField>
          <UFormField label="Scene">
            <USelect
              v-model="form.scenePreset"
              :items="['orbit-product', 'shader-portal', 'case-timeline', 'particle-morph', 'cinematic-scroll']"
            />
          </UFormField>
        </div>
        <UButton type="submit" block :loading="isLoading">Create portfolio draft</UButton>
        <UButton type="button" variant="outline" color="neutral" block :loading="isLoading" @click="loadItems">
          Load admin items
        </UButton>
      </form>

      <div class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          title="Admin request failed"
          :description="error"
        />

        <div v-if="!items.length" class="glass-card p-8 text-center">
          <UIcon name="i-lucide-database" class="w-8 h-8 text-(--ui-primary) mx-auto mb-4" />
          <h2 class="font-semibold mb-2">No database items loaded yet</h2>
          <p class="text-sm text-(--ui-text-muted)">
            Masukkan token lalu load. Public site tetap memakai fixture portfolio sampai DB dipush/seed.
          </p>
        </div>

        <article v-for="item in items" :key="item.id" class="glass-card p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap gap-2 mb-3">
                <UBadge color="primary" variant="soft">{{ item.status }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ item.source }}</UBadge>
                <UBadge color="neutral" variant="outline">{{ item.scenePreset }}</UBadge>
              </div>
              <h2 class="font-semibold text-lg">{{ item.title }}</h2>
              <p class="text-sm text-(--ui-text-muted) mt-1">{{ item.summary }}</p>
              <p class="text-xs text-(--ui-text-muted) mt-3">/{{ item.slug }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton size="xs" @click="changeStatus(item.id, 'publish')">Publish</UButton>
              <UButton size="xs" variant="outline" color="neutral" @click="changeStatus(item.id, 'unpublish')">Draft</UButton>
              <UButton size="xs" variant="outline" color="warning" @click="changeStatus(item.id, 'archive')">Archive</UButton>
            </div>
          </div>
        </article>
      </div>
    </div>
  </UContainer>
</template>
