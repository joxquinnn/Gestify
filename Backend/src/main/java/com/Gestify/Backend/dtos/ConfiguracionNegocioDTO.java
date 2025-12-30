package com.Gestify.Backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionNegocioDTO {
    private Long id;
    private String nombreNegocio;
    private String rut;
    private String direccion;
    private String telefono;
    private String email;
    private String sitioWeb;
}

// ===== REQUEST DTO =====
@Data
@NoArgsConstructor
@AllArgsConstructor
class ConfiguracionNegocioRequestDTO {
    private String nombreNegocio;
    private String rut;
    private String direccion;
    private String telefono;
    private String email;
    private String sitioWeb;
}

// ===== DTO PARA PERFIL DE USUARIO =====
@Data
@NoArgsConstructor
@AllArgsConstructor
class PerfilUsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String cargo;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ActualizarPerfilDTO {
    private String nombre;
    private String telefono;
    private String cargo;
}

// ===== DTO PARA CAMBIO DE CONTRASEÑA =====
@Data
@NoArgsConstructor
@AllArgsConstructor
class CambiarPasswordDTO {
    private String passwordActual;
    private String passwordNueva;
}