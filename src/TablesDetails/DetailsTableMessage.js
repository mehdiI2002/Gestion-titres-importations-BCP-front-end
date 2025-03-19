import { useParams } from 'react-router-dom';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function DetailsTableMessage({useFetch,id}) {
  const { data, loading, error } =useFetch;
  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  // Définir les champs que nous voulons afficher
  const fields = {
    numeroMessage: 'Numéro Message',
    emetteur: 'Émetteur',
    destinataire: 'Destinataire',
    dateMessage: 'Date Message',
    typeMessage: 'Type Message',
    fonction: 'Fonction'
  };

  // Formatter les valeurs si nécessaire
  const formatValue = (key, value) => {
    if (key === 'dateMessage') {
      return new Date(value).toLocaleString();
    }
    return value;
  };
  return (
    <>
     <Typography 
  variant="h6" 
  sx={{ 
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '20px',
    padding: '10px',
    borderBottom: '2px solid #e67900',
    width: 'fit-content'
  }}
>
  Titre d'importation avec le numéro d'enregistrement : {id}
</Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          width: '45%',
          margin: '10px',
          display: 'inline-block',
          verticalAlign: 'top'
        }}
      >
        <Table 
          sx={{ 
            minWidth: 300,
            '& .MuiTableCell-root': {
              padding: '6px',
              fontSize: '0.8rem'
            }
          }} 
          size="small"
        >
          <TableHead>
            <TableRow>
              {Object.values(fields).map((label) => (
                <TableCell 
                  key={label}
                  sx={{ backgroundColor: '#e67900', color: 'white' }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && (
              <TableRow>
                {Object.keys(fields).map((key) => (
                  <TableCell key={key}>
                    {formatValue(key, data[key])}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}