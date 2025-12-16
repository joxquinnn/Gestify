// src/components/HeroSection.tsx
import React from 'react';
import '../styles/HeroSection.styles.css'; 

// Usamos React.FC para el tipado.
const HeroSection: React.FC = () => {
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
          <a 
            href="/signup" 
            className="primary-cta-button large-button"
          >
            Comienza Gratis
          </a>
          <a 
            href="#features" 
            className="secondary-cta-button large-button"
          >
            Ver Funcionalidades
          </a>
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