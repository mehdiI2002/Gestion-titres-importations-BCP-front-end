import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSSE } from '../context/SSEContext';

export default function NotificationSystem() {
  const { notifications, removeNotification } = useSSE();
  
  // Position des notifications
  const anchorOrigin = {
    vertical: 'top',
    horizontal: 'right',
  };
  
  return (
    <Stack spacing={2} sx={{ 
      position: 'fixed', 
      top: 24, 
      right: 24, 
      zIndex: 2000,
      maxWidth: '350px'
    }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={anchorOrigin}
          sx={{ position: 'static', mb: 1 }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ 
              width: '100%',
              fontWeight: 'medium',
              backgroundColor: notification.type === 'success' ? '#e67900' : undefined,
              '& .MuiAlert-icon': {
                color: notification.type === 'success' ? 'white' : undefined
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}