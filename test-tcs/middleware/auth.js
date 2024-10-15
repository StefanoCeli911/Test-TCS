// middleware/auth.js
import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    
    const user = useUserStore();

   
    await user.initializeStore(); 

    const isAuthenticated = user.isAuthenticated;
    const role = user.role;

    // Verifica se l'utente è autenticato
    if (!isAuthenticated) {
        return navigateTo('/login'); // Reindirizza alla pagina di login se non autenticato
    }

    // Controllo del ruolo per la pagina "products"
    if (to.path === '/products' && role !== 'customer') {
        return navigateTo('/'); // Reindirizza alla home se il ruolo non è "customer"
    }

    // Controllo del ruolo per la pagina "admin"
    if (to.path === '/admin' && role !== 'admin') {
        return navigateTo('/'); // Reindirizza alla home se il ruolo non è "admin"
    }
});
