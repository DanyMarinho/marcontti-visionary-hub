import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  stage: { key: string, label: string };
  cards: any[];
  color: string;
  onCardClick: (card: any) => void;
}

export function KanbanColumn({ stage, cards, color, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key,
  });

  const totalValue = cards.reduce((acc, card) => acc + Number(card.estimated_value), 0);

  return (
    <div className="flex flex-col w-[280px] md:w-72 flex-shrink-0 bg-muted/20 rounded-lg border border-transparent transition-colors duration-200">
      <div 
        className={cn(
          "p-3 border-b-2 flex flex-col gap-1",
          isOver && "bg-orange-500/10"
        )}
        style={{ borderColor: color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#888888]">{stage.label}</h3>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{cards.length}</Badge>
        </div>
        <div className="text-[10px] font-medium text-muted-foreground">
          Soma: R$ {totalValue.toLocaleString('pt-BR')}
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 min-h-[500px] transition-colors",
          isOver && "bg-orange-500/5"
        )}
      >
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
