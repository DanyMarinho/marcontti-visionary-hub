import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MessageSquare, Clock, MoreVertical, Bell, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { differenceInDays } from 'date-fns';

interface KanbanCardProps {
  card: any;
  onClick: (card: any) => void;
}

export function KanbanCard({ card, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: card,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const idleDays = differenceInDays(new Date(), new Date(card.updated_at));
  const isIdle = idleDays >= 7;
  const isOverdue = card.expected_close_date && new Date(card.expected_close_date) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const handleClick = (e: React.MouseEvent) => {
    onClick(card);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-3 cursor-grab active:cursor-grabbing bg-[#111111] border-[#1f1f1f] hover:border-orange-500/50 transition-all duration-200 group touch-none shadow-none",
        isDragging && "opacity-50 border-orange-500 ring-2 ring-orange-500/20",
        isOverdue && "border-l-4 border-l-red-600 bg-red-500/5"
      )}
      onClick={handleClick}
      {...attributes}
      {...listeners}
      aria-label={`Card de ${card.client?.full_name || 'Cliente'}, valor R$ ${card.estimated_value}`}
    >
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 bg-orange-500/5 text-orange-600 border-orange-500/20">
            {card.id.substring(0, 8)}
          </Badge>
          <div className="flex items-center gap-1">
            {isIdle && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-red-500 animate-pulse cursor-help">
                      <Bell size={14} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-500 border-none text-white text-[10px]">
                    Sem movimentação há {idleDays} dias
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Mais opções"
            >
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-sm leading-tight line-clamp-2 text-white">{card.title || card.client?.full_name || 'Sem título'}</h4>
          <p className="text-[10px] text-muted-foreground truncate">{card.client?.full_name}</p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone size={10} />
            <span className="text-[10px] font-medium tracking-tighter uppercase">{card.client?.phone || '-'}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1f1f1f] border-dashed flex items-center justify-between">
          <div className="flex items-center gap-1 text-orange-600 font-bold">
            <span className="text-[10px]">R$</span>
            <span className="text-xs">{Number(card.estimated_value).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={10} className={isOverdue ? "text-red-500" : ""} />
            <span className={cn("text-[9px] font-medium", isOverdue && "text-red-500 font-bold")}>
              {isOverdue ? 'Atrasado' : '3d'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 pt-1">
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full bg-orange-100 border-2 border-background flex items-center justify-center text-[8px] font-bold text-orange-600">
              {card.vendedor?.full_name?.substring(0, 1) || 'V'}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-green-500" aria-label="Enviar mensagem WhatsApp">
              <MessageSquare size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
