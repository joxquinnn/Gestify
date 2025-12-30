package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.Usuario;
import com.Gestify.Backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Buscar usuario por email
     */
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Actualizar perfil de usuario
     */
    @Transactional
    public Usuario actualizarPerfil(String email, String nombre, String telefono, String cargo) {
        Usuario usuario = buscarPorEmail(email);
        
        if (nombre != null && !nombre.isEmpty()) {
            usuario.setNombre(nombre);
        }
        
        // Nota: telefono y cargo no están en la entidad Usuario actual
        
        return usuarioRepository.save(usuario);
    }

    /**
     * Cambiar contraseña del usuario
     */
    @Transactional
    public void cambiarPassword(String email, String passwordActual, String passwordNueva) {
        Usuario usuario = buscarPorEmail(email);

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Validar que la nueva contraseña tenga al menos 6 caracteres
        if (passwordNueva == null || passwordNueva.length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }

        // Actualizar con la nueva contraseña encriptada
        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }

    /**
     * Eliminar cuenta de usuario permanentemente
     */
    @Transactional
    public void eliminarCuenta(String email) {
        Usuario usuario = buscarPorEmail(email);
        
        
        usuarioRepository.delete(usuario);
    }

    /**
     * Verificar si existe un usuario por email
     */
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}