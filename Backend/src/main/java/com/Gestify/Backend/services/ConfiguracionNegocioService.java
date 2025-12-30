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
    public ConfiguracionNegocio obtenerConfiguracion(String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        
        return configuracionRepository.findByUsuario(usuario)
                .orElseGet(() -> crearConfiguracionPorDefecto(usuario));
    }

    /**
     * Crear o actualizar configuración de negocio
     */
    @Transactional
    public ConfiguracionNegocio guardarConfiguracion(String email, ConfiguracionNegocio configuracion) {
        Usuario usuario = usuarioService.buscarPorEmail(email);

        ConfiguracionNegocio config = configuracionRepository.findByUsuario(usuario)
                .orElse(new ConfiguracionNegocio());

        config.setUsuario(usuario);
        config.setNombreNegocio(configuracion.getNombreNegocio());
        config.setRut(configuracion.getRut());
        config.setDireccion(configuracion.getDireccion());
        config.setTelefono(configuracion.getTelefono());
        config.setEmail(configuracion.getEmail());
        config.setSitioWeb(configuracion.getSitioWeb());

        return configuracionRepository.save(config);
    }

    /**
     * Crear configuración por defecto para un nuevo usuario
     */
    private ConfiguracionNegocio crearConfiguracionPorDefecto(Usuario usuario) {
        ConfiguracionNegocio config = new ConfiguracionNegocio();
        config.setUsuario(usuario);
        config.setNombreNegocio("Servitec Carahue");
        config.setRut("18.195.452-3");
        config.setDireccion("Manuel Rodríguez, 239B, Carahue");
        config.setTelefono("+56 9 3122 8675");
        config.setEmail("serviteccarahue@gmail.com");
        config.setSitioWeb("");
        
        return configuracionRepository.save(config);
    }

    /**
     * Verificar si existe configuración para un usuario
     */
    public boolean existeConfiguracion(String email) {
        return configuracionRepository.findByUsuarioEmail(email).isPresent();
    }

    /**
     * Eliminar configuración de un usuario
     */
    @Transactional
    public void eliminarConfiguracion(String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        configuracionRepository.deleteByUsuario(usuario);
    }
}