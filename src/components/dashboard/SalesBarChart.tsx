import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { useAppStore } from '@/store';

import { DataPlaceholder } from '@/components/shared/DataPlaceholder';

export const SalesBarChart: React.FC = () => {
  const { monthlyData } = useAppStore();
  const isEmpty = !monthlyData || monthlyData.length === 0;


  return (
    <GlassCard className="p-6 h-full" hover>
      <h3 className="text-lg font-semibold text-white mb-6">Vendas por Mês</h3>
      {isEmpty ? (
        <DataPlaceholder 
          type="empty"
          title="Sem dados de vendas"
          description="Nenhuma venda registrada no período selecionado."
          className="h-[200px] md:h-[250px] lg:h-[300px]"
        />
      ) : (
        <div className="h-[200px] md:h-[250px] lg:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 25, 0.8)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar 
                dataKey="sales" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]} 
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
