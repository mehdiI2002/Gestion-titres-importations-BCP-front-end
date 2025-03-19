// filepath: /c:/Users/lenovo/OneDrive/Desktop/myDesktop/BCP PFE/Livrable/gestion-titre-importation-front-bcp/src/Routing/Routes.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetailsTable from '../TablesDetails/DetailsTableMessage';
import FirstPage from '../Pages/FirstPage';
import PageTwo from '../Pages/SecondPage';

 export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/details/:id/:numeroMessage" element={<PageTwo />} />      </Routes>
    </BrowserRouter>
  );
}
