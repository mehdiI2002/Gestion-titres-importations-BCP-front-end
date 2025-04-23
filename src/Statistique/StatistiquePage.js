import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import AppLayout from '../Layout/AppLayout';
import { useFetchData } from '../DataFetch/FetchData';

// Format des données pour le graphique
const monthsOrder = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function StatistiquePage() {
  const [chartData, setChartData] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const { refetch, loading, error } = useFetchData('/titles/count-by-month');

  // Un seul useEffect avec un flag pour garantir un seul appel
  useEffect(() => {
    const fetchStatistics = async () => {
      if (requestSent) return;
      setRequestSent(true);
      
      try {
        const data = await refetch();
        
        // Traitement des données
        if (data && data.length > 0) {
          const orderedData = monthsOrder
            .map(month => {
              const found = data.find(item => item.month.toLowerCase() === month);
              return found ? found : { month, fileCount: 0 };
            })
            .filter(item => item.fileCount > 0);
          
          setChartData(orderedData);
        } else if (process.env.NODE_ENV === 'development') {
          // Données de démo pour le développement
          setChartData([
            { month: "janvier", fileCount: 1 },
            { month: "février", fileCount: 1 },
            { month: "mars", fileCount: 1 },
            { month: "avril", fileCount: 11 },
            { month: "juin", fileCount: 1 }
          ]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        
        // En mode développement, charger des données de démonstration même en cas d'erreur
        if (process.env.NODE_ENV === 'development') {
          setChartData([
            { month: "janvier", fileCount: 1 },
            { month: "février", fileCount: 1 },
            { month: "mars", fileCount: 1 },
            { month: "avril", fileCount: 11 },
            { month: "juin", fileCount: 1 }
          ]);
        }
      }
    };
    
    fetchStatistics();
  }, []); // Dépendances vides = exécution unique au montage

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px' 
        }}>
          <p style={{ margin: 0 }}><b>{label}</b></p>
          <p style={{ margin: 0, color: '#e67900' }}>
            {`${payload[0].value} fichier${payload[0].value > 1 ? 's' : ''}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#401804', mb: 3 }}>
          Statistiques des Titres d'Importation
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#e67900', mb: 2 }}>
            Nombre de fichiers traités par mois
          </Typography>
          
          {loading && !chartData.length ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
              <CircularProgress sx={{ color: '#e67900' }} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              Une erreur est survenue lors du chargement des statistiques.
            </Typography>
          ) : chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ 
                    value: 'Mois', 
                    position: 'insideBottomRight', 
                    offset: -10,
                    dy: 10
                  }}
                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Nombre de fichiers', 
                    angle: -90, 
                    position: 'insideLeft',
                    dx: -20
                  }}
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Bar 
                  name="Nombre de fichiers" 
                  dataKey="fileCount" 
                  fill="#e67900" 
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography align="center" variant="body1" sx={{ py: 10 }}>
              Aucune donnée disponible pour la période sélectionnée.
            </Typography>
          )}
        </Paper>
      </Box>
    </AppLayout>
  );
}