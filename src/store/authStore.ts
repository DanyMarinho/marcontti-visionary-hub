import { create } from 'zustand';
import { User, Tenant, Role } from '../types';

interface AuthState {
  user: User | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  selectedTenantId: string | null;
  setUser: (user: User | null) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setSelectedTenant: (tenantId: string) => void;
  setRole: (role: Role) => void;
  setTenants: (tenants: Tenant[]) => void;
  login: () => void;
}

const mockUser: User = {
  id: '1',
  full_name: 'Admin MEC',
  name: 'Admin MEC',
  email: 'admin@mec.com',
  role: 'admin',
  tenant_id: '1',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  currentTenant: null,
  tenants: [],
  selectedTenantId: 'all',
  setUser: (user) => set({ user }),
  setCurrentTenant: (tenant) => set({ 
    currentTenant: tenant,
    selectedTenantId: tenant ? tenant.id : 'all'
  }),
  setSelectedTenant: (tenantId) => set((state) => {
    if (tenantId === 'all') {
      return { selectedTenantId: 'all', currentTenant: null };
    }
    const tenant = state.tenants.find(t => t.id === tenantId) || null;
    return {
      selectedTenantId: tenantId,
      currentTenant: tenant
    };
  }),
  setRole: (role) => set((state) => ({ 
    user: state.user ? { ...state.user, role } : null 
  })),
  setTenants: (tenants) => set((state) => {
    // If currentTenant is null and we have tenants, maybe set the first one?
    // But usually for admin we want 'all' by default
    return { tenants };
  }),
  login: () => {},
}));
