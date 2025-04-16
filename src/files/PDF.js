import { useState, useEffect } from 'react';
import { Box, Typography, Link, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData';

export function PDF({ useFetch }) {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const { data, loading, error } = useFetch;
  const { id, numeroMessage } = useParams();
  
  // Initialiser un hook useFetchData pour le téléchargement du PDF
  // Noter qu'on ne définit pas d'endpoint fixe ici car il changera selon le PDF sélectionné
  const { refetch: fetchPdf, loading: loadingPdf } = useFetchData('', {
    method: 'GET',
    headers: { Accept: '*/*' } // Accepter tous les types de contenu, pas seulement du JSON
  });

  // Cleanup function for PDF URLs
  useEffect(() => {
    return () => {
      if (selectedPdf) {
        URL.revokeObjectURL(selectedPdf);
      }
    };
  }, [selectedPdf]);

  const handlePdfClick = async (filePath) => {
    try {
      const sanitizedFilePath = filePath.replace(/\\/g, '/');
      const encodedPath = encodeURIComponent(sanitizedFilePath);
      
      // Utiliser fetchPdf avec l'endpoint complet comme premier argument
      const response = await fetchPdf(`/titles/downloadPdf?filePath=${encodedPath}`);
      
      // Si la réponse n'est pas un blob (cas particulier), il faut faire une requête spéciale
      // car notre hook useFetchData est configuré pour traiter des réponses JSON
      if (!(response instanceof Blob)) {
        // Faire un appel direct pour récupérer le blob
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const fetchOptions = {
          method: 'GET',
          headers: {}
        };
        
        if (token) {
          fetchOptions.headers.Authorization = `Bearer ${token}`;
        }
        
        const directResponse = await fetch(
          `http://localhost:8888/titles/downloadPdf?filePath=${encodedPath}`, 
          fetchOptions
        );
        
        if (!directResponse.ok) {
          throw new Error('Failed to fetch PDF');
        }
        
        const blob = await directResponse.blob();
        const pdfUrl = URL.createObjectURL(blob);
        setSelectedPdf(pdfUrl);
        window.open(pdfUrl, '_blank');
      } else {
        // Dans le cas où notre hook retourne déjà un blob (moins probable avec l'implémentation actuelle)
        const pdfUrl = URL.createObjectURL(response);
        setSelectedPdf(pdfUrl);
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!data?.pdfFilePaths?.length) return <Typography>Aucun document disponible</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Documents disponibles
        </Typography>
        {data.pdfFilePaths.map((filePath, index) => (
          <Link
            key={index}
            component="button"
            onClick={() => handlePdfClick(filePath)}
            sx={{
              display: 'block',
              mb: 1,
              textAlign: 'left',
              cursor: 'pointer',
              color: 'primary.main', // Utiliser la couleur primaire au lieu de 'bleu'
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            {loadingPdf && selectedPdf === filePath ? (
              <CircularProgress size={16} sx={{ mr: 1 }} />
            ) : null}
            Document {index + 1} - {filePath.split('\\').pop()}
          </Link>
        ))}
      </Box>
    </Box>
  );
}