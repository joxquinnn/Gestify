import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// 1. Interfaces base
interface Cliente {
    id: number;
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    estado: 'Activo' | 'Inactivo';
}

interface BusinessConfig {
    nombreNegocio: string;
    rut: string;
    direccion: string;
    telefono: string;
    email: string;
    sitioWeb: string;
}

export interface OrdenServicio {
    id: string;
    cliente: string;
    telefono: string;
    dispositivo: string;
    marcaModelo: string;
    password?: string;
    fallaReportada?: string;
    accesorios?: string;
    estado: 'Pendiente' | 'En Proceso' | 'Terminado' | 'Cancelado';
    fechaIngreso: string;
    total: number;
}

interface AppContextType {
    ordenes: OrdenServicio[];
    setOrdenes: React.Dispatch<React.SetStateAction<OrdenServicio[]>>;
    clientes: Cliente[];
    setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
    configuracion: BusinessConfig;
    setConfiguracion: React.Dispatch<React.SetStateAction<BusinessConfig>>;
    eliminarOrden: (id: string) => void;
    actualizarOrden: (orden: OrdenServicio) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Función para obtener la clave única por usuario
    const getUserKey = (key: string) => {
        if (!user?.email) return `gestify_${key}_guest`;
        return `gestify_${key}_${user.email}`;
    };

    // --- ESTADO: ÓRDENES ---
    const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);

    // --- ESTADO: CLIENTES ---
    const [clientes, setClientes] = useState<Cliente[]>([]);

    // --- ESTADO: CONFIGURACIÓN ---
    const [configuracion, setConfiguracion] = useState<BusinessConfig>({
        nombreNegocio: 'Gestify Service',
        rut: '12.345.678-9',
        direccion: 'Av. Principal 123, Santiago',
        telefono: '+56 9 1234 5678',
        email: 'contacto@gestify.cl',
        sitioWeb: 'www.gestify.cl'
    });

    // Cargar datos cuando el usuario cambia o inicia sesión
    useEffect(() => {
        if (user?.email) {
            console.log('📂 Cargando datos para usuario:', user.email);

            // Cargar órdenes del usuario
            const savedOrders = localStorage.getItem(getUserKey('orders'));
            if (savedOrders) {
                try {
                    setOrdenes(JSON.parse(savedOrders));
                    console.log('✅ Órdenes cargadas:', JSON.parse(savedOrders).length);
                } catch (error) {
                    console.error('❌ Error al cargar órdenes:', error);
                    setOrdenes([]);
                }
            } else {
                setOrdenes([]);
            }

            // Cargar clientes del usuario
            const savedClients = localStorage.getItem(getUserKey('clients'));
            if (savedClients) {
                try {
                    setClientes(JSON.parse(savedClients));
                    console.log('✅ Clientes cargados:', JSON.parse(savedClients).length);
                } catch (error) {
                    console.error('❌ Error al cargar clientes:', error);
                    setClientes([]);
                }
            } else {
                setClientes([]);
            }

            // Cargar configuración del usuario
            const savedConfig = localStorage.getItem(getUserKey('config'));
            if (savedConfig) {
                try {
                    setConfiguracion(JSON.parse(savedConfig));
                    console.log('✅ Configuración cargada');
                } catch (error) {
                    console.error('❌ Error al cargar configuración:', error);
                }
            } else {
                // Configuración por defecto personalizada con el nombre del usuario
                const defaultConfig = {
                    nombreNegocio: `Servicio Técnico ${user.nombre}`,
                    rut: '12.345.678-9',
                    direccion: 'Av. Principal 123, Santiago',
                    telefono: '+56 9 1234 5678',
                    email: user.email,
                    sitioWeb: 'www.gestify.cl'
                };
                setConfiguracion(defaultConfig);
                console.log('✅ Configuración por defecto aplicada');
            }
        } else {
            // Si no hay usuario autenticado, limpiar todos los datos
            console.log('🚪 Usuario no autenticado, limpiando datos...');
            setOrdenes([]);
            setClientes([]);
            setConfiguracion({
                nombreNegocio: 'Gestify Service',
                rut: '12.345.678-9',
                direccion: 'Av. Principal 123, Santiago',
                telefono: '+56 9 1234 5678',
                email: 'contacto@gestify.cl',
                sitioWeb: 'www.gestify.cl'
            });
        }
    }, [user?.email]);

    // --- FUNCIONES DE LÓGICA ---
    const actualizarOrden = (ordenActualizada: OrdenServicio) => {
        setOrdenes(prev => prev.map(o => o.id === ordenActualizada.id ? ordenActualizada : o));
    };

    const eliminarOrden = (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.")) {
            setOrdenes(prev => prev.filter(o => o.id !== id));
        }
    };

    // --- PERSISTENCIA (LocalStorage por usuario) ---
    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(getUserKey('orders'), JSON.stringify(ordenes));
            console.log('💾 Órdenes guardadas para:', user.email, '- Total:', ordenes.length);
        }
    }, [ordenes, user?.email]);

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(getUserKey('clients'), JSON.stringify(clientes));
            console.log('💾 Clientes guardados para:', user.email, '- Total:', clientes.length);
        }
    }, [clientes, user?.email]);

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(getUserKey('config'), JSON.stringify(configuracion));
            console.log('💾 Configuración guardada para:', user.email);
        }
    }, [configuracion, user?.email]);

    return (
        <AppContext.Provider value={{
            ordenes,
            setOrdenes,
            clientes,
            setClientes,
            configuracion,
            setConfiguracion,
            eliminarOrden,
            actualizarOrden
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider');
    return context;
};