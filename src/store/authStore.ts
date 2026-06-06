import { create } from 'zustand';
import { User, Tenant, Role, Store } from '../types';

interface AuthState {
  user: User | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  selectedTenantId: string | null;
  selectedStoreId: string | null;
  stores: Store[];
  setUser: (user: User | null) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  logout: () => void;
  setSelectedTenant: (tenantId: string) => void;
  setSelectedStore: (storeId: string) => void;
  setRole: (role: Role) => void;
  setTenants: (tenants: Tenant[]) => void;
  setStores: (stores: Store[]) => void;
  login: () => void;
}

const isAdmin = (state: { user: User | null }) => state.user?.role === 'admin';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  currentTenant: null,
  tenants: [],
  stores: [],
  selectedTenantId: null,
  selectedStoreId: null,

  setUser: (user) => set((state) => {
    // When user is loaded, lock tenant/store to the user's own context (non-admins only)
    if (!user) {
      try { localStorage.removeItem('activeTenantId'); localStorage.removeItem('activeStoreId'); } catch {}
      return { user: null, selectedTenantId: null, selectedStoreId: null, currentTenant: null, stores: [], tenants: [] };
    }
    if (user.role !== 'admin') {
      try { localStorage.removeItem('activeTenantId'); localStorage.removeItem('activeStoreId'); } catch {}
      return {
        user,
        selectedTenantId: user.tenant_id,
        selectedStoreId: user.store_id ?? null,
      };
    }
    // Admin: respect previous selection or default to global
    const savedTenant = (typeof localStorage !== 'undefined' && localStorage.getItem('activeTenantId')) || 'all';
    const savedStore = (typeof localStorage !== 'undefined' && localStorage.getItem('activeStoreId')) || 'all';
    return {
      user,
      selectedTenantId: state.selectedTenantId ?? savedTenant,
      selectedStoreId: state.selectedStoreId ?? savedStore,
    };
  }),
  setCurrentTenant: (tenant) => {
    if (!isAdmin(get())) return;
    set({ currentTenant: tenant, selectedTenantId: tenant ? tenant.id : 'all' });
  },
  setSelectedTenant: (tenantId) => {
    if (!isAdmin(get())) return;
    set((state) => {
      if (tenantId === 'all') return { selectedTenantId: 'all', currentTenant: null };
      const tenant = state.tenants.find(t => t.id === tenantId) || null;
      return { selectedTenantId: tenantId, currentTenant: tenant };
    });
  },
  setSelectedStore: (storeId) => {
    if (!isAdmin(get())) return;
    set({ selectedStoreId: storeId });
  },
  // Role changes are server-side only (user_roles table). UI cannot self-promote.
  setRole: () => {},
  setTenants: (tenants) => set({ tenants }),
  setStores: (stores) => set({ stores }),
  login: () => {},
  logout: () => {
    try { localStorage.removeItem('activeTenantId'); localStorage.removeItem('activeStoreId'); } catch {}
    set({ user: null, currentTenant: null, selectedTenantId: null, selectedStoreId: null, stores: [], tenants: [] });
  },
}));
