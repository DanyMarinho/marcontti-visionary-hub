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

      // Loja — LojaDashboard tem suas próprias queries diretas, não usa este hook
      if (user?.role === 'loja') {
        return { kpis: [], salesHistory: [], tenantRanking: [], conversionHistory: [] };
      }

      // Vendedor data
      if (user?.role === 'vendedor') {
        const { data: goals } = await supabase.from('goals').select('target_value').eq('tenant_id', activeTenantId).eq('seller_id', user.id).maybeSingle();
        const meta = goals?.target_value ? Number(goals.target_value) : 25000;
        const atingimento = Math.round((vendas / meta) * 100);

        const totalVendedor = (cards || []).length;
        const fechadosVendedor = (cards || []).filter(
          (c: any) => c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
        ).length;
        const conversaoPessoal =
          totalVendedor > 0 ? `${Math.round((fechadosVendedor / totalVendedor) * 100)}%` : '0%';

        // Fetch Next activities
        const { data: nextActs } = await supabase
          .from('pipeline_cards')
          .select('id, title, expected_close_date, clients(full_name)')
          .eq('tenant_id', activeTenantId)
          .eq('seller_id', user.id)
          .eq('is_archived', false)
          .order('expected_close_date', { ascending: true })
          .limit(5);

        // Ranking de vendedores do mesmo tenant (vendas fechadas)
        const { data: rankingData } = await supabase
          .from('pipeline_cards')
          .select('seller_id, final_value, estimated_value, stage_key')
          .eq('tenant_id', activeTenantId)
          .eq('is_archived', false)
          .in('stage_key', ['fechamento', 'pos_venda']);

        const sellerIds = Array.from(
          new Set((rankingData || []).map((r: any) => r.seller_id).filter(Boolean))
        );
        const nameMap: Record<string, string> = {};
        if (sellerIds.length > 0) {
          const { data: sellers } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', sellerIds);
          (sellers || []).forEach((s: any) => { nameMap[s.id] = s.full_name; });
        }

        const rankingMap: Record<string, { name: string; sales: number }> = {};
        (rankingData || []).forEach((card: any) => {
          const sid = card.seller_id;
          if (!sid) return;
          const value = Number(card.final_value || card.estimated_value || 0);
          if (!rankingMap[sid]) rankingMap[sid] = { name: nameMap[sid] || 'Desconhecido', sales: 0 };
          rankingMap[sid].sales += value;
        });

        const ranking = Object.entries(rankingMap)
          .sort(([, a], [, b]) => b.sales - a.sales)
          .slice(0, 5)
          .map(([sid, entry], index) => ({
            position: index + 1,
            name: sid === user.id ? 'Você' : entry.name,
            sales: entry.sales,
          }));

        return {
          kpis: [
            { title: 'Minhas Vendas', value: `R$ ${vendas.toLocaleString('pt-BR')}`, trend: { value: 20, isPositive: true }, icon: 'DollarSign' },
            { title: 'Minha Meta', value: `R$ ${meta.toLocaleString('pt-BR')}`, description: `${atingimento}% atingido`, icon: 'Target' },
            { title: 'Cards Ativos', value: cardsAtivos, trend: { value: 2, isPositive: true }, icon: 'GitMerge' },
            { title: 'Conversão Pessoal', value: conversaoPessoal, trend: { value: 5, isPositive: true }, icon: 'TrendingUp' }
          ],
          nextActivities: (nextActs || []).map((act: any) => ({
            id: act.id,
            customer: act.clients?.full_name || 'Desconhecido',
            activity: act.title,
            date: act.expected_close_date || 'Em breve'
          })),
          ranking,
        };
      }

      // Admin com tenant específico selecionado — mostrar dados desse tenant
      const totalCards = (cards || []).length;
      const closedCards = (cards || []).filter(
        (c: any) => c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
      ).length;
      const conversaoTenant = totalCards > 0
        ? `${Math.round((closedCards / totalCards) * 100)}%`
        : '0%';

      return {
        kpis: [
          { title: 'Vendas do Tenant', value: `R$ ${vendas.toLocaleString('pt-BR')}`, trend: { value: 0, isPositive: true }, icon: 'DollarSign' },
          { title: 'Cards no Pipeline', value: cardsAtivos, trend: { value: 0, isPositive: true }, icon: 'GitMerge' },
          { title: 'Conversão', value: conversaoTenant, trend: { value: 0, isPositive: true }, icon: 'TrendingUp' },
          { title: 'Total Cards', value: totalCards, trend: { value: 0, isPositive: true }, icon: 'Building2' },
        ],
        salesHistory: [],
        tenantRanking: [],
        conversionHistory: [],
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!activeTenantId && !!user?.id
  });
}