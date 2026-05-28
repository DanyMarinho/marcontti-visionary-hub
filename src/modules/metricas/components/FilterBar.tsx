import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Store as StoreIcon, Check } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ShiftingDropDown } from '@/components/ui/ShiftingDropDown';
import { cn } from '@/lib/utils';

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
          <ShiftingDropDown 
            tabs={[{
              id: 'period-filter',
              title: period === 'today' ? 'Hoje' :
                     period === 'week' ? 'Esta Semana' :
                     period === 'month' ? 'Mês Atual' :
                     period === 'last_month' ? 'Mês Anterior' : 'Últimos 3 meses',
              Component: () => (
                <div className="w-full space-y-1">
                  {[
                    { id: 'today', name: 'Hoje' },
                    { id: 'week', name: 'Esta Semana' },
                    { id: 'month', name: 'Mês Atual' },
                    { id: 'last_month', name: 'Mês Anterior' },
                    { id: '3m', name: 'Últimos 3 meses' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
                        period === p.id ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className="text-sm font-medium">{p.name}</span>
                      {period === p.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )
            }]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Unidade/Loja</label>
          <ShiftingDropDown 
            tabs={[{
              id: 'store-filter',
              title: store === 'all' ? 'Todas as Lojas' : 
                     store === 's1' ? 'Joinville Centro' : 
                     store === 's2' ? 'Joinville Norte' : 'Joinville Sul',
              Component: () => (
                <div className="w-full space-y-1">
                  {[
                    { id: 'all', name: 'Todas as Lojas' },
                    { id: 's1', name: 'Joinville Centro' },
                    { id: 's2', name: 'Joinville Norte' },
                    { id: 's3', name: 'Joinville Sul' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStore(s.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
                        store === s.id ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <StoreIcon size={16} className={store === s.id ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"} />
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      {store === s.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )
            }]} 
          />
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
