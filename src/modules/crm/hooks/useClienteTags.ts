import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';

export function useClienteTags(clientId?: string) {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();

  const { data: tenantTags = [], isLoading: isLoadingTenantTags } = useQuery({
    queryKey: ['tenant-tags', activeTenantId],
    queryFn: () => clientService.listTenantTags(activeTenantId!),
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const addTagMutation = useMutation({
    mutationFn: (tagId: string) => clientService.addTagToClient(clientId!, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Tag adicionada');
    },
    onError: () => toast.error('Erro ao adicionar tag')
  });

  const removeTagMutation = useMutation({
    mutationFn: (tagId: string) => clientService.removeTagFromClient(clientId!, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast.success('Tag removida');
    },
    onError: () => toast.error('Erro ao remover tag')
  });

  const createTagMutation = useMutation({
    mutationFn: (name: string) => clientService.createTag(activeTenantId!, name),
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-tags', activeTenantId] });
      if (clientId) {
        addTagMutation.mutate(newTag.id);
      } else {
        toast.success('Tag criada com sucesso');
      }
    },
    onError: () => toast.error('Erro ao criar tag')
  });

  return {
    tenantTags,
    isLoadingTenantTags,
    addTag: addTagMutation,
    removeTag: removeTagMutation,
    createTag: createTagMutation
  };
}
