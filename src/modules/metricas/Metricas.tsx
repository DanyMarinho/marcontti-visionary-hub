import React, { useState } from 'react';
import { useMetricas, MetricasFilter } from './hooks/useMetricas';
import { FilterBar } from './components/FilterBar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowRight,
  Medal,
  AlertTriangle
} from 'lucide-react';
import { SalesBarChart } from '@/modules/dashboard/components/SalesBarChart';
import { ConversionLineChart } from '@/modules/dashboard/components/ConversionLineChart';
import { PipelineFunnelChart } from '@/modules/dashboard/components/PipelineFunnelChart';
import { ExportButton } from '@/components/shared/ExportButton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Metricas() {
  const [filters, setFilters] = useState<MetricasFilter>({
    startDate: format(new Date(), 'yyyy-MM-01'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const { data, isLoading } = useMetricas(filters);

  const renderRanking = (pos: number) => {
    if (pos === 0) return <Medal className="text-yellow-400" size={18} />;
    if (pos === 1) return <Medal className="text-zinc-300" size={18} />;
    if (pos === 2) return <Medal className="text-orange-300" size={18} />;
    return <span className="text-xs font-bold text-zinc-500 ml-1">{pos + 1}º</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Métricas e Relatórios</h1>
          <p className="text-muted-foreground text-sm">Análise de engenharia do processo comercial.</p>
        </div>
        {data && (
          <ExportButton 
            data={data.sellerPerformance} 
            filename="relatorio_performance_vendedores" 
            columns={[
              { header: 'Vendedor', accessorKey: 'name' },
              { header: 'Loja', accessorKey: 'store' },
              { header: 'Cards Criados', accessorKey: 'created' },
              { header: 'Fechados', accessorKey: 'closed' },
              { header: 'Valor Total', accessorKey: 'value' },
              { header: 'Conversão %', accessorKey: 'conversion' }
            ]}
          />
        )}
      </div>

      <FilterBar onFilter={setFilters} isLoading={isLoading} />

      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="bg-[#0a0a0a] border border-zinc-800 p-1 h-12 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="conversion" className="gap-2"><TrendingUp size={16} /> Conversão</TabsTrigger>
          <TabsTrigger value="sellers" className="gap-2"><Users size={16} /> Vendedores</TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2"><Clock size={16} /> Tempo de Funil</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm">Funil de Conversão do Método MEC</CardTitle>
                <CardDescription>Perda de leads entre etapas consecutivas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-zinc-800">
                      <TableHead className="text-zinc-400">Etapa Origem → Destino</TableHead>
                      <TableHead className="text-zinc-400 text-center">Taxa</TableHead>
                      <TableHead className="text-zinc-400 text-right">Perda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.conversionData.map((item, i) => (
                      <TableRow key={i} className="border-zinc-800 hover:bg-zinc-900/50">
                        <TableCell className="text-xs font-medium">
                          <div className="flex items-center gap-2">
                            {item.from} <ArrowRight size={12} className="text-orange-500" /> {item.to}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                            {item.rate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "text-xs font-bold",
                            item.loss > 30 ? "text-red-500" : "text-zinc-500"
                          )}>
                            -{item.loss}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm">Distribuição de Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <PipelineFunnelChart 
                  data={data?.conversionData.map(d => ({ stage: d.from, count: d.total })) || []} 
                  height={320} 
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0a0a0a] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm">Evolução da Taxa de Conversão</CardTitle>
              <CardDescription>Tendência de fechamento nos últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ConversionLineChart data={data?.conversionEvolution || []} height={280} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-6 mt-6">
          <Card className="bg-[#0a0a0a] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm">Ranking de Vendedores</CardTitle>
              <CardDescription>Performance por faturamento e conversão</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-zinc-400">Vendedor</TableHead>
                    <TableHead className="text-zinc-400 text-center">Criados</TableHead>
                    <TableHead className="text-zinc-400 text-center">Fechados</TableHead>
                    <TableHead className="text-zinc-400">Valor Total</TableHead>
                    <TableHead className="text-zinc-400 text-center">Conversão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.sellerPerformance.map((seller, i) => (
                    <TableRow key={seller.id} className="border-zinc-800 hover:bg-zinc-900/50">
                      <TableCell className="text-center">{renderRanking(i)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{seller.name}</span>
                          <span className="text-[10px] text-zinc-500 uppercase">Loja: {seller.store}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{seller.created}</TableCell>
                      <TableCell className="text-center text-sm font-bold">{seller.closed}</TableCell>
                      <TableCell className="text-sm font-bold text-orange-500">
                        R$ {seller.value.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {seller.conversion}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6 mt-6">
          <Card className="bg-[#0a0a0a] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm">Tempo Médio por Etapa</CardTitle>
              <CardDescription>Eficiência e agilidade no fluxo do Pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="text-zinc-400">Etapa</TableHead>
                    <TableHead className="text-zinc-400 text-center">Tempo Médio</TableHead>
                    <TableHead className="text-zinc-400 text-center">Ativos</TableHead>
                    <TableHead className="text-zinc-400 text-right">Atrasados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.pipelineTime.map((item, i) => (
                    <TableRow key={i} className="border-zinc-800 hover:bg-zinc-900/50">
                      <TableCell className="font-medium text-sm">{item.stage}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-bold">{item.avgDays} dias</span>
                          {item.avgDays > 10 && <AlertTriangle size={14} className="text-yellow-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{item.active}</TableCell>
                      <TableCell className="text-right">
                        {item.overdue > 0 ? (
                          <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                            {item.overdue} vencidos
                          </Badge>
                        ) : (
                          <span className="text-zinc-500 text-[10px]">Nenhum atraso</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
