import React from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { SalesBarChart } from './components/SalesBarChart';
import { PipelineFunnelChart } from './components/PipelineFunnelChart';
import { FilterBar } from '@/modules/metricas/components/FilterBar';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { 
  Users, 
  DollarSign, 
  Target, 
  TrendingUp, 
  RefreshCcw,
  Clock
} from 'lucide-react';
import { WhatsAppStatusAlert } from '@/modules/whatsapp/components/WhatsAppStatusAlert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/shared/ChartSkeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LojaDashboard() {
  const [filters, setFilters] = React.useState({ period: 'month' });
  const { data, isLoading, error, refetch } = useDashboardKpis(filters.period as any);

  const iconMap: any = {
    Users,
    DollarSign,
    Target,
    TrendingUp
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-red-500 font-medium">Erro ao carregar dados da unidade</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard da Unidade</h1>
          <p className="text-muted-foreground">Monitoramento em tempo real dos resultados locais.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-8 px-3 flex items-center gap-1.5 font-medium border-orange-200 text-orange-700 bg-orange-50">
             <Clock size={14} /> Atualizado agora
           </Badge>
        </div>
      </div>
      
      <WhatsAppStatusAlert />
      
      <FilterBar onFilter={(f) => setFilters({ period: f.period })} isLoading={isLoading} />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiCard key={i} isLoading title="" icon={Users} value="" />)
        ) : (
          data?.kpis.map((kpi: any, i: number) => (
            <KpiCard 
              key={i}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              description={kpi.description}
              icon={iconMap[kpi.icon]}
            />
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Performance mensal da unidade</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <SalesBarChart data={data?.salesHistory || []} />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Funil do Método MEC</CardTitle>
            <CardDescription>Distribuição de cards por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <PipelineFunnelChart data={data?.funnelData || []} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Vendas</CardTitle>
          <CardDescription>Transações registradas recentemente na unidade</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-6 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                data?.recentSales?.map((sale: any) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.customer}</TableCell>
                    <TableCell>R$ {sale.value.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={sale.status === 'Pago' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
