// src/components/Header.tsx
import React from 'react';
import '../styles/Header.styles.css'; 

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        
        <div className="header-left-group"> 
          
          <div className="logo">
            <img
              src="/images/Gestify-logo-empresa.png"
              alt="Gestify - Control y Eficiencia"
              className="logo-image"
            /> 
          </div>

          <nav className="nav-menu">
            <a href="#features" className="nav-link">FUNCIONALIDADES</a>
            <a href="#pricing" className="nav-link">PRECIOS</a>
          </nav>
        </div>

        <div className="header-right-group">
          
          <a href="/login" className="login-link">LOG IN</a>

          <button className="nav-button secondary-cta-button request-tour-button">
            PRODUCT TOUR
          </button>
          
          <button className="nav-button primary-cta-button request-tour-button">
            REQUEST A DEMO
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;