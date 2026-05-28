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
  login: () => void; // Keep for legacy
}

const mockTenants: Tenant[] = []; // Start empty

  { 
    id: '1', 
    name: 'Marcontti', 
    niche: 'mecanica', 
    color: '#f97316', 
    owner_name: 'Marcos Silva', 
    plan: 'premium', 
    status: 'ativo',
    contact_email: 'marcos@marcontti.com',
    timezone: 'America/Sao_Paulo',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: 'Clínica Vida', 
    niche: 'clinica', 
    color: '#ec4899', 
    owner_name: 'Dra. Ana Paula', 
    plan: 'pro', 
    status: 'ativo',
    contact_email: 'ana@clinicavida.com',
    timezone: 'America/Sao_Paulo',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '3', 
    name: 'EduPro', 
    niche: 'educacao', 
    color: '#0ea5e9', 
    owner_name: 'Roberto Santos', 
    plan: 'basico', 
    status: 'ativo',
    contact_email: 'roberto@edupro.com',
    timezone: 'America/Sao_Paulo',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

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
  currentTenant: mockTenants[0],
  tenants: mockTenants,
  selectedTenantId: '1',
  setUser: (user) => set({ user }),
  setCurrentTenant: (tenant) => set({ 
    currentTenant: tenant,
    selectedTenantId: tenant ? tenant.id : null
  }),
  setSelectedTenant: (tenantId) => set((state) => {
    const tenant = state.tenants.find(t => t.id === tenantId) || null;
    return {
      selectedTenantId: tenantId,
      currentTenant: tenant
    };
  }),
  setRole: (role) => set((state) => ({ 
    user: state.user ? { ...state.user, role } : null 
  })),
  login: () => {},
}));
