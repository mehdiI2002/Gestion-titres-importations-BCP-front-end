import React, { useState } from 'react';
import { 
  Box,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import HelpMenu from './HelpMenu';
import { useSSE } from '../context/SSEProvider.js';

export default function NavBarV2({ userSession, drawerOpen, toggleDrawer }) {
  const { notifications, removeNotification } = useSSE();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const notificationMenuOpen = Boolean(notificationAnchorEl);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClear = (id) => {
    removeNotification(id);
    // Si c'était la dernière notification, fermer le menu
    if (notifications.length <= 1) {
      handleNotificationClose();
    }
  };

  const handleClearAll = () => {
    // Supprimer toutes les notifications
    notifications.forEach(notification => removeNotification(notification.id));
    handleNotificationClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#484c4c',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
        >
          {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Gestion des Titres d'Importation
        </Typography>
        
        {/* Badge de statut de connexion */}
        <Tooltip 
          title={userSession ? "Connecté" : "Non connecté"} 
          arrow
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <FiberManualRecordIcon 
              fontSize="small" 
              sx={{ 
                color: userSession ? '#4caf50' : '#f44336',
                animation: userSession ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.6 }
                }
              }} 
            />
            <Typography variant="body2" sx={{ ml: 0.5, display: { xs: 'none', md: 'block' } }}>
              {userSession ? 'Connecté' : 'Non connecté'}
            </Typography>
          </Box>
        </Tooltip>

        {/* Icône de notifications avec badge */}
        <Box sx={{ mr: 2 }}>
          <Tooltip title="Notifications" arrow>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              size="large"
            >
              <Badge 
                badgeContent={notifications.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#e67900',
                    color: 'white'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Menu de notifications */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationMenuOpen}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { 
                width: 350,
                maxHeight: 400,
                overflow: 'auto'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#401804' }}>
                Notifications
              </Typography>
              {notifications.length > 0 && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#e67900', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={handleClearAll}
                >
                  Tout effacer
                </Typography>
              )}
            </Box>
            <Divider />
            
            {notifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
                  Aucune notification
                </Typography>
              </MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={() => handleNotificationClear(notification.id)}
                  sx={{
                    borderLeft: `4px solid ${notification.type === 'success' ? '#e67900' : 
                              notification.type === 'error' ? '#f44336' : 
                              notification.type === 'warning' ? '#ff9800' : '#2196f3'}`,
                    my: 0.5,
                    mx: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(230, 121, 0, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#e67900' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.message}
                    primaryTypographyProps={{
                      variant: 'body2',
                      style: { 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }
                    }}
                  />
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
        
        <HelpMenu />
      </Toolbar>
    </AppBar>
  );
}