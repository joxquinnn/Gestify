import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (data: { user: any; token: string }) => void; // Ahora recibe user y token
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar, verificar si hay una sesión guardada en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('gestify_user');
    const token = localStorage.getItem('gestify_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (data: { user: any; token: string }) => {
    // Guardamos ambos en el navegador
    localStorage.setItem('gestify_user', JSON.stringify(data.user));
    localStorage.setItem('gestify_token', data.token);
    
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('gestify_user');
    localStorage.removeItem('gestify_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, // Es true si el objeto user existe
      user, 
      login, 
      logout,
      loading 
    }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};