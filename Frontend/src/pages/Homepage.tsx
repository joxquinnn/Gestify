import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import CTABlock from '../components/CTABlock'; 


const Homepage: React.FC = () => {
    return (
        <div className="homepage-wrapper">
            
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
};

export default Homepage;