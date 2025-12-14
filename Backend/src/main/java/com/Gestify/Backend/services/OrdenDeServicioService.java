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

    // --- Lógica Básica ---

    public List<OrdenDeServicio> findAll() {
        return ordenRepository.findAll();
    }

    public Optional<OrdenDeServicio> findByAll(Long id) {
        return ordenRepository.findById(id);
    }

    // Lógica para el Kanban y Notificaciones
    public List<OrdenDeServicio> findByEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }

    // --- Lógica de Negocio Compleja ---

    @Transactional
    public OrdenDeServicio saveOrder(OrdenDeServicio order) throws Exception {
        OrdenDeServicio savedOrder = ordenRepository.save(order);
        
        return ordenRepository.save(savedOrder); // Guardamos la orden con el costo actualizado
    }

    
    // Lógica para cambiar el estado y activar notificaciones (Aún no implementada la notificación).
     
    @Transactional
    public OrdenDeServicio setEstado(Long id, String newEstado) throws Exception {
        OrdenDeServicio order = ordenRepository.findById(id)
            .orElseThrow(() -> new Exception("Orden de Servicio no encontrada"));
        
        order.setEstado(newEstado);
        OrdenDeServicio setOrder = ordenRepository.save(order);

        // Si el estado es "LISTO", se debe activar la notificación al cliente (futura implementación)
        if ("LISTO".equalsIgnoreCase(newEstado)) {
            // NotificacionService.enviarSMS(orden.getCliente().getTelefono(), "Tu equipo está listo!");
        }

        // Si el estado es "ENTREGADO", se debe reducir el stock (futura implementación)
        if ("ENTREGADO".equalsIgnoreCase(newEstado)) {
             // reducirStockDeOrden(ordenActualizada);
        }

        return setOrder;
    }

    // --- Métodos Auxiliares Futuros ---

    /* private BigDecimal calcularCostoTotal(OrdenDeServicio orden) {
        // Lógica para sumar costos de Repuestos y Servicios, aplicando márgenes.
        return BigDecimal.ZERO;
    } */
}