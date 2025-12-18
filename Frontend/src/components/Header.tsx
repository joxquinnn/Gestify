// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.styles.css'; 

const Header: React.FC = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
        navigate('/login');
    };

  const goToRegister = () => {
        navigate('/register');
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
            <a href="#features" className="nav-link">FUNCIONALIDADES</a>
          </nav>
        </div>

        <div className="header-right-group">

          <button
           className="nav-button secondary-cta-button request-tour-button"
           onClick={goToLogin}
           >
            INICIAR SESIÓN
          </button>
          
          <button
           className="nav-button primary-cta-button request-tour-button"
           onClick={goToRegister}
           >
            REGISTRARSE
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;