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

        console.log('🔍 Iniciando login...');
        console.log('📧 Email:', email);
        console.log('🌐 Backend URL:', api.defaults.baseURL);

        try {
            console.log('📤 Enviando petición a:', `${api.defaults.baseURL}/auth/login`);
            
            const response = await api.post('/auth/login', { 
                email, 
                password 
            });
            
            console.log('✅ Respuesta recibida:', response.data);

            const adaptedData = {
                user: {
                    email: response.data.email,
                    nombre: response.data.nombre
                },
                token: response.data.token
            };

            console.log('📄 Datos adaptados:', adaptedData);
            
            // Ejecutar login (guarda en localStorage y actualiza estado)
            login(adaptedData);

            console.log('🚀 Redirigiendo a dashboard...');
            // Redirigir después de un login exitoso
            navigate('/dashboard/inicio', { replace: true });

        } catch (err: any) {
            console.error('❌ ERROR COMPLETO:', err);
            
            let message = 'Error al conectar con el servidor';
            
            // Sin response = backend no disponible
            if (!err.response) {
                message = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080';
            }
            // 403 = CORS o Spring Security bloqueando
            else if (err.response?.status === 403) {
                message = 'Acceso prohibido (403). Verifica la configuración de CORS en el backend.';
            }
            // 401 = Credenciales incorrectas
            else if (err.response?.status === 401) {
                message = err.response.data || 'Email o contraseña incorrectos';
            }
            // 404 = Endpoint no existe
            else if (err.response?.status === 404) {
                message = 'Endpoint no encontrado. Verifica que /api/auth/login exista en el backend.';
            }
            // 500 = Error interno del servidor
            else if (err.response?.status === 500) {
                message = 'Error interno del servidor. Revisa los logs del backend.';
            }
            // Otros errores
            else if (err.response?.data) {
                message = typeof err.response.data === 'string' 
                    ? err.response.data 
                    : err.response.data.message || message;
            }
            
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

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

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
                            placeholder="usuario@ejemplo.com"
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
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div className="form-options">
                        <a href="/reset-password" className="forgot-password-link">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button primary-cta-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Cargando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                    <div className="login-divider">
                        <span>o</span>
                    </div>

                    <div className="login-footer">
                        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;