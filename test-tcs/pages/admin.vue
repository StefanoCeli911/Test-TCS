<script setup>
import { ref, onMounted } from 'vue'
import { checkAuth } from '~/utils/func'

const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = checkAuth()
})
</script>

<template>
  <div v-if="isAuthenticated">
  
    <h1>Pannello Admin</h1>

  </div>

  <div v-else>
   
    <p>Non risulti con privilegi amministrativi, verrai reindirizzato alla home page.</p>
  </div>
</template>
