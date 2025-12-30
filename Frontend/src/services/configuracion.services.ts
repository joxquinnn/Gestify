// src/services/configuracion.service.ts
import api from '../api/axiosConfig';

export interface ConfiguracionNegocio {
  id?: number;
  nombreNegocio: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

export interface PerfilUsuario {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}

export const configuracionService = {
  
  /**
   * Obtener configuración del negocio del usuario autenticado
   */
  async obtenerConfiguracion(): Promise<ConfiguracionNegocio> {
    try {
      console.log('📥 Obteniendo configuración desde backend...');
      const response = await api.get('/configuracion');
      console.log('✅ Configuración obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener configuración:', error);
      throw error;
    }
  },

  /**
   * Guardar o actualizar configuración del negocio
   */
  async guardarConfiguracion(config: ConfiguracionNegocio): Promise<ConfiguracionNegocio> {
    try {
      console.log('💾 Guardando configuración en backend...');
      console.log('📤 Datos enviados:', config);
      
      const response = await api.post('/configuracion', config);
      console.log('✅ Configuración guardada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al guardar configuración:', error);
      throw error;
    }
  },

  /**
   * Actualizar configuración del negocio
   */
  async actualizarConfiguracion(config: ConfiguracionNegocio): Promise<ConfiguracionNegocio> {
    try {
      console.log('🔄 Actualizando configuración en backend...');
      const response = await api.put('/configuracion', config);
      console.log('✅ Configuración actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar configuración:', error);
      throw error;
    }
  },
  
  /**
   * Obtener perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<PerfilUsuario> {
    try {
      console.log('📥 Obteniendo perfil desde backend...');
      const response = await api.get('/usuario/perfil');
      console.log('✅ Perfil obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);
      throw error;
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  async actualizarPerfil(datos: { nombre: string; telefono?: string; cargo?: string }): Promise<any> {
    try {
      console.log('🔄 Actualizando perfil en backend...');
      const response = await api.put('/usuario/perfil', datos);
      console.log('✅ Perfil actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      throw error;
    }
  },
  
  /**
   * Cambiar contraseña del usuario
   */
  async cambiarPassword(datos: CambiarPasswordRequest): Promise<void> {
    try {
      console.log('🔒 Cambiando contraseña en backend...');
      const response = await api.put('/usuario/cambiar-password', datos);
      console.log('✅ Contraseña cambiada:', response.data);
    } catch (error: any) {
      console.error('❌ Error al cambiar contraseña:', error);
      
      // Manejar errores específicos
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  },

  /**
   * Eliminar cuenta permanentemente
   */
  async eliminarCuenta(): Promise<void> {
    try {
      console.log('🗑️ Eliminando cuenta en backend...');
      const response = await api.delete('/usuario/eliminar-cuenta');
      console.log('✅ Cuenta eliminada:', response.data);
    } catch (error) {
      console.error('❌ Error al eliminar cuenta:', error);
      throw error;
    }
  }
};