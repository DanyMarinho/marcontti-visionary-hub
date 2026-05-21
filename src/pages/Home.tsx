import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { MetricsSection } from '@/components/home/MetricsSection';
import { InventoryGrid } from '@/components/home/InventoryGrid';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { pageTransition } from '@/lib/animations';

const Home = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-responsive pb-24 scroll-smooth"
    >
      <HeroSection />
      
      <div className="max-w-7xl mx-auto space-y-responsive px-4 md:px-6">
        <MetricsSection />
        <InventoryGrid />
        <ServicesGrid />
        <TestimonialsSection />
      </div>

      {/* Footer Branding */}
      <footer className="text-center py-12 border-t border-white/5">
        <div className="text-2xl font-bold text-white mb-2 tracking-tighter">
          MARCONTTI <span className="text-blue-500">GARAGE</span>
        </div>
        <p className="text-slate-500 text-sm">
          Joinville, SC • Premium Motorcycles & Detailing
        </p>
      </footer>
    </motion.div>
  );
};

export default Home;
