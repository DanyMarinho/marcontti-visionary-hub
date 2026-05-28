import { create } from 'zustand';
import { User, Tenant } from '../types';

interface AuthState {
  user: User | null;
  selectedTenantId: string | 'all';
  tenants: Tenant[];
  login: (role: User['role']) => void;
  setSelectedTenant: (id: string | 'all') => void;
}

export const mockTenants: Tenant[] = [
  { id: 'tenant-1', name: 'Marcontti', niche: 'mecanica', color: '#f97316', ownerName: 'João Marcontti', plan: 'premium', status: 'ativo' },
  { id: 'tenant-2', name: 'Clínica Vida', niche: 'clinica', color: '#10b981', ownerName: 'Dra. Maria', plan: 'pro', status: 'ativo' },
  { id: 'tenant-3', name: 'Casa & Lar', niche: 'comercio', color: '#3b82f6', ownerName: 'Ricardo Santos', plan: 'basico', status: 'ativo' },
  { id: 'tenant-4', name: 'EduPro', niche: 'educacao', color: '#8b5cf6', ownerName: 'Prof. Ana', plan: 'pro', status: 'ativo' },
];

const mockUsers: Record<string, User> = {
  admin: { id: '1', name: 'Admin Infinda', email: 'admin@infindadigital.com', role: 'admin', tenantId: 'system' },
  shop: { id: '2', name: 'Gerente Loja', email: 'loja@infindadigital.com', role: 'shop', tenantId: 'tenant-1' },
  vendor: { id: '3', name: 'Vendedor MEC', email: 'vendedor@infindadigital.com', role: 'vendor', tenantId: 'tenant-1' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers.admin,
  selectedTenantId: 'all',
  tenants: mockTenants,
  login: (role) => set({ user: mockUsers[role] }),
  setSelectedTenant: (id) => set({ selectedTenantId: id }),
}));
