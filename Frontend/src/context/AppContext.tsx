import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ordenesService } from '../services/order.services';
import { clientesService } from '../services/clientes.service';
import { configuracionService, type ConfiguracionNegocio } from '../services/configuracion.services';

// Interfaces
interface Cliente {
    id: number;
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    estado: 'Activo' | 'Inactivo';
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
    configuracion: ConfiguracionNegocio;
    setConfiguracion: React.Dispatch<React.SetStateAction<ConfiguracionNegocio>>;
    eliminarOrden: (id: string) => Promise<void>;
    actualizarOrden: (orden: OrdenServicio) => Promise<void>;
    cargarOrdenes: () => Promise<void>;
    cargarClientes: () => Promise<void>;
    agregarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
    eliminarCliente: (id: number) => Promise<void>;
    cargarConfiguracion: () => Promise<void>;
    guardarConfiguracion: (config: ConfiguracionNegocio) => Promise<void>;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    // Configuración por defecto
    const [configuracion, setConfiguracion] = useState<ConfiguracionNegocio>({
        nombreNegocio: 'Servitec Carahue',
        rut: '18.195.452-3',
        direccion: 'Manuel Rodríguez, 239B, Carahue',
        telefono: '+56 9 3122 8675',
        email: 'serviteccarahue@gmail.com',
        sitioWeb: ''
    });

    // ============================================
    // CARGAR ÓRDENES DESDE BACKEND
    // ============================================
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

            if (error.response?.status === 401) {
                console.error('🔒 Token expirado, redirigiendo a login...');
            } else if (!error.response) {
                console.error('🔴 Backend no disponible en Railway');
            }

            setOrdenes([]);
        }
    };

    // ============================================
    // CARGAR CLIENTES DESDE BACKEND
    // ============================================
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

    // ============================================
    // CARGAR CONFIGURACIÓN DESDE BACKEND
    // ============================================
    const cargarConfiguracion = async () => {
        if (!isAuthenticated) {
            console.log('⚠️ Usuario no autenticado, no se puede cargar configuración');
            return;
        }

        try {
            console.log('📥 Cargando configuración desde PostgreSQL...');
            const configBackend = await configuracionService.obtenerConfiguracion();
            setConfiguracion(configBackend);
            console.log('✅ Configuración cargada desde DB');
        } catch (error) {
            console.error('❌ Error al cargar configuración:', error);
            // Mantener configuración por defecto si hay error
        }
    };

    // ============================================
    // GUARDAR CONFIGURACIÓN EN BACKEND
    // ============================================
    const guardarConfiguracion = async (config: ConfiguracionNegocio) => {
        if (!isAuthenticated) {
            console.log('⚠️ Usuario no autenticado');
            return;
        }

        try {
            console.log('💾 Guardando configuración en PostgreSQL...');
            const configGuardada = await configuracionService.guardarConfiguracion(config);
            setConfiguracion(configGuardada);
            console.log('✅ Configuración guardada en DB');
        } catch (error) {
            console.error('❌ Error al guardar configuración:', error);
            throw error;
        }
    };

    // ============================================
    // AGREGAR CLIENTE
    // ============================================
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


    useEffect(() => {
        const inicializarDatos = async () => {
            if (isAuthenticated && user?.email) {
                setLoading(true);
                console.log('🔄 Inicializando datos desde Railway para:', user.email);

                await Promise.all([
                    cargarOrdenes(),
                    cargarClientes(),
                    cargarConfiguracion()
                ]);

                setLoading(false);
                console.log('✅ Datos inicializados correctamente');
            } else {
                // Usuario no autenticado: limpiar todo
                console.log('🔒 No hay usuario autenticado, limpiando datos...');
                setOrdenes([]);
                setClientes([]);
                setConfiguracion({
                    nombreNegocio: 'Servitec Carahue',
                    rut: '18.195.452-3',
                    direccion: 'Manuel Rodríguez, 239B, Carahue',
                    telefono: '+56 9 3122 8675',
                    email: 'serviteccarahue@gmail.com',
                    sitioWeb: ''
                });
                setLoading(false);
            }
        };

        inicializarDatos();
    }, [isAuthenticated, user?.email]);

   
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

  
    const eliminarOrden = async (id: string) => {
        if (!window.confirm("¿Estás seguro de eliminar esta orden? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            console.log('🗑️ Eliminando orden de PostgreSQL:', id);
            await ordenesService.eliminarOrden(id);
            setOrdenes(prev => prev.filter(o => o.id !== id));
            console.log('✅ Orden eliminada de DB');
        } catch (error) {
            console.error('❌ Error al eliminar orden de DB:', error);
            alert('Error al eliminar la orden. Por favor intenta nuevamente.');
            throw error;
        }
    };

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
            cargarConfiguracion,
            guardarConfiguracion,
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