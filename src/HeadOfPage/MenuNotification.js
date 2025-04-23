import React from 'react';
import { 
  Menu, 
  MenuItem, 
  Box, 
  Typography, 
  Button, 
  Divider,
  ListItemIcon
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const MenuNotification = ({ 
  anchorEl, 
  open, 
  handleClose, 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          width: 320,
          maxHeight: 400,
          '& .MuiList-root': {
            paddingTop: 0,
            paddingBottom: 0
          }
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsActiveIcon sx={{ mr: 1, color: '#e67900' }} />
          Notifications
        </Typography>
        {notifications.some(notif => !notif.read) && (
          <Button 
            size="small" 
            onClick={onMarkAllAsRead}
            sx={{ color: '#e67900', fontWeight: 'bold', '&:hover': { bgcolor: 'rgba(230, 121, 0, 0.1)' } }}
          >
            Tout lire
          </Button>
        )}
      </Box>
      <Divider />
      
      {notifications.length === 0 ? (
        <MenuItem disabled sx={{ py: 2, textAlign: 'center' }}>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </Box>
        </MenuItem>
      ) : (
        notifications.map((notification) => (
          <MenuItem 
            key={notification.id} 
            onClick={() => onMarkAsRead(notification.id)}
            sx={{
              py: 1.5,
              px: 2,
              borderLeft: notification.read ? 'none' : '3px solid #e67900',
              backgroundColor: notification.read ? 'inherit' : 'rgba(230, 121, 0, 0.05)',
              "&:hover": {
                backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(230, 121, 0, 0.1)',
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              {!notification.read && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="caption" sx={{ color: '#e67900', fontWeight: 'bold' }}>
                    Nouveau
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" sx={{ 
                fontWeight: notification.read ? 'normal' : 'bold',
                color: notification.read ? 'text.primary' : '#333'
              }}>
                {notification.message}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {notification.timestamp}
                </Typography>
                {notification.read && (
                  <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                    <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default MenuNotification;