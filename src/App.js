import './App.css';
import NavBar from './HeadOfPage/NavBar';
import DataTable from './Table/DataTable';
import Routing from './Routing/Routes';
import { SSEProvider } from './context/SSEProvider';
function App() {
  return (
    <div className="App">
     <SSEProvider>
      <Routing />

         
          </SSEProvider>
          </div>
  );
}
export default App;
