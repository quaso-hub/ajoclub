<template>
  <footer class="py-16 bg-zinc-950 border-t border-zinc-800">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-xl font-bold text-zinc-100">AjoClub</span>
          <p class="text-sm text-zinc-500 mt-2">Digital Agency. Web, SaaS, Mobile.</p>
        </div>
        <div class="flex items-center gap-8">
          <a href="#services" class="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">Services</a>
          <a href="#work" class="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">Work</a>
          <a href="#about" class="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">About</a>
          <a href="#contact" class="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">Contact</a>
        </div>
        <p class="text-sm text-zinc-600">&copy; {{ new Date().getFullYear() }} AjoClub.</p>
      </div>
    </div>
  </footer>
</template>
