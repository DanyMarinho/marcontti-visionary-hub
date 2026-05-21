import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const periods = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: '12m', label: '12m' },
] as const;

export const PeriodSelector: React.FC = () => {
  const { selectedPeriod, setPeriod } = useAppStore();

  return (
    <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl w-fit">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => setPeriod(period.id)}
          className={cn(
            "relative px-4 py-1.5 text-sm font-medium transition-colors duration-200",
            selectedPeriod === period.id ? "text-white" : "text-secondary hover:text-white"
          )}
        >
          {selectedPeriod === period.id && (
            <motion.div
              layoutId="activePeriod"
              className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {period.label}
        </button>
      ))}
    </div>
  );
};
