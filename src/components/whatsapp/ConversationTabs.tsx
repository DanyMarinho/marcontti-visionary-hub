import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { ConversationScenario } from '@/types/conversation';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/GlassCard';

const scenarios: { id: ConversationScenario; label: string }[] = [
  { id: 'qualificacao_lead', label: 'Qualificação de Lead' },
  { id: 'agendamento_visita', label: 'Agendamento de Visita' },
  { id: 'envio_informacoes', label: 'Envio de Informações' },
];

export const ConversationTabs: React.FC = () => {
  const { activeScenario, setActiveScenario, resetConversations } = useAppStore();

  const handleTabChange = (id: ConversationScenario) => {
    setActiveScenario(id);
    resetConversations(); // Reset to start animation again
  };

  return (
    <GlassCard className="p-1 mb-6 flex overflow-x-auto scrollbar-none" hover={false}>
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => handleTabChange(scenario.id)}
          className={cn(
            "relative flex-1 min-w-[140px] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 whitespace-nowrap",
            activeScenario === scenario.id ? "text-white" : "text-secondary hover:text-white"
          )}
        >
          {activeScenario === scenario.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg shadow-blue-500/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {scenario.label}
        </button>
      ))}
    </GlassCard>
  );
};
