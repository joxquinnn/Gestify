package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;
    
    @Column(length = 15)
    private String telefono;
    
    @Email(message = "Email no válido")
    private String email;
    
    private String direccion;
    
    @Column(nullable = false, name = "user_email")
    private String userEmail;
    
    // Constructores
    public Cliente() {}
    
    public Cliente(String nombre, String telefono, String email, String direccion, String userEmail) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
        this.userEmail = userEmail;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getUserEmail() {
        return userEmail;
    }
    
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}