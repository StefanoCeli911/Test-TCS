import { defineStore } from 'pinia';
import { useCookie } from '#app'; // Composable di Nuxt per gestire i cookie

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isAuthenticated: false,
      role: null,
      user: null,
    };
  },
  actions: {
    
    initializeStore() {
      // Inizializzazione dei cookie per leggere i dati
      const cookieUser = useCookie('user').value;
      const cookieRole = useCookie('role').value;
      const cookieAuth = useCookie('isAuthenticated').value;

      // Verifica se i cookie sono presenti e deserializza correttamente
      if (cookieUser && cookieRole && cookieAuth) {
        try {
          // Decodifica URL e deserializza i cookie
          this.isAuthenticated = typeof cookieAuth === 'string' ? JSON.parse(decodeURIComponent(cookieAuth)) : cookieAuth;
          this.role = cookieRole;
          this.user = typeof cookieUser === 'string' ? JSON.parse(decodeURIComponent(cookieUser)) : cookieUser;
        } catch (error) {
          console.error("Errore durante il parsing dei cookie", error);
        }
      }
    },
    login(userData) {
      this.isAuthenticated = true;
      this.role = userData.role;
      this.user = userData;

      useCookie('user').value = encodeURIComponent(JSON.stringify(userData)); // Codifica in URL
      useCookie('role').value = userData.role;
      useCookie('isAuthenticated').value = encodeURIComponent(JSON.stringify(true)); // Codifica in URL
    },
    logout() {
      this.isAuthenticated = false;
      this.role = null;
      this.user = null;

      // Rimuovi i cookie al logout
      useCookie('user').value = null;
      useCookie('role').value = null;
      useCookie('isAuthenticated').value = null;
    }
  }
});
