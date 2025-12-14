package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre; // Ej: Diagnóstico, Reemplazo de Batería

    @Column(name = "tarifa_base", precision = 10, scale = 2)
    private BigDecimal tarifaBase; // Precio por hora o tarifa fija del servicio

    @Column(name = "tiempo_estimado_horas", precision = 4, scale = 2)
    private BigDecimal tiempoEstimadoHoras; // El tiempo asociado al servicio (ej: 1.5 horas)

    @Column(name = "es_mano_obra")
    private Boolean esManoObra = true; // Indica si es un servicio de mano de obra (para diferenciar de repuestos)
}
