import { useState } from 'react';
import NavBarV2 from "../HeadOfPage/NavBarV2";
import ColumnGroupingTable from "../Table/DataTable";
import TextFieldBar from "../CherchBar/TextField";

export default function FirstPage() {
    const [searchResults, setSearchResults] = useState(null);
    
    const handleSearchResults = (results) => {
        console.log("Résultats de recherche reçus :", results);
        setSearchResults(results);
    };

    return <>
        <NavBarV2 />
        <TextFieldBar onSearchResults={handleSearchResults} />
        <ColumnGroupingTable searchResults={searchResults} />
    </>
}