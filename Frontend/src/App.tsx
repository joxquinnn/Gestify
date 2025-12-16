import React from 'react';
import Header from './components/Header'; 
import HeroSection from './components/HeroSection'; 
import FeaturesSection from './components/FeaturesSection'; 
import PricingSection from './components/PricingSection';
import CTABlock from './components/CTABlock';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection /> 
        <PricingSection />
        <CTABlock />
      </main>
      <Footer />
    </div>
  );
}

export default App;