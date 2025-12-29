import React, { useState } from 'react';
import '../styles/ContactSection.styles.css';

interface FormData {
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
    mensaje: string;
}

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        mensaje: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación simple
        if (!formData.nombre || !formData.email || !formData.telefono || !formData.mensaje) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        setIsSubmitting(true);

        try {
            // TODO: Reemplaza esto con tu endpoint real
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            
            // Simulación de envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Formulario enviado:', formData);
            
            setShowSuccess(true);
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                empresa: '',
                mensaje: ''
            });
        } catch (error) {
            console.error('Error al enviar:', error);
            alert('Hubo un error al enviar el formulario. Por favor intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contacto" className="contact-section">
            <div className="contact-container">
                <div className="contact-header">
                    <h2 className="contact-heading">Solicita tu Acceso</h2>
                    <p className="contact-description">
                        Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
                    </p>
                </div>

                <div className="contact-form-wrapper">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nombre" className="form-label">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="telefono" className="form-label">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="+56 9 1234 5678"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="empresa" className="form-label">
                                    Empresa
                                </label>
                                <input
                                    type="text"
                                    id="empresa"
                                    name="empresa"
                                    value={formData.empresa}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Nombre de tu empresa"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje" className="form-label">
                                Cuéntanos sobre tu necesidad *
                            </label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="¿Qué problema buscas resolver? ¿Cuántos usuarios necesitas?"
                                rows={5}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="form-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </form>

                    <div className="contact-info">
                        <div className="contact-info-item">
                            <div className="contact-info-icon">📧</div>
                            <span>jkdstudio.contact@gmail.com</span>
                        </div>
                        <div className="contact-info-item">
                            <div className="contact-info-icon">📞</div>
                            <span>+56 9 8201 7427</span>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <div className="success-modal-overlay" onClick={() => setShowSuccess(false)}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close-button"
                            onClick={() => setShowSuccess(false)}
                        >
                            ×
                        </button>
                        <div className="success-icon-wrapper">
                            <div className="success-icon">✓</div>
                        </div>
                        <h3 className="success-title">¡Solicitud Enviada!</h3>
                        <p className="success-message">
                            Hemos recibido tu solicitud. Nos pondremos en contacto contigo en las próximas 24 horas para evaluar tu caso.
                        </p>
                        <button 
                            className="success-button"
                            onClick={() => setShowSuccess(false)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactSection;