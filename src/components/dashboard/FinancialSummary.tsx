import React from 'react';
import { GlassCard } from '@/components/shared/GlassCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';

export const FinancialSummary: React.FC = () => {
  const data = [
    { label: 'Faturamento', value: 510000, color: 'text-white', barColor: 'bg-blue-500' },
    { label: 'Custos', value: 180000, color: 'text-rose-400', barColor: 'bg-rose-500' },
    { label: 'Lucro Líquido', value: 330000, color: 'text-emerald-400', barColor: 'bg-emerald-500' },
  ];

  const maxVal = data[0].value;

  return (
    <GlassCard className="p-6" hover>
      <h3 className="text-lg font-semibold text-white mb-6">Resumo Financeiro</h3>
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-secondary text-sm font-medium">{item.label}</span>
              <AnimatedCounter 
                value={item.value} 
                prefix="R$ " 
                className={`text-xl font-bold ${item.color}`} 
              />
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.barColor} transition-all duration-1000 ease-out`}
                style={{ width: `${(item.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
