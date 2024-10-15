<template>
  <div v-show="isAuthenticated" class="p-4" >
    <h1 class="text-2xl text-center font-bold mb-4">Admin Panel</h1>

    <!-- Mostra il loader se i dati non sono ancora caricati -->
    <Loader v-if="isLoading" />

     <!-- Pulsante per creare nuovo utente -->
     <div class="mb-4 text-center">
      <button @click="openCreateUserDialog" class="bg-green-500 text-white p-2 rounded">Crea utente</button>
    </div>

    <!-- Campo di ricerca -->
    <div class="mb-4 flex justify-center gap-4">
      <input
        v-model="searchQuery"
        type="text"
        @keydown.enter="handleSearch"
        placeholder="Cerca utenti..."
        class="border p-2 rounded w-2/3 md:w-1/3"
      />
      <button
        @click="handleSearch"
        class="bg-blue-500 text-white p-2 rounded"
      >
        Cerca
      </button>
    </div>

   

    <!-- Lista utenti - Visualizzazione desktop -->
    <div v-if="users.length > 0" class="hidden md:block">
      <table class="w-full">
        <thead>
          <tr>
            <th class="px-4 py-2">Nome</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Ruolo</th>
            <th class="px-4 py-2">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="border px-4 py-2">{{ user.name }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ user.role }}</td>
            <td class="border px-4 py-2">
              <router-link :to="`/users/${user.id}`" class="text-green-500">
                Dettagli
              </router-link>
              <div class="my-2"><button @click="editUser(user)" class="text-blue-500">Modifica</button></div>
              <div><button @click="deleteUser(user.id)" class="text-red-500">Elimina</button></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Visualizzazione mobile - Cards -->
    <div v-if="users.length > 0" class="md:hidden">
      <div v-for="user in paginatedUsers" :key="user.id" class="border p-4 mb-4 rounded-lg shadow-lg">
        <div class="mb-2">
          <span class="font-bold">Nome: </span>{{ user.name }}
        </div>
        <div class="mb-2">
          <span class="font-bold">Email: </span>{{ user.email }}
        </div>
        <div class="mb-2">
          <span class="font-bold">Ruolo: </span>{{ user.role }}
        </div>
        <div class="flex justify-end">
          <router-link :to="`/users/${user.id}`" class="text-green-500">
            Dettagli
          </router-link>
          <button @click="editUser(user)" class="text-blue-500 mx-4">Modifica</button>
          <button @click="deleteUser(user.id)" class="text-red-500">Elimina</button>
        </div>
      </div>
    </div>

    <!-- Nessun utente trovato -->
    <div v-else>
      <p v-if="!isLoading">Nessun utente trovato.</p>
    </div>

    <!-- Paginazione -->
    <div class="flex justify-center mt-4 space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="bg-gray-200 text-gray-700 py-1 px-4 rounded disabled:bg-gray-400"
        >
          Precedente
        </button>
        <span>Pagina {{ currentPage }} di {{ totalPages }}</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="bg-gray-200 text-gray-700 py-1 px-4 rounded disabled:bg-gray-400"
        >
          Successivo
        </button>
    </div>

    <!-- Dialog per creare nuovo utente -->
    <div v-if="showCreateUserDialog" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 class="text-xl font-bold mb-4">Crea Nuovo Utente</h2>
        <form @submit.prevent="createUser">
          <div class="mb-4">
            <label class="block">Nome</label>
            <input v-model="newUser.name" type="text" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Email</label>
            <input v-model="newUser.email" type="email" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Password</label>
            <input v-model="newUser.password" type="password" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Avatar URL</label>
            <input v-model="newUser.avatar" type="text" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Ruolo</label>
            <select v-model="newUser.role" class="border p-2 w-full rounded">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeCreateUserDialog" class="bg-gray-500 text-white p-2 rounded mr-2">Annulla</button>
            <button type="submit" class="bg-green-500 text-white p-2 rounded">Crea</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Dialog per modificare un utente -->
    <div v-if="showEditUserDialog" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 class="text-xl font-bold mb-4">Modifica Utente</h2>
        <form @submit.prevent="updateUser">
          <div class="mb-4">
            <label class="block">Nome</label>
            <input v-model="updatedUserData.name" type="text" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Email</label>
            <input v-model="updatedUserData.email" type="email" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Password</label>
            <input v-model="updatedUserData.password" type="password" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Avatar</label>
            <input v-model="updatedUserData.avatar" type="text" class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block">Ruolo</label>
            <select v-model="updatedUserData.role" class="border p-2 w-full rounded">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeEditUserDialog" class="bg-gray-500 text-white p-2 rounded mr-2">Annulla</button>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Aggiorna</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Dialog per conferma operazione -->
    <div v-if="showSuccessDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg font-semibold">Operazione completata con successo!</p>
        <button
          class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="closeSuccessDialog"
        >
          Ok
        </button>
      </div>
    </div>
    
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '~/stores/userStore';
import Loader from '~/components/Loader.vue';

