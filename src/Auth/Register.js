
import React, { useState } from 'react';
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
  Link,
  createTheme,
  ThemeProvider,
  Alert
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  
  const { loading, error, refetch } = useFetchData('/auth/register', { method: 'POST' });

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
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du mot de passe
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    // Validation de la confirmation du mot de passe
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
      const result = await refetch(null, {
        email,
        password,
        role
      });
      
      if (result) {
        console.log('Inscription réussie:', result);
        setSubmitSuccess(true);
        
        // Redirection vers la page de connexion après un délai
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setSubmitError(err.message || 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
        }}
      >
        <Container component="main" maxWidth="sm">
          <Paper 
            elevation={8} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.05)', 
              background: '#fff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img 
                src="/logo_bp_lg.png" 
                alt="Banque Centrale Populaire" 
                style={{
                  height: '150px',
                  objectFit: 'contain',
                  marginBottom: '10px'
                }}
              />
              
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Créer un compte
              </Typography>
              
              {submitError && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              
              {submitSuccess && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                  Inscription réussie! Vous allez être redirigé vers la page de connexion.
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse email @groupbcp.com"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={loading}
                />
                
                <FormControl 
                  fullWidth 
                  margin="normal"
                  error={!!errors.role}
                  disabled={loading}
                >
                  <InputLabel id="role-select-label">Rôle souhaité</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role"
                    value={role}
                    label="Rôle souhaité"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="USER">Utilisateur</MenuItem>
                    <MenuItem value="ADMIN">Administrateur</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </FormControl>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress 
                        size={24} 
                        sx={{ 
                          position: 'absolute',
                          color: 'white'
                        }} 
                      />
                      <span style={{ visibility: 'hidden' }}>S'inscrire</span>
                    </>
                  ) : "S'inscrire"}
                </Button>
                
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/" variant="body2" color="primary">
                      Vous avez déjà un compte? Connectez-vous
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
          <Box sx={{ textAlign: 'center', mt: 2, opacity: 0.7 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Banque Centrale Populaire. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}