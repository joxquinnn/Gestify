import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
    <aside className="sidebar">
        <div className="sidebar-logo">GESTIFY APP</div>
        <nav>
            <Link to="/app/clientes" className="sidebar-link">Clientes</Link>
            <Link to="/app/ordenes" className="sidebar-link">Órdenes</Link>
            <Link to="/app/configuracion" className="sidebar-link">Configuración</Link>
        </nav>
    </aside>
);
export default Sidebar;