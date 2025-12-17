// src/pages/dashboard/DashboardLayout.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import '../../styles/Dashboard.styles.css'; 

import ClientsPage from './ClientsPage'; 
import OrdersPage from './OrdersPage';
import SettingsPage from './SettingsPage';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
        
        <Sidebar />
        
        <main className="dashboard-content">
            
            
            <Routes>
                <Route path="clientes" element={<ClientsPage />} /> 
                
                <Route path="ordenes" element={<OrdersPage />} />
                <Route path="configuracion" element={<SettingsPage />} />

                <Route path="*" element={<ClientsPage />} /> 
            </Routes>
        </main>
    </div>
  );
};

export default DashboardLayout;