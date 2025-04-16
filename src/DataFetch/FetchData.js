import { useState } from 'react';

export const useFetchData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (customEndpoint, body = null) => {
    setLoading(true);
    try {
      const url = customEndpoint || `http://localhost:8888${endpoint}`;
      console.log('Début de la requête vers:', url);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const fetchOptions = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
      };
      
      // Ajouter le token d'authentification à l'en-tête si disponible
      if (token) {
        fetchOptions.headers.Authorization = `Bearer ${token}`;
        console.log('Token d\'authentification ajouté à la requête');
      } else {
        console.warn('Aucun token d\'authentification trouvé pour la requête:', url);
      }

      // Ajouter le corps de la requête si c'est une méthode POST, PUT, etc.
      if (body || options.body) {     
        fetchOptions.body = JSON.stringify(body || options.body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Gérer spécifiquement les erreurs d'authentification
        if (response.status === 401 || response.status === 403) {
          console.error('Erreur d\'authentification:', response.status);
          // Option: rediriger vers la page de connexion
          // window.location.href = '/login';
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Vérifier si la réponse contient du contenu
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        // Pour les endpoints qui retournent du JSON
        const result = await response.json();
        console.log('Données reçues:', result);
        setData(result);
        setLoading(false);
        return result;
      } else {
        console.log('Réponse vide reçue avec succès');
        setData({ success: true });
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return { data, loading, error, refetch: fetchData };
};