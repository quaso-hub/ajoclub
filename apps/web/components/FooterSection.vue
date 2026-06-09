<template>
  <footer class="py-16 bg-(--ui-bg) border-t border-(--ui-border)">
    <UContainer>
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-xl font-bold">AjoClub</span>
          <p class="text-sm text-(--ui-text-muted) mt-2">Digital Agency. Web, SaaS, Mobile.</p>
        </div>
        <div class="flex items-center gap-8">
          <a href="#services" class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors">Services</a>
          <a href="#work" class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors">Work</a>
          <a href="#about" class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors">About</a>
          <a href="#contact" class="text-sm text-(--ui-text-muted) hover:text-(--ui-text) transition-colors">Contact</a>
        </div>
        <p class="text-sm text-(--ui-text-muted)">&copy; {{ new Date().getFullYear() }} AjoClub.</p>
      </div>
    </UContainer>
  </footer>
</template>
