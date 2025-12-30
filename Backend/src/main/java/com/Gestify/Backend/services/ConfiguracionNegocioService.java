package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.ConfiguracionNegocio;
import com.Gestify.Backend.entities.Usuario;
import com.Gestify.Backend.repository.ConfiguracionNegocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracionNegocioService {

    @Autowired
    private ConfiguracionNegocioRepository configuracionRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Obtener configuración de negocio por email del usuario
     */
    @Transactional(readOnly = true)
    public ConfiguracionNegocio obtenerConfiguracion(String email) {
        try {
            System.out.println("🔍 Buscando configuración para email: " + email);
            Usuario usuario = usuarioService.buscarPorEmail(email);
            System.out.println("✅ Usuario encontrado: " + usuario.getNombre());
            
            return configuracionRepository.findByUsuario(usuario)
                    .orElseGet(() -> {
                        System.out.println("⚠️ No existe configuración, creando por defecto...");
                        return crearConfiguracionPorDefecto(usuario);
                    });
        } catch (Exception e) {
            System.err.println("❌ Error en obtenerConfiguracion: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Crear o actualizar configuración de negocio
     */
    @Transactional
    public ConfiguracionNegocio guardarConfiguracion(String email, ConfiguracionNegocio configuracion) {
        try {
            System.out.println("💾 Iniciando guardado de configuración para: " + email);
            Usuario usuario = usuarioService.buscarPorEmail(email);
            System.out.println("✅ Usuario encontrado: " + usuario.getNombre());

            ConfiguracionNegocio config = configuracionRepository.findByUsuario(usuario)
                    .orElse(new ConfiguracionNegocio());

            System.out.println("📝 Actualizando campos de configuración...");
            config.setUsuario(usuario);
            config.setNombreNegocio(configuracion.getNombreNegocio());
            config.setRut(configuracion.getRut() != null ? configuracion.getRut() : "");
            config.setDireccion(configuracion.getDireccion() != null ? configuracion.getDireccion() : "");
            config.setTelefono(configuracion.getTelefono() != null ? configuracion.getTelefono() : "");
            config.setEmail(configuracion.getEmail() != null ? configuracion.getEmail() : "");
            config.setSitioWeb(configuracion.getSitioWeb() != null ? configuracion.getSitioWeb() : "");

            ConfiguracionNegocio guardada = configuracionRepository.save(config);
            System.out.println("✅ Configuración guardada exitosamente en BD");
            
            return guardada;
        } catch (Exception e) {
            System.err.println("❌ Error en guardarConfiguracion: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al guardar configuración: " + e.getMessage());
        }
    }

    /**
     * Crear configuración por defecto para un nuevo usuario
     */
    @Transactional
    protected ConfiguracionNegocio crearConfiguracionPorDefecto(Usuario usuario) {
        try {
            System.out.println("🆕 Creando configuración por defecto para: " + usuario.getEmail());
            
            ConfiguracionNegocio config = new ConfiguracionNegocio();
            config.setUsuario(usuario);
            config.setNombreNegocio("Servitec Carahue");
            config.setRut("18.195.452-3");
            config.setDireccion("Manuel Rodríguez, 239B, Carahue");
            config.setTelefono("+56 9 3122 8675");
            config.setEmail("serviteccarahue@gmail.com");
            config.setSitioWeb("");
            
            ConfiguracionNegocio guardada = configuracionRepository.save(config);
            System.out.println("✅ Configuración por defecto creada y guardada");
            
            return guardada;
        } catch (Exception e) {
            System.err.println("❌ Error al crear configuración por defecto: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al crear configuración por defecto: " + e.getMessage());
        }
    }

    /**
     * Verificar si existe configuración para un usuario
     */
    @Transactional(readOnly = true)
    public boolean existeConfiguracion(String email) {
        return configuracionRepository.findByUsuarioEmail(email).isPresent();
    }

    /**
     * Eliminar configuración de un usuario
     */
    @Transactional
    public void eliminarConfiguracion(String email) {
        try {
            Usuario usuario = usuarioService.buscarPorEmail(email);
            configuracionRepository.deleteByUsuario(usuario);
            System.out.println("✅ Configuración eliminada para: " + email);
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar configuración: " + e.getMessage());
            throw new RuntimeException("Error al eliminar configuración: " + e.getMessage());
        }
    }
}