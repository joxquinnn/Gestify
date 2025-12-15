package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.OrdenDeServicio;
import com.Gestify.Backend.services.OrdenDeServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenDeServicioController {

    private final OrdenDeServicioService ordenService;

    public OrdenDeServicioController(OrdenDeServicioService ordenService) {
        this.ordenService = ordenService;
    }

    // --- CRUD BÁSICO Y CREACIÓN (Entrada de Equipo) ---

    // Crear/Guardar una nueva Orden (Entrada de equipo)
    @PostMapping
    public ResponseEntity<OrdenDeServicio> saveOrder(@RequestBody OrdenDeServicio order) {
        try {
            OrdenDeServicio newOrder = ordenService.saveOrder(order);
            return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            // Manejo de errores simplificado. En producción usarías un ControllerAdvice.
            return new ResponseEntity<>((OrdenDeServicio)null, HttpStatus.BAD_REQUEST); 
        }
    }
    
    // Obtener todas las órdenes
    @GetMapping
    public ResponseEntity<List<OrdenDeServicio>> findAll() {
        return new ResponseEntity<>(ordenService.findAll(), HttpStatus.OK);
    }

    // --- LÓGICA DE NEGOCIO: KANBAN Y ESTADOS ---

    
    // Obtener órdenes por estado ---
    @GetMapping("/estado")
    public ResponseEntity<List<OrdenDeServicio>> findByEstado(@RequestParam String valor) {
        List<OrdenDeServicio> orders = ordenService.findByEstado(valor.toUpperCase());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Actualizar el estado de una orden (Dispara la lógica de notificación) ---
    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenDeServicio> setEstado(
            @PathVariable Long id, 
            @RequestParam String newEstado) {
        try {
            OrdenDeServicio ordenActualizada = ordenService.setEstado(id, newEstado.toUpperCase());
            return new ResponseEntity<>(ordenActualizada, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}