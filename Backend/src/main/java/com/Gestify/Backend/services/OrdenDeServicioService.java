package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.OrdenDeServicio;
import com.Gestify.Backend.entities.DetalleOrdenItem;
import com.Gestify.Backend.repository.OrdenDeServicioRepository;
import com.Gestify.Backend.repository.DetalleOrdenItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenDeServicioService {

    private final OrdenDeServicioRepository ordenRepository;
    private final DetalleOrdenItemRepository detalleRepository;
    private final RepuestoService repuestoService;

    // Inyección de dependencias
    public OrdenDeServicioService(
            OrdenDeServicioRepository ordenRepository,
            DetalleOrdenItemRepository detalleRepository,
            RepuestoService repuestoService) {

        this.ordenRepository = ordenRepository;
        this.detalleRepository = detalleRepository;
        this.repuestoService = repuestoService;
    }

    public List<OrdenDeServicio> findByUserEmail(String userEmail) {
        return ordenRepository.findByUserEmail(userEmail);
    }

    public List<OrdenDeServicio> findByUserEmailOrderByDate(String userEmail) {
        return ordenRepository.findByUserEmailOrderByFechaRecepcionDesc(userEmail);
    }

    public OrdenDeServicio findByIdAndUserEmail(Long id, String userEmail) throws Exception {
        return ordenRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new Exception("Orden no encontrada o no tienes permiso para acceder a ella"));
    }

    @Transactional
    public OrdenDeServicio saveOrder(OrdenDeServicio order, String userEmail) throws Exception {
        OrdenDeServicio savedOrder = ordenRepository.save(order);

        return ordenRepository.findById(savedOrder.getId()).orElse(savedOrder);
    }

    @Transactional
    public void deleteByIdAndUserEmail(Long id, String userEmail) throws Exception {
        OrdenDeServicio orden = findByIdAndUserEmail(id, userEmail);
        ordenRepository.delete(orden);
    }

    public List<OrdenDeServicio> findByEstadoAndUserEmail(String estado, String userEmail) {
        return ordenRepository.findByEstadoAndUserEmail(estado.toUpperCase(), userEmail);
    }

    @Transactional
    public OrdenDeServicio setEstado(Long id, String newEstado, String userEmail) throws Exception {
        OrdenDeServicio order = ordenRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new Exception("Orden no encontrada"));

        order.setEstado(newEstado.toUpperCase());
        ordenRepository.save(order);

      
        return ordenRepository.findById(id).orElse(order);
    }

    public long countByUserEmail(String userEmail) {
        return ordenRepository.countByUserEmail(userEmail);
    }

    public long countByEstadoAndUserEmail(String estado, String userEmail) {
        return ordenRepository.countByEstadoAndUserEmail(estado.toUpperCase(), userEmail);
    }

    public List<OrdenDeServicio> findRecentByUserEmail(String userEmail, int limit) {
        List<OrdenDeServicio> ordenes = ordenRepository.findRecentByUserEmail(userEmail);
        return ordenes.size() > limit ? ordenes.subList(0, limit) : ordenes;
    }

    /**
     * @deprecated Usar findByUserEmail(String userEmail) en su lugar
     *             Este método devuelve TODAS las órdenes sin filtrar por usuario
     */
    @Deprecated
    public List<OrdenDeServicio> findAll() {
        return ordenRepository.findAll();
    }

    /**
     * @deprecated Usar findByIdAndUserEmail(Long id, String userEmail)
     */
    @Deprecated
    public Optional<OrdenDeServicio> findByAll(Long id) {
        return ordenRepository.findById(id);
    }

    /**
     * @deprecated Usar findByEstadoAndUserEmail(String estado, String userEmail)
     *             Este método NO filtra por usuario
     */
    @Deprecated
    public List<OrdenDeServicio> findByEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }

    /**
     * @deprecated Usar saveOrder(OrdenDeServicio order, String userEmail)
     */
    @Deprecated
    @Transactional
    public OrdenDeServicio saveOrder(OrdenDeServicio order) throws Exception {
        return ordenRepository.save(order);
    }

    /**
     * @deprecated Usar setEstado(Long id, String newEstado, String userEmail)
     */
    @Deprecated
    @Transactional
    public OrdenDeServicio setEstado(Long id, String newEstado) throws Exception {
        OrdenDeServicio order = ordenRepository.findById(id)
                .orElseThrow(() -> new Exception("Orden de Servicio no encontrada"));

        order.setEstado(newEstado);
        return ordenRepository.save(order);
    }

}