import { useQuery } from '@tanstack/react-query';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';

export function useDashboardKpis(period: 'today' | 'week' | 'month' | 'last_month' = 'month') {
  const { activeTenantId, isGlobal } = useTenant();
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['dashboard-kpis', activeTenantId, user?.role, period],
    queryFn: async () => {
      // Simulate API call with realistic mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      const isMonthly = period === 'month';
      const isToday = period === 'today';
      const isWeek = period === 'week';
      
      // Admin global data
      if (user?.role === 'admin' && isGlobal) {
        return {
          kpis: [
            { title: 'Empresas Ativas', value: isToday ? 8 : 12, trend: { value: 8, isPositive: true }, icon: 'Building2' },
            { title: 'Vendas do Período', value: isToday ? 'R$ 4.200' : isWeek ? 'R$ 28.500' : 'R$ 145.800', trend: { value: 12.5, isPositive: true }, icon: 'DollarSign' },
            { title: 'Cards no Pipeline', value: isToday ? 42 : 342, trend: { value: 4, isPositive: true }, icon: 'GitMerge' },
            { title: 'Conversão Global', value: '24.2%', trend: { value: 2.1, isPositive: true }, icon: 'TrendingUp' }
          ],
          salesHistory: [
            { month: 'Dez', value: 110000 },
            { month: 'Jan', value: 125000 },
            { month: 'Fev', value: 118000 },
            { month: 'Mar', value: 142000 },
            { month: 'Abr', value: 155000 },
            { month: 'Mai', value: 145800 },
          ],
          tenantRanking: [
            { name: 'Marcontti Mecânica', sales: 45000, customers: 128 },
            { name: 'Clínica Vida', sales: 38500, customers: 95 },
            { name: 'EduPro Cursos', sales: 32000, customers: 210 },
            { name: 'Imobiliária Lar', sales: 30300, customers: 45 },
          ],
          conversionHistory: [
            { month: 'Jan', rate: 21 },
            { month: 'Fev', rate: 23 },
            { month: 'Mar', rate: 22 },
            { month: 'Abr', rate: 25 },
            { month: 'Mai', rate: 24.2 },
          ]
        };
      }

      // Loja data
      if (user?.role === 'loja' || (user?.role === 'admin' && !isGlobal)) {
        return {
          kpis: [
            { title: 'Vendas (Unidade)', value: isToday ? 'R$ 850' : 'R$ 45.000', trend: { value: 15, isPositive: true }, icon: 'DollarSign' },
            { title: 'Meta do Período', value: isToday ? 'R$ 2.000' : 'R$ 60.000', description: isToday ? '42% atingido' : '75% atingido', icon: 'Target' },
            { title: 'Atingimento', value: isToday ? '42.5%' : '75.0%', trend: { value: 5, isPositive: true }, icon: 'TrendingUp' },
            { title: 'Clientes Ativos', value: 128, trend: { value: 5, isPositive: true }, icon: 'Users' }
          ],
          funnelData: [
            { stage: 'Prospecção', count: 120 },
            { stage: 'Qualificação', count: 85 },
            { stage: 'Apresentação', count: 60 },
            { stage: 'Proposta', count: 42 },
            { stage: 'Negociação', count: 28 },
            { stage: 'Fechamento', count: 18 },
            { stage: 'Pós-venda', count: 15 },
          ],
          salesHistory: [
            { month: 'Jan', value: 38000 },
            { month: 'Fev', value: 42000 },
            { month: 'Mar', value: 39000 },
            { month: 'Abr', value: 48000 },
            { month: 'Mai', value: 45000 },
          ],
          recentSales: [
            { id: '1', customer: 'Carlos Oliveira', value: 1200, status: 'Pago', date: 'Hoje' },
            { id: '2', customer: 'Fernanda Lima', value: 2500, status: 'Pendente', date: 'Hoje' },
            { id: '3', customer: 'Ricardo Silva', value: 850, status: 'Pago', date: 'Ontem' },
            { id: '4', customer: 'Patrícia Souza', value: 3200, status: 'Pago', date: 'Ontem' },
          ]
        };
      }

      // Vendedor data
      return {
        kpis: [
          { title: 'Minhas Vendas', value: 'R$ 18.500', trend: { value: 20, isPositive: true }, icon: 'DollarSign' },
          { title: 'Minha Meta', value: 'R$ 25.000', description: '74% atingido', icon: 'Target' },
          { title: 'Cards Ativos', value: 24, trend: { value: 2, isPositive: true }, icon: 'GitMerge' },
          { title: 'Conversão Pessoal', value: '28%', trend: { value: 5, isPositive: true }, icon: 'TrendingUp' }
        ],
        nextActivities: [
          { id: '1', customer: 'Marta Rocha', activity: 'Apresentação de Proposta', date: 'Amanhã, 14:00' },
          { id: '2', customer: 'Júlio Bento', activity: 'Follow-up Negociação', date: 'Quarta, 10:30' },
          { id: '3', customer: 'Sérgio Reis', activity: 'Qualificação Lead', date: 'Quinta, 09:00' },
        ],
        ranking: [
          { name: 'Ana Souza', sales: 22000, position: 1 },
          { name: 'Você', sales: 18500, position: 2 },
          { name: 'Bruno Lima', sales: 15200, position: 3 },
          { name: 'Carla Dias', sales: 12800, position: 4 },
        ]
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
