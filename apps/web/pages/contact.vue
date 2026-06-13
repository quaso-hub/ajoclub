<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Hubungi Kami - AjoClub',
  meta: [
    { name: 'description', content: 'Chat WhatsApp langsung untuk konsultasi bikin website.' },
  ],
})
</script>

<template>
  <div>
    <Navbar />
    <ContactSection />
    <FooterSection />
    <WhatsAppFAB />
  </div>
</template>
