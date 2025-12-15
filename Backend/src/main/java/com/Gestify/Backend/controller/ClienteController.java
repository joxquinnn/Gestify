package com.Gestify.Backend.controller;

import com.Gestify.Backend.entities.Cliente;
import com.Gestify.Backend.services.ClienteService;

import jakarta.validation.Valid;

import com.Gestify.Backend.mapper.ClienteMapper;
import com.Gestify.Backend.dtos.ClienteResponseDTO;
import com.Gestify.Backend.dtos.ClienteRequestDTO;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ClienteMapper clienteMapper;

    // Obtener todos los clietnes
    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> getAllClientes() {
        List<Cliente> clientes = clienteService.findAll();
        return ResponseEntity.ok(clienteMapper.toResponseDTOList(clientes));  
    }

    // Obtener un cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> findById(@PathVariable Long id) {
        return clienteService.findById(id)
                .map(cliente -> new ResponseEntity<>(clienteMapper.toResponseDTO(cliente), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> createCliente(@Valid @RequestBody ClienteRequestDTO clienteDto) {
        
        Cliente clienteToSave = clienteMapper.toEntity(clienteDto);

        Cliente savedCliente = clienteService.save(clienteToSave);

        return ResponseEntity.status(HttpStatus.CREATED).body(clienteMapper.toResponseDTO(savedCliente));
    }

    // Actualizar un cliente existente
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> setCliente(@PathVariable Long id, @Valid @RequestBody ClienteRequestDTO clienteDetailsDTO) {
        return clienteService.findById(id)
                .map(cliente -> {
                    cliente.setNombre(clienteDetailsDTO.getNombre());
                    cliente.setTelefono(clienteDetailsDTO.getTelefono());
                    cliente.setEmail(clienteDetailsDTO.getEmail());
                    cliente.setDireccion(clienteDetailsDTO.getDireccion());

                    Cliente updateCliente = clienteService.save(cliente);

                    return new ResponseEntity<>(clienteMapper.toResponseDTO(updateCliente), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Eliminar un Cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCliente(@PathVariable Long id) {
        clienteService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
