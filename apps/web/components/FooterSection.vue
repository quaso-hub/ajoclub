<template>
  <footer class="py-16 bg-[var(--background)] border-t border-[var(--border)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-xl font-bold tracking-tight text-[var(--foreground)]">
            AjoClub
          </span>
          <p class="text-sm text-[var(--muted-foreground)] mt-2">
            Digital Agency. Web, SaaS, Mobile.
          </p>
        </div>

        <div class="flex items-center gap-8">
          <a href="#services" class="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Services</a>
          <a href="#work" class="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Work</a>
          <a href="#about" class="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">About</a>
          <a href="#contact" class="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Contact</a>
        </div>

        <p class="text-sm text-[var(--muted-foreground)]">
          &copy; {{ new Date().getFullYear() }} AjoClub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
