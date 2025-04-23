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
  Divider,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData';
import NavBarV2 from '../HeadOfPage/NavBarV2';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// Ajoutez cet import avec les autres imports au début du fichier
import HomeIcon from '@mui/icons-material/Home';
import AppLayout from '../Layout/AppLayout';
export default function AddUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER'); // Valeur par défaut: USER
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  // Vérification que l'utilisateur est bien administrateur
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || 'null');
    
    if (!userInfo) {
      navigate('/auth'); // Rediriger vers la page de connexion si non connecté
      return;
    }
    
    // Vérifier si l'utilisateur est admin (selon votre structure)
    const userIsAdmin = userInfo.authorities && 
      Array.isArray(userInfo.authorities) && 
      userInfo.authorities.some(auth => auth.authority === 'ADMIN');
    
    setIsAdmin(userIsAdmin);
    
    if (!userIsAdmin) {
      // Rediriger les non-admins vers la page d'accueil
      navigate('/');
    }
  }, [navigate]);
  
  // Hook pour l'ajout d'un utilisateur
  const { loading, refetch } = useFetchData('/auth/user', { method: 'POST' });

  // Définition du thème personnalisé
  const theme = createTheme({
    palette: {
      primary: { main: '#e67900' },
      secondary: { main: '#401804' },
    }
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        role
      };
      
      const result = await refetch(`http://localhost:8888/auth/user/createUser`, userData);
      
      if (result) {
        console.log('Utilisateur créé avec succès:', result);
        setSubmitSuccess(true);
        
        // Réinitialiser le formulaire après succès
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('USER');
        
        // Redirection vers la liste des utilisateurs après un délai
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setSubmitError(err.message || 'Une erreur s\'est produite lors de la création de l\'utilisateur.');
    }
  };

  if (!isAdmin) {
    return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />;
  }

  return (
    <ThemeProvider theme={theme}>
    <AppLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 80px)',
          padding: '20px',
          background: '#f5f5f5',
        }}
      >
        {/* Fil d'Ariane */}
      

        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAddIcon fontSize="large" sx={{ color: '#e67900', mr: 1 }} />
              <Typography component="h1" variant="h5" sx={{ color: '#401804', fontWeight: 'bold' }}>
                Créer un Nouvel Utilisateur
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              En tant qu'administrateur, vous pouvez créer un nouveau compte utilisateur pour le système.
            </Typography>
            
            <Divider sx={{ width: '100%', mb: 3 }} />
            
            {submitError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {submitError}
              </Alert>
            )}
            
            {submitSuccess && (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Utilisateur créé avec succès! Redirection en cours...
              </Alert>
            )}
            
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
                    disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
              />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!errors.role}
                disabled={loading}
              >
                <InputLabel id="role-select-label">Rôle</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  value={role}
                  label="Rôle"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="USER">Utilisateur Standard</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="outlined"
                  sx={{ px: 4, py: 1.2 }}
                >
                  Annuler
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ px: 4, py: 1.2, position: 'relative' }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ position: 'absolute', color: 'white' }} />
                      <span style={{ visibility: 'hidden' }}>Créer</span>
                    </>
                  ) : "Créer l'utilisateur"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      </AppLayout>
    </ThemeProvider>
  );
}
