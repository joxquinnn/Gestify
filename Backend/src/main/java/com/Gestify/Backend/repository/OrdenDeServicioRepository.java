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

    @Query("SELECT o FROM OrdenDeServicio o WHERE o.user.email = :email")
    List<OrdenDeServicio> findByUserEmail(@Param("email") String email);

    @Query("SELECT o FROM OrdenDeServicio o WHERE o.id = :id AND o.user.email = :email")
    Optional<OrdenDeServicio> findByIdAndUserEmail(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT o FROM OrdenDeServicio o WHERE o.estado = :estado AND o.user.email = :email")
    List<OrdenDeServicio> findByEstadoAndUserEmail(@Param("estado") String estado, @Param("email") String email);

    List<OrdenDeServicio> findByUserEmailOrderByFechaRecepcionDesc(String userEmail);

    @Query("SELECT o FROM OrdenDeServicio o WHERE o.user.email = :email ORDER BY o.fechaRecepcion DESC")
    List<OrdenDeServicio> findRecentByUserEmail(@Param("email") String email);

    @Query("SELECT COUNT(o) FROM OrdenDeServicio o WHERE o.user.email = :email")
    long countByUserEmail(@Param("email") String email);

    long countByEstadoAndUserEmail(String estado, String userEmail);

    boolean existsByIdAndUserEmail(Long id, String userEmail);

    List<OrdenDeServicio> findByEquipoModeloContainingIgnoreCaseAndUserEmail(
            String equipoModelo,
            String userEmail);

    List<OrdenDeServicio> findByEquipoSerieAndUserEmail(String equipoSerie, String userEmail);

    /**
     * @deprecated Usar findByEstadoAndUserEmail en su lugar
     *             Este método NO filtra por usuario, puede ser un riesgo de
     *             seguridad
     */
    @Deprecated
    List<OrdenDeServicio> findByEstado(String estado);

    boolean existsById(Long id);
}