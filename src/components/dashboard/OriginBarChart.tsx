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

const COLORS = ['#3b82f6', '#06b6d4', '#eab308', '#8b5cf6', '#22c55e'];

export const OriginBarChart: React.FC = () => {
  const { leadsByOrigin } = useAppStore();

  return (
    <GlassCard className="p-6 h-full" hover>
      <h3 className="text-lg font-semibold text-white mb-6">Leads por Origem</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={leadsByOrigin} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              type="number"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <YAxis 
              dataKey="origin" 
              type="category"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              width={80}
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
              dataKey="count" 
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
            >
              {leadsByOrigin.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
