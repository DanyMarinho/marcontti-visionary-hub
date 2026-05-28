import React from 'react';
import { format } from 'date-fns';
import { useProjecao } from './hooks/useProjecao';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Plus,
  Table as TableIcon,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjecaoFinanceira() {
  const { data, isLoading, goals, deleteGoal } = useProjecao();
  const [isGoalFormOpen, setIsGoalFormOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<any>(null);

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

  const residualValue = Math.max(0, projection.realistic - closedSales);

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
          <CardContent className="h-[300px]">
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
                    <span className="font-bold text-white">{formatCurrency(residualValue)}</span>
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

      <Card className="bg-[#0a0a0a] border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <TableIcon size={16} className="text-orange-500" /> Metas Cadastradas
            </CardTitle>
            <CardDescription>Gestão de objetivos comerciais por período.</CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-[10px] uppercase font-bold border-[#1f1f1f]"
            onClick={() => {
              setSelectedGoal(null);
              setIsGoalFormOpen(true);
            }}
          >
            <Plus size={14} className="mr-1" /> Nova Meta
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#1f1f1f] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 border-b border-[#1f1f1f]">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-[#888888] tracking-widest">Escopo</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-[#888888] tracking-widest">Valor</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-[#888888] tracking-widest">Período</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-[#888888] tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {goals.map((goal: any) => (
                  <tr key={goal.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/20 text-[10px] uppercase">
                        {goal.scope === 'tenant' ? 'Unidade' : goal.scope === 'store' ? 'Loja' : 'Vendedor'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {formatCurrency(goal.target_value)}
                    </td>
                    <td className="px-4 py-3 text-[#888888] text-xs">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={12} />
                        {format(new Date(goal.period_start), 'dd/MM/yy')} até {format(new Date(goal.period_end), 'dd/MM/yy')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => {
                            if (confirm('Deseja excluir esta meta?')) {
                              deleteGoal.mutate(goal.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {goals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#888888] italic text-xs">
                      Nenhuma meta cadastrada para este tenant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <GoalForm 
        open={isGoalFormOpen}
        onOpenChange={setIsGoalFormOpen}
        goal={selectedGoal}
      />
    </div>
  );
}
