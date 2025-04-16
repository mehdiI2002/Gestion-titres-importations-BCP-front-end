import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import NavBarV2 from '../HeadOfPage/NavBarV2';
import { useFetchData } from '../DataFetch/FetchData';
import ModifyAndDelete from './ModifiyAdnDelete';
// Ajoutez ces imports au début du fichier
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';

export default function ListUsers() {
  const navigate = useNavigate();
  // Utiliser le hook personnalisé pour récupérer les utilisateurs
  const { data: users, loading, error, refetch } = useFetchData('/auth/user/users');

  // Charger les utilisateurs au chargement du composant
  useEffect(() => {
    refetch();
  }, []);

  // Récupérer les initiales à partir du nom complet
  const getInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Obtenir la couleur de l'avatar selon le rôle
  const getAvatarColor = (role) => {
    return role === 'ADMIN' ? '#e67900' : '#6e7582';
  };

  const handleUpdate = () => {
    // Rafraîchir la liste des utilisateurs après une suppression
    refetch();
  };

  // Gérer la navigation vers la page d'ajout d'utilisateur
  const handleAddUser = () => {
    navigate('/admin/addUser');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavBarV2 />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ py: 1.5 }}>
      <MuiLink 
        color="inherit" 
        href="/selectTitles" 
        sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
        underline="always"
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        Accueil
      </MuiLink>
      <MuiLink 
        color="inherit" 
        href="/admin/users" 
        sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
        underline="always"
      >
        <AdminPanelSettingsIcon sx={{ mr: 0.5 }} fontSize="small" />
        Administration des Utilisateurs
      </MuiLink>
  
    </Breadcrumbs>
  </Container>
  
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* En-tête avec titre et bouton d'ajout */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#401804' }}>
            Liste des Utilisateurs
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{
              bgcolor: '#e67900',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#d46e00',
              },
              px: 2,
              py: 1
            }}
          >
            Créer un utilisateur
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress sx={{ color: '#e67900' }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Une erreur est survenue: {error}
          </Typography>
        ) : !users || users.length === 0 ? (
          <Typography align="center" variant="h6">
            Aucun utilisateur trouvé
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3
                  }}>
                    {/* Avatar avec initiales */}
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: getAvatarColor(user.role),
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      {getInitials(user.firstName)}
                    </Avatar>
                    
                    {/* Nom et informations */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                      {user.firstName+' ' + user.lastName}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                      {user.email}
                    </Typography>
                    
                    {/* Badge de rôle */}
                    <Chip
                      label={user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                      sx={{
                        mb: 2,
                        bgcolor: user.role === 'ADMIN' ? '#e67900' : undefined,
                        color: user.role === 'ADMIN' ? 'white' : undefined,
                        fontWeight: user.role === 'ADMIN' ? 'bold' : 'normal',
                      }}
                    />
                    <ModifyAndDelete user={user} onUpdate={handleUpdate} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}