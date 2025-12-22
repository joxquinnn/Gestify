package com.Gestify.Backend.services;

import com.Gestify.Backend.entities.Cliente;
import com.Gestify.Backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> findByUserEmail(String userEmail) {
        return clienteRepository.findByUserEmail(userEmail);
    }

    public Cliente findByIdAndUserEmail(Long id, String userEmail) throws Exception {
        return clienteRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new Exception("Cliente no encontrado o no tienes permiso para acceder a él"));
    }

    @Transactional
    public Cliente save(Cliente cliente, String userEmail) throws Exception {
        if (cliente.getId() == null) {
            // Cliente nuevo
            cliente.setUserEmail(userEmail);
        } else {
            // Actualización: verificar que pertenece al usuario
            Cliente existente = findByIdAndUserEmail(cliente.getId(), userEmail);
            cliente.setUserEmail(existente.getUserEmail()); // Mantener propietario original
        }
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void deleteByIdAndUserEmail(Long id, String userEmail) throws Exception {
        Cliente cliente = findByIdAndUserEmail(id, userEmail);
        clienteRepository.delete(cliente);
    }

    public long countByUserEmail(String userEmail) {
        return clienteRepository.countByUserEmail(userEmail);
    }

    @Deprecated
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }
    
    @Deprecated
    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }
    
    @Deprecated
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    @Deprecated
    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }
}