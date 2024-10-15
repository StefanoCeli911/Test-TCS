<template>
  <div class="min-h-screen flex flex-col bg-gray-100 relative">
    <!-- Navbar -->
    <header class="bg-gray-800 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <div class="text-lg font-bold"><NuxtLink to="/" class="cursor-pointer">Top Consulting & Services</NuxtLink></div>

         <!-- Icona hamburger mobile -->
         <div class="lg:hidden">
          <button @click="toggleMenu" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300" :class="{'transform rotate-90': isMenuOpen}"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <!-- Links desktop -->
        <ul class="hidden lg:flex space-x-4">
          <li><NuxtLink to="/" class="hover:text-slate-400">Home</NuxtLink></li>
          <li v-show="isAuthenticated"><NuxtLink to="/products" class="hover:text-slate-400">Prodotti</NuxtLink></li>
          <li v-show="userRole=='admin'"><NuxtLink to="/admin" class="hover:text-slate-400">Pannello Admin</NuxtLink></li>
          <li class="text-center" v-show="isAuthenticated"><NuxtLink @click="logout" class="cursor-pointer hover:text-slate-400">Logout</NuxtLink></li>
          <li v-show="!isAuthenticated"><NuxtLink to="/login" class="hover:text-slate-400">Login</NuxtLink></li>
        </ul>
      </nav>

      <!-- Menu mobile -->
      <transition name="slide-left">
        <div v-if="isMenuOpen" class="rounded bold absolute right-0 top-14 w-2/5 bg-gray-800 text-white shadow-lg lg:hidden z-10">
          <div class="container mx-auto py-4">
            <ul class="space-y-4">
              <li class="text-center"><NuxtLink @click="toggleMenu" to="/" class="block text-lg hover:text-slate-400">Home</NuxtLink></li>
              <li class="text-center" v-show="isAuthenticated"><NuxtLink @click="toggleMenu" to="/products" class="block text-lg hover:text-slate-400">Prodotti</NuxtLink></li>
              <li class="text-center" v-show="userRole=='admin'"><NuxtLink @click="toggleMenu" to="/admin" class="block text-lg hover:text-slate-400">Pannello Admin</NuxtLink></li>
              <li class="text-center" v-show="isAuthenticated"><NuxtLink @click="logout" class="cursor-pointer block text-lg hover:text-slate-400">Logout</NuxtLink></li>
              <li class="text-center" v-show="!isAuthenticated"><NuxtLink @click="toggleMenu" to="/login" class="block text-lg hover:text-slate-400">Login</NuxtLink></li>
            </ul>
          </div>
        </div>
      </transition>
    </header>

    <!-- Page Content -->
    <main class="flex-grow container mx-auto p-4">
      <NuxtPage/>
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
import { ref,computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const isMenuOpen = ref(false);

// Rendo le variabili reattive
const isAuthenticated = computed(() => userStore.isAuthenticated);
const userRole = computed(() => userStore.role);


// Toggle menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

const logout = () => {
  // Usa le azioni del tuo store per effettuare il logout
  userStore.logout();

  // Aggiorna lo stato del menu
  isMenuOpen.value = false;

  // Reindirizza a login
  router.push('/login').catch(err => {
    console.error('Errore nel reindirizzamento:', err);
  });
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
