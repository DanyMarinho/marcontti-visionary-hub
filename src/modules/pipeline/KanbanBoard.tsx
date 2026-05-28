import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { usePipeline } from './hooks/usePipeline';
import { KanbanColumn } from './components/KanbanColumn';
import { KanbanCard } from './components/KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const MEC_STAGES = [
  { key: 'prospeccao', label: '1. Prospecção', color: '#f97316' },
  { key: 'qualificacao', label: '2. Qualificação', color: '#fb923c' },
  { key: 'apresentacao', label: '3. Apresentação', color: '#fdba74' },
  { key: 'proposta', label: '4. Proposta', color: '#fed7aa' },
  { key: 'negociacao', label: '5. Negociação', color: '#a1a1aa' },
  { key: 'fechamento', label: '6. Fechamento', color: '#71717a' },
  { key: 'pos_venda', label: '7. Pós-venda', color: '#3f3f46' },
];

export default function KanbanBoard() {
  const { cards, moveCard, isLoading } = usePipeline();
  const [activeCard, setActiveCard] = useState<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCard(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (over && active.id !== over.id) {
      const cardId = active.id as string;
      const toStage = over.id as string;
      const card = active.data.current;
      
      if (card && card.stage_key !== toStage) {
        moveCard.mutate({ 
          cardId, 
          fromStage: card.stage_key, 
          toStage 
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline Kanban</h1>
          <p className="text-muted-foreground text-sm">Método MEC: Engenharia de Processos.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Novo Card
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full pb-4">
        <div className="flex gap-4 min-h-full pb-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {MEC_STAGES.map((stage) => (
              <KanbanColumn
                key={stage.key}
                stage={stage}
                color={stage.color}
                cards={cards.filter(c => c.stage_key === stage.key)}
                onCardClick={(card) => console.log('Click card', card)}
              />
            ))}
            
            <DragOverlay>
              {activeCard ? (
                <div className="w-72">
                  <KanbanCard card={activeCard} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
