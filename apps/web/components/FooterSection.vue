<template>
  <footer class="py-16 bg-black border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-xl font-bold tracking-tight">
            <span class="text-white">Ajo</span><span class="text-cyan-400">Club</span>
          </span>
          <p class="text-sm text-white/30 mt-2">
            Digital Agency. Web, SaaS, Mobile.
          </p>
        </div>

        <div class="flex items-center gap-8">
          <a href="#services" class="text-sm text-white/40 hover:text-white transition-colors">Services</a>
          <a href="#work" class="text-sm text-white/40 hover:text-white transition-colors">Work</a>
          <a href="#about" class="text-sm text-white/40 hover:text-white transition-colors">About</a>
          <a href="#contact" class="text-sm text-white/40 hover:text-white transition-colors">Contact</a>
        </div>

        <p class="text-sm text-white/20">
          &copy; {{ new Date().getFullYear() }} AjoClub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
