import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AmbientLights } from './AmbientLights';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { FloatingWhatsApp } from '../whatsapp/FloatingWhatsApp';
import { ToastContainer } from '../shared/ToastNotification';
import { DemoControlPanel } from '../demo/DemoControlPanel';
import { DemoKeyboardHandler } from '../demo/DemoKeyboardHandler';
import { useDemoMode } from '@/hooks/useDemoMode';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  
  // Initialize Demo Mode auto-injection
  useDemoMode();

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden relative">
      <AmbientLights />
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            {outlet && React.cloneElement(outlet as React.ReactElement, { key: location.pathname })}
          </AnimatePresence>
        </main>
      </div>
      <MobileMenu />
      <FloatingWhatsApp />
      <ToastContainer />
      <DemoControlPanel />
      <DemoKeyboardHandler />
    </div>
  );
};

export default RootLayout;