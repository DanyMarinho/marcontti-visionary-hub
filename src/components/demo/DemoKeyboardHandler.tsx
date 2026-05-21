import React, { useEffect } from 'react';
import { useAppStore } from '@/store';
import { useToastStore } from '../shared/ToastNotification';

export const DemoKeyboardHandler: React.FC = () => {
  const togglePanel = useAppStore((state) => state.togglePanel);
  const injectLead = useAppStore((state) => state.injectLeadGlobal);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Toggle demo panel with 'D'
      if (e.key.toLowerCase() === 'd') {
        togglePanel();
      }
      // Inject lead with 'L'
      if (e.key.toLowerCase() === 'l') {
        injectLead();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePanel, injectLead, addToast]);

  return null;
};

export default DemoKeyboardHandler;