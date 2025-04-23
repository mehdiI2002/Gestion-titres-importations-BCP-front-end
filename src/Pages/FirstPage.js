import ColumnGroupingTable from "../Table/DataTable";
import TextFieldBar from "../CherchBar/TextField";
import { useState } from 'react';
import AppLayout from '../Layout/AppLayout';
import { Box } from '@mui/material';
export default function FirstPage() {
    const [searchResults, setSearchResults] = useState(null);
    
    const handleSearchResults = (results) => {
        console.log("Résultats de recherche reçus :", results);
        setSearchResults(results);
    };

    return (
        <AppLayout>
                <TextFieldBar onSearchResults={handleSearchResults} />
                <ColumnGroupingTable searchResults={searchResults} />
        </AppLayout>
    );
}