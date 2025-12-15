package com.Gestify.Backend.mapper;

import com.Gestify.Backend.dtos.ClienteRequestDTO;
import com.Gestify.Backend.dtos.ClienteResponseDTO;
import com.Gestify.Backend.entities.Cliente;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public ClienteResponseDTO toResponseDTO(Cliente cliente) {
        if (cliente == null) {
            return null;
        }
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setTelefono(cliente.getTelefono());
        dto.setEmail(cliente.getEmail());
        dto.setDireccion(cliente.getDireccion());
        return dto;
    }

    public Cliente toEntity(ClienteRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setDireccion(dto.getDireccion());
        return cliente;
    }
    
    public List<ClienteResponseDTO> toResponseDTOList(List<Cliente> clientes) {
        if (clientes == null) {
            return List.of();
        }
        return clientes.stream()
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
    }
}
