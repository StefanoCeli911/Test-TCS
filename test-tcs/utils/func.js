export const checkAuth = () => {
    if (process.client) {
      const token = localStorage.getItem('token')
  
      if (token) {
        return true // Se l'utente è autenticato
      } else {
        navigateTo('/login'); // Reindirizza se non autenticato
        return false
      }
    }
  }

  export async function getUserProfile(token) {
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Invia il token nell'header Authorization
      }
    });
  
    const userProfile = await response.json();
  
    if (userProfile) {
      console.log('User Profile:', userProfile);
      
      // Salva il ruolo e il nome utente nel localStorage
      localStorage.setItem('role', userProfile.role);
      localStorage.setItem('name', userProfile.name);
    } else {
      console.error('Errore nel recupero del profilo utente:', userProfile);
    }
  }