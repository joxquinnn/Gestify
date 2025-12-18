// src/data/pricingData.ts

import type { PricingPlan } from '../types/Pricing';

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Plan Básico (Taller Pequeño)",
    price: 19.99,
    frequency: "mensual",
    isPopular: false,
    ctaText: "Prueba Gratis",
    features: [
      { text: "Gestión de 50 Clientes", included: true },
      { text: "Órdenes de Servicio Ilimitadas", included: true },
      { text: "1 Usuario (Técnico)", included: true },
      { text: "Control Básico de Inventario", included: true },
      { text: "Reportes Avanzados", included: false },
      { text: "Soporte 24/7 Dedicado", included: false },
    ],
  },
  {
    id: 2,
    name: "Plan Profesional (Recomendado)",
    price: 49.99,
    frequency: "mensual",
    isPopular: true, // Destacaremos este plan
    ctaText: "Comenzar Ahora",
    features: [
      { text: "Gestión Ilimitada de Clientes", included: true },
      { text: "Órdenes de Servicio Ilimitadas", included: true },
      { text: "Hasta 5 Usuarios (Técnicos)", included: true },
      { text: "Control Avanzado de Inventario", included: true },
      { text: "Reportes Avanzados (Rendimiento, Ganancias)", included: true },
      { text: "Notificaciones Automáticas al Cliente", included: true },
    ],
  },
  {
    id: 3,
    name: "Plan Empresarial (Grandes Cadenas)",
    price: 99.99,
    frequency: "mensual",
    isPopular: false,
    ctaText: "Contáctanos",
    features: [
      { text: "Todo lo del Plan Profesional", included: true },
      { text: "Usuarios Ilimitados", included: true },
      { text: "Integración API (para otros sistemas)", included: true },
      { text: "Subdominios Personalizados (gestify.tucadena.cl)", included: true },
      { text: "Asesoría y Onboarding Dedicado", included: true },
      { text: "Soporte 24/7 Prioritario", included: true },
    ],
  },
];