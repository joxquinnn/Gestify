package com.Gestify.Backend.dtos;

import lombok.Data;

@Data
public class RegistroDTO {
    private String nombre;
    private String email;
    private String password;
}