import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const loading = ref(false);
  const allProductsLoaded = ref(false);
  const error = ref(null);

  const fetchProducts = async (offset) => { 
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=50`);
      if(response.data!=""){
        products.value.push(...response.data);
      }else{
        allProductsLoaded.value=true;
      }
    } catch (err) {
      error.value = 'Errore nel caricamento dei prodotti';
    } finally {
      loading.value = false;
    }
  };
  const fetchProductsHomePage = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/products?offset=0&limit=10');
      products.value = response.data;
    } catch (err) {
      error.value = 'Errore nel caricamento dei prodotti';
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    allProductsLoaded,
    error,
    fetchProducts,
    fetchProductsHomePage
  };
});
