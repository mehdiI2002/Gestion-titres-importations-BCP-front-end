import React from 'react';
import { 
  Box, 
  IconButton, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Importer l'icône Plus
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchData } from '../DataFetch/FetchData';
import { useNavigate } from 'react-router-dom';

export default function ModifyAndDelete({ user, onUpdate }) {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { refetch } = useFetchData('', { method: 'POST' });
  const handleAdd = () => {
   navigate("/admin/addUser")
    // Implémentez la logique d'ajout ici
  };
  // Gérer la redirection vers le formulaire de modification
  const handleEdit = () => {
    // Cette fonction sera utilisée pour rediriger vers un formulaire de modification
    // Pour l'instant, on peut juste logger l'action
    navigate(`/admin/editeFormUser/${encodeURIComponent(user.email)}`);
    
    // Quand le formulaire sera prêt, vous pourrez décommenter cette ligne:
    // navigate(`/admin/users/edit/${user.id}`);
  };

  // Ouvrir le dialogue de suppression
  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Fermer le dialogue de suppression
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await refetch(`http://localhost:8888/auth/user/deleteUser`,{
        email: user.email,
      });
      setOpenDeleteDialog(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Divider sx={{ width: '100%', my: 1 }} />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        width: '100%', 
        pt: 1 
      }}>
      
      
        <IconButton 
          onClick={handleEdit}
          sx={{ 
            color: '#401804',
            '&:hover': { 
              color: '#e67900',
              backgroundColor: 'rgba(230, 121, 0, 0.1)'
            }
          }}
          title="Modifier l'utilisateur"
        >
          <EditIcon />
        </IconButton>
        
        <IconButton 
          onClick={handleOpenDelete}
          sx={{ 
            color: '#d32f2f',
            '&:hover': { 
              color: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)'
            }
          }}
          title="Supprimer l'utilisateur"
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle sx={{ color: '#d32f2f' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user?.firstName} {user?.lastName}</strong> ?
            <br /><br />
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDelete} 
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}