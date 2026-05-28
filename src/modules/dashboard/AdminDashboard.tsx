import React from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { SalesBarChart } from './components/SalesBarChart';
import { ConversionLineChart } from './components/ConversionLineChart';
import { FilterBar } from '@/modules/metricas/components/FilterBar';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { 
  Building2, 
  DollarSign, 
  GitMerge, 
  TrendingUp, 
  RefreshCcw,
  Quote,
  LayoutDashboard
} from 'lucide-react';
import { WhatsAppStatusAlert } from '@/modules/whatsapp/components/WhatsAppStatusAlert';
import { cn } from '@/lib/utils';
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

const QUOTES = [
  "Previsibilidade não é sorte. É engenharia.",
  "O que não é medido não é gerenciado.",
  "Vendas é um processo, não um evento.",
  "Sua base de dados é seu maior ativo."
];

export default function AdminDashboard() {
  const [filters, setFilters] = React.useState({ period: 'month' });
  const { data, isLoading, error, refetch } = useDashboardKpis(filters.period as any);
  const [quote] = React.useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const iconMap: any = {
    Building2,
    DollarSign,
    GitMerge,
    TrendingUp
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-red-500 font-medium">Erro ao carregar dados do dashboard</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão consolidada de toda a operação MEC Hub.</p>
        </div>
        <Card className="bg-orange-500/5 border-orange-500/20 py-2 px-4 flex items-center gap-3 max-w-xs">
          <Quote className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <p className="text-xs italic font-medium text-orange-700 dark:text-orange-400">
            "{quote}"
          </p>
        </Card>
      </div>
      
      <WhatsAppStatusAlert />
      
      <FilterBar onFilter={(f) => setFilters({ period: f.period })} isLoading={isLoading} />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiCard key={i} isLoading title="" icon={Building2} value="" />)
        ) : (
          data?.kpis.map((kpi: any, i: number) => (
            <KpiCard 
              key={i}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              icon={iconMap[kpi.icon]}
              className={cn(
                i >= 2 ? "col-span-1" : "col-span-1"
              )}
            />
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Evolução de Faturamento</CardTitle>
            <CardDescription>Vendas consolidadas nos últimos 6 meses</CardDescription>
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
            <CardTitle>Taxa de Conversão</CardTitle>
            <CardDescription>Média global de fechamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ConversionLineChart data={data?.conversionHistory || []} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Empresas</CardTitle>
          <CardDescription>Performance por faturamento no mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Clientes Ativos</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                data?.tenantRanking?.map((item: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>R$ {item.sales.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{item.customers}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">
                        +{(10 - i * 2).toFixed(1)}%
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
