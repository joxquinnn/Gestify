import React from 'react';
import '../styles/CTABlock.styles.css'; 

const CTABlock: React.FC = () => {
    return (
        <section className="cta-block">
            <div className="cta-container">
                
                <div className="cta-content">
                    <h2 className="cta-title">
                        Comienza tu Prueba Gratuita Hoy
                    </h2>
                    <p className="cta-subtitle">
                        Descubre cómo Gestify puede llevar el Control y la Eficiencia a tu Servicio Técnico sin compromiso.
                    </p>
                </div>

                <div className="cta-form-wrapper">
                    <form className="cta-form">
                        <div className="form-group">
                            <input type="text" placeholder="Nombre Completo" required className="form-input" />
                        </div>
                        <div className="form-group">
                            <input type="email" placeholder="Correo de Contacto" required className="form-input" />
                        </div>
                        <div className="form-group">
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Selecciona tu Región</option>
                                <option value="araucania">Región de la Araucanía</option>
                                <option value="metropolitana">Región Metropolitana</option>
                                {/* Añadir más regiones según necesidad */}
                            </select>
                        </div>
                        <button type="submit" className="cta-submit-button primary-cta-button large-button">
                            Solicitar Acceso Gratuito
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default CTABlock;