import { useQuery, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { useAuthStore } from '../store/authStore';
import { useTenant } from './useTenant';
import { useEffect } from 'react';

export function useStore() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useTenant();
  const { selectedStoreId, setSelectedStore, stores, setStores } = useAuthStore();

  const { data: storesData, isLoading } = useQuery({
    queryKey: ['stores', activeTenantId],
    queryFn: () => storeService.getAll(activeTenantId || undefined),
    enabled: true,
  });

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
    }
  }, [storesData, setStores]);

  const setActiveStore = (id: string) => {
    setSelectedStore(id);
    localStorage.setItem('activeStoreId', id);
    queryClient.invalidateQueries();
  };

  const activeStore = stores.find(s => s.id === selectedStoreId);

  return {
    activeStoreId: selectedStoreId,
    activeStore,
    stores,
    setActiveStore,
    isLoading,
    isAllStores: selectedStoreId === 'all' || !selectedStoreId
  };
}
