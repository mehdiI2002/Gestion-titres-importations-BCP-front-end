import { useFetchData } from '../DataFetch/FetchData';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DetailsTableMessage from '../TablesDetails/DetailsTableMessage';
import DetailsTableOperator from '../TablesDetails/DetailsTableOperator';
import DetailsTableBank from '../TablesDetails/DatailsTableBank';
import DetailsTableTitle from '../TablesDetails/DetailsTableTitrreImportation';
import DetailsTableMarchandise from '../TablesDetails/DetailsTableMarchandise';
import { PDF } from '../files/PDF';
import NavBarV2 from '../HeadOfPage/NavBarV2';
// Nouveaux imports pour Breadcrumbs
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import Box from '@mui/material/Box';

export default function PageDetailsTitleHistorique() {
    const { id, numeroMessage } = useParams();
    const fetchData = useFetchData(`/titles/detailTitle/${id}/${numeroMessage}`);
    
    useEffect(() => {
        fetchData.refetch();
    }, []);
    
    return <>
        <NavBarV2 />
        {/* Fil d'Ariane (Breadcrumbs) */}
        <Box sx={{ px: 3, pt: 2 }}>
            <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ py: 1.5 }}>
                <Link 
                    color="inherit" 
                    component={RouterLink}
                    to="/selectTitles" 
                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 500,
                        '&:hover': {
                            textDecoration: 'underline',
                            color: '#e67900'
                        }
                     }}
                    underline="hover"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Accueil
                </Link>
                <Link 
                    color="inherit" 
                    component={RouterLink}
                    to="/historique" 
                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 , '&:hover': {
                        textDecoration: 'underline',
                        color: '#e67900'
                    }}}
                   
                >
                    <HistoryIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Historique
                </Link>
                <Link 
                    color="text.primary"
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        fontWeight: 600,
                        pointerEvents: 'none'
                    }}
                    underline="none"
                >
                    <DescriptionIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Détails du titre {id}
                </Link>
            </Breadcrumbs>
        </Box>
        
        {/* Contenu existant */}
        <DetailsTableMessage useFetch={fetchData} id={id} />
        <DetailsTableOperator useFetch={fetchData} id={id} />
        <DetailsTableBank useFetch={fetchData} id={id} /> 
        <DetailsTableMarchandise useFetch={fetchData} id={id} />
        <DetailsTableTitle useFetch={fetchData} id={id} />
        <PDF useFetch={fetchData} />
    </>
}