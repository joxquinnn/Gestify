package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.Usuario;
import com.Gestify.Backend.services.UsuarioService;
import com.Gestify.Backend.services.ConfiguracionNegocioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ConfiguracionNegocioService configuracionService;

    /**
     * GET /api/usuario/perfil - Obtener perfil del usuario autenticado
     */
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(Authentication authentication) {
        try {
            String email = authentication.getName();
            Usuario usuario = usuarioService.buscarPorEmail(email);
            
            Map<String, Object> perfil = new HashMap<>();
            perfil.put("id", usuario.getId());
            perfil.put("nombre", usuario.getNombre());
            perfil.put("email", usuario.getEmail());
            perfil.put("rol", usuario.getRol());
            
            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener perfil: " + e.getMessage());
        }
    }

    /**
     * PUT /api/usuario/perfil - Actualizar perfil del usuario
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @RequestBody Map<String, String> datos,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            String nombre = datos.get("nombre");
            String telefono = datos.get("telefono");
            String cargo = datos.get("cargo");
            
            Usuario usuario = usuarioService.actualizarPerfil(email, nombre, telefono, cargo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.getId());
            response.put("nombre", usuario.getNombre());
            response.put("email", usuario.getEmail());
            response.put("mensaje", "Perfil actualizado correctamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar perfil: " + e.getMessage());
        }
    }

    /**
     * PUT /api/usuario/cambiar-password - Cambiar contraseña
     */
    @PutMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(
            @RequestBody Map<String, String> datos,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            String passwordActual = datos.get("passwordActual");
            String passwordNueva = datos.get("passwordNueva");
            
            if (passwordActual == null || passwordNueva == null) {
                return ResponseEntity.badRequest().body("Faltan datos requeridos");
            }
            
            usuarioService.cambiarPassword(email, passwordActual, passwordNueva);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Contraseña actualizada correctamente");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar contraseña: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/usuario/eliminar-cuenta - Eliminar cuenta permanentemente
     */
    @DeleteMapping("/eliminar-cuenta")
    public ResponseEntity<?> eliminarCuenta(Authentication authentication) {
        try {
            String email = authentication.getName();
            
            // Eliminar primero la configuración
            configuracionService.eliminarConfiguracion(email);
            
            // Luego eliminar el usuario (esto eliminará en cascada todo lo relacionado)
            usuarioService.eliminarCuenta(email);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Cuenta eliminada permanentemente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar cuenta: " + e.getMessage());
        }
    }
}