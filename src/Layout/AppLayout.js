import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import NavBarV2 from '../HeadOfPage/NavBarV2';
import SideBar from '../HeadOfPage/SideBar';

// Constantes pour les largeurs du drawer
const drawerWidth = 280;
const closedDrawerWidth = 70;

export default function AppLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations de session
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || 'null');
    const isUserAdmin = userInfo && userInfo.authorities && Array.isArray(userInfo.authorities) && 
        userInfo.authorities.some(auth => auth.authority === 'ADMIN');
    if (userInfo) {
        setUserSession({
            user: {
                name: userInfo.userName || 'Utilisateur',
                email: userInfo.email || '',
                role: isUserAdmin ? 'ADMIN' : 'USER',
            }
        });
    }
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
    setUserSession(null);
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* NavBar en haut */}
      <NavBarV2 
        userSession={userSession} 
        drawerOpen={drawerOpen} 
        toggleDrawer={toggleDrawer} 
      />
      
      {/* SideBar à gauche */}
      <SideBar
        drawerOpen={drawerOpen}
        userSession={userSession}
        handleSignOut={handleSignOut}
        handleSignIn={handleSignIn}
      />
      
      {/* Contenu principal avec Container */}
      <Container
        component="main"
        maxWidth="xl"
        disableGutters
        sx={{ 
          marginLeft:'0px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          mt: '64px', // Pour la hauteur de la NavBar
          // Marge de base constante avec la largeur du drawer
          ml: drawerOpen 
            ? `${drawerWidth}px) ` 
            : `${closedDrawerWidth}px - 5px`,
          // Largeur réduite pour tenir compte de la marge
          width: drawerOpen 
            ? `calc(100% - ${drawerWidth}px)` 
            : `calc(100% - ${closedDrawerWidth}px )`,
          transition: theme => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          height: 'calc(100vh - 64px)', // Hauteur totale moins la NavBar
          overflow: 'auto', // Permet le défilement
        }}
      >
        {children}
      </Container>
    </div>
  );
}