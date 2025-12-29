import React from 'react';
import '../styles/HeroSection.styles.css';

const HeroSection: React.FC = () => {
    const scrollToContacto = () => {
        const section = document.getElementById('contacto');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToFeatures = () => {
        const section = document.getElementById('features');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section">
            <div className="hero-container">
                <h1 className="hero-title">
                    La Solución <span className="accent-text">Profesional</span> que tu Negocio Necesita
                </h1>
                
                <p className="hero-subtitle">
                    Plataforma exclusiva diseñada para optimizar tus procesos y llevar tu empresa al siguiente nivel. 
                    Acceso limitado bajo solicitud.
                </p>
                
                <div className="cta-group">
                    <button 
                        onClick={scrollToContacto}
                        className="large-button primary-cta-button"
                    >
                        Solicitar Demostración
                    </button>
                    <button 
                        onClick={scrollToFeatures}
                        className="large-button secondary-cta-button"
                    >
                        Ver Características
                    </button>
                </div>
                
                <div className="hero-image-placeholder">
                    <span className="placeholder-text">Dashboard Preview</span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;