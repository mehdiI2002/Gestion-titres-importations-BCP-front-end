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

export default function DetailsTableMarchandise({useFetch, id}) {
  const { data, loading, error } = useFetch;

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const bankFields = {
    nomenclature : 'Nomenclature',
    paysOrigine : 'Pays Origine',
    designation : 'Designation',
    quantite : 'Quantite',
    uniteComplementaire : 'Unite Complementaire',
    poidsUnit : 'Poids Net',
  };

  return (
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
            {Object.values(bankFields).map((label) => (
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
              {Object.keys(bankFields).map((key) => (
                <TableCell key={key}>
                  {data[key]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}