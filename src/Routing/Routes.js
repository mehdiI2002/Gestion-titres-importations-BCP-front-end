// filepath: /c:/Users/lenovo/OneDrive/Desktop/myDesktop/BCP PFE/Livrable/gestion-titre-importation-front-bcp/src/Routing/Routes.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FirstPage from '../Pages/FirstPage';
import PageTwo from '../Pages/SecondPage';
import AuthPage from '../Pages/AuthenticationPage';
import Register from '../Auth/Register';
import Users from '../UserMangement/ListUsers';
import EditUser from '../UserMangement/EditFormUser';
import AddUser from '../UserMangement/AddUser';
import HistoriquePage from '../Historique/HistoriquePage';
import HistoriquePageDetailsTitle from '../Historique/HistoriquePageDetailsTittle';
import StatistiquePage from '../Statistique/StatistiquePage.js';
 export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/selectTitles" element={<FirstPage />} />
        <Route path="/details/:id/:numeroMessage" element={<PageTwo />} />
        <Route path = "/" element= {<AuthPage />} ></Route>    
        <Route  path = "/register" element = {<Register />}></Route> 
        <Route path = "/admin/users" element = {<Users />}></Route>
        <Route path = "/admin/editeFormUser/:userEmail" element = {<EditUser />}></Route>
        <Route path = "/admin/addUser" element = {<AddUser />}></Route>
        <Route path = "/historique" element = {<HistoriquePage />}></Route>
        <Route path="/details/titles/historique/:id/:numeroMessage" element={<HistoriquePageDetailsTitle />}/>
        <Route path="/statistiques" element={<StatistiquePage />} />
        </Routes>
    </BrowserRouter>
  );
}
