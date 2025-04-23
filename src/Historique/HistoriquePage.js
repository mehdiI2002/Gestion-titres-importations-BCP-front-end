import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import HistoriqueTable from './Historique';
import AppLayout from '../Layout/AppLayout';

export default function HistoriquePage() {
    const [searchResults, setSearchResults] = useState(null);
    const navigate = useNavigate();
    return (
        <AppLayout>
            <Container 
                       maxWidth="xl" 
                       sx={{ 
                           flexGrow: 1, 
                           py: 2, 
                           px: 3,
                           pt: 1,
                           overflow: 'auto'
                       }}
                   >
                <HistoriqueTable searchResults={searchResults} />
            </Container>
        </AppLayout>
    );
}

   