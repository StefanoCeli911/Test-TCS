<template>
  <div>
    <Loader v-if="loading" />
    <div v-else class="container mx-auto px-4 py-6">
      <h3 class="text-xl font-bold text-center mb-6">Ecco alcuni dei nostri migliori articoli.</h3>
      <p class="text-md font-bold text-center mb-6">Per visionare la nostra gamma completa entra nella nostra sezione 
        <NuxtLink to="/products" class="underline text-lg hover:text-blue-600">Prodotti</NuxtLink>
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
        >
          <img 
            :src="product.images[0]" 
            alt="Product Image" 
            class="w-full h-48 object-fit h-[300px]" 
            @error="onImageError"
          />
          
          <div class="flex-1 p-4">
            <h2 class="text-lg font-semibold">{{ product.title }}</h2>
            <p class="text-gray-700">{{ product.description }}</p>
          </div>

          <div class="flex justify-between items-center mt-4 p-4 border-t">
            <span class="text-xl font-bold text-gray-600">Prezzo:</span>
            <span class="text-xl font-bold text-green-600">{{ product.price }}€</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>


<script setup>
import { computed } from 'vue';
import { useProductsStore } from '~/stores/products';
import Loader from '~/components/Loader.vue';

const productsStore = useProductsStore();
const { fetchProductsHomePage } = productsStore;

// Propietà Computed accedere in modo reattivo allo store
const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.loading);

onMounted(()=>{
  fetchProductsHomePage();
})

const onImageError = (event) => {
  event.target.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1255/image-not-found.svg';
};
</script>

<style scoped>

</style>
