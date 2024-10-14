<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-10">
      <div class="loader"></div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .loader {
    border: 8px solid #f3f3f3; /* Light gray */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  