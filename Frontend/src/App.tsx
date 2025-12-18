import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import type { JSX } from 'react';

// Componente para proteger rutas privadas (requieren autenticación)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Cargando sesión...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (login/register)
// Si el usuario ya está autenticado, lo redirige al dashboard
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>; 
  }

  // Si ya está autenticado, redirigir al dashboard en lugar de mostrar login/register
  return isAuthenticated ? <Navigate to="/dashboard/inicio" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Homepage - siempre accesible */}
            <Route path="/" element={<Homepage />} />
            
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} /> 

            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            />

            {/* Manejo de 404 */}
            <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;