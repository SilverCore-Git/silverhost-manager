<template>
    <nav class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Logo ou nom du site -->
        <div class="text-white text-2xl font-bold">
          MonSite
        </div>
  
        <!-- Menu de navigation -->
        <div class="hidden md:flex space-x-6">
          <a href="/" class="text-white hover:text-gray-300">Accueil</a>
          <a href="/about" class="text-white hover:text-gray-300">À propos</a>
          <a href="/services" class="text-white hover:text-gray-300">Services</a>
          <a href="/contact" class="text-white hover:text-gray-300">Contact</a>
        </div>
  
        <!-- Menu hamburger pour mobile -->
        <div class="md:hidden">
          <button @click="toggleMenu" class="text-white">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Menu mobile -->
      <div v-if="isMenuOpen" class="md:hidden bg-blue-700 p-4 space-y-4">
        <a href="/" class="text-white hover:text-gray-300 block">Accueil</a>
        <a href="/about" class="text-white hover:text-gray-300 block">À propos</a>
        <a href="/services" class="text-white hover:text-gray-300 block">Services</a>
        <a href="/contact" class="text-white hover:text-gray-300 block">Contact</a>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isMenuOpen = ref(false);
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
  <style scoped>
  /* Styles personnalisés si nécessaire */
  </style>
  
