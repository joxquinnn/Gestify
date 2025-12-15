package com.Gestify.Backend.dtos;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class ClienteRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 15)
    private String telefono;

    @Email(message = "Debe ser un formato de email válido")
    private String email;

    private String direccion;
    
}