import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import TableHead from '@mui/material/TableHead'; 
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../DataFetch/FetchData';
import Typography from '@mui/material/Typography';
export default function HistoriqueTable({ searchResults }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  // Endpoint modifié pour l'historique
  const { data: fetchedData, loading, error, refetch } = useFetchData('/titles/historique');
  const navigate = useNavigate();
  
  // Réinitialiser la pagination quand les résultats changent
  useEffect(() => {
    setPage(0);
  }, [searchResults]);

  useEffect(() => {
    // Charger les données au démarrage
    refetch();
  }, []);  // Pas besoin de SSE pour l'historique, c'est juste un chargement initial

  // Utiliser soit les résultats de recherche, soit les données complètes
  const displayData = searchResults || fetchedData;
  const columns = [
    { id: 'numEnregistrement', label: 'Numero Enregistrement', minWidth: 80,  
      format: (value) => {
        return value ? value.toString() : '';
      }},
    { id: 'montantTotale', label: 'Montant Total', minWidth: 80, align: 'right' },
    { id: 'motantFret', label: 'Montant Fret', minWidth: 70, align: 'right' },
    { id: 'montantFOB', label: 'Montant FOB', minWidth: 80, align: 'right' },
    { id: 'devise', label: 'Devise', minWidth: 60, align: 'right' },
    { id: 'incotermString', label: 'Incoterm', minWidth: 60, align: 'right' },
    { id: 'ribBancaire', label: 'Rib Bancaire', minWidth: 80, align: 'center' },
    { id: 'typeMessage', label: 'Type de message', minWidth: 80, align: 'center' },
    { id: 'dateReception', label: 'Date de Réception', minWidth: 100, align: 'center',
      format: (value) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
      } 
    },
    { id: 'dateTraitement', label: 'Date de Traitement', minWidth: 100, align: 'center',
        format: (value) => {
          // Si la valeur est null, afficher "En cours de traitement" avec style visuel
          if (!value) return (
            <span style={{ color: 'gray', fontStyle: 'italic', fontWeight: '500' }}>
              En cours de traitement
            </span>
          );
          
          // Sinon afficher la date formatée
          const date = new Date(value);
          return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
        }
      },
    { id: 'etat', label: 'État', minWidth: 60, align: 'center',
      format: (value) => {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1); // Première lettre en majuscule
      }
    },

    {
      id: 'viewdetail',
      label: 'Actions',
      minWidth: 60,
      align: 'right',
      format: (value, row) => (
        <Link
          href="#"
          sx={{
            color: ' #e67900',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/details/titles/historique/${row.numEnregistrement}/${row.numeromessage}`);
          }}
        >
          Voir détails
        </Link>
      )
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading && !searchResults) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error && !searchResults) {
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
        Erreur: {error}
      </div>
    );
  }

  if (!displayData) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', marginLeft: '10px' }}>
      <Typography variant="h6" sx={{ padding: '16px', color: '#e67900', fontWeight: 'bold' }}>
        Historique des Titres d'Importation
      </Typography>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#e67900' ,  padding: '8px 6px'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${row.numEnregistrement}-${index}`}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}  style={{ padding: '8px 6px' }}  >
                          {column.format && column.id === 'viewdetail'
                            ? column.format(value, row)
                            : column.format
                              ? column.format(value)
                              : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={displayData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="ligne par page"

      />
    </Paper>
  );
}