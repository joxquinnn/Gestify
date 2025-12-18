import type { Feature } from '../types/feature';

export const features: Feature[] = [
  {
    id: 1,
    title: "Gestión Centralizada de Clientes",
    description: "Almacena historial de reparaciones, datos de contacto y equipos asociados, todo en un solo lugar.",
    iconClass: "icon-cliente", 
  },
  {
    id: 2,
    title: "Trazabilidad de Órdenes de Servicio",
    description: "Crea, asigna y da seguimiento al estado de cada orden (Pendiente, En Proceso, Terminada), notificando al cliente.",
    iconClass: "icon-orden", 
  },
  {
    id: 3,
    title: "Control de Inventario y Repuestos",
    description: "Monitorea tu stock en tiempo real, registra el uso de repuestos en cada orden y genera alertas de baja existencia.",
    iconClass: "icon-repuesto", 
  },
  {
    id: 4,
    title: "Reportes y Eficiencia",
    description: "Genera informes sobre tiempos de reparación, rendimiento de técnicos y ganancias para optimizar tu operación.",
    iconClass: "icon-reporte", 
  },
];