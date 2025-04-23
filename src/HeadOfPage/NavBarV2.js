import React from 'react';
import { 
  Box,
  IconButton,
  Typography,
  AppBar,
  Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Tooltip from '@mui/material/Tooltip';
import HelpMenu from './HelpMenu';

export default function NavBarV2({ userSession, drawerOpen, toggleDrawer }) {
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
        <HelpMenu />
      </Toolbar>
    </AppBar>
  );
}