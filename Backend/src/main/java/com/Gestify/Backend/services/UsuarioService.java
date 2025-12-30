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
    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        System.out.println("🔍 Buscando usuario con email: " + email);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("❌ Usuario no encontrado: " + email);
                    return new RuntimeException("Usuario no encontrado con email: " + email);
                });
    }

    /**
     * Actualizar perfil de usuario
     */
    @Transactional
    public Usuario actualizarPerfil(String email, String nombre, String telefono, String cargo) {
        try {
            System.out.println("🔄 Actualizando perfil de: " + email);
            Usuario usuario = buscarPorEmail(email);
            
            if (nombre != null && !nombre.isEmpty()) {
                usuario.setNombre(nombre);
                System.out.println("✅ Nombre actualizado a: " + nombre);
            }
            
            // Nota: telefono y cargo no están en la entidad Usuario actual
            // Si quieres agregarlos, debes modificar la entidad Usuario
            
            Usuario actualizado = usuarioRepository.save(usuario);
            System.out.println("✅ Perfil actualizado correctamente");
            return actualizado;
        } catch (Exception e) {
            System.err.println("❌ Error al actualizar perfil: " + e.getMessage());
            throw new RuntimeException("Error al actualizar perfil: " + e.getMessage());
        }
    }

    /**
     * Cambiar contraseña del usuario
     */
    @Transactional
    public void cambiarPassword(String email, String passwordActual, String passwordNueva) {
        try {
            System.out.println("🔒 Cambiando contraseña para: " + email);
            Usuario usuario = buscarPorEmail(email);

            // Verificar que la contraseña actual sea correcta
            if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
                System.err.println("❌ Contraseña actual incorrecta");
                throw new RuntimeException("La contraseña actual es incorrecta");
            }

            // Validar que la nueva contraseña tenga al menos 6 caracteres
            if (passwordNueva == null || passwordNueva.length() < 6) {
                System.err.println("❌ Contraseña muy corta");
                throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
            }

            // Actualizar con la nueva contraseña encriptada
            usuario.setPassword(passwordEncoder.encode(passwordNueva));
            usuarioRepository.save(usuario);
            System.out.println("✅ Contraseña actualizada correctamente");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("❌ Error al cambiar contraseña: " + e.getMessage());
            throw new RuntimeException("Error al cambiar contraseña: " + e.getMessage());
        }
    }

    /**
     * Eliminar cuenta de usuario permanentemente
     */
    @Transactional
    public void eliminarCuenta(String email) {
        try {
            System.out.println("🗑️ Eliminando cuenta de: " + email);
            Usuario usuario = buscarPorEmail(email);
            
            // Aquí se eliminará el usuario y por cascada todas sus configuraciones y órdenes
            // Asegúrate de tener @OnDelete(action = OnDeleteAction.CASCADE) en las relaciones
            usuarioRepository.delete(usuario);
            System.out.println("✅ Cuenta eliminada permanentemente");
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar cuenta: " + e.getMessage());
            throw new RuntimeException("Error al eliminar cuenta: " + e.getMessage());
        }
    }

    /**
     * Verificar si existe un usuario por email
     */
    @Transactional(readOnly = true)
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}