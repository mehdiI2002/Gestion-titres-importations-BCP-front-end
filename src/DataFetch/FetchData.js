import { useState } from 'react';

export const useFetchData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Début de la requête vers:', `http://localhost:8089${endpoint}`);
      
      const response = await fetch(`http://localhost:8089${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Vérifier si la réponse contient du contenu
      const contentType = response.headers.get("content-type");
      
      // Si le endpoint commence par /accepter, c'est une action sans retour de données
      if (endpoint.startsWith('/titles/accepter/')) {
        console.log('Action exécutée avec succès');
        setData({ success: true });
      } else if (contentType && contentType.includes("application/json")) {
        // Pour les autres endpoints qui retournent du JSON
        const result = await response.json();
        console.log('Données brutes reçues:', result);
        setData(result);
      } else {
        console.log('Réponse vide reçue avec succès');
        setData({ success: true });
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return { data, loading, error, refetch: fetchData };
};