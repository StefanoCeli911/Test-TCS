<script setup>
import { onMounted } from 'vue';
import { createAdmin } from '~/utils/func';

// Esegui la funzione all'avvio dell'applicazione
onMounted(() => {
  createAdmin();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
