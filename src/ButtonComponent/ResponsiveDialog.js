
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useFetchData } from '../DataFetch/FetchData'; 
import { useNavigate } from 'react-router-dom'; // Ajout de cet import

export default function ResponsiveDialog({numeroMessage}) {
  const { refetch, loading } = useFetchData(`/accepter/${numeroMessage}`);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const navigate = useNavigate(); // Initialisation du hook pour la navigation

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAccept = async () => {
    try {
      setStatus('loading');
      await refetch();
      setStatus('success');
  
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      setStatus('error');
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    // Redirection vers la page des titres
    navigate('/'); // Ajustez ce chemin selon votre structure de routes
  };
  return (
    <React.Fragment>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Accepter
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => status !== 'loading' && setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {status === 'success' ? 
            "Demande acceptée avec succès !" : 
            "Êtes-vous sûr d'accepter cette demande de domiciliation ?"}
        </DialogTitle>
        <DialogContent>
          {status === 'error' && (
            <p style={{ color: 'red' }}>
              Une erreur s'est produite. Veuillez réessayer.
            </p>
          )}
          {status === 'success' && (
            <p>
              La demande a été traitée avec succès. 
            </p>
          )}
        </DialogContent>
        <DialogActions>
          {status !== 'success' && status !== 'loading' && (
            <Button onClick={() => setOpen(false)}>
              Annuler
            </Button>
          )}
          {status === 'loading' ? (
            <Button disabled>
              Traitement en cours...
            </Button>
          ) : status === 'success' ? (
            <Button onClick={handleClose} autoFocus>
             Retour à la liste
            </Button>
          ) : (
            <Button onClick={handleAccept} autoFocus>
              Accepter
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}