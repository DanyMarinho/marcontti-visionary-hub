import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/GlassCard';

export const FlowTabs: React.FC = () => {
  const { flows, activeFlowId, setActiveFlow } = useAppStore();

  return (
    <GlassCard className="p-1 mb-6 flex overflow-x-auto scrollbar-none" hover={false}>
      {flows.map((flow) => (
        <button
          key={flow.id}
          onClick={() => setActiveFlow(flow.id)}
          className={cn(
            "relative flex-1 min-w-[160px] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 whitespace-nowrap",
            activeFlowId === flow.id ? "text-white" : "text-secondary hover:text-white"
          )}
        >
          {activeFlowId === flow.id && (
            <motion.div
              layoutId="activeFlowTab"
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg shadow-blue-500/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{flow.name}</span>
        </button>
      ))}
    </GlassCard>
  );
};
