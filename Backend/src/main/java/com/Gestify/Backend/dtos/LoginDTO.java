package com.Gestify.Backend.dtos;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;
    private String password;
}