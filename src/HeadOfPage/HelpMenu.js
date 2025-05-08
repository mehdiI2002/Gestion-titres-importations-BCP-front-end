import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NavBarV2 from './NavBarV2';
export default function HelpMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContactSupport = () => {
    handleClose();
    
    // Récupérer les informations utilisateur du stockage
    const userInfoString = sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo');
    let userEmail = '';
    
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        userEmail = userInfo.email || '';
      } catch (e) {
        console.error('Erreur de lecture des informations utilisateur:', e);
      }
    }
    
    // Construire l'URL Gmail avec paramètres
    const supportEmail = 'support@groupebcp.com'; // Remplacer par l'email de support réel
    const subject = encodeURIComponent('Demande d\'assistance - Application Titres d\'Importation');
    const body = encodeURIComponent(`Bonjour,\n\nJe rencontre un problème avec l'application de gestion des titres d'importation.\n\nDétails du problème:\n[Décrivez votre problème ici]\n\nCordialement,\n`);
    
    // Créer l'URL Gmail
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${subject}&body=${body}`;
    
    // Ouvrir Gmail dans un nouvel onglet
    window.open(gmailUrl, '_blank');
  };

  const handleWebsiteSupport = () => {
    handleClose();
    window.open('https://www.groupebcp.com/fr/contacts', '_blank');
  };

  return (
    <>
      <Tooltip title="Aide" arrow>
        <IconButton 
          color="inherit" 
          aria-label="help" 
          onClick={handleOpen}
          edge="end"
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleContactSupport}>
          <ListItemIcon>
            <EmailIcon fontSize="small" sx={{ color: '#e67900' }} />
          </ListItemIcon>
          <ListItemText>Contacter par email</ListItemText>
        </MenuItem>
       
      </Menu>
    </>
  );
}