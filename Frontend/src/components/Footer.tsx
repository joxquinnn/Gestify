import React from 'react';
import '../styles/Footer.styles.css';

const Footer: React.FC = () => {
    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3 className="footer-logo-text">Gestify</h3>
                    <p className="slogan">
                        Solución profesional exclusiva para empresas que buscan optimizar sus procesos
                        y llevar su negocio al siguiente nivel.
                    </p>
                </div>

                <div className="footer-links">
                    <h4 className="footer-heading">Navegación</h4>
                    <ul>
                        <li>
                            <button
                                onClick={() => scrollToSection('caracteristicas')}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Características
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection('acceso')}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Acceso Exclusivo
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection('contacto')}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Contacto
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4 className="footer-heading">Contacto</h4>
                    <ul>
                        <li className="footer-link" style={{ cursor: 'default' }}>
                            Email: jkdstudio.contact@gmail.com
                        </li>
                        <li className="footer-link" style={{ cursor: 'default' }}>
                            Teléfono: +56 9 8201 7427
                        </li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4 className="footer-heading">Legal</h4>
                    <ul>
                        <li>
                            <a href="/terminos" className="footer-link">
                                Términos y Condiciones
                            </a>
                        </li>
                        <li>
                            <a href="/privacidad" className="footer-link">
                                Política de Privacidad
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* BARRA OSCURA PERSONALIZADA - JK STUDIO */}
            <div className="darkBar">
                <div className="darkBarContent">
                    <div className="copyrightGroup">
                        <span>&copy; {new Date().getFullYear()}</span>
                        <span className="whiteText">Gestify</span>
                        <div className="dotSeparator"></div>
                        <span>Todos los derechos reservados</span>
                    </div>

                    <div className="developerBox">
                        <div className="devLabel">
                            <span className="line"></span>
                            <span className="text">Desarrollado por</span>
                        </div>
                        <a
                            href="https://tu-enlace.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="devLink"
                        >
                            JK STUDIO
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;