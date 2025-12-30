package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.ConfiguracionNegocio;
import com.Gestify.Backend.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConfiguracionNegocioRepository extends JpaRepository<ConfiguracionNegocio, Long> {
    
    Optional<ConfiguracionNegocio> findByUsuario(Usuario usuario);
    
    Optional<ConfiguracionNegocio> findByUsuarioEmail(String email);
    
    boolean existsByUsuario(Usuario usuario);
    
    void deleteByUsuario(Usuario usuario);
}