import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardPage from './DashboardPage';
import OrdersPage from './OrdersPage';
import ClientsPage from './ClientsPage';
import SettingsPage from './SettingsPage';
import '../../styles/Dashboard.styles.css';

const DashboardLayout: React.FC = () => {
  const [ordenes, setOrdenes] = useState(() => {
    const saved = localStorage.getItem('gestify_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gestify_orders', JSON.stringify(ordenes));
  }, [ordenes]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Routes>
          <Route index element={<DashboardPage ordenes={ordenes} />} />
          <Route path="inicio" element={<DashboardPage ordenes={ordenes} />} />
          <Route path="ordenes" element={<OrdersPage ordenes={ordenes} setOrdenes={setOrdenes} />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;