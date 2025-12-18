// src/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroSection.styles.css'; 

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-container">
        
        <h1 className="hero-title">
          Control Total y Eficiencia <br /> 
          para tu <span className="accent-text">Servicio Técnico</span>
        </h1>
        
        <p className="hero-subtitle">
          Gestify centraliza órdenes de servicio, clientes y repuestos, permitiendo a tu equipo enfocarse en lo que mejor sabe hacer: reparar.
        </p>

        <div className="cta-group">
          <button 
            className="primary-cta-button large-button"
            onClick={() => {
              console.log('🟢 Navegando a /register desde Hero');
              navigate('/register');
            }}
          >
            Comienza Gratis
          </button>
          
          <button 
            className="secondary-cta-button large-button"
            onClick={() => {
              // Scroll suave a la sección de features
              const featuresSection = document.getElementById('features');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Ver Funcionalidades
          </button>
        </div>
        
        <div className="hero-image-placeholder">
            <span className="placeholder-text">
                [Placeholder de la interfaz del Dashboard de Gestify]
            </span>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;