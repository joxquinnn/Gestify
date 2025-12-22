package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.Cliente;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    List<Cliente> findByUserEmail(String userEmail);
    
    Optional<Cliente> findByIdAndUserEmail(Long id, String userEmail);
    
    boolean existsByIdAndUserEmail(Long id, String userEmail);
    
    long countByUserEmail(String userEmail);
}
