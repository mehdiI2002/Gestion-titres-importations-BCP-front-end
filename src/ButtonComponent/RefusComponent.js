
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useFetchData } from '../DataFetch/FetchData';
import { useNavigate } from 'react-router-dom';

export default function Refus({ comment, setError ,numeroMessage}) {
  const [open, setOpen] = React.useState(false);

  const [status, setStatus] = React.useState(null);
  const navigate = useNavigate();
  const { refetch, loading } = useFetchData(`/titles/refuser/${numeroMessage}/${encodeURIComponent(comment)}`);

  const handleClick = () => {
    if (!comment || comment.trim() === '') {
      // Signaler l'erreur si le motif est vide
      setError(true);
    } else {
      setOpen(true);
      setError(false);
    }
  };

  const handleRefus = async () => {
    try {
      setStatus('loading');
      await refetch();
      setStatus('success');
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      setStatus('error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (status === 'success') {
      navigate('/');
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="error"
        onClick={handleClick}
      >
        Refuser
      </Button>
      
      <Dialog
        open={open}
        onClose={() => status !== 'loading' && setOpen(false)}
      >
        <DialogTitle>
          {status === 'success' ? 
            "Demande refusée avec succès" : 
            "Confirmation de refus"}
        </DialogTitle>
        <DialogContent>
          {status === 'error' && (
            <DialogContentText color="error">
              Une erreur s'est produite lors du refus.
            </DialogContentText>
          )}
          {status === 'success' ? (
            <DialogContentText>
              La demande a été refusée avec succès.
            </DialogContentText>
          ) : status !== 'loading' && (
            <DialogContentText>
              Êtes-vous sûr de vouloir refuser cette demande ?
              <br /><br />
              <b>Motif:</b> {comment}
            </DialogContentText>
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
            <Button onClick={handleRefus} color="error" autoFocus>
              Confirmer le refus
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}