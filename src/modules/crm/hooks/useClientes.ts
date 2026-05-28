import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';

export function useClientes(page = 1, pageSize = 10, search = '', filters = {}) {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes', activeTenantId, page, pageSize, search, filters],
    queryFn: () => clientService.getAll(activeTenantId!, page, pageSize, search, filters),
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const createMutation = useMutation({
    mutationFn: async (newClient: any) => {
      const isDuplicate = await clientService.checkDuplicatePhone(activeTenantId!, newClient.phone);
      if (isDuplicate && !newClient.confirmDuplicate) {
        return { isDuplicate: true };
      }
      return clientService.create({ ...newClient, tenant_id: activeTenantId });
    },
    onSuccess: (data) => {
      if (!(data as any).isDuplicate) {
        queryClient.invalidateQueries({ queryKey: ['clientes'] });
        toast.success('Cliente cadastrado com sucesso');
      }
    },
    onError: () => toast.error('Erro ao cadastrar cliente')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => clientService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente atualizado com sucesso');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente removido (soft-delete)');
    }
  });

  return {
    clientes: data?.data || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    createCliente: createMutation,
    updateCliente: updateMutation,
    deleteCliente: deleteMutation
  };
}
