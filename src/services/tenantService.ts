import { Tenant } from "../types";
import { useAuthStore } from "@/store/authStore";

export const tenantService = {
  async getAll() {
    // Returning mock data from store for demonstration
    return useAuthStore.getState().tenants;
  },

  async getById(id: string) {
    const tenants = useAuthStore.getState().tenants;
    return tenants.find(t => t.id === id) || null;
  },

  async create(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const newTenant: Tenant = {
      ...tenant,
      id: Math.random().toString(36).substr(2, 9),
      is_active: true,
      status: 'ativo',
      timezone: 'America/Sao_Paulo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Tenant;
    
    const currentTenants = useAuthStore.getState().tenants;
    useAuthStore.getState().setTenants([...currentTenants, newTenant]);
    return newTenant;
  },

  async update(id: string, updates: Partial<Tenant>) {
    const currentTenants = useAuthStore.getState().tenants;
    const updatedTenants = currentTenants.map(t => 
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    );
    useAuthStore.getState().setTenants(updatedTenants);
    return updatedTenants.find(t => t.id === id) as Tenant;
  },

  async delete(id: string) {
    const currentTenants = useAuthStore.getState().tenants;
    const filteredTenants = currentTenants.filter(t => t.id !== id);
    useAuthStore.getState().setTenants(filteredTenants);
  }
};
