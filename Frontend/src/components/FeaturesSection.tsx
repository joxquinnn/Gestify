import React from 'react';
import '../styles/FeatureSection.styles.css'; 
import { features } from '../data/featuresData';
import type { Feature } from '../types/feature';

// Interfaz para el componente FeatureItem (tipado de props)
interface FeatureItemProps {
    feature: Feature;
}

// Componente para una sola tarjeta de funcionalidad
const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  return (
    <div className="feature-card">
      <div className={`feature-icon ${feature.iconClass}`}>
        {/* Placeholder para el icono */}
      </div>
      
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
    </div>
  );
};

// Componente principal de la sección
const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        
        {/* Encabezado de la Sección */}
        <h2 className="section-heading">Diseñado para la Eficiencia de tu Taller</h2>
        <p className="section-subheading">
          Gestify te ofrece las herramientas clave para transformar el caos en control, desde la recepción del equipo hasta la entrega final.
        </p>

        {/* Grid de Funcionalidades */}
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;