import React from 'react';
import '../styles/PricingSection.styles.css'; // Importa el CSS específico
import { pricingPlans } from '../data/PricingData';
import type { PricingPlan, PlanFeature } from '../types/Pricing';

// Componente para una característica de la lista
interface FeatureProps {
    feature: PlanFeature;
}

const FeatureItem: React.FC<FeatureProps> = ({ feature }) => (
    <li className={feature.included ? 'feature-included' : 'feature-excluded'}>
        {feature.text}
    </li>
);

// Componente para una tarjeta de plan
interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    return (
        <div className={`pricing-card ${plan.isPopular ? 'card-popular' : ''}`}>
            
            {plan.isPopular && <div className="tag-popular">MÁS POPULAR</div>}

            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price-group">
                <span className="price-currency">$</span>
                <span className="price-value">{plan.price}</span>
                <span className="price-frequency">/{plan.frequency}</span>
            </div>
            
            <ul className="plan-features">
                {plan.features.map((feature, index) => (
                    <FeatureItem key={index} feature={feature} />
                ))}
            </ul>

            <button className={`cta-plan-button ${plan.isPopular ? 'primary-cta-button' : 'secondary-cta-button'}`}>
                {plan.ctaText}
            </button>
        </div>
    );
};


// Componente principal de la sección de precios
const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        
        <h2 className="section-heading">Planes Simples, Valor Gigante</h2>
        <p className="section-subheading">
          Escoge el plan perfecto para el tamaño de tu operación. Sin contratos, cancela cuando quieras.
        </p>

        {/* Grid que renderiza las tarjetas */}
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;