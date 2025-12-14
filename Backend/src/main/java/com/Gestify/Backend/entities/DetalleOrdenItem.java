package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_orden_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con OrdenDeServicio: Muchos DetalleItems pertenecen a Una Orden
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id", nullable = false)
    private OrdenDeServicio ordenDeServicio;

    // Usaremos esta columna para identificar si el item es un REPUESTO o un SERVICIO
    @Column(name = "tipo_item", nullable = false, length = 10)
    private String tipoItem; // REPUESTO o SERVICIO

    @Column(name = "item_referencia_id", nullable = false)
    private Long itemReferenciaId; // ID que apunta a la tabla de Repuesto O Servicio (depende del tipoItem)

    @Column(nullable = false)
    private Integer cantidad; // Cantidad de repuestos o unidades de servicio/horas

    @Column(name = "margen_aplicado", precision = 4, scale = 2)
    private BigDecimal margenAplicado; // Ej: 0.30 para 30%

    @Column(name = "precio_unitario_final", precision = 10, scale = 2)
    private BigDecimal precioUnitarioFinal; // Precio final al cliente por unidad
}
