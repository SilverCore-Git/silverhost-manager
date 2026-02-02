<template>
  <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
            <Server class="w-6 h-6 text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-white text-xl font-black tracking-tight leading-none">SILVER<span class="text-indigo-500">HOST</span></span>
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Console V1.0.0</span>
          </div>
        </div>

        <div class="hidden md:flex items-center space-x-1">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" 
             class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
             :class="link.active ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'">
            <div class="flex items-center gap-2">
              <component :is="link.icon" class="w-4 h-4" />
              {{ link.name }}
            </div>
          </a>
        </div>

        <div class="flex items-center gap-4">

          <button @click="toggleMenu" class="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800">
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-slate-800 border-b border-slate-700">
        <div class="px-4 py-4 space-y-2">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <component :is="link.icon" class="w-5 h-5 text-indigo-400" />
            {{ link.name }}
          </a>
          <hr class="border-slate-700 my-4" />
          <div class="flex items-center gap-4 px-4 py-2">
             <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">AS</div>
             <div>
               <p class="text-white font-bold text-sm">Alex Score</p>
               <p class="text-slate-400 text-xs">alex@scorehost.com</p>
             </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Server, 
  LayoutDashboard,
  Menu, 
  X
} from 'lucide-vue-next';

const isMenuOpen = ref(false);

const navLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, active: true },
  // { name: 'Instances', href: '/services', icon: Server, active: false },
  // { name: 'Databases', href: '/db', icon: Database, active: false },
  // { name: 'Domaines', href: '/domains', icon: Globe, active: false },
  // { name: 'Facturation', href: '/billing', icon: CreditCard, active: false },
  // { name: 'Paramètres', href: '/settings', icon: Settings, active: false },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>