import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Clock,
  AlertCircle,
  Bell
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { differenceInDays } from 'date-fns';
import { PipelineCard } from '@/types';

interface KanbanCardProps {
  card: PipelineCard & { client?: any; seller?: any };
  onClick?: (card: any) => void;
}

export function KanbanCard({ card, onClick }: KanbanCardProps) {
  const idleDays = differenceInDays(new Date(), new Date(card.updated_at));
  const isIdle = idleDays >= 7;

  return (
    <Card 
      className="bg-[#111111] border-[#1f1f1f] hover:border-orange-500/50 cursor-pointer transition-all shadow-sm group relative overflow-hidden"
      onClick={() => onClick?.(card)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight flex-1">
              {card.client?.full_name || card.title}
            </h4>
            <Badge variant="outline" className="text-[9px] uppercase font-black px-1 h-4 border-[#1f1f1f] text-[#888888]">
              {card.id.substring(0, 4)}
            </Badge>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#888888]">
              <Calendar size={12} className="text-orange-500/50" />
              <span>{new Date(card.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <User size={12} />
                <span className="truncate max-w-[80px]">{card.seller?.full_name?.split(' ')[0]}</span>
              </div>
              {isIdle && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-red-500 animate-pulse">
                        <Bell size={12} />
                        <AlertCircle size={10} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-500 border-none text-white text-[10px]">
                      Sem movimentação há {idleDays} dias
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
              <DollarSign size={12} />
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.estimated_value)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
