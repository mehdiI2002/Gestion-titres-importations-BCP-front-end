import * as React from 'react';
import { useState, useEffect } from 'react';
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
  
  // Réinitialiser la pagination quand les résultats changent
  useEffect(() => {
    setPage(0);
  }, [searchResults]);

  useEffect(() => {
    // Toujours charger les données au démarrage
    refetch();
  }, []);

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