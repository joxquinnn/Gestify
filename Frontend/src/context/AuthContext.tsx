import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (data: { user: any; token: string }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gestify_user');
    const token = localStorage.getItem('gestify_token');

    if (savedUser && token && savedUser !== "undefined" && token !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Sesión restaurada:', parsedUser);
      } catch (error) {
        console.error("❌ Error al cargar la sesión guardada:", error);
        localStorage.removeItem('gestify_user');
        localStorage.removeItem('gestify_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (data: { user: any; token: string }) => {
    console.log('🔐 Intentando login con data:', data);
    
    if (data.user && data.token) {
      localStorage.setItem('gestify_user', JSON.stringify(data.user));
      localStorage.setItem('gestify_token', data.token);
      
      setUser(data.user);
      
      console.log('✅ Login exitoso, usuario guardado:', data.user);
    } else {
      console.error('❌ Error: datos de login incompletos', data);
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('gestify_user');
    localStorage.removeItem('gestify_token');
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};