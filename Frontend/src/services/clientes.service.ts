// src/services/clientes.service.ts
import api from '../api/axiosConfig';

interface Cliente {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}

// DTO que coincide con ClienteRequestDTO de tu backend
interface ClienteBackendDTO {
  nombre: string;
  telefono: string;
  email: string;
  direccion?: string; // Tu backend tiene dirección
}

// Convertir de formato frontend a backend
const toBackendFormat = (cliente: Partial<Cliente>): ClienteBackendDTO => {
  return {
    nombre: cliente.nombre || '',
    telefono: cliente.telefono || '',
    email: cliente.email || '',
    direccion: cliente.empresa || '' // Mapear empresa a dirección temporalmente
  };
};

// Convertir de formato backend a frontend
const toFrontendFormat = (clienteBackend: any): Cliente => {
  return {
    id: clienteBackend.id,
    nombre: clienteBackend.nombre || '',
    empresa: clienteBackend.direccion || 'Particular', // Temporal hasta que agregues empresa en backend
    email: clienteBackend.email || '',
    telefono: clienteBackend.telefono || '',
    estado: 'Activo' // Por defecto activo, tu backend no tiene este campo aún
  };
};

export const clientesService = {
  //  Obtener todos los clientes
  async getClientes(): Promise<Cliente[]> {
    try {
      console.log('📥 Obteniendo clientes desde backend...');
      const response = await api.get('/clientes');
      console.log('✅ Respuesta backend:', response.data);
      
      // Tu backend devuelve ClienteResponseDTO[]
      return response.data.map(toFrontendFormat);
    } catch (error) {
      console.error('❌ Error al obtener clientes:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  async getClienteById(id: number): Promise<Cliente> {
    try {
      const response = await api.get(`/clientes/${id}`);
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al obtener cliente:', error);
      throw error;
    }
  },

  //  Crear nuevo cliente
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      console.log('💾 Creando cliente en backend...');
      const clienteBackend = toBackendFormat(cliente);
      console.log('📤 Datos enviados:', clienteBackend);
      
      const response = await api.post('/clientes', clienteBackend);
      console.log('✅ Cliente creado:', response.data);
      
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      throw error;
    }
  },

  //  Actualizar cliente
  async actualizarCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    try {
      console.log('🔄 Actualizando cliente:', id);
      const clienteBackend = toBackendFormat(cliente);
      
      const response = await api.put(`/clientes/${id}`, clienteBackend);
      console.log('✅ Cliente actualizado:', response.data);
      
      return toFrontendFormat(response.data);
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      throw error;
    }
  },

  //  Eliminar cliente
  async eliminarCliente(id: number): Promise<void> {
    try {
      console.log('🗑️ Eliminando cliente:', id);
      await api.delete(`/clientes/${id}`);
      console.log('✅ Cliente eliminado');
    } catch (error) {
      console.error('❌ Error al eliminar cliente:', error);
      throw error;
    }
  }
};