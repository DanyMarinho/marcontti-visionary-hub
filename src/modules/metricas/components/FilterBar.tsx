import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Filter, Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface FilterBarProps {
  onFilter: (filters: any) => void;
  isLoading?: boolean;
}

export function FilterBar({ onFilter, isLoading }: FilterBarProps) {
  const [period, setPeriod] = React.useState('month');
  const [store, setStore] = React.useState('all');

  const handleApply = () => {
    let startDate = subMonths(new Date(), 1);
    const endDate = new Date();

    if (period === '7d' || period === 'week') startDate = subMonths(new Date(), 0.25);
    if (period === '3m') startDate = subMonths(new Date(), 3);
    if (period === '6m') startDate = subMonths(new Date(), 6);
    if (period === 'today') startDate = new Date();
    if (period === 'last_month') startDate = subMonths(startOfMonth(new Date()), 1);

    onFilter({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      storeId: store === 'all' ? undefined : store,
      period: period // Added for dashboard usage
    });
  };

  return (
    <Card className="bg-[#0a0a0a] border-zinc-800">
      <CardContent className="p-4 flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-1">
            <Calendar size={12} /> Período
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Mês Atual</SelectItem>
              <SelectItem value="last_month">Mês Anterior</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Unidade/Loja</label>
          <Select value={store} onValueChange={setStore}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Lojas</SelectItem>
              <SelectItem value="s1">Joinville Centro</SelectItem>
              <SelectItem value="s2">Joinville Norte</SelectItem>
              <SelectItem value="s3">Joinville Sul</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleApply} 
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2"
          disabled={isLoading}
        >
          <Filter size={16} /> Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
}
