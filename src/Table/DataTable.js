import * as React from 'react';
import { useState, useEffect ,useRef} from 'react';
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

export default function ColumnGroupingTable({ searchResults }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: fetchedData, loading, error, refetch } = useFetchData('/titles/selectTittles');
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);
  const refetchTimeoutRef = useRef(null);
  
  // Réinitialiser la pagination quand les résultats changent
  useEffect(() => {
    setPage(0);
  }, [searchResults]);

  useEffect(() => {
    // Charger les données au démarrage
    refetch();
    
    // Fonction pour créer et configurer la connexion SSE
    const setupSSE = () => {
      // Fermer toute connexion existante
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      // Créer une connexion SSE
      const eventSource = new EventSource('http://localhost:8888/sse/files');
      eventSourceRef.current = eventSource;
      
      // Écouter les événements
      eventSource.onmessage = (event) => {
        console.log('un titre est ajoute au tableau', event.data);
        
        // Annuler tout refetch précédent en attente
        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
        }
        
        // Ajouter un délai avant le refetch pour éviter de surcharger le serveur
        refetchTimeoutRef.current = setTimeout(() => {
          refetch()
            .catch(err => {
              console.error('Erreur lors du refetch après notification:', err);
              // Réessayer après un délai plus long en cas d'échec
              setTimeout(refetch, 5000);
            });
        }, 1000); // Attendre 1 seconde avant de refetch
      };

      eventSource.onerror = (error) => {
        console.error('Erreur SSE:', error);
        // Fermer la connexion en cas d'erreur
        eventSource.close();
        // Réessayer de se connecter après un délai
        setTimeout(setupSSE, 5000);
      };
    };
    
    // Initialiser la connexion SSE
    setupSSE();
    
    return () => {
      // Nettoyer les timeouts et la connexion SSE
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        console.log('Fermeture de la connexion SSE');
        eventSourceRef.current.close();
      }
    };
  }, []);  // Supprimé refetch de la dépendance pour éviter les reconexions inutiles

  // Utiliser soit les résultats de recherche, soit les données complètes
  const displayData = searchResults || fetchedData;
  

  const columns = [
    // ... vos colonnes restent identiques...
    { id: 'numEnregistrement', label: 'Numero Enregistrement', minWidth: 100,  
      format: (value) => {
        return value ? value.toString() : '';
      }},
    { id: 'categorie', label: 'Categorie', minWidth: 70, align: 'center' },
    { id: 'montantTotale', label: 'Montant Total', minWidth: 100, align: 'right' },
    { id: 'motantFret', label: 'Montant Fret', minWidth: 80, align: 'right' },
    { id: 'montantFOB', label: 'Montant FOB', minWidth: 100, align: 'right' },
    { id: 'devise', label: 'Devise', minWidth: 70, align: 'right' },
    { id: 'incotermString', label: 'Incoterm', minWidth: 80, align: 'right' },
    { id: 'ribBancaire', label: 'Rib Bancaire', minWidth: 100, align: 'center' },
    {id: "typeMessage", label: "Type de message", minWidth: 100, align: 'center'},
    {
      id: 'viewdetail',
      label: 'Actions',
      minWidth: 70,
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
            navigate(`/details/${row.numEnregistrement}/${row.numeromessage}`);
          }}
        >
          View Detail
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
        Error: {error}
      </div>
    );
  }

  if (!displayData) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        No data available
      </div>
    );
  }

  return (
    <Paper sx={{ width: '95%', overflow: 'hidden', marginLeft: '30px' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#e67900' }}
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
                        <TableCell key={column.id} align={column.align}>
                          {column.format && column.id === 'viewdetail'
                            ? column.format(value, row)
                            : column.format && value != null
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
      />
    </Paper>
  );
}