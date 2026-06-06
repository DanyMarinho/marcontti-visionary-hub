import { useQuery, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { useAuthStore } from '../store/authStore';
import { useTenant } from './useTenant';
import { useEffect } from 'react';

export function useStore() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useTenant();
  const { selectedStoreId, setSelectedStore, stores, setStores, user } = useAuthStore();

  // Non-admins are locked to their own store (vendedor) or tenant's stores (loja)
  const isLockedToStore = !!user && user.role === 'vendedor';
  const effectiveStoreId = isLockedToStore ? (user!.store_id ?? null) : selectedStoreId;

  const { data: storesData, isLoading } = useQuery({
    queryKey: ['stores', activeTenantId, user?.id, user?.role],
    queryFn: () => storeService.getAll(activeTenantId || undefined),
    enabled: !!user,
  });

  useEffect(() => {
    if (storesData) {
      // Vendedor only sees their own store
      if (isLockedToStore && user?.store_id) {
        setStores(storesData.filter((s: any) => s.id === user.store_id));
      } else {
        setStores(storesData);
      }
    }
  }, [storesData, setStores, isLockedToStore, user?.store_id]);

  const setActiveStore = (id: string) => {
    if (user && user.role === 'vendedor') return; // locked
    setSelectedStore(id);
    localStorage.setItem('activeStoreId', id);
    queryClient.invalidateQueries();
  };

  const activeStore = stores.find(s => s.id === effectiveStoreId);

  return {
    activeStoreId: effectiveStoreId,
    activeStore,
    stores,
    setActiveStore,
    isLoading,
    isAllStores: (effectiveStoreId === 'all' || !effectiveStoreId) && !isLockedToStore,
  };
}
