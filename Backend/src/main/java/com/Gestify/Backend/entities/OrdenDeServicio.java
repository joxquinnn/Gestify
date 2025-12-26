package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes_servicio", indexes = {
        @Index(name = "idx_user_email", columnList = "user_email"),
        @Index(name = "idx_estado", columnList = "estado"),
        @Index(name = "idx_user_email_estado", columnList = "user_email, estado")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDeServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false, updatable = false)
    private String userEmail;

    // Relación con Cliente: Una Orden pertenece a Un Cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha_recepcion", nullable = false, updatable = false)
    private LocalDateTime fechaRecepcion;

    @Column(name = "equipo_modelo", length = 100)
    private String equipoModelo;

    @Column(name = "tipo_equipo", length = 50)
    private String tipoEquipo;

    @Column(name = "equipo_serie", length = 100)
    private String equipoSerie;

    @Column(name = "patron_contrasena", length = 100)
    private String patronContrasena;

    @Column(name = "diagnostico_inicial", columnDefinition = "TEXT")
    private String diagnosticoInicial;

    @Column(name = "condicion_fisica", columnDefinition = "TEXT")
    private String condicionFisica;

    // Campo CRÍTICO para notificaciones y Kanban:
    @Column(nullable = false, length = 50)
    private String estado = "RECIBIDO"; // Valores posibles: RECIBIDO, DIAGNOSTICO, EN_REPARACION, LISTO, ENTREGADO

    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal = BigDecimal.ZERO;

    // Campos de auditoría
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (fechaRecepcion == null) {
            fechaRecepcion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "RECIBIDO";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}