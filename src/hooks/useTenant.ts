import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import { useAuthStore } from '../store/authStore';

export function useTenant() {
  const queryClient = useQueryClient();
  const { selectedTenantId, setSelectedTenant, user } = useAuthStore();

  // Non-admins are locked to their own tenant
  const effectiveTenantId = user && user.role !== 'admin' ? user.tenant_id : selectedTenantId;

  const { data: activeTenant, isLoading } = useQuery({
    queryKey: ['tenant', effectiveTenantId],
    queryFn: () => (effectiveTenantId && effectiveTenantId !== 'all' ? tenantService.getById(effectiveTenantId) : null),
    enabled: !!effectiveTenantId && effectiveTenantId !== 'all',
  });

  const setActiveTenant = (id: string) => {
    if (user && user.role !== 'admin') return; // locked
    setSelectedTenant(id);
    localStorage.setItem('activeTenantId', id);
    queryClient.invalidateQueries();
  };

  return {
    activeTenantId: effectiveTenantId,
    activeTenant,
    setActiveTenant,
    isLoading,
    isGlobal: (effectiveTenantId === 'all' || !effectiveTenantId) && (!user || user.role === 'admin'),
  };
}
