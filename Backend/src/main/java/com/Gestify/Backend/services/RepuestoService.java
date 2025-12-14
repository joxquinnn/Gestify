package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.Repuesto;
import com.Gestify.Backend.repository.RepuestoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RepuestoService {

    private final RepuestoRepository repuestoRepository;

    public RepuestoService(RepuestoRepository repuestoRepository) {
        this.repuestoRepository = repuestoRepository;
    }

    // --- Métodos de Gestión Básica (CRUD) ---

    public List<Repuesto> findAll() {
        return repuestoRepository.findAll();
    }

    public Optional<Repuesto> findById(Long id) {
        return repuestoRepository.findById(id);
    }

    public Repuesto save(Repuesto repuesto) {
        return repuestoRepository.save(repuesto);
    }

    public void deleteById(Long id) {
        repuestoRepository.deleteById(id);
    }

    // --- Lógica de Negocio: Pronóstico de Compras ---

    public List<Repuesto> obtenerRepuestosBajoStock() {
        return repuestoRepository.findByStockActualLessThanEqual(0);
    }

    public Repuesto reducirStock(Long id, Integer cantidad) throws Exception {
        Repuesto repuesto = findById(id)
            .orElseThrow(() -> new Exception("Repuesto no encontrado"));

        if (repuesto.getStockActual() < cantidad) {
            throw new Exception("Stock insuficiente para realizar la operación.");
        }

        repuesto.setStockActual(repuesto.getStockActual() - cantidad);
        return repuestoRepository.save(repuesto);
    }
}