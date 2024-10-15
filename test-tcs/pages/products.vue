<template>
  <div>
    <h1 class="text-xl font-bold text-center my-4">La nostra selezione di prodotti</h1>
   <!--  <button @click="fetchProducts" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring">
      Carica Prodotti
    </button> -->

    <Loader v-if="loading" />
    <div v-if="error" class="text-red-500">{{ error }}</div>
    
    <div v-if="!loading && products.length > 0">

        <div class="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                <img class="w-full h-2/5 object-fit h-[300px]"
                :src="currentImage(product)" 
                :alt="product.title" 
                @error="onImageError"
                >
                <div class="p-4 flex-1">
                    <h2 class="text-lg font-bold">{{ product.title }}</h2>
                    <p class="text-gray-600 mt-2 text-sm">{{ product.description }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <div class="p-4">
                      <p class="text-gray-600 text-sm">Images:</p>
                      <div class="flex space-x-2 mt-2">
                          <img v-for="(image, index) in product.images" :key="index" 
                          :src="image" 
                          alt="Image" 
                          class="w-12 h-12 cursor-pointer object-cover rounded"
                          @error="onImageError"
                          @click="changeImage(image, product.id)"
                          @mouseover="changeImage(image, product.id)"
                          >
                      </div>
                      
                    </div>
                    
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
import { useProductsStore } from '@/stores/products';
import { onMounted, computed } from 'vue';
import Loader from '~/components/Loader.vue';

const productsStore = useProductsStore();
const { fetchProducts } = productsStore;
const currentImageMap = ref({});

definePageMeta({
  middleware: 'auth'
})

onMounted(() => {
  fetchProducts();
});

const onImageError = (event) => {
  event.target.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1255/image-not-found.svg';
};

// Funzione per ottenere l'immagine corrente dinamicamente
const currentImage = (product) => {
  return currentImageMap.value[product.id] || product.images[0]; // Restituisce l'immagine corrente o quella di default
};

// Funzione per cambiare l'immagine principale
const changeImage = (image, productId) => {
  currentImageMap.value[productId] = image; // Imposta l'immagine selezionata
};


// Propietà Computed accedere in modo reattivo allo store
const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);
</script>
