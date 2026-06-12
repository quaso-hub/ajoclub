<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Kelola Portfolio - AjoClub Admin',
})

const { data: portfolioData, refresh, status: portfolioStatus } = await useFetch('/api/admin/portfolio')
const { data: categoriesData } = await useFetch('/api/admin/categories')
const { data: templatesData } = await useFetch('/api/admin/templates')

const items = computed(() => portfolioData.value?.items || [])
const categories = computed(() => categoriesData.value?.categories || [])
const templates = computed(() => templatesData.value?.templates || [])

const isCreating = ref(false)
const newItem = ref({
  title: '',
  slug: '',
  summary: '',
  categoryId: '',
  templateId: '',
})

async function createDraft() {
  if (!newItem.value.title || !newItem.value.slug || !newItem.value.summary) return

  isCreating.value = true
  try {
    await $fetch('/api/admin/portfolio', {
      method: 'POST',
      body: {
        title: newItem.value.title,
        slug: newItem.value.slug,
        summary: newItem.value.summary,
        categoryId: newItem.value.categoryId || undefined,
        templateId: newItem.value.templateId || undefined,
      },
    })
    newItem.value = { title: '', slug: '', summary: '', categoryId: '', templateId: '' }
    await refresh()
  }
  catch (e) {
    console.error('Create failed:', e)
  }
  finally {
    isCreating.value = false
  }
}

async function publishItem(id: string) {
  await $fetch(`/api/admin/portfolio/${id}/publish`, { method: 'POST' })
  await refresh()
}

async function unpublishItem(id: string) {
  await $fetch(`/api/admin/portfolio/${id}/unpublish`, { method: 'POST' })
  await refresh()
}

async function archiveItem(id: string) {
  await $fetch(`/api/admin/portfolio/${id}/archive`, { method: 'POST' })
  await refresh()
}

async function deleteItem(id: string) {
  if (!confirm('Hapus portfolio ini?')) return
  await $fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
  await refresh()
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <header class="border-b border-zinc-800">
      <UContainer class="h-14 sm:h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/admin" class="text-base sm:text-lg font-bold">AjoClub</NuxtLink>
          <UBadge variant="soft" color="primary" size="sm">Portfolio</UBadge>
        </div>
        <UButton variant="ghost" color="neutral" size="sm" to="/admin" icon="i-lucide-arrow-left">
          Kembali
        </UButton>
      </UContainer>
    </header>

    <main class="py-8 sm:py-12">
      <UContainer>
        <!-- Create form -->
        <div class="rounded-xl border border-zinc-800 p-5 sm:p-6 mb-8">
          <h2 class="text-lg font-semibold mb-4 text-white">Buat Portfolio Baru</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <UInput
              v-model="newItem.title"
              placeholder="Judul"
              size="sm"
              @update:model-value="newItem.slug = generateSlug($event)"
            />
            <UInput v-model="newItem.slug" placeholder="slug-url" size="sm" />
            <USelect
              v-model="newItem.categoryId"
              :items="categories.map(c => ({ label: c.label, value: c.id }))"
              placeholder="Kategori"
              size="sm"
            />
            <USelect
              v-model="newItem.templateId"
              :items="templates.map(t => ({ label: t.title, value: t.id }))"
              placeholder="Template"
              size="sm"
            />
          </div>
          <UTextarea v-model="newItem.summary" placeholder="Ringkasan singkat" :rows="2" size="sm" class="mb-4" />
          <UButton
            size="sm"
            :loading="isCreating"
            :disabled="!newItem.title || !newItem.slug || !newItem.summary"
            @click="createDraft"
          >
            Buat Draft
          </UButton>
        </div>

        <!-- Portfolio list -->
        <div class="rounded-xl border border-zinc-800 overflow-hidden">
          <div class="p-4 sm:p-5 border-b border-zinc-800">
            <h2 class="text-lg font-semibold text-white">Daftar Portfolio</h2>
          </div>

          <!-- Skeleton -->
          <div v-if="portfolioStatus === 'pending'" class="divide-y divide-zinc-800">
            <div v-for="i in 4" :key="i" class="p-4 sm:p-5 animate-pulse">
              <div class="flex items-center gap-4">
                <div class="h-5 bg-zinc-800 rounded w-32" />
                <div class="h-5 bg-zinc-800 rounded w-20" />
                <div class="h-5 bg-zinc-800 rounded w-16 ml-auto" />
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!items.length" class="p-8 text-center">
            <UIcon name="i-lucide-inbox" class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p class="text-zinc-400 text-sm">Belum ada portfolio.</p>
          </div>

          <!-- Items -->
          <div v-else class="divide-y divide-zinc-800">
            <div
              v-for="item in items"
              :key="item.id"
              class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-white text-sm sm:text-base truncate">{{ item.title }}</h3>
                  <UBadge
                    :color="item.status === 'PUBLISHED' ? 'success' : item.status === 'ARCHIVED' ? 'warning' : 'neutral'"
                    variant="soft"
                    size="sm"
                  >
                    {{ item.status }}
                  </UBadge>
                </div>
                <p class="text-zinc-400 text-xs sm:text-sm truncate">{{ item.summary }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <UButton
                  v-if="item.status !== 'PUBLISHED'"
                  size="xs"
                  color="success"
                  variant="soft"
                  @click="publishItem(item.id)"
                >
                  Publish
                </UButton>
                <UButton
                  v-if="item.status === 'PUBLISHED'"
                  size="xs"
                  color="warning"
                  variant="soft"
                  @click="unpublishItem(item.id)"
                >
                  Unpublish
                </UButton>
                <UButton
                  v-if="item.status !== 'ARCHIVED'"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  @click="archiveItem(item.id)"
                >
                  Archive
                </UButton>
                <UButton
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  @click="deleteItem(item.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </main>
  </div>
</template>
