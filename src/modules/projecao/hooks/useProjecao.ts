import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { calculateProjection } from '../utils/calculateProjection';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useProjecao() {
  const { activeTenantId } = useTenant();

  return useQuery({
    queryKey: ['projecao-financeira', activeTenantId],
    queryFn: async () => {
      if (!activeTenantId || activeTenantId === 'all') return null;

      const now = new Date();
      const firstDay = format(startOfMonth(now), 'yyyy-MM-dd');
      const lastDay = format(endOfMonth(now), 'yyyy-MM-dd');

      // 1. Fetch closed sales this month
      const { data: salesData, error: salesError } = await supabase
        .from('pipeline_cards')
        .select('final_value')
        .eq('tenant_id', activeTenantId)
        .eq('stage_key', 'pos_venda')
        .gte('closed_at', firstDay)
        .lte('closed_at', lastDay);

      if (salesError) throw salesError;
      const closedSales = salesData?.reduce((acc, s) => acc + Number(s.final_value || 0), 0) || 0;

      // 2. Fetch active cards in Proposal, Negotiation, Closing
      const { data: cardsData, error: cardsError } = await supabase
        .from('pipeline_cards')
        .select('estimated_value, stage_key')
        .eq('tenant_id', activeTenantId)
        .in('stage_key', ['proposta', 'negociacao', 'fechamento'])
        .eq('is_archived', false);

      if (cardsError) throw cardsError;

      // 3. Define conversion rates per stage (Método MEC standards or historical)
      const rates: Record<string, number> = {
        proposta: 30,
        negociacao: 60,
        fechamento: 90
      };

      const activeCards = cardsData?.map(card => ({
        value: Number(card.estimated_value),
        conversionRate: rates[card.stage_key] || 0
      })) || [];

      // 4. Calculate projection
      const projection = calculateProjection(closedSales, activeCards);

      // 5. Fetch Goals
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('tenant_id', activeTenantId)
        .gte('period_start', firstDay)
        .lte('period_end', lastDay)
        .maybeSingle();

      if (goalError) throw goalError;

      // Mock historical comparison for the chart
      const months = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
      const historicalData = months.map((m, i) => ({
        month: m,
        meta: 50000 + (i * 2000),
        realizado: 45000 + (i * Math.random() * 5000),
        projecao: 52000 + (i * 1500)
      }));

      return {
        projection,
        closedSales,
        goal: goalData?.target_value || 60000, // Default fallback
        historicalData,
        activeCount: activeCards.length
      };
    },
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });
}
