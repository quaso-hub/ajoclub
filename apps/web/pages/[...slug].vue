<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Halaman Tidak Ditemukan',
})
</script>

<template>
  <div>
    <Navbar />
    <section class="min-h-screen flex items-center justify-center bg-(--ui-bg)">
      <UContainer class="text-center">
        <p class="text-8xl font-black text-(--ui-primary) mb-6">404</p>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Halaman tidak ditemukan</h1>
        <p class="text-(--ui-text-muted) mb-8 max-w-md mx-auto">
          URL yang Anda cari tidak ada. Mungkin sudah dipindah atau salah ketik.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton size="lg" to="/">Kembali ke beranda</UButton>
          <UButton size="lg" variant="outline" color="neutral" to="/#showcase">Lihat template</UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>
