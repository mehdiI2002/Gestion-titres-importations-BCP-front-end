import { useFetchData } from '../DataFetch/FetchData';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DetailsTableMessage from '../TablesDetails/DetailsTableMessage';
import DetailsTableOperator from '../TablesDetails/DetailsTableOperator';
import DetailsTableBank from '../TablesDetails/DatailsTableBank';
import DetailsTableTitle from '../TablesDetails/DetailsTableTitrreImportation';
import DetailsTableMarchandise from '../TablesDetails/DetailsTableMarchandise';
import ButtonContainer from '../ButtonComponent/ButtonContainer';
import { PDF } from '../files/PDF';  // Add this import
import NavBarV2 from '../HeadOfPage/NavBarV2';

export default function PageTwo() {
    const { id, numeroMessage } = useParams();
    const fetchData = useFetchData(`/titles/detailTitle/${id}/${numeroMessage}`);
    useEffect(() => {
        fetchData.refetch();
      }, []);
    return <>
    <NavBarV2 />
        <DetailsTableMessage useFetch={fetchData} id={id} />
        <DetailsTableOperator useFetch={fetchData} id={id} />
        <DetailsTableBank useFetch={fetchData} id={id} /> 
        <DetailsTableMarchandise useFetch={fetchData} id={id} />
        <DetailsTableTitle useFetch={fetchData} id={id} />
        <PDF useFetch={fetchData} /> 
        <ButtonContainer  numeroMessage = {numeroMessage}/> 
    </>
}