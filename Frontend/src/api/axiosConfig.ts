import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🌐 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gestify_token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const fullURL = `${config.baseURL}${config.url}`;
    console.log('📤 REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: fullURL
    });
    
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', {
      status: error.response?.status,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      message: error.message
    });
    
    if (!error.response) {
      console.error('🔴 Backend no disponible en:', API_URL);
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("⚠️ Sesión expirada");
      localStorage.removeItem('gestify_token');
      localStorage.removeItem('gestify_user');
      
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;