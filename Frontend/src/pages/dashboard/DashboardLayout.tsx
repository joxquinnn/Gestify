// src/pages/dashboard/DashboardLayout.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardPage from './DashboardPage';
import OrdersPage from './OrdersPage';
import ClientsPage from './ClientsPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import '../../styles/Dashboard.styles.css';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="inicio" element={<DashboardPage />} />
          <Route path="ordenes" element={<OrdersPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="configuracion" element={<SettingsPage />} />

          {/* Redirigir cualquier sub-ruta desconocida a inicio */}
          <Route path="*" element={<Navigate to="inicio" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;