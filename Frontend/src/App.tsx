import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage'; 
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/dashboard/DashboardLayout'; // La ruta principal de la app

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Homepage />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        
        <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;