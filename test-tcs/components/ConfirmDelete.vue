<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Conferma eliminazione</h2>

        <p class="mb-4">Sei sicuro di voler eliminare i seguenti prodotti?</p>
        
        <ul class="mb-4">
          <li v-for="item in items" :key="item.id" class="text-sm text-gray-700">
            {{ item.title }} - {{ item.price }}€
          </li>
        </ul>

        <div class="flex justify-end space-x-4">
          <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Annulla
          </button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Conferma
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  const props = defineProps({
    items: {
      type: Array,
      required: true
    }
  });
  </script>

  <style scoped>

  </style>
