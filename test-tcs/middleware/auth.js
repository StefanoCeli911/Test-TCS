// middleware/auth.js

export default defineNuxtRouteMiddleware((to, from) => {
    // Controlla se il codice è eseguito nel browser
    if (process.client) {
        // Recupera il token JWT dallo storage (localStorage)
        const token = localStorage.getItem('token')
    
        // Se non esiste un token, reindirizza alla pagina di login
        if (!token) {
            return navigateTo('/login')
        }else{    
            // Se l'utente cerca di accedere alla pagina admin, controlla il ruolo
            if (to.path === '/products') {
                // Decodifica il token per ottenere i dati dell'utente (ruolo)
                const payload = JSON.parse(atob(token.split('.')[1]))
                if (payload.role !== 'customers') {
                    // Se l'utente non è customers, reindirizzalo alla home page
                    return navigateTo('/')
                }
            }
            if (to.path === '/admin') {
                // Decodifica il token per ottenere i dati dell'utente (ruolo)
                const payload = JSON.parse(atob(token.split('.')[1]))
                if (payload.role !== 'admin') {
                    // Se l'utente non è admin, reindirizzalo alla home page
                    return navigateTo('/')
                }
            }
        }
    }
  })
  
  