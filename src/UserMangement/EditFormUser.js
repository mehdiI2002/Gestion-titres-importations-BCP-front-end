import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Grid,
  createTheme,
  ThemeProvider,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData';
import NavBarV2 from '../HeadOfPage/NavBarV2';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import AppLayout from '../Layout/AppLayout';


export default function EditFormUser() {
  const { userId } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const { userEmail } = useParams();
  console.log('userEmail:', userEmail);
  const decodedEmail = userEmail ? decodeURIComponent(userEmail) : null
  
  // Hook pour récupérer les données de l'utilisateur
  const { data: userData, loading: loadingUser, error: userError, refetch: fetchUser } = useFetchData('/auth/user');
  
  // Hook pour la mise à jour de l'utilisateur
  const { loading: updatingUser, error: updateError, refetch: updateUser } = useFetchData('/auth/user', { method: 'POST' });

  // Chargement initial des données de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await fetchUser(`http://localhost:8888/auth/user?email=${decodedEmail}}`);
        if (user) {
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setEmail(user.email || '');
          setRole(user.role || '');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur:', err);
        setSubmitError('Impossible de charger les données de l\'utilisateur');
      }
    };
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  // Définition du thème personnalisé
  const theme = createTheme({
    palette: {
      primary: {
        main: '#e67900', // Couleur orange de l'application
      },
      secondary: {
        main: '#401804', // Couleur secondaire
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom et prénom
    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du mot de passe (optionnel en mode édition)
    if (password) {
      if (password.length < 4) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    // Validation du rôle
    if (!role) {
      newErrors.role = 'Veuillez sélectionner un rôle';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const userData = {
       
        firstname:firstName,
        lastname: lastName,
        email: email,
        role:role
      };
      let endpoint = `http://localhost:8888/auth/user/updateUser?email=${encodeURIComponent(decodedEmail)}`;

      
      // Ajouter le mot de passe uniquement s'il a été modifié
      if (password && password.trim() !== ''){
        endpoint = `http://localhost:8888/auth/user/updateUserPassword?email=${encodeURIComponent(decodedEmail)}`;

        userData.password = password;
      }
      
      const result = await updateUser(endpoint, userData);
      
      if (result) {
        console.log('Mise à jour réussie:', result);
        setSubmitSuccess(true);
        
        // Redirection vers la liste des utilisateurs après un délai
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur de mise à jour:', err);
      setSubmitError(err.message || 'Une erreur s\'est produite lors de la mise à jour. Veuillez réessayer.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppLayout>
   
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 120px)',
          padding: '20px',
          background: '#f5f5f5',
        }}
      >
        <Container component="main" maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.05)', 
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5" sx={{ mb: 1, color: '#401804', fontWeight: 'bold' }}>
                Modifier l'utilisateur
              </Typography>
              
              <Divider sx={{ width: '100%', mb: 3 }} />
              
              {loadingUser && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress sx={{ color: '#e67900' }} />
                </Box>
              )}
              
              {userError && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  Impossible de charger les données de l'utilisateur
                </Alert>
              )}
              
              {submitError && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              
              {submitSuccess && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                  Modifications enregistrées avec succès! Redirection en cours...
                </Alert>
              )}
              
              {!loadingUser && !userError && (
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="Prénom"
                        name="firstName"
                        autoFocus
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        disabled={updatingUser}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Nom"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        disabled={updatingUser}
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={updatingUser}
                  />
 <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.role}
                    disabled={updatingUser}
                  >
                    <InputLabel id="role-select-label">Rôle</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role"
                      value={role}
                      label="Rôle"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="USER">Utilisateur</MenuItem>
                      <MenuItem value="ADMIN">Administrateur</MenuItem>
                    </Select>
                    {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                  </FormControl>                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    Laisser les champs mot de passe vides pour conserver le mot de passe actuel
                  </Typography>
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Nouveau mot de passe (optionnel)"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={updatingUser}
                  />
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    name="confirmPassword"
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={updatingUser || !password}
                  />
                  
                 
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      onClick={handleCancel}
                      variant="outlined"
                      sx={{ 
                        px: 4,
                        py: 1.2,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                      }}
                    >
                      Annuler
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={updatingUser}
                      sx={{ 
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        position: 'relative'
                      }}
                    >
                      {updatingUser ? (
                        <>
                          <CircularProgress 
                            size={24} 
                            sx={{ 
                              position: 'absolute',
                              color: 'white'
                            }} 
                          />
                          <span style={{ visibility: 'hidden' }}>Enregistrer</span>
                        </>
                      ) : "Enregistrer les modifications"}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
      </AppLayout>
    </ThemeProvider>
  );
}