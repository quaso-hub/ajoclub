<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  title: 'Admin - AjoClub',
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-3xl">
      <UBadge variant="soft" color="primary" class="mb-4">Admin</UBadge>
      <h1 class="text-4xl font-bold mb-4">AjoClub content control room</h1>
      <p class="text-(--ui-text-muted) mb-8">
        Admin ini adalah shell awal untuk portfolio dinamis. Gunakan token admin development sampai Supabase Auth UI dipasang penuh.
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <NuxtLink to="/admin/portfolio" class="glass-card p-6 block hover:-translate-y-1 transition-transform">
          <UIcon name="i-lucide-panels-top-left" class="w-7 h-7 text-(--ui-primary) mb-4" />
          <h2 class="font-semibold mb-2">Portfolio Manager</h2>
          <p class="text-sm text-(--ui-text-muted)">Create, review, publish, unpublish, and archive portfolio entries.</p>
        </NuxtLink>
        <NuxtLink to="/#showcase" class="glass-card p-6 block hover:-translate-y-1 transition-transform">
          <UIcon name="i-lucide-eye" class="w-7 h-7 text-(--ui-primary) mb-4" />
          <h2 class="font-semibold mb-2">Public Showroom</h2>
          <p class="text-sm text-(--ui-text-muted)">Preview the public portfolio experience and scene presets.</p>
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>
