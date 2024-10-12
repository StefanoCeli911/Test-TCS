<template>
  <div class="min-h-screen flex flex-col bg-gray-100 relative">
    <!-- Navbar -->
    <header class="bg-gray-800 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <div class="text-lg font-bold">Top Consulting & Services</div>

         <!-- Icona hamburger mobile -->
         <div class="lg:hidden">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" :class="{'transform rotate-90': isMenuOpen}" class="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <!-- Links desktop -->
        <ul class="hidden lg:flex space-x-4">
          <li><NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink></li>
          <li><NuxtLink to="/login" class="hover:text-gray-400">Login</NuxtLink></li>
        </ul>
      </nav>

      <!-- Menu mobile -->
      <transition name="slide-left">
        <div v-if="isMenuOpen" class="rounded bold absolute right-0 top-14 w-2/5 bg-gray-800 text-white shadow-lg z-10">
          <div class="container mx-auto py-4">
            <ul class="space-y-4">
              <li class="text-center"><NuxtLink @click="toggleMenu" to="/" class="block text-lg hover:text-slate-400">Home</NuxtLink></li>
              <li class="text-center"><NuxtLink @click="toggleMenu" to="/login" class="block text-lg hover:text-slate-400">Login</NuxtLink></li>
            </ul>
          </div>
        </div>
      </transition>
    </header>

    <!-- Page Content -->
    <main class="flex-grow container mx-auto p-4">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4">
      <div class="container mx-auto text-center">
        © Top Consulting & Services - Celi Stefano
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Stato del menu
const isMenuOpen = ref(false)

// Toggle menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Animazione slide-left */
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(+100%);
}
</style>
