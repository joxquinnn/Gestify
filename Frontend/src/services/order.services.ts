// src/services/ordenes.service.ts
import api from '../api/axiosConfig';
import type { OrdenServicio } from '../context/AppContext';

// Convertir de formato frontend a backend
const toBackendFormat = (orden: Partial<OrdenServicio>, clienteId?: number): any => {
  return {
    equipoModelo: orden.marcaModelo || '',
    equipoSerie: 'N/A',
    tipoEquipo: orden.dispositivo || 'Celular',
    patronContrasena: orden.password || '', 
    diagnosticoInicial: orden.fallaReportada || '',
    condicionFisica: orden.accesorios || '',
    // Aseguramos que el estado sea el que el Enum de Java espera
    estado: orden.estado ? orden.estado.toUpperCase().replace(/\s+/g, '_') : 'RECIBIDO',
    costoTotal: orden.total || 0,
    cliente: clienteId ? { id: clienteId } : null
  };
};

// Convertir de formato backend a frontend
const toFrontendFormat = (orden: any): OrdenServicio => {
   const estadoMap: Record<string, string> = {
    'RECIBIDO': 'Pendiente',
    'DIAGNOSTICO': 'Pendiente',
    'EN_REPARACION': 'En Proceso',
    'LISTO': 'Terminado',
    'ENTREGADO': 'Entregado'
  };

  const estadoBackend = orden.estado || 'RECIBIDO';
  const estadoFrontend = estadoMap[estadoBackend] || 'Pendiente';
  
  return {
    id: `OS-${orden.id}`, 
    cliente: orden.cliente?.nombre || 'Sin cliente',
    telefono: orden.cliente?.telefono || '',
    dispositivo: 'Celular', 
    marcaModelo: orden.equipoModelo || '', 
    password: orden.patronContrasena || '',
    fallaReportada: orden.diagnosticoInicial || '', 
    accesorios: orden.condicionFisica || '', 
    estado: estadoFrontend as any,
    fechaIngreso: orden.fechaRecepcion 
      ? new Date(orden.fechaRecepcion).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    total: Number(orden.costoTotal) || 0 // BigDecimal → number
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
  async crearOrden(orden: Omit<OrdenServicio, 'id'>, clienteId?: number): Promise<OrdenServicio> {
    try {
      console.log('💾 Creando orden en backend...');
      console.log('📋 Datos recibidos:', orden);
      console.log('👤 Cliente ID:', clienteId);
      
      const ordenBackend = toBackendFormat(orden, clienteId);
      console.log('📤 Datos enviados a backend:', ordenBackend);
      
      const response = await api.post('/ordenes', ordenBackend);
      console.log('✅ Respuesta del backend:', response.data);
      
      return toFrontendFormat(response.data);
    } catch (error: any) {
      console.error('❌ Error al crear orden:', error);
      console.error('📄 Respuesta error:', error.response?.data);
      console.error('🔢 Status:', error.response?.status);
      throw error;
    }
  },

  //  Actualizar orden existente
  async actualizarOrden(id: string, orden: Partial<OrdenServicio>): Promise<OrdenServicio> {
    try {
      console.log('🔄 Actualizando orden:', id);
      console.log('📋 Datos a actualizar:', orden);
      
      const numericId = id.replace('OS-', '');
      
      const ordenActualResponse = await api.get(`/ordenes/${numericId}`);
      const ordenActual = ordenActualResponse.data;
      const clienteId = ordenActual.cliente?.id;
      
      console.log('👤 Cliente ID de la orden:', clienteId);
      
      const ordenBackend = toBackendFormat(orden, clienteId);
      console.log('📤 Datos enviados al backend:', ordenBackend);
      
      const response = await api.put(`/ordenes/${numericId}`, ordenBackend);
      
      console.log('✅ Orden actualizada:', response.data);
      return toFrontendFormat(response.data);
    } catch (error: any) {
      console.error('❌ Error al actualizar orden:', error);
      console.error('📄 Respuesta error:', error.response?.data);
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

  // Cambiar estado de orden
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