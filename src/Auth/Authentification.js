import React, { useState } from 'react';
import { 
  Avatar,
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
  createTheme,
  ThemeProvider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Authentification() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Ici, vous devriez implémenter la logique d'authentification
    // Par exemple, un appel API pour vérifier les identifiants

    if (email === 'admin@example.com' && password === 'password') {
      // Authentification réussie, rediriger vers la page d'accueil
      navigate('/');
    } else {
      // Échec de l'authentification
      setError('Email ou mot de passe incorrect');
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
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Se souvenir de moi"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  Se connecter
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Mot de passe oublié?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Pas de compte? S'inscrire"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}