package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.OrdenDeServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenDeServicioRepository extends JpaRepository<OrdenDeServicio, Long> {
    List<OrdenDeServicio> findByEstado(String estado);
}