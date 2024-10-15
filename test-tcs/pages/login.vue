<template>

  <div class="flex justify-center items-center flex-grow mt-12">
    <Loader v-if="isLoading" />

    <div v-else class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">

      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
            placeholder="Inserisci la tua email"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
            placeholder="Inserisci la tua password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Accedi
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { getUserProfile } from '~/utils/func';
import Loader from '~/components/Loader.vue';

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);
const userStore = useUserStore();

const emit = defineEmits();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('https://api.escuelajs.co/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    // Salva il token JWT in localStorage
    localStorage.setItem('token', response.access_token);

    // Dopo aver ottenuto il token, chiama la funzione per ottenere il profilo utente
    const userData = await getUserProfile(response.access_token);
    userStore.login(userData);

    // Reindirizza alla pagina prodotti dopo il login
    router.push('/products');

  } catch (error) {
    console.error('Login fallito:', error)
  } finally{
    isLoading.value = false;
  }
}
</script>
