import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService } from '@/services/whatsappService';
import { useTenant } from '@/hooks/useTenant';
import { WhatsAppInstance } from '@/types';
import { toast } from 'sonner';

export function useWhatsAppInstance() {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();

  const { data: instance, isLoading, error } = useQuery({
    queryKey: ['whatsapp-instance', activeTenantId],
    queryFn: () => whatsappService.getInstance(activeTenantId!),
    enabled: !!activeTenantId && activeTenantId !== 'all',
    refetchInterval: (query) => {
      // Polling every 5 seconds if connecting
      return query.state.data?.status === 'connecting' ? 5000 : false;
    }
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => whatsappService.upsertInstance({
      tenant_id: activeTenantId!,
      instance_name: data.instance_name,
      evolution_url: data.evolution_url,
      api_key: data.api_key,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instance', activeTenantId] });
      toast.success('Configurações salvas. Iniciando conexão...');
    },
    onError: () => toast.error('Erro ao salvar configurações')
  });

  const connectMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      // Simplified mock: update status to connecting
      await whatsappService.updateStatus(instanceId, 'connecting');
      // In production, call Edge Function to trigger Evolution API connection
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instance', activeTenantId] });
    }
  });

  return {
    instance,
    isLoading,
    error,
    upsertInstance: upsertMutation,
    connectInstance: connectMutation
  };
}
