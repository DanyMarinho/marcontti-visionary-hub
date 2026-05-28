import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  usePageTitle();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => isMobile && setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={closeSidebar}
        />
      )}

      <Sidebar 
        collapsed={!sidebarOpen && !isMobile} 
        open={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      
      <Toaster 
        position="bottom-right" 
        richColors 
        theme="light" // Will be overridden by theme provider if supported by sonner
        toastOptions={{
          className: "font-sans",
        }}
      />
    </div>
  );
}
