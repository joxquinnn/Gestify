import React from 'react';
import '../styles/HeroSection.styles.css';

const HeroSection: React.FC = () => {
    const scrollToContacto = () => {
        const section = document.getElementById('contacto');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToCaracteristicas = () => {
        const section = document.getElementById('caracteristicas');
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
                        onClick={scrollToCaracteristicas}
                        className="large-button secondary-cta-button"
                    >
                        Ver Características
                    </button>
                </div>
                
                <div className="hero-image-placeholder">
                    <video 
                        className="hero-video-preview"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        poster="/images/video-thumbnail.jpg"
                    >
                        <source src="/videos/gestify-preview.mp4" type="video/mp4" />
                    </video>
                    <div className="video-play-overlay">
                        <button 
                            className="play-demo-button"
                            onClick={() => document.getElementById('video-demo')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            ▶ Ver Demo Completo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;