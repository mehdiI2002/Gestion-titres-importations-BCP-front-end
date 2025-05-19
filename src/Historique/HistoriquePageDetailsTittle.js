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
import AppLayout from '../Layout/AppLayout';

export default function PageDetailsTitleHistorique() {
    const { id, numeroMessage } = useParams();
    const fetchData = useFetchData(`/titles/detailTitle/${id}/${numeroMessage}`);
    
    useEffect(() => {
        fetchData.refetch();
    }, []);
    
    return (
        <AppLayout>
            {/* NavBarV2 n'est plus nécessaire ici, il est déjà inclus dans AppLayout */}
            {/* Fil d'Ariane (Breadcrumbs) peut être ajouté ici si besoin */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <DetailsTableMessage useFetch={fetchData} id={id} />
                <DetailsTableOperator useFetch={fetchData} id={id} />
                <DetailsTableBank useFetch={fetchData} id={id} />
                <DetailsTableMarchandise useFetch={fetchData} id={id} />
            </Box>
            <Box sx={{ width: '100%', mb: 3 }}>
                <DetailsTableTitle useFetch={fetchData} id={id} />
            </Box>
            <PDF useFetch={fetchData} />
        </AppLayout>
    );
}