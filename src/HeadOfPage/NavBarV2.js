import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem,
  Avatar,
  Button,
  Divider,
  ListItemIcon,
  Typography,
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People'; // Importer l'icône pour gérer les utilisateurs
import { useNavigate } from 'react-router-dom';

export default function NavBarV2() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const navigate = useNavigate();
 
  // Récupérer les informations de session au chargement du composant
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || 'null');
    const isUserAdmin = userInfo.authorities && Array.isArray(userInfo.authorities) && 
      userInfo.authorities.some(auth => auth.authority === 'ADMIN');
    if (userInfo) {
      setUserSession({
        user: {
          name: userInfo.userName || 'Utilisateur',
          email: userInfo.email || '',
          role: isUserAdmin ? 'ADMIN' : 'USER', // Définir le rôle en fonction de l'analyse des authorities
         
        }
      });
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    handleClose();
    navigate('/auth');
  };

  // Ajout d'un gestionnaire pour la gestion des utilisateurs
  const handleManageUsers = () => {
    handleClose();
    navigate('/admin/users'); // Naviguer vers la page d'administration des utilisateurs
  };

  const handleSignOut = () => {
    // Supprimer les informations d'authentification
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
    
    // Réinitialiser l'état
    setUserSession(null);
    
    handleClose();
    navigate('/');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'gray',
        height: '60px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgb(255, 255, 255)'
      }}
    >
      <img 
        src="/logo_bp_lg.png" 
        alt="Banque Centrale Populaire" 
        style={{
          height: '150px',
          objectFit: 'contain',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon sx={{ color: 'white', fontSize: 30, marginRight: '20px' }} />
          </Badge>
        </IconButton>

        {/* Composant de compte utilisateur amélioré */}
        {userSession ? (
          <Tooltip title="Compte">
            <IconButton
              onClick={handleMenu}
              sx={{ 
                border: '2px solid #e67900',
                marginRight: '20px'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 30, 
                  height: 30, 
                  bgcolor: '#e67900',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                {userSession.user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            onClick={handleMenu}
          >
            <LoginIcon sx={{ color: 'white', fontSize: 30, marginRight: '20px' }} />
          </IconButton>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              width: 220,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {userSession ? (
            <>
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {userSession.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userSession.user.email}
                </Typography>
                {/* Afficher le rôle de l'utilisateur */}
                <Typography variant="body2" sx={{ 
                  color: userSession.user.role === 'ADMIN' ? '#e67900' : 'text.secondary',
                  fontWeight: 'medium'
                }}>
                  {userSession.user.role=== 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>
              <Divider />
              
              {/* Ajouter conditionnellement l'option de gestion des utilisateurs */}
              {userSession.user.role === 'ADMIN' && (
                <MenuItem onClick={handleManageUsers}>
                  <ListItemIcon>
                    <PeopleIcon fontSize="small" sx={{ color: '#e67900' }} />
                  </ListItemIcon>
                  Gérer les utilisateurs
                </MenuItem>
              )}
              
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Se déconnecter
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleSignIn}>Se connecter</MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
}