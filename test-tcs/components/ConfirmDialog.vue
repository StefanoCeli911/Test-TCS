<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="text-center bg-white rounded p-4 max-w-sm mx-auto">
        <h2 class="text-lg font-bold">{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="$emit('close')" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  