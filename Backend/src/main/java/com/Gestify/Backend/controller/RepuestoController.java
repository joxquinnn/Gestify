package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.Repuesto;
import com.Gestify.Backend.services.RepuestoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/repuestos")
public class RepuestoController {

    private final RepuestoService repuestoService;

    public RepuestoController(RepuestoService repuestoService) {
        this.repuestoService = repuestoService;
    }

    // --- CRUD BÁSICO ---
    @GetMapping
    public ResponseEntity<List<Repuesto>> findAll() {
        return new ResponseEntity<>(repuestoService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repuesto> findByid(@PathVariable Long id) {
        return repuestoService.findById(id)
                .map(repuesto -> new ResponseEntity<>(repuesto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Repuesto> save(@RequestBody Repuesto repuesto) {
        Repuesto nuevoRepuesto = repuestoService.save(repuesto);
        return new ResponseEntity<>(nuevoRepuesto, HttpStatus.CREATED);
    }

    // --- FUNCIÓN CLAVE: PRONÓSTICO DE COMPRAS ---

    // Endpoint para obtener la lista de repuestos que están bajo stock mínimo ---
    @GetMapping("/bajo-stock")
    public ResponseEntity<List<Repuesto>> obtenerBajoStock() {
        List<Repuesto> repuestosEnAlerta = repuestoService.obtenerRepuestosBajoStock();
        return new ResponseEntity<>(repuestosEnAlerta, HttpStatus.OK);
    }
}