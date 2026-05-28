import React from 'react';
import { 
  FunnelChart, 
  Funnel, 
  LabelList, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PipelineFunnelChartProps {
  data: { stage: string; count: number }[];
  height?: number;
}

const COLORS = [
  '#f97316', // Prospecção
  '#fb923c', // Qualificação
  '#fdba74', // Apresentação
  '#fed7aa', // Proposta
  '#a1a1aa', // Negociação
  '#71717a', // Fechamento
  '#3f3f46', // Pós-venda
];

export function PipelineFunnelChart({ data, height = 300 }: PipelineFunnelChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)'
            }}
          />
          <Funnel
            dataKey="count"
            data={data}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList position="right" fill="#71717a" stroke="none" dataKey="stage" />
            <LabelList position="center" fill="#fff" stroke="none" dataKey="count" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
