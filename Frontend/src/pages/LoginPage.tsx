// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.styles.css'; 

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Intentando iniciar sesión con:', { email, password });
        
        if (email === 'demo@gestify.com' && password === '123456') {
            alert('¡Inicio de sesión exitoso!');
            // Redirigir al Dashboard principal
            navigate('/dashboard/inicio'); 
        } else {
            alert('Credenciales incorrectas. Usa demo@gestify.com / 123456');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                
                <img 
                    src="/images/Gestify-logo-empresa.png"
                    alt="Gestify Logo"
                    className="login-logo-image"
                />

                <h1 className="login-title">Accede a tu cuenta de Gestify</h1>
                <p className="login-subtitle">Introduce tus credenciales para continuar con la gestión.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-options">
                        <a href="/reset-password" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    <button type="submit" className="login-button primary-cta-button">
                        Iniciar Sesión
                    </button>
                    
                </form>

            </div>
        </div>
    );
};

export default LoginPage;