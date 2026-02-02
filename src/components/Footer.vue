<template>
  <footer class="bg-slate-900 border-t border-slate-800 pt-12 pb-6 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="bg-slate-800 p-1.5 rounded-md border border-slate-700">
              <Server class="w-5 h-5 text-indigo-500" />
            </div>
            <span class="text-white font-bold tracking-tight">SILVER<span class="text-indigo-500">HOST</span></span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            <!--  -->
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Tous les systèmes sont opérationnels
          </div>
        </div>

      </div>

      <div class="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-6">
          <p class="text-slate-500 text-xs">
            © 2026 Silverhost Console. Tous droits réservés.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-slate-500 hover:text-slate-300 transition-colors"><Twitter class="w-4 h-4" /></a>
            <a href="#" class="text-slate-500 hover:text-slate-300 transition-colors"><Github class="w-4 h-4" /></a>
            <a href="#" class="text-slate-500 hover:text-slate-300 transition-colors"><Globe class="w-4 h-4" /></a>
          </div>
        </div>
        
        <div class="flex gap-6">
          <a href="#" class="text-slate-500 hover:text-slate-300 text-xs">CGU/CGV</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-xs">Confidentialité</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-xs">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  Server, 
  Twitter, 
  Github, 
  Globe, 
  Send 
} from 'lucide-vue-next';
</script>