package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.OrdenDeServicio;
import com.Gestify.Backend.services.OrdenDeServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenDeServicioController {

    private final OrdenDeServicioService ordenService;

    public OrdenDeServicioController(OrdenDeServicioService ordenService) {
        this.ordenService = ordenService;
    }

    @PostMapping
    public ResponseEntity<?> saveOrder(@RequestBody OrdenDeServicio order, Authentication auth) {
        try {
            String userEmail = auth.getName();
            OrdenDeServicio newOrder = ordenService.saveOrder(order, userEmail);
            return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear la orden", "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<OrdenDeServicio>> findAll(Authentication auth) {
        String userEmail = auth.getName();
        List<OrdenDeServicio> ordenes = ordenService.findByUserEmail(userEmail);
        return new ResponseEntity<>(ordenes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(
            @PathVariable Long id,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            OrdenDeServicio orden = ordenService.findByIdAndUserEmail(id, userEmail);
            return ResponseEntity.ok(orden);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Orden no encontrada", "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable Long id,
            @RequestBody OrdenDeServicio order,
            Authentication auth) {
        try {
            String userEmail = auth.getName();

            // Asignar el ID de la URL al objeto
            order.setId(id);

            OrdenDeServicio ordenActualizada = ordenService.saveOrder(order, userEmail);
            return ResponseEntity.ok(ordenActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Error al actualizar", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(
            @PathVariable Long id,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            ordenService.deleteByIdAndUserEmail(id, userEmail);
            return ResponseEntity.ok(Map.of("message", "Orden eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Error al eliminar", "message", e.getMessage()));
        }
    }

    @GetMapping("/estado")
    public ResponseEntity<List<OrdenDeServicio>> findByEstado(
            @RequestParam String valor,
            Authentication auth) {
        String userEmail = auth.getName();
        List<OrdenDeServicio> orders = ordenService.findByEstadoAndUserEmail(
                valor.toUpperCase(),
                userEmail);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> setEstado(
            @PathVariable Long id,
            @RequestParam String newEstado,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            OrdenDeServicio ordenActualizada = ordenService.setEstado(
                    id,
                    newEstado.toUpperCase(),
                    userEmail);
            return new ResponseEntity<>(ordenActualizada, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Error al actualizar estado", "message", e.getMessage()));
        }
    }

    @GetMapping("/estadisticas/estados")
    public ResponseEntity<Map<String, Long>> contarPorEstado(Authentication auth) {
        String userEmail = auth.getName();
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("recibido", ordenService.countByEstadoAndUserEmail("RECIBIDO", userEmail));
            stats.put("diagnostico", ordenService.countByEstadoAndUserEmail("DIAGNOSTICO", userEmail));
            stats.put("enReparacion", ordenService.countByEstadoAndUserEmail("EN_REPARACION", userEmail));
            stats.put("listo", ordenService.countByEstadoAndUserEmail("LISTO", userEmail));
            stats.put("entregado", ordenService.countByEstadoAndUserEmail("ENTREGADO", userEmail));
            stats.put("total", ordenService.countByUserEmail(userEmail));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<OrdenDeServicio>> obtenerRecientes(
            @RequestParam(defaultValue = "5") int limit,
            Authentication auth) {
        String userEmail = auth.getName();
        List<OrdenDeServicio> ordenes = ordenService.findRecentByUserEmail(userEmail, limit);
        return ResponseEntity.ok(ordenes);
    }

    /**
     * @deprecated Usar GET /api/ordenes en su lugar
     */
    @Deprecated
    @GetMapping("/all")
    public ResponseEntity<List<OrdenDeServicio>> findAllLegacy() {
        return new ResponseEntity<>(ordenService.findAll(), HttpStatus.OK);
    }
}