import * as React from 'react';
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBarV2() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <NotificationsIcon sx={{ color: 'white', fontSize: 30,marginRight:'20px' }} />
          </Badge>
        </IconButton>

        <IconButton
          onClick={handleMenu}
        >
          <AccountCircleIcon sx={{ color: 'white' ,fontSize: 30 ,marginRight:'20px'}} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Se connecter</MenuItem>
          <MenuItem onClick={handleClose}>Se déconnecter</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}