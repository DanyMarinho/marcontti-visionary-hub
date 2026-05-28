import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { KpiCard } from '@/components/shared/KpiCard';
import { 
  TrendingUp, 
  Target, 
  Users, 
  GitMerge, 
  ArrowUpRight,
  AlertCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { SalesBarChart } from './components/SalesBarChart';
import { PipelineFunnelChart } from './components/PipelineFunnelChart';
import { useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

export function LojaDashboard() {
  const { activeTenantId } = useTenant();
  const navigate = useNavigate();

  const { data: reactivationStats } = useQuery({
    queryKey: ['reactivation-stats', activeTenantId],
    queryFn: async () => {
      if (!activeTenantId) return { total: 0, critical: 0, attention: 0 };
      const { data, error } = await supabase
        .from('pipeline_cards')
        .select('updated_at')
        .eq('tenant_id', activeTenantId)
        .eq('is_archived', false)
        .neq('stage_key', 'pos_venda')
        .neq('stage_key', 'fechamento');
      
      if (error) throw error;
      
      const critical = (data || []).filter(c => differenceInDays(new Date(), new Date(c.updated_at)) >= 15).length;
      const attention = (data || []).filter(c => {
        const days = differenceInDays(new Date(), new Date(c.updated_at));
        return days >= 7 && days < 15;
      }).length;
      
      return { total: critical + attention, critical, attention };
    },
    enabled: !!activeTenantId
  });

  const { data: whatsappStats } = useQuery({
    queryKey: ['whatsapp-stats', activeTenantId],
    queryFn: async () => {
      if (!activeTenantId) return { waiting: 0, attending: 0, resolved: 0 };
      const { data, error } = await supabase
        .from('whatsapp_conversations')
        .select('status')
        .eq('tenant_id', activeTenantId);
      
      if (error) throw error;
      
      const stats = { waiting: 0, attending: 0, resolved: 0 };
      (data || []).forEach(conv => {
        if (conv.status === 'waiting') stats.waiting++;
        else if (conv.status === 'attending') stats.attending++;
        else if (conv.status === 'resolved') stats.resolved++;
      });
      return stats;
    },
    enabled: !!activeTenantId
  });

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis', activeTenantId],
    queryFn: async () => {
      return {
        vendas: 45250,
        atingimento: 85,
        clientesAtivos: 124,
        cardsAtivos: 42,
        salesHistory: [
          { month: 'Jan', value: 32000 },
          { month: 'Fev', value: 35000 },
          { month: 'Mar', value: 31000 },
          { month: 'Abr', value: 42000 },
          { month: 'Mai', value: 38000 },
          { month: 'Jun', value: 45250 },
        ],
        funnelData: [
          { stage: 'Prospecção', count: 120 },
          { stage: 'Qualificação', count: 85 },
          { stage: 'Apresentação', count: 60 },
          { stage: 'Proposta', count: 40 },
          { stage: 'Negociação', count: 25 },
          { stage: 'Fechamento', count: 15 },
        ]
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard da Loja</h1>
          <p className="text-muted-foreground">Bem-vindo ao MEC Hub. Veja o desempenho da sua loja.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Vendas do Mês"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis?.vendas || 0)}
          description="+12.5% vs mês anterior"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <KpiCard
          title="Atingimento de Meta"
          value={`${kpis?.atingimento || 0}%`}
          description={(kpis?.atingimento || 0) >= 100 ? 'Meta batida!' : 'Em progresso'}
          icon={Target}
          isLoading={isLoading}
        />
        <div onClick={() => navigate('/reactivation')} className="cursor-pointer">
          <KpiCard
            title="Reativar Agora"
            value={reactivationStats?.total || 0}
            description={`${reactivationStats?.critical || 0} críticos`}
            icon={AlertCircle}
            isLoading={isLoading}
            className="border-red-500/20 bg-red-500/5"
          />
        </div>
        <KpiCard
          title="Cards Ativos"
          value={kpis?.cardsAtivos || 0}
          description="+5 novos este mês"
          icon={GitMerge}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-[#111111] p-6 rounded-lg border border-[#1f1f1f]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#888888] mb-6">Evolução de Vendas</h3>
          <SalesBarChart data={kpis?.salesHistory || []} />
        </div>
        <div className="col-span-3 bg-[#111111] p-6 rounded-lg border border-[#1f1f1f]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#888888] mb-6">Funil de Vendas</h3>
          <PipelineFunnelChart data={kpis?.funnelData || []} />
        </div>
      </div>
    </div>
  );
}
