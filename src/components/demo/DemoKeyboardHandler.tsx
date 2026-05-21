import React from 'react';
import { useAppStore } from '@/store';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { toast } from 'sonner';

export const DemoKeyboardHandler: React.FC = () => {
  const { injectLeadGlobal, resetAllData, togglePanel } = useAppStore();

  useKeyboardShortcut('ctrl+shift+l', () => {
    injectLeadGlobal();
  });

  useKeyboardShortcut('ctrl+shift+n', () => {
    toast.info('🔔 Novo lead chegando...', {
      description: 'Simulando notificação manual de entrada.',
    });
  });

  useKeyboardShortcut('ctrl+shift+r', () => {
    resetAllData();
    toast.success('Dados resetados com sucesso!');
  });

  useKeyboardShortcut('ctrl+shift+d', () => {
    togglePanel();
  });

  return null;
};
