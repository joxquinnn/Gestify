package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.Repuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepuestoRepository extends JpaRepository<Repuesto, Long> {

    List<Repuesto> findByStockActualLessThanEqual(Integer stockMinimo);
}