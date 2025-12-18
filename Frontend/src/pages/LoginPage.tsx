import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.styles.css';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            
            login(response.data); 

            navigate('/dashboard/inicio');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al conectar con el servidor';
            setError(message);
        } finally {
            setIsLoading(false);
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

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
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
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-options">
                        <a href="/reset-password" alt-forgot className="forgot-password-link">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button primary-cta-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;