package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDeServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Cliente: Una Orden pertenece a Un Cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha_recepcion", nullable = false)
    private LocalDateTime fechaRecepcion = LocalDateTime.now();

    @Column(name = "equipo_modelo", length = 100)
    private String equipoModelo;

    @Column(name = "equipo_serie", length = 100)
    private String equipoSerie;

    @Column(name = "diagnostico_inicial", columnDefinition = "TEXT")
    private String diagnosticoInicial;

    @Column(name = "condicion_fisica", columnDefinition = "TEXT")
    private String condicionFisica;

    // Campo CRÍTICO para notificaciones y Kanban:
    @Column(nullable = false, length = 50)
    private String estado = "RECIBIDO"; // Valores posibles: RECIBIDO, DIAGNOSTICO, EN_REPARACION, LISTO, ENTREGADO

    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal = BigDecimal.ZERO;
    
    // La relación con DetalleOrdenItem se maneja en la otra entidad (mappedBy)
    // No la definiremos aquí para evitar problemas de recursividad en esta etapa inicial.
}
