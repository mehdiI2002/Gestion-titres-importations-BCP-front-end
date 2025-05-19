import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Créer le contexte
const SSEContext = createContext(null);

// Hook personnalisé pour utiliser le contexte SSE
export const useSSE = () => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSE doit être utilisé dans un SSEProvider');
  }
  return context;
};

// Provider du contexte
export const SSEProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [latestEvent, setLatestEvent] = useState(null);
  const eventSourceRef = useRef(null);
  
  // Fonction pour ajouter une notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Supprimer automatiquement la notification après 5 secondes
    setTimeout(() => {
      removeNotification(id);
    }, 10000);
    
    return id;
  };
  
  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Configuration et gestion de la connexion SSE
  useEffect(() => {
    const setupSSE = () => {
      // Fermer toute connexion existante
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      try {
        // Créer une connexion SSE
        const eventSource = new EventSource('http://localhost:8888/sse/files');
        eventSourceRef.current = eventSource;
        
        // Écouter les événements
        eventSource.onmessage = (event) => {
          console.log('Événement SSE reçu:', event.data);
          
          // Analyser les données reçues
          let eventData;
          try {
            eventData = JSON.parse(event.data);
          } catch (e) {
            eventData = { message: event.data };
          }
          
          // Mettre à jour le dernier événement
          setLatestEvent(eventData);
          
          // Ajouter une notification
              addNotification(`Nouveau titre ajouté`, 'success');
        };
        
        eventSource.onerror = (error) => {
          console.error('Erreur SSE:', error);
          // Fermer la connexion en cas d'erreur
          eventSource.close();
          addNotification('Connexion aux notifications perdue. Tentative de reconnexion...', 'error');
          // Réessayer de se connecter après un délai
          setTimeout(setupSSE, 5000);
        };
      } catch (err) {
        console.error('Erreur lors de la création de la connexion SSE:', err);
        addNotification('Impossible de se connecter au service de notifications', 'error');
      }
    };
    
    // Initialiser la connexion SSE
    setupSSE();
    
    // Nettoyage à la destruction du composant
    return () => {
      if (eventSourceRef.current) {
        console.log('Fermeture de la connexion SSE');
        eventSourceRef.current.close();
      }
    };
  }, []);
  
  // Valeur du contexte exposée aux composants enfants
  const value = {
    latestEvent,
    notifications,
    addNotification,
    removeNotification
  };
  
  return (
    <SSEContext.Provider value={value}>
      {children}
    </SSEContext.Provider>
  );
};