import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';


const Homepage: React.FC = () => {
    return (
        <div className="homepage-wrapper">
            
            <Header /> 
            
            <main>
                
                <HeroSection />       
                <FeaturesSection /> 
                
            </main>
            
            <Footer />
        </div>
    );
};

export default Homepage;