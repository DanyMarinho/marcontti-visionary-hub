import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import { useAuthStore } from '../store/authStore';

export function useTenant() {
  const queryClient = useQueryClient();
  const { selectedTenantId, setSelectedTenant } = useAuthStore();

  const { data: activeTenant, isLoading } = useQuery({
    queryKey: ['tenant', selectedTenantId],
    queryFn: () => (selectedTenantId && selectedTenantId !== 'all' ? tenantService.getById(selectedTenantId) : null),
    enabled: !!selectedTenantId && selectedTenantId !== 'all',
  });

  const setActiveTenant = (id: string) => {
    setSelectedTenant(id);
    localStorage.setItem('activeTenantId', id);
    // Invalidate all queries to refresh data for the new tenant
    queryClient.invalidateQueries();
  };

  return {
    activeTenantId: selectedTenantId,
    activeTenant,
    setActiveTenant,
    isLoading,
    isGlobal: selectedTenantId === 'all' || !selectedTenantId
  };
}
