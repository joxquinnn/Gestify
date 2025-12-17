import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // --- ESTADO: ÓRDENES ---
    const [ordenes, setOrdenes] = useState<OrdenServicio[]>(() => {
        const saved = localStorage.getItem('gestify_orders');
        return saved ? JSON.parse(saved) : [];
    });

    // --- ESTADO: CLIENTES ---
    const [clientes, setClientes] = useState<Cliente[]>(() => {
        const saved = localStorage.getItem('gestify_clients');
        return saved ? JSON.parse(saved) : [];
    });

    // --- ESTADO: CONFIGURACIÓN ---
    const [configuracion, setConfiguracion] = useState<BusinessConfig>(() => {
        const saved = localStorage.getItem('gestify_config');
        return saved ? JSON.parse(saved) : {
            nombreNegocio: 'Gestify Service',
            rut: '12.345.678-9',
            direccion: 'Av. Principal 123, Santiago',
            telefono: '+56 9 1234 5678',
            email: 'contacto@gestify.cl',
            sitioWeb: 'www.gestify.cl'
        };
    });

    // --- FUNCIONES DE LÓGICA ---
    const actualizarOrden = (ordenActualizada: OrdenServicio) => {
        setOrdenes(prev => prev.map(o => o.id === ordenActualizada.id ? ordenActualizada : o));
    };

    const eliminarOrden = (id: string) => {
        // La confirmación la dejamos aquí para centralizar la seguridad
        if (window.confirm("¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.")) {
            setOrdenes(prev => prev.filter(o => o.id !== id));
        }
    };

    // --- PERSISTENCIA (LocalStorage) ---
    useEffect(() => {
        localStorage.setItem('gestify_orders', JSON.stringify(ordenes));
    }, [ordenes]);

    useEffect(() => {
        localStorage.setItem('gestify_clients', JSON.stringify(clientes));
    }, [clientes]);

    useEffect(() => {
        localStorage.setItem('gestify_config', JSON.stringify(configuracion));
    }, [configuracion]);

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