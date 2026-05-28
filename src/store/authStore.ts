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
  setSelectedTenant: (tenantId: string) => void;
  setSelectedStore: (storeId: string) => void;
  setRole: (role: Role) => void;
  setTenants: (tenants: Tenant[]) => void;
  setStores: (stores: Store[]) => void;
  login: () => void;
}

const mockTenants: Tenant[] = [
  { 
    id: '1', name: 'MA Marcontti', niche: 'mecanica', cnpj: '12.345.678/0001-01', contact_email: 'contato@marcontti.com', color: '#f97316', is_active: true, plan: 'premium', status: 'ativo', timezone: 'America/Sao_Paulo', 
    no_response_threshold_minutes: 30, reactivation_auto_enabled: false, reactivation_idle_days: 7, reactivation_max_attempts: 3, reactivation_interval_days: 3, reactivation_messages: {},
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
  },
  { 
    id: '2', name: 'Clínica Vida', niche: 'clinica', cnpj: '12.345.678/0001-02', contact_email: 'contato@clinicavida.com', color: '#10b981', is_active: true, plan: 'pro', status: 'ativo', timezone: 'America/Sao_Paulo', 
    no_response_threshold_minutes: 30, reactivation_auto_enabled: false, reactivation_idle_days: 7, reactivation_max_attempts: 3, reactivation_interval_days: 3, reactivation_messages: {},
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
  },
  { 
    id: '3', name: 'Casa & Lar', niche: 'comercio_local', cnpj: '12.345.678/0001-03', contact_email: 'contato@casalar.com', color: '#3b82f6', is_active: true, plan: 'basico', status: 'ativo', timezone: 'America/Sao_Paulo', 
    no_response_threshold_minutes: 30, reactivation_auto_enabled: false, reactivation_idle_days: 7, reactivation_max_attempts: 3, reactivation_interval_days: 3, reactivation_messages: {},
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
  },
  { 
    id: '4', name: 'EduPro', niche: 'educacao', cnpj: '12.345.678/0001-04', contact_email: 'contato@edupro.com', color: '#8b5cf6', is_active: true, plan: 'pro', status: 'ativo', timezone: 'America/Sao_Paulo', 
    no_response_threshold_minutes: 30, reactivation_auto_enabled: false, reactivation_idle_days: 7, reactivation_max_attempts: 3, reactivation_interval_days: 3, reactivation_messages: {},
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() 
  }
];

const mockUser: User = {
  id: '1',
  full_name: 'Admin MEC',
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
  tenants: mockTenants,
  stores: [],
  selectedTenantId: localStorage.getItem('activeTenantId') || 'all',
  selectedStoreId: localStorage.getItem('activeStoreId') || 'all',

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
  setSelectedStore: (storeId) => set({ selectedStoreId: storeId }),
  setRole: (role) => set((state) => ({ 
    user: state.user ? { ...state.user, role } : null 
  })),
  setTenants: (tenants) => set({ tenants }),
  setStores: (stores) => set({ stores }),
  login: () => {},
}));
