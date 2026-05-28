import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  MessageSquare, 
  User as UserIcon,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ReactivationModal } from './ReactivationModal';

export function ReactivationList() {
  const { activeTenantId } = useTenant();
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'critical' | 'attention' | 'monitor'>('all');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['reactivation-cards', activeTenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_cards')
        .select('*, client:clients(*), seller:users(*)')
        .eq('tenant_id', activeTenantId!)
        .eq('is_archived', false)
        .neq('stage_key', 'pos_venda')
        .neq('stage_key', 'fechamento');
      
      if (error) throw error;
      return data;
    },
    enabled: !!activeTenantId
  });

  const processedCards = cards.map(card => {
    const lastUpdate = new Date(card.updated_at);
    const idleDays = differenceInDays(new Date(), lastUpdate);
    let group: 'critical' | 'attention' | 'monitor' | 'normal' = 'normal';
    
    if (idleDays >= 15) group = 'critical';
    else if (idleDays >= 7) group = 'attention';
    else if (idleDays >= 3) group = 'monitor';
    
    return { ...card, idleDays, group };
  }).filter(card => card.group !== 'normal');

  const filteredCards = processedCards.filter(card => {
    const matchesSearch = card.client?.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                         card.client?.phone?.includes(search);
    const matchesGroup = filterGroup === 'all' || card.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const stats = {
    critical: processedCards.filter(c => c.group === 'critical').length,
    attention: processedCards.filter(c => c.group === 'attention').length,
    monitor: processedCards.filter(c => c.group === 'monitor').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reativação de Clientes</h2>
          <p className="text-sm text-[#888888]">Cards parados no pipeline que precisam de atenção</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setFilterGroup('critical')}
          className={cn(
            "p-4 rounded-lg border transition-all text-left",
            filterGroup === 'critical' ? "bg-red-500/10 border-red-500" : "bg-[#111111] border-[#1f1f1f] hover:border-red-500/50"
          )}
        >
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Crítico</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.critical}</div>
          <p className="text-[10px] text-[#888888]">Parados há +15 dias</p>
        </button>

        <button 
          onClick={() => setFilterGroup('attention')}
          className={cn(
            "p-4 rounded-lg border transition-all text-left",
            filterGroup === 'attention' ? "bg-yellow-500/10 border-yellow-500" : "bg-[#111111] border-[#1f1f1f] hover:border-yellow-500/50"
          )}
        >
          <div className="flex items-center gap-2 text-yellow-500 mb-1">
            <Clock size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Atenção</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.attention}</div>
          <p className="text-[10px] text-[#888888]">Parados há 7-14 dias</p>
        </button>

        <button 
          onClick={() => setFilterGroup('monitor')}
          className={cn(
            "p-4 rounded-lg border transition-all text-left",
            filterGroup === 'monitor' ? "bg-blue-500/10 border-blue-500" : "bg-[#111111] border-[#1f1f1f] hover:border-blue-500/50"
          )}
        >
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Filter size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Monitorar</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.monitor}</div>
          <p className="text-[10px] text-[#888888]">Parados há 3-6 dias</p>
        </button>
      </div>

      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg">
        <div className="p-4 border-b border-[#1f1f1f] flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
            <Input 
              placeholder="Buscar por cliente ou telefone..." 
              className="pl-9 bg-[#1a1a1a] border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filterGroup !== 'all' && (
            <Button variant="ghost" size="sm" onClick={() => setFilterGroup('all')} className="text-orange-500 hover:text-orange-400">
              Limpar Filtros
            </Button>
          )}
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[#1a1a1a] rounded-lg animate-pulse" />)}
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12 text-[#888888]">
                Nenhum cliente para reativar neste grupo.
              </div>
            ) : (
              filteredCards.map(card => (
                <div key={card.id} className="p-4 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] hover:border-orange-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-lg text-white">
                      {card.client?.full_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {card.client?.full_name}
                        <Badge variant="outline" className="text-[9px] uppercase font-black border-orange-500/30 text-orange-500">
                          {card.stage_key}
                        </Badge>
                      </h4>
                      <p className="text-xs text-[#888888]">{card.client?.phone}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-[#888888]">
                          <UserIcon size={12} />
                          {card.seller?.full_name}
                        </div>
                        <div className="font-bold text-orange-500 text-xs">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.estimated_value)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full",
                      card.group === 'critical' ? "bg-red-500/20 text-red-500" :
                      card.group === 'attention' ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-blue-500/20 text-blue-500"
                    )}>
                      Parado há {card.idleDays} dias
                    </div>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 h-9 gap-2"
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      Reativar agora <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {selectedCardId && (
        <ReactivationModal 
          cardId={selectedCardId} 
          onClose={() => setSelectedCardId(null)} 
          isOpen={!!selectedCardId}
        />
      )}
    </div>
  );
}
