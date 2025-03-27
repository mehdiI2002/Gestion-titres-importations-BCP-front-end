import { useState, useEffect } from 'react';
import { Box, Typography, Link, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

export function PDF({ useFetch }) {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const { data, loading, error } = useFetch;
  const { id, numeroMessage } = useParams();

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
    
    const response = await fetch(`http://localhost:8089/titles/downloadPdf?filePath=${encodeURIComponent(sanitizedFilePath)}`, {
      method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setSelectedPdf(pdfUrl);
      window.open(pdfUrl, '_blank');
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
              color: 'bleu',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Document {index + 1} - {filePath.split('\\').pop()}
          </Link>
        ))}
      </Box>
    </Box>
  );
}