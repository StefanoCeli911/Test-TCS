<template>
  <div>
    <h1 class="text-xl font-bold text-center my-4">La nostra selezione di prodotti</h1>

    <Loader v-if="loading" />
    <div v-if="error" class="text-red-500">{{ error }}</div>
    
     <!-- Select per i filtri -->
     <div class="sticky top-[60px] bg-white z-10 shadow-md p-4">

      <!-- Bottone per aprire/chiudere i filtri su mobile -->
      <button @click="toggleFilterMenu" class="w-full text-white py-2 px-4 bg-blue-500 rounded-md sm:hidden">
        {{ filterMenuOpen ? 'Chiudi filtri' : 'Filtri' }}
      </button>


      <p class="hidden sm:block text-center font-bold text-blue-500">Filtri</p>
      <div :class="{'hidden': !filterMenuOpen, 'sm:flex': true}" class="mt-4 flex-col lg:flex-row space-y-4 lg:space-y-0 lg:justify-around">
        <!-- Seleziona la categoria -->
        <select v-model="selectedCategory" @change="applyFilters" class="p-2 border rounded w-full sm:w-auto">
          <option value="">Seleziona una categoria</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
    
        <!-- Filtro per il titolo -->
        <input v-model="titleFilter" @input="applyFilters" placeholder="Filtra per titolo" class="p-2 border rounded w-full sm:w-auto xl:w-1/3" />

        <!-- Filtro per il range di prezzo -->
        <div class="flex space-x-2 sm:justify-around">
          <input v-model.number="priceMin" @input="applyFilters" placeholder="Prezzo Min" class="p-2 border rounded w-full sm:w-auto" type="number" />
          <input v-model.number="priceMax" @input="applyFilters" placeholder="Prezzo Max" class="p-2 border rounded w-full sm:w-auto" type="number" />
        </div>
      </div>

        <!-- Pulsanti per aggiungere ed eliminare prodotti -->
      <div class="flex flex-col sm:flex-row justify-center mt-2 sm:mt-7">
        <button @click="showAddProductDialog = true" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring sm:mr-2">
          Aggiungi prodotti
        </button>
  
        <button v-if="selectedProducts.length > 0" @click="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring mt-2 sm:mt-0">
          Elimina prodotti selezionati
        </button>
      </div>
    </div>

      <!-- Messaggio se nessun prodotto è stato trovato -->
      <div v-if="noProductsFound  && !loading" class="text-center text-gray-500 my-4 font-bold">
        Nessun prodotto trovato
      </div>

      <div v-if="products.length > 0">

        <div class="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          <!-- Checkbox per selezionare i prodotti -->
          <input type="checkbox" v-model="selectedProducts" :value="product" class="m-4">
          
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
        <div v-if="!allProductsLoaded" class="flex justify-center my-4">
          <button @click="loadMoreProducts" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring">
            Carica altro
          </button>
        </div>
        <div v-else-if="allProductsLoaded && products.length > 0" class="text-center my-4 text-gray-500 font-bold">
          Tutti i prodotti sono stati caricati
        </div>
      </div>

    <!-- Dialog di conferma eliminazione -->
    <ConfirmDelete 
      v-if="showConfirmDelete" 
      @confirm="deleteSelectedProducts" 
      @cancel="showConfirmDelete = false" 
      :items="selectedProducts"
    />

    <!-- Componente dialog per l'aggiunta del prodotto -->
    <AddProductDialog
      v-if="showAddProductDialog"
      :show="showAddProductDialog"
      :categories="categories"
      @close="showAddProductDialog = false"
    />

  </div>
</template>


<script setup>
import { useProductsStore } from '@/stores/products';
import { onMounted, computed, ref } from 'vue';
import Loader from '~/components/Loader.vue';
import ConfirmDelete from '~/components/ConfirmDelete.vue';
import AddProductDialog from '~/components/AddProductDialog.vue';

const productsStore = useProductsStore();
const { fetchCategories, fetchProducts, deleteProducts } = productsStore;
const currentImageMap = ref({});
let offset = ref(0);

definePageMeta({
  middleware: 'auth'
});

const selectedCategory = ref(''); 
const titleFilter = ref(''); 
const priceMin = ref(null); 
const priceMax = ref(null); 
const noProductsFound = ref(false);
const selectedProducts = ref([]); 
const showConfirmDelete = ref(false);
const filterMenuOpen = ref(false);
const showAddProductDialog = ref(false);

onMounted(() => {
  fetchCategories(); // Carica le categorie
  fetchProducts(selectedCategory.value, titleFilter.value, priceMin.value, priceMax.value, offset.value); // Carica i prodotti iniziali
});

const toggleFilterMenu = () => {
  filterMenuOpen.value = !filterMenuOpen.value;
};

// Funzione per applicare i filtri e resettare i prodotti
const applyFilters = async () => {
  offset.value = 0; // Resetta l'offset
  noProductsFound.value = false; // Resetta il messaggio di "nessun prodotto"
  
  await fetchProducts(selectedCategory.value, titleFilter.value, priceMin.value, priceMax.value, offset.value);
  
  // Se non ci sono prodotti restituiti, mostra il messaggio
  if (products.value.length === 0) {
    noProductsFound.value = true;
  }
};

// Funzione per caricare più prodotti
const loadMoreProducts = async () => {
  offset.value += 50; // Incrementa l'offset
  await fetchProducts(selectedCategory.value, titleFilter.value, priceMin.value, priceMax.value, offset.value);
};

// Funzione per confermare l'eliminazione
const confirmDelete = () => {
  showConfirmDelete.value = true;
};

// Funzione per eliminare i prodotti selezionati
const deleteSelectedProducts = async () => {
  const productIds = selectedProducts.value.map(p => p.id);
  await deleteProducts(productIds); 
  selectedProducts.value = []; // Resetta la selezione
  showConfirmDelete.value = false; 
  await fetchProducts(); // Ricarica i prodotti
};



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

// Proprietà Computed per accedere in modo reattivo allo store
const products = computed(() => productsStore.products);
const allProductsLoaded = computed(() => productsStore.allProductsLoaded);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);
const categories = computed(() => productsStore.categories);
</script>
