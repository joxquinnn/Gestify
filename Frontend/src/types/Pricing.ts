export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number; // Precio mensual
  frequency: string; // "mensual", "anual"
  isPopular: boolean;
  ctaText: string;
  features: PlanFeature[];
}