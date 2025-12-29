import React from 'react';
import '../styles/AccessSection.styles.css';

const AccessSection: React.FC = () => {
    const scrollToContacto = () => {
        const section = document.getElementById('contacto');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const benefits = [
        'Evaluación personalizada',
        'Onboarding dedicado',
        'Soporte prioritario'
    ];

    return (
        <section id="acceso" className="access-section">
            <div className="access-container">
                <h2 className="access-heading">
                    Acceso Exclusivo por Invitación
                </h2>
                
                <p className="access-description">
                    Para garantizar la mejor experiencia y soporte personalizado, trabajamos con un número limitado de clientes. 
                    Contacta con nosotros para evaluar si nuestra plataforma es ideal para tu negocio.
                </p>
                
                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="benefit-item">
                            <div className="benefit-icon">✓</div>
                            <span className="benefit-text">{benefit}</span>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={scrollToContacto}
                    className="access-cta-button"
                >
                    Solicitar Acceso Ahora
                </button>
            </div>
        </section>
    );
};

export default AccessSection;