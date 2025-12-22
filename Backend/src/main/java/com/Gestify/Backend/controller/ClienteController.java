package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.Cliente;
import com.Gestify.Backend.services.ClienteService;
import jakarta.validation.Valid;
import com.Gestify.Backend.mapper.ClienteMapper;
import com.Gestify.Backend.dtos.ClienteResponseDTO;
import com.Gestify.Backend.dtos.ClienteRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ClienteMapper clienteMapper;

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> getAllClientes(Authentication auth) {
        String userEmail = auth.getName();
        List<Cliente> clientes = clienteService.findByUserEmail(userEmail);
        return ResponseEntity.ok(clienteMapper.toResponseDTOList(clientes));  
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(
            @PathVariable Long id,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            Cliente cliente = clienteService.findByIdAndUserEmail(id, userEmail);
            return ResponseEntity.ok(clienteMapper.toResponseDTO(cliente));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Cliente no encontrado", "message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCliente(
            @Valid @RequestBody ClienteRequestDTO clienteDto,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            Cliente clienteToSave = clienteMapper.toEntity(clienteDto);
            Cliente savedCliente = clienteService.save(clienteToSave, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(clienteMapper.toResponseDTO(savedCliente));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear cliente", "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> setCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO clienteDetailsDTO,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            Cliente cliente = clienteService.findByIdAndUserEmail(id, userEmail);
            
            cliente.setNombre(clienteDetailsDTO.getNombre());
            cliente.setTelefono(clienteDetailsDTO.getTelefono());
            cliente.setEmail(clienteDetailsDTO.getEmail());
            cliente.setDireccion(clienteDetailsDTO.getDireccion());

            Cliente updatedCliente = clienteService.save(cliente, userEmail);
            return ResponseEntity.ok(clienteMapper.toResponseDTO(updatedCliente));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Error al actualizar", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCliente(
            @PathVariable Long id,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            clienteService.deleteByIdAndUserEmail(id, userEmail);
            return ResponseEntity.ok(Map.of("message", "Cliente eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Error al eliminar", "message", e.getMessage()));
        }
    }
}