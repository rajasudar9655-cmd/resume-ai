import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import FeaturesSection from './components/FeaturesSection';
import TemplatesGallery from './components/TemplatesGallery';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <TemplatesGallery />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}