const users = ref([]);
const filteredUsers = ref([]);
const paginatedUsers = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(0);
const limit = 20;
const showCreateUserDialog = ref(false);
const showEditUserDialog = ref(false);
const showSuccessDialog = ref(false);
const newUser = ref({
  name: '',
  email: '',
  password: '',
  avatar: '',
  role: 'customer',
});
const selectedUser = ref(null);
const updatedUserData = ref({});
const isLoading = ref(true);
const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated);

definePageMeta({
  middleware: 'auth'
})


onMounted(async () => {
  userStore.initializeStore();
//Lista utenti
  fetchUsers();
});

// Funzione per aprire il dialog di creazione utente
const openCreateUserDialog = () => {
  
  // Resetta i dati dell'utente
  newUser.value = {
    name: '',
    email: '',
    password: '',
    avatar: '',
    role: 'customer',
  }; 

  showCreateUserDialog.value = true;
};

// Funzione per chiudere il dialog di creazione utente
const closeCreateUserDialog = () => {
  showCreateUserDialog.value = false;
};

// Funzione per aprire il dialog di modifica utente
const openEditUserDialog = () => {
  showEditUserDialog.value = true;
};

// Funzione per chiudere il dialog di modifica utente
const closeEditUserDialog = () => {
  showEditUserDialog.value = false;
};

const closeSuccessDialog = () => {
  showSuccessDialog.value = false;
};

// Funzione per recuperare utenti
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/users');
    const data = await response.json();
    
    if (response.ok) {
      users.value = data.reverse(); // Assegna la lista completa di utenti dall'ultimo inserito
      updateFilteredUsers(); // Filtra gli utenti
      updatePaginatedUsers(); // Imposta la prima pagina
    } else {
      throw new Error('Errore durante il caricamento degli utenti');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false; 
  }
};

// Funzione per cercare gli utenti
const handleSearch = () => {
  currentPage.value = 1; // Resetta alla prima pagina
  updateFilteredUsers();
  updatePaginatedUsers();
};

// Funzione per aggiornare gli utenti filtrati
const updateFilteredUsers = () => {
  if (searchQuery.value) {
    filteredUsers.value = users.value.filter(user =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    filteredUsers.value = users.value;
  }
  totalPages.value = Math.ceil(filteredUsers.value.length / limit); // Calcola le pagine totali
};

// Funzione per aggiornare gli utenti per pagina
const updatePaginatedUsers = () => {
  const start = (currentPage.value - 1) * limit;
  paginatedUsers.value = filteredUsers.value.slice(start, start + limit); // Mostra solo gli utenti per la pagina corrente
};

// Funzione per cambiare pagina
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return; // Controllo per evitare pagine non valide
  currentPage.value = page;
  updatePaginatedUsers(); // Ricarica gli utenti per la nuova pagina
};

// Funzione per creare un nuovo utente
const createUser = async () => {
  isLoading.value = true;
  try {
    // Imposta un avatar di default se il campo è vuoto
    if (!newUser.value.avatar) {
      newUser.value.avatar = 'https://picsum.photos/800';  // URL di un'immagine di placeholder
    }

    const response = await fetch('https://api.escuelajs.co/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser.value),
    });

    const responseData = await response.json(); // Leggi la risposta del server

    if (response.ok) {
      isLoading.value = false;
      closeCreateUserDialog();
      showSuccessDialog.value = true;
      fetchUsers(); //Ricarico la lista utenti
    } else {
      console.error('Errore API:', responseData); // Mostra il messaggio di errore dell'API
      throw new Error('Errore durante la creazione dell\'utente');
    }
  } catch (error) {
    console.error(error);
  }
};

// Funzione per eliminare un utente
const deleteUser = async (userId) => {
  isLoading.value = true;
  try {
    const response = await fetch(`https://api.escuelajs.co/api/v1/users/${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      isLoading.value = false;
      showSuccessDialog.value = true;
      fetchUsers(); //Ricarico la lista utenti
    } else {
      throw new Error('Errore durante l\'eliminazione dell\'utente');
    }
  } catch (error) {
    console.error(error);
  }
};

// Funzione per aprire il dialog di modifica e popolare i dati utente
const editUser = (user) => {
  selectedUser.value = user;
  updatedUserData.value = { ...user }; // Copia i dati dell'utente selezionato nel form
  openEditUserDialog();  // Apre il dialog di modifica
};

// Funzione per aggiornare un utente esistente
const updateUser = async () => {
  const userId = selectedUser.value.id;

  const updatedData = {
    name: updatedUserData.value.name,
    email: updatedUserData.value.email,
    avatar: updatedUserData.value.avatar,
    role: updatedUserData.value.role,
    password: updatedUserData.value.password
  };

  isLoading.value = true;
  try {
    const response = await fetch(`https://api.escuelajs.co/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const responseData = await response.json();

    if (response.ok) { 
      isLoading.value = false;
      closeEditUserDialog(); // Chiudo il dialog di modifica
      showSuccessDialog.value = true;
      fetchUsers(); //Ricarico la lista utenti
    } else {
      console.error('Errore API:', responseData);
      throw new Error('Errore durante l\'aggiornamento dell\'utente');
    }
  } catch (error) {
    console.error(error);
    alert('Si è verificato un errore durante l\'aggiornamento dell\'utente.');
  }
};
</script>

<style scoped>

</style>
