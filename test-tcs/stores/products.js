import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const loading = ref(false);
  const allProductsLoaded = ref(false);
  const error = ref(null);
  const categories = ref([]);

  const fetchProducts = async (categoryId, title, priceMin, priceMax, offset, limit = 50) => {
    loading.value = true;
    error.value = null;

    // Imposto i valori di default per priceMin e priceMax
    if (!priceMin && priceMax) {
      priceMin = 1; // Se viene settato solo priceMax, imposta priceMin a 1
    }
    if (!priceMax && priceMin) {
      priceMax = 99999999; // Se viene settato solo priceMin, imposta priceMax a un valore alto
    }

    try {
      const params = {
        categoryId,
        title,
        price_min: priceMin,
        price_max: priceMax,
        offset,
        limit
      };
      
      const response = await axios.get('https://api.escuelajs.co/api/v1/products/', { params });

      if (response.data.length > 0) {
        // Se si tratta di una nuova ricerca, resetta l'array dei prodotti
        products.value = offset === 0 ? response.data : [...products.value, ...response.data];
        allProductsLoaded.value = response.data.length < limit; // Se il numero di prodotti restituito è minore del limite, non ci sono più prodotti da caricare
      } else {
        // Nessun prodotto trovato, resetta l'array e imposta la variabile di stato
        products.value = [];
        allProductsLoaded.value = true;

      }
    } catch (err) {
      error.value = 'Errore nel caricamento dei prodotti';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  const fetchProductsHomePage = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/products',{
          params: {
            price_min: 20,
            price_max: 70,
          }
      });
      products.value = response.data;
    } catch (err) {
      error.value = 'Errore nel caricamento dei prodotti';
    } finally {
      loading.value = false;
    }
  };

  // Funzione per eliminare molteplici prodotti selezionati
  const deleteProducts = async (productIds) => {
    loading.value = true;
    error.value = null;
    try {
      for (const id of productIds) {
        await axios.delete(`https://api.escuelajs.co/api/v1/products/${id}`);
      }
      products.value = products.value.filter((product) => !productIds.includes(product.id));
    } catch (err) {
      error.value = 'Errore durante l\'eliminazione dei prodotti';
      console.error(err);
    }finally {
      loading.value = false;
    }
  };

    // Funzione per aggiungere un nuovo prodotto
    const addProduct = async (newProduct) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios.post('https://api.escuelajs.co/api/v1/products', newProduct);
        products.value.push(response.data); // Aggiungi il nuovo prodotto all'array dei prodotti
      } catch (err) {
        error.value = 'Errore durante l\'aggiunta del prodotto';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
      categories.value = response.data;
    } catch (err) {
      console.error('Errore nel caricamento delle categorie:', err);
    }
  };

  return {
    products,
    loading,
    allProductsLoaded,
    error,
    categories,
    fetchProducts,
    fetchProductsHomePage,
    fetchCategories,
    deleteProducts,
    addProduct
  };
});

