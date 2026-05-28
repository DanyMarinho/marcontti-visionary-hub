import React from 'react';
import { useProjecao } from './hooks/useProjecao';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetaComparativeChart } from './components/MetaComparativeChart';
import { GoalForm } from './components/GoalForm';
import { 
  TrendingDown, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle2,
  Zap,
  Quote,
  Loader2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjecaoFinanceira() {
  const { data, isLoading } = useProjecao();
  const [isGoalFormOpen, setIsGoalFormOpen] = React.useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { projection, closedSales, goal, activeCount } = data || {
    projection: { pessimistic: 0, realistic: 0, optimistic: 0 },
    closedSales: 0,
    goal: 1,
    activeCount: 0
  };

  const progress = Math.min(100, (closedSales / goal) * 100);
  const projectionStatus = projection.realistic >= goal && (closedSales > 0 || activeCount > 0)
    ? 'on-track'
    : projection.realistic < (goal * 0.7)
    ? 'danger'
    : 'warning';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projeção Financeira</h1>
          <p className="text-muted-foreground text-sm font-medium">Crescimento sem previsibilidade é sorte. Com o MEC, é sistema.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsGoalFormOpen(true)}
            variant="outline" 
            className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 gap-2 h-10 px-4 font-bold"
          >
            <Target size={18} /> Gerenciar Metas
          </Button>

          <div className={cn(
            "flex items-center gap-2 px-4 h-10 rounded-full border text-xs font-bold uppercase tracking-wider",
            projectionStatus === 'on-track' && "bg-green-500/10 text-green-500 border-green-500/20",
            projectionStatus === 'danger' && "bg-red-500/10 text-red-500 border-red-500/20",
            projectionStatus === 'warning' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          )}>
            {projectionStatus === 'on-track' && <><CheckCircle2 size={16} /> Meta em rota de atingimento</>}
            {projectionStatus === 'danger' && <><AlertCircle size={16} /> Atenção: projeção abaixo da meta</>}
            {projectionStatus === 'warning' && <><Zap size={16} /> Projeção próxima à meta</>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Pessimistic */}
        <Card className="bg-[#0a0a0a] border-zinc-800 border-l-4 border-l-zinc-500">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold text-zinc-500">Cenário Pessimista</CardDescription>
            <CardTitle className="text-2xl font-black">{formatCurrency(projection.pessimistic)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">Considera fechamentos mínimos e maior perda no funil.</p>
          </CardContent>
        </Card>

        {/* Realistic */}
        <Card className="bg-[#0a0a0a] border-orange-500/30 border-l-4 border-l-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold text-orange-500">Cenário Realista</CardDescription>
            <CardTitle className="text-3xl font-black text-white">{formatCurrency(projection.realistic)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ponderado pelas taxas de conversão do Método MEC.</p>
          </CardContent>
        </Card>

        {/* Optimistic */}
        <Card className="bg-[#0a0a0a] border-zinc-800 border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold text-green-500">Cenário Otimista</CardDescription>
            <CardTitle className="text-2xl font-black">{formatCurrency(projection.optimistic)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">Considera aceleração comercial e conversão máxima.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 bg-[#0a0a0a] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm">Comparativo: Meta vs Projeção vs Realizado</CardTitle>
            <CardDescription>Histórico de performance dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <MetaComparativeChart data={data?.historicalData || []} />
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card className="bg-[#0a0a0a] border-zinc-800 h-full">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target size={16} className="text-orange-500" /> Acompanhamento da Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold">Realizado</span>
                  <span className="font-black">{formatCurrency(closedSales)}</span>
                </div>
                <Progress value={progress} className="h-3 bg-zinc-900" />
                <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                  <span>{progress.toFixed(1)}% atingido</span>
                  <span>Meta: {formatCurrency(goal)}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 space-y-3">
                <h4 className="text-xs font-bold text-orange-500 uppercase flex items-center gap-2">
                  <TrendingUp size={14} /> Pipeline Residual
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Cards Qualificados</span>
                    <span className="font-bold text-white">{activeCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Potencial Bruto</span>
                    <span className="font-bold text-white">{formatCurrency(projection.realistic - closedSales)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-start gap-3 italic text-zinc-500 text-xs">
                <Quote size={24} className="text-orange-500 opacity-20 shrink-0" />
                <p>"A engenharia de processos substitui a ansiedade por números. Se o processo está certo, o resultado é inevitável."</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GoalForm 
        open={isGoalFormOpen}
        onOpenChange={setIsGoalFormOpen}
      />
    </div>
  );
}
