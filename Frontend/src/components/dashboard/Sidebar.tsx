import React from 'react';
import { NavLink} from 'react-router-dom';
import '../styles/HeroSection.styles.css';

const Sidebar: React.FC = () => {

    return (
        <aside className="sidebar">
            <div className="logo">
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
                >
                    <span className="sidebar-link-icon">🏠</span>
                    <span>Inicio</span>
                </NavLink>

                <NavLink 
                    to="/dashboard/clientes" 
                    className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                >
                    <span className="sidebar-link-icon">👥</span>
                    <span>Clientes</span>
                </NavLink>
                
                <NavLink 
                    to="/dashboard/ordenes" 
                    className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                >
                    <span className="sidebar-link-icon">📋</span>
                    <span>Órdenes</span>
                </NavLink>

                <NavLink 
                    to="/dashboard/reportes" 
                    className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                >
                    <span className="sidebar-link-icon">📊</span>
                    <span>Reportes y Caja</span>
                </NavLink>
                
                <NavLink 
                    to="/dashboard/configuracion" 
                    className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                >
                    <span className="sidebar-link-icon">⚙️</span>
                    <span>Configuración</span>
                </NavLink>
            </nav>

            {/* Opcional: Footer del sidebar */}
            <div className="sidebar-footer">
                © 2025 Gestify
            </div>
        </aside>
    );
};

export default Sidebar;