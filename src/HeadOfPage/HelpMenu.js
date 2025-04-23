import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
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
          Contact support
        </MenuItem>
      </Menu>
    </>
  );
}

