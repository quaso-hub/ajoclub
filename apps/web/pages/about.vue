<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Tentang Kami - AjoClub',
  meta: [
    { name: 'description', content: 'AjoClub: tim kecil yang bikin website dari awal sampai online.' },
  ],
})
</script>

<template>
  <div>
    <Navbar />
    <AboutSection />
    <ContactSection />
    <FooterSection />
    <WhatsAppFAB />
  </div>
</template>
