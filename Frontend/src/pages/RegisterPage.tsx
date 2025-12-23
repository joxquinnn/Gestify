import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../styles/RegisterPage.styles.css';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password
            });

            alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al registrar el usuario';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-card">
                <h1 className="register-title">Crea tu cuenta en Gestify</h1>
                <p className="register-subtitle">Únete para gestionar tu servicio técnico de forma profesional.</p>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del Taller / Técnico</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="register-button primary-cta-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>
                
                <p className="login-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;