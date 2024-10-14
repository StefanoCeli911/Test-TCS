<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div v-if="user" class="bg-white shadow-md rounded-lg w-full max-w-sm sm:max-w-md p-6">
        <!-- User Info -->
        <div class="text-center sm:text-left mb-4">
          <img :src="user.avatar" alt="Avatar" class="mx-auto sm:mx-0 rounded-full mb-4">
        </div>
  
        <!-- User Details -->
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b border-gray-200 py-2">
            <span class="text-gray-700 font-bold">Nome:</span>
            <span class="text-gray-900">{{ user.name }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-gray-200 py-2">
            <span class="text-gray-700 font-bold">Email:</span>
            <span class="text-gray-900">{{ user.email }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-700 font-bold">Ruolo:</span> 
            <span :class="user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'" class="px-2 py-1 mt-2 font-semibold text-white rounded-md">{{ user.role }}</span>
          </div>
        </div>
  
        <!-- Back Button -->
        <div class="mt-6">
          <router-link
            to="/admin"
            class="block w-full bg-blue-500 text-white text-center py-2 rounded-lg shadow hover:bg-blue-600 transition">
            Torna Indietro
          </router-link>
        </div>
      </div>
  
      <!-- Loading State -->
      <Loader v-else/>
    </div>
    
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import Loader from '~/components/Loader.vue';
  
  const route = useRoute()
  const user = ref(null)
  
  onMounted(async () => {
    const res = await fetch(`https://api.escuelajs.co/api/v1/users/${route.params.id}`)
    user.value = await res.json()
  })
  </script>
  
  <style>

  </style>
  