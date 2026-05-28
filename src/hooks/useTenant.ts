import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types';

export function useTenant() {
  const queryClient = useQueryClient();
  const [activeTenantId, setActiveTenantId] = useState<string | null>(() => {
    return localStorage.getItem('activeTenantId');
  });

  const { data: activeTenant, isLoading } = useQuery({
    queryKey: ['tenant', activeTenantId],
    queryFn: () => (activeTenantId && activeTenantId !== 'all' ? tenantService.getById(activeTenantId) : null),
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const setActiveTenant = (id: string) => {
    localStorage.setItem('activeTenantId', id);
    setActiveTenantId(id);
    // Invalidate all queries to refresh data for the new tenant
    queryClient.invalidateQueries();
  };

  return {
    activeTenantId,
    activeTenant,
    setActiveTenant,
    isLoading,
    isGlobal: activeTenantId === 'all'
  };
}
