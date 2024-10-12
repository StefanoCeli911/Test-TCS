<template>

  <div class="min-h-screen flex flex-col bg-gray-100">

    <!-- Navbar -->
    <header class="bg-gray-800 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <div class="text-lg font-bold">Top Consulting & Services</div>

         <!-- Icona hamburger mobile -->
         <div class="lg:hidden">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- Links mobile -->
    <div v-if="isMenuOpen" class="lg:hidden">
        <ul class="flex flex-col space-y-2 mt-4">
          <li><NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink></li>
          <li><NuxtLink to="/login" class="hover:text-gray-400">Login</NuxtLink></li>
        </ul>
      </div>
    </header>


    <!-- Page Content -->
    <main class="flex-grow container mx-auto">
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

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
