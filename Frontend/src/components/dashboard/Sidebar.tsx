import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Dashboard.styles.css';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleSidebar = () => setIsOpen(!isOpen);
    
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? '✕' : '☰'}
            </button>

            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></div>

            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-logo">
                    <img
                        src="/images/Gestify-logo-empresa.png"
                        alt="Gestify - Control y Eficiencia"
                        className="logo-image"
                    />
                </div>

                <nav>
                    <NavLink
                        to="/dashboard/inicio"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        onClick={closeSidebar}
                    >
                        <span className="sidebar-link-icon">🏠</span>
                        <span>Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/clientes"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        onClick={closeSidebar}
                    >
                        <span className="sidebar-link-icon">👥</span>
                        <span>Clientes</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/ordenes"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        onClick={closeSidebar}
                    >
                        <span className="sidebar-link-icon">📋</span>
                        <span>Órdenes</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/reportes"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        onClick={closeSidebar}
                    >
                        <span className="sidebar-link-icon">📊</span>
                        <span>Reportes y Caja</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/configuracion"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        onClick={closeSidebar}
                    >
                        <span className="sidebar-link-icon">⚙️</span>
                        <span>Configuración</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    © 2025 Gestify
                </div>
            </aside>
        </>
    );
};

export default Sidebar;