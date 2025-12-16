// src/components/Header.tsx
import React from 'react';
import '../styles/Header.styles.css'; 

// Usamos React.FC (Functional Component) para el tipado.
const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        
        <div className="logo">
          <span className="logo-text">GESTIFY</span>
        </div>

        <nav className="nav-menu">
          <a href="#features" className="nav-link">Funcionalidades</a>
          <a href="#pricing" className="nav-link">Precios</a>
          <a href="#contact" className="nav-link">Contacto</a>
          
          <button className="nav-button primary-cta-button">
            Iniciar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;