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
import { CardForm } from './components/CardForm';
import { StageConfirmationDialog } from './components/StageConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, GitMerge } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ cardId: string, fromStage: string, toStage: string } | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
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
        if (toStage === 'fechamento') {
          setPendingMove({ cardId, fromStage: card.stage_key, toStage });
        } else {
          moveCard.mutate({ 
            cardId, 
            fromStage: card.stage_key, 
            toStage 
          });
        }
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
          <Button onClick={() => setIsFormOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Novo Card
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden -mx-4 md:mx-0">
        <div className="h-full overflow-x-auto overflow-y-hidden px-4 md:px-0 scrollbar-thin">
          <div className="flex gap-3 md:gap-4 min-h-full pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {isLoading ? (
                MEC_STAGES.map((stage) => (
                  <div key={stage.key} className="flex flex-col w-[260px] md:w-72 flex-shrink-0 space-y-3">
                    <div className="h-10 w-full bg-muted animate-pulse rounded-lg" />
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ))
              ) : cards.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-card rounded-xl border border-dashed min-h-[400px]">
                  <EmptyState 
                    icon={GitMerge}
                    title="Nenhuma oportunidade no pipeline"
                    description="Crie o primeiro card para começar a gerenciar suas vendas através do Método MEC."
                    action={
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Card
                      </Button>
                    }
                  />
                </div>
              ) : (
                MEC_STAGES.map((stage) => (
                  <KanbanColumn
                    key={stage.key}
                    stage={stage}
                    color={stage.color}
                    cards={cards.filter(c => c.stage_key === stage.key)}
                    onCardClick={(card) => console.log('Click card', card)}
                  />
                ))
              )}
              
              <DragOverlay>
                {activeCard ? (
                  <div className="w-64 md:w-72">
                    <KanbanCard card={activeCard} onClick={() => {}} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      <CardForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      <StageConfirmationDialog
        open={!!pendingMove}
        onOpenChange={(open) => !open && setPendingMove(null)}
        title="Confirmar Fechamento"
        description="Parabéns pela venda! Informe o valor final para encerrar este card."
        onConfirm={(data) => {
          if (pendingMove) {
            moveCard.mutate({ 
              ...pendingMove,
              // In real app, moveCard would accept finalValue
            });
            setPendingMove(null);
          }
        }}
      />
    </div>
  );
}
