// src/services/ordenes.service.ts
import api from '../api/axiosConfig';
import type { OrdenServicio } from '../context/AppContext';

// DTO que coincide con tu backend Java
interface OrdenBackendDTO {
  id?: number; // En backend es Long, aquí number
  cliente: string;
  telefono: string;
  dispositivo: string;
  marcaModelo: string;
  password?: string;
  fallaReportada?: string;
  accesorios?: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'CANCELADO';
  fechaIngreso: string; // Backend: fechaRecepcion
  total: number;
}

// Convertir de formato frontend a backend
const toBackendFormat = (orden: Partial<OrdenServicio>): any => {
  return {
    cliente: orden.cliente,
    telefono: orden.telefono,
    dispositivo: orden.dispositivo,
    marcaModelo: orden.marcaModelo,
    password: orden.password,
    fallaReportada: orden.fallaReportada,
    accesorios: orden.accesorios,
    estado: orden.estado?.toUpperCase().replace(/\s+/g, '_') || 'PENDIENTE',
    fechaRecepcion: orden.fechaIngreso, // Mapear al nombre correcto
    total: orden.total
  };
};

// Convertir de formato backend a frontend
const toFrontendFormat = (orden: any): OrdenServicio => {
  return {
    id: `OS-${orden.id}`, // Convertir Long a String con prefijo
    cliente: orden.cliente?.nombre || orden.cliente || 'Sin cliente',
    telefono: orden.telefono || '',
    dispositivo: orden.dispositivo || 'Celular',
    marcaModelo: orden.marcaModelo || '',
    password: orden.password,
    fallaReportada: orden.fallaReportada,
    accesorios: orden.accesorios,
    estado: orden.estado?.replace(/_/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ') as any || 'Pendiente',
    fechaIngreso: orden.fechaRecepcion?.split('T')[0] || new Date().toISOString().split('T')[0],
    total: orden.total || 0
  };
};

export const ordenesService = {
  //  Obtener todas las órdenes del usuario autenticado
  async getOrdenes(): Promise<OrdenServicio[]> {
    try {
      console.log('📥 Obteniendo órdenes desde backend...');
      const response = await api.get('/ordenes');
      console.log('✅ Respuesta backend:', response.data);
      return response.data.map(toFrontendFormat);
    } catch (error) {
      console.error('❌ Error al obtener órdenes:', error);
      throw error;
    }
  },

  //  Crear nueva orden
  async crearOrden(orden: Omit<OrdenServicio, 'id'>): Promise<OrdenServicio> {
    try {
      console.log('💾 Creando orden en backend...');
      const ordenBackend = toBackendFormat(orden);
      console.log('📤 Datos enviados:', ordenBackend);
      
      const response = await api.post('/ordenes', ordenBackend);
      console.log('✅ Orden creada:', response.data);
      
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
      throw error;
    }
  },

  //  Actualizar orden existente
  async actualizarOrden(id: string, orden: Partial<OrdenServicio>): Promise<OrdenServicio> {
    try {
      console.log('🔄 Actualizando orden:', id);
      
      // Extraer el número del ID (OS-1001 → 1001)
      const numericId = id.replace('OS-', '');
      
      const ordenBackend = toBackendFormat(orden);
      const response = await api.put(`/ordenes/${numericId}`, ordenBackend);
      
      console.log('✅ Orden actualizada:', response.data);
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al actualizar orden:', error);
      throw error;
    }
  },

  //  Eliminar orden
  async eliminarOrden(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando orden:', id);
      const numericId = id.replace('OS-', '');
      await api.delete(`/ordenes/${numericId}`);
      console.log('✅ Orden eliminada');
    } catch (error) {
      console.error('❌ Error al eliminar orden:', error);
      throw error;
    }
  },

  //  Cambiar estado de orden
  async cambiarEstado(id: string, nuevoEstado: string): Promise<OrdenServicio> {
    try {
      console.log('🔄 Cambiando estado:', id, '→', nuevoEstado);
      
      const numericId = id.replace('OS-', '');
      const estadoBackend = nuevoEstado.toUpperCase().replace(/\s+/g, '_');
      
      // Tu backend usa @RequestParam, así que enviamos como query param
      const response = await api.put(
        `/ordenes/${numericId}/estado?newEstado=${estadoBackend}`
      );
      
      console.log('✅ Estado actualizado:', response.data);
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      throw error;
    }
  },

  //  Obtener órdenes recientes
  async getOrdenesRecientes(limit: number = 5): Promise<OrdenServicio[]> {
    try {
      const response = await api.get(`/ordenes/recientes?limit=${limit}`);
      return response.data.map(toFrontendFormat);
    } catch (error) {
      console.error('❌ Error al obtener órdenes recientes:', error);
      throw error;
    }
  },

  //  Obtener estadísticas
  async getEstadisticas(): Promise<any> {
    try {
      const response = await api.get('/ordenes/estadisticas/estados');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }
};