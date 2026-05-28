import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns';

export interface MetricasFilter {
  startDate: string;
  endDate: string;
  storeId?: string;
  sellerId?: string;
}

export function useMetricas(filters: MetricasFilter) {
  const { activeTenantId } = useTenant();

  return useQuery({
    queryKey: ['metricas', activeTenantId, filters],
    queryFn: async () => {
      if (!activeTenantId || activeTenantId === 'all') return null;

      // Simulate heavy data aggregation for MEC metrics
      // In a real app, these would be RPC calls or complex queries
      
      // 1. Conversion between stages
      const conversionData = [
        { from: 'Prospecção', to: 'Qualificação', total: 150, rate: 85, loss: 15 },
        { from: 'Qualificação', to: 'Apresentação', total: 128, rate: 70, loss: 30 },
        { from: 'Apresentação', to: 'Proposta', total: 90, rate: 60, loss: 40 },
        { from: 'Proposta', to: 'Negociação', total: 54, rate: 80, loss: 20 },
        { from: 'Negociação', to: 'Fechamento', total: 43, rate: 40, loss: 60 },
        { from: 'Fechamento', to: 'Pós-venda', total: 17, rate: 100, loss: 0 },
      ];

      // 2. Seller performance
      const sellerPerformance = [
        { id: 'v1', name: 'Ana Silva', store: 'Centro', created: 45, closed: 12, value: 38500, conversion: 26.6 },
        { id: 'v2', name: 'Bruno Santos', store: 'Norte', created: 38, closed: 10, value: 31200, conversion: 26.3 },
        { id: 'v3', name: 'Carla Oliveira', store: 'Centro', created: 42, closed: 8, value: 28900, conversion: 19.0 },
        { id: 'v4', name: 'Diego Ferreira', store: 'Sul', created: 30, closed: 9, value: 35000, conversion: 30.0 },
      ].sort((a, b) => b.value - a.value);

      // 3. Time in pipeline
      const pipelineTime = [
        { stage: 'Prospecção', avgDays: 2.5, active: 45, overdue: 5 },
        { stage: 'Qualificação', avgDays: 4.2, active: 30, overdue: 12 },
        { stage: 'Apresentação', avgDays: 7.8, active: 22, overdue: 8 },
        { stage: 'Proposta', avgDays: 12.5, active: 18, overdue: 10 },
        { stage: 'Negociação', avgDays: 15.2, active: 12, overdue: 6 },
        { stage: 'Fechamento', avgDays: 3.1, active: 5, overdue: 0 },
      ];

      // 4. Conversion evolution (12 months)
      const months = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
      const conversionEvolution = months.map(m => ({
        month: m,
        rate: 20 + Math.random() * 10
      }));

      return {
        conversionData,
        sellerPerformance,
        pipelineTime,
        conversionEvolution,
        globalMetrics: {
          totalSales: 133600,
          avgTicket: 3425,
          globalConversion: 24.5
        }
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });
}
