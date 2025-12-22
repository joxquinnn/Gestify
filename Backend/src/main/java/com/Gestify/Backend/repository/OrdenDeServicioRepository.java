package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.OrdenDeServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenDeServicioRepository extends JpaRepository<OrdenDeServicio, Long> {

    List<OrdenDeServicio> findByUserEmail(String userEmail);

    Optional<OrdenDeServicio> findByIdAndUserEmail(Long id, String userEmail);

    List<OrdenDeServicio> findByEstadoAndUserEmail(String estado, String userEmail);

    List<OrdenDeServicio> findByUserEmailOrderByFechaRecepcionDesc(String userEmail);

    @Query("SELECT o FROM OrdenDeServicio o WHERE o.userEmail = :userEmail ORDER BY o.fechaRecepcion DESC")
    List<OrdenDeServicio> findRecentByUserEmail(@Param("userEmail") String userEmail);

    long countByUserEmail(String userEmail);

    long countByEstadoAndUserEmail(String estado, String userEmail);

    boolean existsByIdAndUserEmail(Long id, String userEmail);

    List<OrdenDeServicio> findByEquipoModeloContainingIgnoreCaseAndUserEmail(
            String equipoModelo, 
            String userEmail
    );

    List<OrdenDeServicio> findByEquipoSerieAndUserEmail(String equipoSerie, String userEmail);

    /**
     * @deprecated Usar findByEstadoAndUserEmail en su lugar
     * Este método NO filtra por usuario, puede ser un riesgo de seguridad
     */
    @Deprecated
    List<OrdenDeServicio> findByEstado(String estado);

    
    boolean existsById(Long id);
}