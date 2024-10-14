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

  // Controlla se l'utente admin esiste e lo crea se non esiste
export const createAdmin = async () => {
  try {
    // Effettua una richiesta per ottenere tutti gli utenti
    const response = await fetch('https://api.escuelajs.co/api/v1/users');
    const users = await response.json();
    
    // Verifica se esiste già un utente la mail
    const adminUser = users.some(user => user.email === 'stefano@mail.com');

    if (!adminUser) {
      // Crea un nuovo utente con il ruolo admin
      const newAdminUser = {
        name: 'Stefano',
        email: 'stefano@mail.com',  
        password: 'admin',   
        avatar: 'https://api.lorem.space/image/face?w=150&h=150', 
        role: 'admin'
      };

      const createResponse = await fetch('https://api.escuelajs.co/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdminUser),
      });

      if (createResponse.ok) {
        console.log('Utente admin creato con successo');
      } else {
        console.error('Errore durante la creazione dell\'utente admin');
      }
    } 
  } catch (error) {
    console.error('Errore durante la verifica o la creazione dell\'utente admin:', error);
  }
};