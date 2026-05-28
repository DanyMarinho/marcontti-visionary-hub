import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pipelineService as pipelineCardService } from '@/services/pipelineCardService';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function usePipeline(filters = {}) {
  const { activeTenantId } = useTenant();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: cards = [], isLoading, error } = useQuery({
    queryKey: ['pipeline-cards', activeTenantId, filters],
    queryFn: () => pipelineCardService.getCards(activeTenantId!, filters),
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const moveCardMutation = useMutation({
    mutationFn: ({ cardId, fromStage, toStage, finalValue, closingDate }: { cardId: string, fromStage: string, toStage: string, finalValue?: number, closingDate?: string }) => 
      pipelineCardService.moveCard(cardId, activeTenantId!, user!.id, fromStage, toStage),
    onMutate: async ({ cardId, toStage }) => {
      await queryClient.cancelQueries({ queryKey: ['pipeline-cards', activeTenantId] });
      const previousCards = queryClient.getQueryData(['pipeline-cards', activeTenantId, filters]);
      
      queryClient.setQueryData(['pipeline-cards', activeTenantId, filters], (old: any[] | undefined) => {
        if (!old) return [];
        return old.map(card => card.id === cardId ? { ...card, stage_key: toStage } : card);
      });

      return { previousCards };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['pipeline-cards', activeTenantId, filters], context?.previousCards);
      toast.error('Erro ao mover card. Verificando rastro de falha...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards', activeTenantId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      queryClient.invalidateQueries({ queryKey: ['projecao-financeira'] });
    }
  });

  const createCardMutation = useMutation({
    mutationFn: (newCard: any) => pipelineCardService.createCard({ ...newCard, tenant_id: activeTenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards', activeTenantId] });
      toast.success('Card criado com sucesso');
    }
  });

  const archiveCardMutation = useMutation({
    mutationFn: ({ cardId, reason }: { cardId: string, reason: string }) => 
      pipelineCardService.archiveCard(cardId, activeTenantId!, user!.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards', activeTenantId] });
      toast.success('Card arquivado');
    }
  });

  return {
    cards,
    isLoading,
    error,
    moveCard: moveCardMutation,
    createCard: createCardMutation,
    archiveCard: archiveCardMutation
  };
}
