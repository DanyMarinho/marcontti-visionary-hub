import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanCardProps {
  card: any;
  onClick: (card: any) => void;
}

export function KanbanCard({ card, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: card
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1
  } : undefined;

  const isOverdue = card.expected_close_date && 
    new Date(card.expected_close_date) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => onClick(card)}
      className="cursor-grab active:cursor-grabbing mb-3"
    >
      <Card className={cn(
        "bg-white dark:bg-[#1a1a1a] border-l-4 shadow-sm hover:shadow-md transition-all",
        isOverdue ? "border-l-red-500" : "border-l-orange-500"
      )}>
        <CardContent className="p-3 space-y-2">
          <h4 className="text-sm font-bold leading-tight line-clamp-2">{card.title}</h4>
          
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
              {card.client?.full_name?.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate">{card.client?.full_name}</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted/50">
            <div className="flex items-center text-orange-600 font-bold text-xs">
              <DollarSign size={10} />
              {Number(card.estimated_value).toLocaleString('pt-BR')}
            </div>
            
            {card.expected_close_date && (
              <div className={cn(
                "flex items-center gap-1 text-[10px]",
                isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"
              )}>
                <Calendar size={10} />
                {format(new Date(card.expected_close_date), 'dd/MM', { locale: ptBR })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
