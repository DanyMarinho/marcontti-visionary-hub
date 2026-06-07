import { useQuery } from '@tanstack/react-query';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardKpis(period: 'today' | 'week' | 'month' | 'last_month' = 'month') {
  const { activeTenantId, isGlobal } = useTenant();
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['dashboard-kpis', activeTenantId, user?.role, user?.id, period],
    queryFn: async () => {
      if (!activeTenantId) return null;

      // Buscar cartões
      let query = supabase.from('pipeline_cards').select('stage_key, final_value, estimated_value, seller_id').eq('tenant_id', activeTenantId).eq('is_archived', false);
      
      if (user?.role === 'vendedor') {
        query = query.eq('seller_id', user.id);
      } else if (user?.role === 'loja' && user?.store_id) {
        query = query.eq('store_id', user.store_id);
      }

      const { data: cards, error } = await query;
      if (error) throw error;

      let vendas = 0;
      let cardsAtivos = 0;

      (cards || []).forEach(card => {
        if (card.stage_key === 'fechamento' || card.stage_key === 'pos_venda') {
          vendas += Number(card.final_value || card.estimated_value || 0);
        } else {
          cardsAtivos++;
        }
      });

      // Admin global data
      if (user?.role === 'admin' && isGlobal) {
        const { count: tenantsCount } = await supabase
          .from('tenants')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        const totalCards = (cards || []).length;
        const closedCards = (cards || []).filter(
          (c: any) => c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
        ).length;
        const conversaoReal =
          totalCards > 0 ? `${Math.round((closedCards / totalCards) * 100)}%` : '0%';

        return {
          kpis: [
            { title: 'Empresas Ativas', value: tenantsCount ?? 0, trend: { value: 0, isPositive: true }, icon: 'Building2' },
            { title: 'Vendas do Período', value: `R$ ${vendas.toLocaleString('pt-BR')}`, trend: { value: 12.5, isPositive: true }, icon: 'DollarSign' },
            { title: 'Cards no Pipeline', value: cardsAtivos, trend: { value: 4, isPositive: true }, icon: 'GitMerge' },
            { title: 'Conversão Global', value: conversaoReal, trend: { value: 2.1, isPositive: true }, icon: 'TrendingUp' },
          ],
          salesHistory: [],
          tenantRanking: [],
          conversionHistory: [],
        };
      }

      // Vendedor data
      if (user?.role === 'vendedor') {
        const { data: goals } = await supabase.from('goals').select('target_value').eq('tenant_id', activeTenantId).eq('seller_id', user.id).limit(1).single();
        const meta = goals?.target_value ? Number(goals.target_value) : 25000;
        const atingimento = Math.round((vendas / meta) * 100);

        // Fetch Next activities
        const { data: nextActs } = await supabase
          .from('pipeline_cards')
          .select('id, title, expected_close_date, clients(full_name)')
          .eq('tenant_id', activeTenantId)
          .eq('seller_id', user.id)
          .eq('is_archived', false)
          .order('expected_close_date', { ascending: true })
          .limit(5);

        return {
          kpis: [
            { title: 'Minhas Vendas', value: `R$ ${vendas.toLocaleString('pt-BR')}`, trend: { value: 20, isPositive: true }, icon: 'DollarSign' },
            { title: 'Minha Meta', value: `R$ ${meta.toLocaleString('pt-BR')}`, description: `${atingimento}% atingido`, icon: 'Target' },
            { title: 'Cards Ativos', value: cardsAtivos, trend: { value: 2, isPositive: true }, icon: 'GitMerge' },
            { title: 'Conversão Pessoal', value: '28%', trend: { value: 5, isPositive: true }, icon: 'TrendingUp' }
          ],
          nextActivities: (nextActs || []).map((act: any) => ({
            id: act.id,
            customer: act.clients?.full_name || 'Desconhecido',
            activity: act.title,
            date: act.expected_close_date || 'Em breve'
          })),
          ranking: [] // simplificado para o escopo
        };
      }

      return null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!activeTenantId && !!user?.id
  });
}