// src/services/ordenes.service.ts
import api from '../api/axiosConfig';
import type { OrdenServicio } from '../context/AppContext';

// Convertir de formato frontend a backend
const toBackendFormat = (orden: Partial<OrdenServicio>, clienteId?: number): any => {
  return {
    equipoModelo: orden.marcaModelo || '',
    equipoSerie: 'N/A', 
    tipoEquipo: orden.dispositivo || 'Celular', 
    diagnosticoInicial: orden.fallaReportada || '',
    condicionFisica: orden.accesorios || '',
    estado: orden.estado ? orden.estado.toUpperCase().replace(/\s+/g, '_') : 'RECIBIDO', 
    costoTotal: orden.total || 0,
    cliente: clienteId ? { id: clienteId } : null
  };
};

const mapEstado = (est: string): 'Pendiente' | 'En Proceso' | 'Terminado' | 'Cancelado' => {
  const e = est?.toUpperCase() || '';
  if (e === 'RECIBIDO' || e === 'PENDIENTE') return 'Pendiente';
  if (e === 'EN_PROCESO' || e === 'REPARACION' || e === 'DIAGNOSTICO') return 'En Proceso';
  if (e === 'LISTO' || e === 'TERMINADO' || e === 'ENTREGADO') return 'Terminado';
  return 'Cancelado';
};

// Convertir de formato backend a frontend
const toFrontendFormat = (orden: any): OrdenServicio => {
  return {
    id: String(orden.id),
    cliente: orden.cliente?.nombre || 'Sin cliente',
    telefono: orden.cliente?.telefono || '',
    dispositivo: 'Celular', 
    marcaModelo: orden.equipoModelo || '', 
    password: '',
    fallaReportada: orden.diagnosticoInicial || '', 
    accesorios: orden.condicionFisica || '', 
    estado: mapEstado(orden.estado),
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

  // Cambiar estado de orden
  async cambiarEstado(id: string, nuevoEstado: string): Promise<OrdenServicio> {
  // Limpiamos CUALQUIER letra. Si mandas "OS-5", solo enviará "5"
  const numericId = id.replace(/\D/g, ''); 
  
  const estadoBackend = nuevoEstado.toUpperCase().replace(/\s+/g, '_');
  
  // Ahora la URL será limpia: /api/ordenes/5/estado
  const response = await api.put(
    `/ordenes/${numericId}/estado?newEstado=${estadoBackend}`
  );
  
  return toFrontendFormat(response.data);
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