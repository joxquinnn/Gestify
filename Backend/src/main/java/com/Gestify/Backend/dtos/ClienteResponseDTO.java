package com.Gestify.Backend.dtos;

import lombok.Data;

@Data
public class ClienteResponseDTO {
    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private String direccion;
    
}