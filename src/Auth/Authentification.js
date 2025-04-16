import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Link, 
  Paper, 
  Box, 
  Grid, 
  Typography,
  Container,
  CircularProgress,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData'; // Importation du hook
import { Link as RouterLink } from 'react-router-dom';


export default function Authentification() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  // Initialisation du hook avec l'endpoint d'authentification et la méthode POST
  const { refetch } = useFetchData('/auth/authenticate', { method: 'POST' });

  // Définition du thème personnalisé
  const theme = createTheme({
    palette: {
      primary: {
        main: '#e67900', // Couleur orange de votre application
      },
      secondary: {
        main: '#401804', // Couleur secondaire
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation des champs
    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Regex simple pour valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Utilisation de refetch au lieu de fetch direct
      const data = await refetch(null, {
        email,
        password
      });
      
      console.log('Authentification réussie:', data);
      
      // Stocker le token JWT selon l'option "Se souvenir de moi"
      if (data.token) {
        // Décoder le token pour extraire les informations
        const decodedToken = jwtDecode(data.token);      
          console.log('Token décodé:', decodedToken);
        
        // Extraire le rôle du token (ajustez le nom du champ selon votre structure de token)
        const authorities = decodedToken.authorities || [];
        
        // Créer l'objet d'informations utilisateur avec le rôle extrait du token
        const userInfo = {
          email: email,
          userName: data.userName || email.split('@')[0],
          authorities: authorities // Utiliser le rôle extrait du token
        };
        
        // Stocker les informations selon l'option "Se souvenir de moi"
        if (rememberMe) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }
      
      // Rediriger vers la page d'accueil
      navigate('/selectTitles');
    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
          backgroundImage: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)', // Fond dégradé subtil
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
                  marginBottom: '16px'
                }}
              />
              
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Connexion
              </Typography>
              
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
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
                  disabled={loading}
                  InputProps={{
                    sx: {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    sx: {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      color="primary" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Se souvenir de moi"
                />
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
                      <span style={{ visibility: 'hidden' }}>Se connecter</span>
                    </>
                  ) : "Se connecter"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" sx={{ color: 'primary.main' }}>
                      Mot de passe oublié?
                    </Link>
                  </Grid>
                  <Grid item>
  <Link 
    component={RouterLink} 
    to="/register" 
    variant="body2" 
    sx={{ color: 'primary.main' }}
  >
    {"Pas de compte? S'inscrire"}
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