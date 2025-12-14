package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Aquí puedes añadir métodos de búsqueda personalizados, como:
    // Cliente findByTelefono(String telefono);
}
