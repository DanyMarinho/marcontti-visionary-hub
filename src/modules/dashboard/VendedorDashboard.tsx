import React from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { 
  DollarSign, 
  Target, 
  GitMerge, 
  TrendingUp, 
  RefreshCcw,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';

export default function VendedorDashboard() {
  const { data, isLoading, error, refetch } = useDashboardKpis();

  const iconMap: any = {
    DollarSign,
    Target,
    GitMerge,
    TrendingUp
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-red-500 font-medium">Erro ao carregar seus resultados</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Meus Resultados</h1>
          <p className="text-muted-foreground">Foco no processo, o resultado é consequência.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiCard key={i} isLoading title="" icon={DollarSign} value="" />)
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
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" /> Próximas Atividades
            </CardTitle>
            <CardDescription>Ações prioritárias para seus cards ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))
              ) : (
                data?.nextActivities?.map((act: any) => (
                  <div key={act.id} className="flex items-center gap-4 border-b pb-4 last:border-0 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {act.customer.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{act.customer}</h4>
                      <p className="text-xs text-muted-foreground">{act.activity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{act.date}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-[10px] uppercase font-bold">Atender</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Ranking da Loja</CardTitle>
            <CardDescription>Sua posição entre os melhores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))
              ) : (
                data?.ranking?.map((rank: any) => (
                  <div 
                    key={rank.position} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      rank.name === 'Você' ? "bg-orange-500/10 border-orange-500/20" : "border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                        rank.position === 1 ? "bg-yellow-400 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {rank.position}
                      </span>
                      <span className={cn("text-sm font-medium", rank.name === 'Você' && "text-orange-700 dark:text-orange-400")}>
                        {rank.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold">R$ {rank.sales.toLocaleString('pt-BR')}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
