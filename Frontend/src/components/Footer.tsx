import React from 'react';
import '../styles/Footer.styles.css'; 

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="main-footer">
            <div className="footer-container">
                
                {/* Columna 1: Logo y Slogan */}
                <div className="footer-brand">
                    <span className="logo-text footer-logo-text">GESTIFY</span>
                    <p className="slogan">Control y Eficiencia para tu Servicio Técnico.</p>
                </div>

                {/* Columna 2: Navegación Rápida */}
                <div className="footer-links">
                    <h4 className="footer-heading">Navegación</h4>
                    <ul>
                        <li><a href="#features" className="footer-link">Funcionalidades</a></li>
                        <li><a href="#pricing" className="footer-link">Precios</a></li>
                        <li><a href="#demo" className="footer-link">Prueba Gratuita</a></li>
                    </ul>
                </div>

                {/* Columna 3: Legal y Soporte */}
                <div className="footer-links">
                    <h4 className="footer-heading">Soporte</h4>
                    <ul>
                        <li><a href="/contact" className="footer-link">Contáctanos</a></li>
                        <li><a href="/privacy" className="footer-link">Política de Privacidad</a></li>
                        <li><a href="/terms" className="footer-link">Términos del Servicio</a></li>
                    </ul>
                </div>
            </div>

            {/* Derechos de Autor */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} Gestify. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;