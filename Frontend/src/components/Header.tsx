// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.styles.css'; 

const Header: React.FC = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <button 
              onClick={() => scrollToSection('features')}
              className="nav-link"
            >
              FUNCIONALIDADES
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="nav-link"
            >
              CONTACTO
            </button>
          </nav>
        </div>

        <div className="header-right-group">
          <button
            className="login-link"
            onClick={goToLogin}
          >
            INICIAR SESIÓN
          </button>
          
          <button
            className="nav-button primary-cta-button"
            onClick={() => scrollToSection('contacto')}
          >
            SOLICITAR ACCESO
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;