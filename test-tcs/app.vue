<script setup>
import { onBeforeMount, onMounted  } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { createAdmin, createCustomer } from '~/utils/func';

const userStore = useUserStore();
// Esegui la funzione all'avvio dell'applicazione
onBeforeMount (() => {
  userStore.initializeStore();

});
onMounted(() => {
  createAdmin();
  createCustomer();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
