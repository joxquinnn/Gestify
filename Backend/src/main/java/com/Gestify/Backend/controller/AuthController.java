package com.Gestify.Backend.controller;

import com.Gestify.Backend.dtos.LoginDTO;
import com.Gestify.Backend.dtos.RegistroDTO;
import com.Gestify.Backend.dtos.AuthResponseDTO;
import com.Gestify.Backend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://appealing-tranquility-production-3da9.up.railway.app"
})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistroDTO registroDTO) {
        try {
            authService.registrarUsuario(registroDTO);
            return ResponseEntity.ok("Usuario registrado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.autenticar(loginDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales inválidas: " + e.getMessage());
        }
    }
}