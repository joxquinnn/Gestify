import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ordenesService } from '../services/order.services';
import { clientesService } from '../services/clientes.service';

// Interfaces
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
    estado: 'Pendiente' | 'En Proceso' | 'Terminado' | 'Entregado';
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
    eliminarOrden: (id: string) => Promise<void>;
    actualizarOrden: (orden: OrdenServicio) => Promise<void>;
    cargarOrdenes: () => Promise<void>;
    cargarClientes: () => Promise<void>;
    agregarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
    eliminarCliente: (id: number) => Promise<void>;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    const [configuracion, setConfiguracion] = useState<BusinessConfig>({
        nombreNegocio: 'Servitec Carahue',
        rut: '18.195.452-3',
        direccion: 'Manuel Rodríguez, 239B, Carahue',
        telefono: '+56 9 3122 8675',
        email: 'serviteccarahue@gmail.com',
        sitioWeb: ''
    });

    //  CARGAR ÓRDENES DESDE BACKEND (PostgreSQL en Railway)
    const cargarOrdenes = async () => {
        if (!isAuthenticated) {
            console.log('⚠️ Usuario no autenticado, no se pueden cargar órdenes');
            return;
        }

        try {
            console.log('📥 Cargando órdenes desde PostgreSQL (Railway)...');
            const ordenesBackend = await ordenesService.getOrdenes();
            setOrdenes(ordenesBackend);
            console.log('✅ Órdenes cargadas desde DB:', ordenesBackend.length);
        } catch (error: any) {
            console.error('❌ Error al cargar órdenes desde DB:', error);

            // Mensaje específico según el error
            if (error.response?.status === 401) {
                console.error('🔒 Token expirado, redirigiendo a login...');
            } else if (!error.response) {
                console.error('🔴 Backend no disponible en Railway');
            }

            setOrdenes([]);
        }
    };

    //  CARGAR CLIENTES DESDE BACKEND (PostgreSQL en Railway)
    const cargarClientes = async () => {
        if (!isAuthenticated) {
            console.log('⚠️ Usuario no autenticado, no se pueden cargar clientes');
            return;
        }

        try {
            console.log('📥 Cargando clientes desde PostgreSQL (Railway)...');
            const clientesBackend = await clientesService.getClientes();
            setClientes(clientesBackend);
            console.log('✅ Clientes cargados desde DB:', clientesBackend.length);
        } catch (error) {
            console.error('❌ Error al cargar clientes desde DB:', error);
            setClientes([]);
        }
    };

    //  AGREGAR CLIENTE (EN BACKEND)
    const agregarCliente = async (cliente: Omit<Cliente, 'id'>) => {
        try {
            console.log('💾 Guardando cliente en PostgreSQL...');
            const clienteCreado = await clientesService.crearCliente(cliente);
            setClientes(prev => [...prev, clienteCreado]);
            console.log('✅ Cliente guardado en DB');
        } catch (error) {
            console.error('❌ Error al guardar cliente:', error);
            throw error;
        }
    };

    //  ELIMINAR CLIENTE (EN BACKEND)
    const eliminarCliente = async (id: number) => {
        try {
            console.log('🗑️ Eliminando cliente de PostgreSQL...');
            await clientesService.eliminarCliente(id);
            setClientes(prev => prev.filter(c => c.id !== id));
            console.log('✅ Cliente eliminado de DB');
        } catch (error) {
            console.error('❌ Error al eliminar cliente:', error);
            throw error;
        }
    };

    //  CARGAR CONFIGURACIÓN (Solo en localStorage por ahora)
    const cargarConfiguracion = () => {
        if (!user?.email) return;

        const configKey = `gestify_config_${user.email}`;
        const savedConfig = localStorage.getItem(configKey);

        if (savedConfig) {
            try {
                setConfiguracion(JSON.parse(savedConfig));
                console.log('✅ Configuración cargada desde localStorage');
            } catch (error) {
                console.error('❌ Error al cargar configuración:', error);
            }
        } else {
            // Configuración por defecto
            const defaultConfig = {
                nombreNegocio: `Servitec Carahue`,
                rut: '18.195.452-3',
                direccion: 'Manuel Rodriguez, 239B, Carahue',
                telefono: '+56 9 3122 8675',
                email: 'serviteccarahue@gmail.com',
                sitioWeb: ''
            };
            setConfiguracion(defaultConfig);
            console.log('✅ Configuración por defecto aplicada');
        }
    };

    //  EFECTO: Cargar datos cuando usuario esté autenticado
    useEffect(() => {
        const inicializarDatos = async () => {
            if (isAuthenticated && user?.email) {
                setLoading(true);
                console.log('🔄 Inicializando datos desde Railway para:', user.email);

                await Promise.all([
                    cargarOrdenes(),
                    cargarClientes()
                ]);

                cargarConfiguracion();
                setLoading(false);
                console.log('✅ Datos inicializados correctamente');
            } else {
                // Usuario no autenticado: limpiar todo
                console.log('🔒 No hay usuario autenticado, limpiando datos...');
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
                setLoading(false);
            }
        };

        inicializarDatos();
    }, [isAuthenticated, user?.email]);

    //  ACTUALIZAR ORDEN (EN POSTGRESQL)
    const actualizarOrden = async (ordenActualizada: OrdenServicio) => {
        try {
            console.log('🔄 Actualizando orden en PostgreSQL:', ordenActualizada.id);

            const clienteEncontrado = clientes.find(c => c.nombre === ordenActualizada.cliente);

            if (!clienteEncontrado) {
                console.error('❌ No se encontró el cliente:', ordenActualizada.cliente);
                alert('Error: El cliente asociado a esta orden no existe en el sistema.');
                return;
            }

            const ordenBackend = await ordenesService.actualizarOrden(
                ordenActualizada.id,
                ordenActualizada,
                clienteEncontrado.id 
            );

            setOrdenes(prev => prev.map(o =>
                o.id === ordenActualizada.id ? ordenBackend : o
            ));

            console.log('✅ Orden actualizada en DB');
        } catch (error) {
            console.error('❌ Error al actualizar orden en DB:', error);
            alert('Error al actualizar la orden. Por favor intenta nuevamente.');
            throw error;
        }
    };

    //  ELIMINAR ORDEN (EN POSTGRESQL)
    const eliminarOrden = async (id: string) => {
        if (!window.confirm("¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            console.log('🗑️ Eliminando orden de PostgreSQL:', id);
            await ordenesService.eliminarOrden(id);

            // Actualizar estado local
            setOrdenes(prev => prev.filter(o => o.id !== id));

            console.log('✅ Orden eliminada de DB');
        } catch (error) {
            console.error('❌ Error al eliminar orden de DB:', error);
            alert('Error al eliminar la orden. Por favor intenta nuevamente.');
            throw error;
        }
    };

    //  GUARDAR CONFIGURACIÓN 
    useEffect(() => {
        if (user?.email) {
            const configKey = `gestify_config_${user.email}`;
            localStorage.setItem(configKey, JSON.stringify(configuracion));
            console.log('💾 Configuración guardada en localStorage');
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
            actualizarOrden,
            cargarOrdenes,
            cargarClientes,
            agregarCliente,
            eliminarCliente,
            loading
        }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '1.2rem',
                    color: '#64748b'
                }}>
                    ⏳ Cargando datos desde Railway...
                </div>
            ) : (
                children
            )}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider');
    return context;
};