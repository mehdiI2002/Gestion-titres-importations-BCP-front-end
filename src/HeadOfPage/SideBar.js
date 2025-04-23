import React from 'react';
import { 
  Box, 
  Drawer,
  Avatar,
  Button,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  List,
  Typography,
  Toolbar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate, useLocation } from 'react-router-dom';
import InsightsIcon from '@mui/icons-material/Insights';

// Constantes pour les largeurs du drawer
const drawerWidth = 280;
const closedDrawerWidth = 70;

export default function SidebBar({ drawerOpen, userSession, handleSignOut, handleSignIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGestionTitres = () => {
    navigate('/selectTitles');
  };

  const handleHistorique = () => {
    navigate('/historique');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };
  const handleStatistiques = () => {
    navigate('/statistiques');
  };

  
  // Vérifier la page active pour le style de menu
  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/selectTitles' && location.pathname === '/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        transition: theme => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerOpen ? drawerWidth : closedDrawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#484c4c',
          color: '#fff',
          borderRight: '1px solid #666',
          overflow: 'hidden',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Toolbar />
      
      {drawerOpen && (
        <>
          <Box sx={{ 
            height: '120px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderBottom: '1px solid #666',
            p: 2
          }}>
            <img 
              src="/logo_bp_lg.png" 
              alt="Banque Centrale Populaire" 
              style={{
                height: '100px',
                objectFit: 'contain',
              }}
            />
          </Box>
          
          <Typography
            variant="h6"
            sx={{
              p: 2,
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            Titres d'Importation
          </Typography>
        </>
      )}
      
      {/* Menu principal */}
      <List sx={{ mt: drawerOpen ? 2 : 8 }}>
        {/* Gestion des Titres */}
        <ListItemButton 
          onClick={handleGestionTitres}
          selected={isActive('/selectTitles')}
          sx={{
            mb: 1,
            mx: drawerOpen ? 2 : 0.5,
            borderRadius: 1,
            justifyContent: drawerOpen ? 'initial' : 'center',
            '&.Mui-selected': {
              bgcolor: 'rgba(230, 121, 0, 0.25)',
              '&:hover': {
                bgcolor: 'rgba(230, 121, 0, 0.35)',
              }
            },
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 'auto' }}>
            <DescriptionIcon sx={{ 
              color: isActive('/selectTitles') ? '#e67900' : '#fff',
              fontSize: drawerOpen ? '1.3rem' : '1.8rem'
            }} />
          </ListItemIcon>
          {drawerOpen && (
            <ListItemText 
              primary="Gestion des Titres" 
              primaryTypographyProps={{
                fontWeight: isActive('/selectTitles') ? 'bold' : 'medium',
                color: isActive('/selectTitles') ? '#e67900' : '#fff'
              }}
            />
          )}
        </ListItemButton>
        
        {/* Historique */}
        <ListItemButton 
          onClick={handleHistorique}
          selected={isActive('/historique')}
          sx={{
            mb: 1,
            mx: drawerOpen ? 2 : 0.5,
            borderRadius: 1,
            justifyContent: drawerOpen ? 'initial' : 'center',
            '&.Mui-selected': {
              bgcolor: 'rgba(230, 121, 0, 0.25)',
              '&:hover': {
                bgcolor: 'rgba(230, 121, 0, 0.35)',
              }
            },
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 'auto' }}>
            <HistoryIcon sx={{ 
              color: isActive('/historique') ? '#e67900' : '#fff',
              fontSize: drawerOpen ? '1.3rem' : '1.8rem'
            }} />
          </ListItemIcon>
          {drawerOpen && (
            <ListItemText 
              primary="Historique" 
              primaryTypographyProps={{
                fontWeight: isActive('/historique') ? 'bold' : 'medium',
                color: isActive('/historique') ? '#e67900' : '#fff'
              }}
            />
          )}
        </ListItemButton>
        <ListItemButton 
    onClick={handleStatistiques}
    selected={isActive('/statistiques')}
    sx={{
      mb: 1,
      mx: drawerOpen ? 2 : 0.5,
      borderRadius: 1,
      justifyContent: drawerOpen ? 'initial' : 'center',
      '&.Mui-selected': {
        bgcolor: 'rgba(230, 121, 0, 0.25)',
        '&:hover': {
          bgcolor: 'rgba(230, 121, 0, 0.35)',
        }
      },
      '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.1)',
      }
    }}
  >
    <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 'auto' }}>
      <InsightsIcon sx={{ 
        color: isActive('/statistiques') ? '#e67900' : '#fff',
        fontSize: drawerOpen ? '1.3rem' : '1.8rem'
      }} />
    </ListItemIcon>
    {drawerOpen && (
      <ListItemText 
        primary="Statistiques" 
        primaryTypographyProps={{
          fontWeight: isActive('/statistiques') ? 'bold' : 'medium',
          color: isActive('/statistiques') ? '#e67900' : '#fff'
        }}
      />
    )}
  </ListItemButton>
        
        {/* Gestion Utilisateurs (Admin uniquement) */}
        {userSession && userSession.user.role === 'ADMIN' && (
          <ListItemButton 
            onClick={handleManageUsers}
            selected={isActive('/admin/users')}
            sx={{
              mb: 1,
              mx: drawerOpen ? 2 : 0.5,
              borderRadius: 1,
              justifyContent: drawerOpen ? 'initial' : 'center',
              '&.Mui-selected': {
                bgcolor: 'rgba(230, 121, 0, 0.25)',
                '&:hover': {
                  bgcolor: 'rgba(230, 121, 0, 0.35)',
                }
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 'auto' }}>
              <PeopleIcon sx={{ 
                color: isActive('/admin/users') ? '#e67900' : '#fff',
                fontSize: drawerOpen ? '1.3rem' : '1.8rem' 
              }} />
            </ListItemIcon>
            {drawerOpen && (
              <ListItemText 
                primary="Gestion Utilisateurs" 
                primaryTypographyProps={{
                  fontWeight: isActive('/admin/users') ? 'bold' : 'medium',
                  color: isActive('/admin/users') ? '#e67900' : '#fff'
                }}
              />
            )}
          </ListItemButton>
          
        )}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Profil utilisateur */}
      {drawerOpen && (
        <Box sx={{ p: 2, borderTop: '1px solid #666' }}>
          {userSession ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#e67900',
                    color: 'white',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  {userSession.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#fff">
                    {userSession.user.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    {userSession.user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<LogoutIcon />} 
                onClick={handleSignOut}
                fullWidth
                sx={{ 
                  mt: 1, 
                  borderColor: '#e67900',
                  color: '#e67900',
                  '&:hover': {
                    borderColor: '#ff8c1a',
                    bgcolor: 'rgba(230, 121, 0, 0.15)',
                  }
                }}
              >
                Se déconnecter
              </Button>
            </Box>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<LoginIcon />} 
              onClick={handleSignIn}
              fullWidth
              sx={{ 
                bgcolor: '#e67900', 
                '&:hover': { 
                  bgcolor: '#ff8c1a' 
                } 
              }}
            >
              Se connecter
            </Button>
          )}
        </Box>
      )}
    </Drawer>
  );
}