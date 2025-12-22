package com.Gestify.Backend.services;

import com.Gestify.Backend.dtos.LoginDTO;
import com.Gestify.Backend.dtos.RegistroDTO;
import com.Gestify.Backend.dtos.AuthResponseDTO;
import com.Gestify.Backend.entities.Usuario;
import com.Gestify.Backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public void registrarUsuario(RegistroDTO dto) throws Exception {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());

        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));

        usuarioRepository.save(usuario);
    }

    public AuthResponseDTO autenticar(LoginDTO dto) throws Exception {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new Exception("Contraseña incorrecta");
        }

        String tokenReal = jwtService.generateToken(usuario.getEmail());
        return new AuthResponseDTO(tokenReal, usuario.getEmail(), usuario.getNombre());
    }
}