import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface MetaComparativeChartProps {
  data: any[];
  height?: number;
}

export function MetaComparativeChart({ data, height = 350 }: MetaComparativeChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e1e" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value/1000}k`}
          />
          <Tooltip
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid #27272a', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              backgroundColor: '#09090b'
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend />
          
          <Area 
            name="Realizado"
            type="monotone" 
            dataKey="realizado" 
            fill="#f97316" 
            fillOpacity={0.1}
            stroke="none"
          />
          
          <Line 
            name="Meta"
            type="monotone" 
            dataKey="meta" 
            stroke="#52525b" 
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          
          <Line 
            name="Projeção"
            type="monotone" 
            dataKey="projecao" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ r: 4, fill: "#f97316", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
