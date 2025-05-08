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
import { 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AppLayout from '../Layout/AppLayout';
import { useFetchData } from '../DataFetch/FetchData';

// Format des données pour le graphique
const monthsOrder = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function StatistiquePage() {
  // État pour les données filtrées à afficher dans le graphique
  const [chartData, setChartData] = useState([]);
  // État pour stocker toutes les données reçues de l'API
  const [allData, setAllData] = useState([]);
  // État pour les années disponibles dans les données
  const [availableYears, setAvailableYears] = useState([]);
  // État pour l'année actuellement sélectionnée
  const [selectedYear, setSelectedYear] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  
  // Utilisation du hook personnalisé pour l'appel API
  const { refetch, loading, error } = useFetchData('/titles/count-by-month');

  // Fonction pour extraire les années disponibles des données
  const extractYears = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    // Extraire toutes les années uniques et les trier
    const years = [...new Set(data.map(item => item.year))];
    return years.sort((a, b) => b - a); // Tri décroissant pour avoir l'année la plus récente en premier
  };

  // Fonction pour filtrer les données par année
  const filterDataByYear = (data, year) => {
    if (!data || !Array.isArray(data) || !year) return [];
    
    // Filtrer les données pour l'année sélectionnée
    const filteredByYear = data.filter(item => item.year === year);
    
    // Créer un tableau complet avec tous les mois, même ceux sans données
    const complete = monthsOrder.map(month => {
      const found = filteredByYear.find(item => item.month.toLowerCase() === month.toLowerCase());
      return found ? found : { month, year, fileCount: 0 };
    }).filter(item => item.fileCount > 0); // Ne garder que les mois avec des fichiers
    
    return complete;
  };

  // Gestionnaire de changement d'année
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setChartData(filterDataByYear(allData, year));
  };

  // Effet pour charger les données une seule fois
  useEffect(() => {
    const fetchStatistics = async () => {
      if (requestSent) return;
      setRequestSent(true);
      
      try {
        const data = await refetch();
        
        // Vérification des données
        if (data && Array.isArray(data) && data.length > 0) {
          console.log("Données reçues:", data);
          setAllData(data);
          
          // Extraire les années disponibles
          const years = extractYears(data);
          setAvailableYears(years);
          
          // Sélectionner l'année la plus récente par défaut
          if (years.length > 0) {
            const latestYear = years[0]; // La première année est la plus récente (après tri)
            setSelectedYear(latestYear);
            setChartData(filterDataByYear(data, latestYear));
          }
        } else if (process.env.NODE_ENV === 'development') {
          // Données de démo en cas d'absence de données
          const mockData = [
            { month: "avril", year: 2025, fileCount: 17 },
            { month: "avril", year: 2024, fileCount: 1 },
            { month: "mars", year: 2024, fileCount: 1 }
          ];
          
          setAllData(mockData);
          const years = extractYears(mockData);
          setAvailableYears(years);
          
          if (years.length > 0) {
            setSelectedYear(years[0]);
            setChartData(filterDataByYear(mockData, years[0]));
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        
        // Données de démo en cas d'erreur
        if (process.env.NODE_ENV === 'development') {
          const mockData = [
            { month: "avril", year: 2025, fileCount: 17 },
            { month: "avril", year: 2024, fileCount: 1 },
            { month: "mars", year: 2024, fileCount: 1 }
          ];
          
          setAllData(mockData);
          const years = extractYears(mockData);
          setAvailableYears(years);
          
          if (years.length > 0) {
            setSelectedYear(years[0]);
            setChartData(filterDataByYear(mockData, years[0]));
          }
        }
      }
    };
    
    fetchStatistics();
  }, []);

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
          <p style={{ margin: 0 }}><b>{label} {selectedYear}</b></p>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e67900' }}>
            Nombre de fichiers reçus par mois
            </Typography>
            
            {availableYears.length > 0 && (
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ 
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#e67900', // bordure orange au focus
                    },
                    '&:hover fieldset': {
                      borderColor: '#e67900', // bordure orange au survol
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#e67900', // Label orange au focus
                  },
                  '& .MuiSelect-icon': {
                    color: '#e67900', // Icône de la flèche en orange
                  }
                }}
              >
                <InputLabel id="year-select-label">Année</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                  label="Année"
                  sx={{
                    '&.Mui-focused': {
                      color: '#e67900', // Texte orange quand sélectionné
                    }
                  }}
                >
                  {availableYears.map(year => (
                    <MenuItem 
                      key={year} 
                      value={year}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(230, 121, 0, 0.1)', // Fond orange clair pour l'élément sélectionné
                          '&:hover': {
                            backgroundColor: 'rgba(230, 121, 0, 0.2)', // Fond orange plus foncé au survol
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(230, 121, 0, 0.05)', // Léger fond orange au survol
                        }
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          
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
                  name={`Nombre de fichiers (${selectedYear})`}
                  dataKey="fileCount" 
                  fill="#e67900" 
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography align="center" variant="body1" sx={{ py: 10 }}>
              Aucune donnée disponible pour l'année {selectedYear}.
            </Typography>
          )}
        </Paper>
      </Box>
    </AppLayout>
  );
}