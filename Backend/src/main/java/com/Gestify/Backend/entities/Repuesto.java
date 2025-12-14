package com.Gestify.Backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal; // Importante para manejar dinero con precisión

@Entity
@Table(name = "repuestos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre; // Ej: Pantalla iPhone 11 Pro, Batería Samsung S20

    @Column(length = 50, unique = true)
    private String sku; // Código de producto (SKU)

    @Column(name = "costo_proveedor", precision = 10, scale = 2)
    private BigDecimal costoProveedor; // Precio pagado al proveedor

    @Column(name = "precio_venta", precision = 10, scale = 2)
    private BigDecimal precioVenta; // Precio final al cliente (con margen)

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual = 0; // Cantidad disponible en almacén

    @Column(name = "stock_minimo")
    private Integer stockMinimo = 0; // Umbral para la alerta de compra (Pronóstico)
}
