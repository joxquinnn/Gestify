package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.OrdenDeServicio;
import com.Gestify.Backend.entities.Cliente;
import com.Gestify.Backend.repository.OrdenDeServicioRepository;
import com.Gestify.Backend.repository.DetalleOrdenItemRepository;
import com.Gestify.Backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenDeServicioService {

    private final OrdenDeServicioRepository ordenRepository;
    private final DetalleOrdenItemRepository detalleRepository;
    private final ClienteRepository clienteRepository;
    private final RepuestoService repuestoService;

    public OrdenDeServicioService(
            OrdenDeServicioRepository ordenRepository,
            DetalleOrdenItemRepository detalleRepository,
            ClienteRepository clienteRepository,
            RepuestoService repuestoService) {

        this.ordenRepository = ordenRepository;
        this.detalleRepository = detalleRepository;
        this.clienteRepository = clienteRepository;
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

        if (order.getId() != null) {
            // === ACTUALIZACIÓN ===
            OrdenDeServicio existente = findByIdAndUserEmail(order.getId(), userEmail);

            // Si no viene cliente en la petición, mantener el cliente existente
            if (order.getCliente() == null || order.getCliente().getId() == null) {
                System.out.println("⚠️ No se envió cliente, manteniendo el existente");
                order.setCliente(existente.getCliente());
            } else {
                Long clienteId = order.getCliente().getId();

                System.out.println("🔍 Validando cliente ID: " + clienteId + " para usuario: " + userEmail);

                boolean clientePertenece = clienteRepository
                        .existsByIdAndUserEmail(clienteId, userEmail);

                if (!clientePertenece) {
                    throw new Exception("El cliente seleccionado no existe o no tienes permiso para usarlo");
                }

                Cliente cliente = clienteRepository.findByIdAndUserEmail(clienteId, userEmail)
                        .orElseThrow(() -> new Exception("Cliente no encontrado"));

                order.setCliente(cliente);
            }

            order.setUserEmail(existente.getUserEmail());

        } else {
            // === CREACIÓN ===
            if (order.getCliente() == null || order.getCliente().getId() == null) {
                throw new Exception("Debe especificar un cliente válido para la orden");
            }

            Long clienteId = order.getCliente().getId();

            System.out.println("🔍 Validando cliente ID: " + clienteId + " para usuario: " + userEmail);

            boolean clientePertenece = clienteRepository
                    .existsByIdAndUserEmail(clienteId, userEmail);

            if (!clientePertenece) {
                throw new Exception("El cliente seleccionado no existe o no tienes permiso para usarlo");
            }

            Cliente cliente = clienteRepository.findByIdAndUserEmail(clienteId, userEmail)
                    .orElseThrow(() -> new Exception("Cliente no encontrado"));

            order.setCliente(cliente);
            order.setUserEmail(userEmail);
        }

        OrdenDeServicio saved = ordenRepository.save(order);
        System.out.println("✅ Orden guardada - ID: " + saved.getId() + ", Cliente: " + saved.getCliente().getNombre());

        return saved;
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
        // Verificar que la orden pertenezca al usuario
        OrdenDeServicio order = findByIdAndUserEmail(id, userEmail);

        order.setEstado(newEstado.toUpperCase());
        OrdenDeServicio updatedOrder = ordenRepository.save(order);

        // Lógica de notificaciones según el estado
        switch (newEstado.toUpperCase()) {
            case "LISTO":
                System.out.println("📱 Notificación pendiente: Equipo listo para cliente " +
                        order.getCliente().getNombre());
                break;

            case "ENTREGADO":
                System.out.println("📦 Orden entregada: " + order.getId());
                break;

            case "EN_REPARACION":
                System.out.println("🔧 Orden en reparación: " + order.getId());
                break;
        }

        return updatedOrder;
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

    @Deprecated
    public List<OrdenDeServicio> findAll() {
        return ordenRepository.findAll();
    }

    @Deprecated
    public Optional<OrdenDeServicio> findByAll(Long id) {
        return ordenRepository.findById(id);
    }

    @Deprecated
    public List<OrdenDeServicio> findByEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }

    @Deprecated
    @Transactional
    public OrdenDeServicio saveOrder(OrdenDeServicio order) throws Exception {
        return ordenRepository.save(order);
    }

    @Deprecated
    @Transactional
    public OrdenDeServicio setEstado(Long id, String newEstado) throws Exception {
        OrdenDeServicio order = ordenRepository.findById(id)
                .orElseThrow(() -> new Exception("Orden de Servicio no encontrada"));

        order.setEstado(newEstado);
        return ordenRepository.save(order);
    }
}