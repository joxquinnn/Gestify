package com.Gestify.Backend.repository;

import com.Gestify.Backend.entities.DetalleOrdenItem;
import com.Gestify.Backend.entities.OrdenDeServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetalleOrdenItemRepository extends JpaRepository<DetalleOrdenItem, Long> {

    /**
     * Busca todos los items de detalle asociados a una OrdenDeServicio específica.
     */
    List<DetalleOrdenItem> findByOrdenDeServicio(OrdenDeServicio ordenDeServicio);
}