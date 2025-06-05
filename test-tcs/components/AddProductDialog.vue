<template>
   
    <div v-if="show" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6">
        
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Aggiungi un nuovo prodotto</h2>
  
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label class="block text-gray-700">Titolo</label>
            <input
              v-model="newProduct.title"
              type="text"
              class="w-full p-2 border rounded-md"
              placeholder="Inserisci il titolo del prodotto"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Prezzo</label>
            <input
              v-model.number="newProduct.price"
              type="number"
              class="w-full p-2 border rounded-md"
              placeholder="Inserisci il prezzo del prodotto"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Descrizione</label>
            <textarea
              v-model="newProduct.description"
              rows="4"
              class="w-full p-2 border rounded-md"
              placeholder="Inserisci una descrizione"
              required
            ></textarea>
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Categoria</label>
            <select v-model="newProduct.categoryId" class="w-full p-2 border rounded-md" required>
              <option value="" selected>Seleziona una categoria</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Immagini (Puoi inserire molteplici URL usando ',' come divisore) </label>
            <textarea
              v-model="productImages"
              @input="updateImagesArray"
              rows="4"
              class="w-full p-2 border rounded-md"
              placeholder="Inserisci URL dell'immagine"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-4">
            <button @click="closeDialog" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md">
              Annulla
            </button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
              Aggiungi
            </button>
          </div>
        </form>

        <!-- Dialog di successo -->
        <ConfirmDialog
        v-if="showSuccessDialog"
        @close="closeDialog"
        title="Operazione completata!"
        message="Prodotto aggiunto correttamente!"
        />

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useProductsStore } from '~/stores/products';
  import ConfirmDialog from '~/components/ConfirmDialog.vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  const showSuccessDialog = ref(false);
  
  const newProduct = ref({
    title: '',
    price: null,
    description: '',
    categoryId: null,
    images: ['']
  });

  const productImages=ref('');

  const updateImagesArray = () => {
    newProduct.value.images = productImages.value
      .split(',') 
      .map(url => url.trim()) // Rimuove spazi vuoti
      .filter(url => url) // Rimuove righe vuote
  }

  
  const productsStore = useProductsStore(); 
  
  const closeDialog = () => {
    showSuccessDialog.value = false
    emit('close');
  };
  
  const onSubmit = async () => {
    newProduct.value.images=='' ? newProduct.value.images[0]="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1255/image-not-found.svg" :""
  try {
    await productsStore.addProduct(newProduct.value); 
    showSuccessDialog.value = true;
  } catch (error) {
    console.error('Errore durante l\'aggiunta del prodotto:', error);
  }
};
</script>
  