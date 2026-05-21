import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { useAppStore } from '@/store';

export const RevenueDonutChart: React.FC = () => {
  const { revenueDistribution } = useAppStore();
  
  const totalRevenue = "R$ 510k";

  return (
    <GlassCard className="p-6 h-full" hover>
      <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Receita</h3>
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueDistribution}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={3}
              cornerRadius={6}
              dataKey="value"
              nameKey="category"
              animationDuration={1500}
            >
              {revenueDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 15, 25, 0.8)', 
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-secondary uppercase tracking-wider">Total</span>
          <span className="text-2xl font-bold text-white">{totalRevenue}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        {revenueDistribution.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col">
              <span className="text-xs text-secondary">{item.category}</span>
              <span className="text-sm font-semibold text-white">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
