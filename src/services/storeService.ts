import { Store } from "../types";

const mockStores: Store[] = [
  { id: '1', tenant_id: '1', name: 'Joinville Centro', address: 'Rua XV de Novembro, 100', phone: '(47) 99999-0001', manager: 'Carlos Silva', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', tenant_id: '1', name: 'Joinville Norte', address: 'Rua Dona Francisca, 500', phone: '(47) 99999-0002', manager: 'Ana Paula', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', tenant_id: '2', name: 'Clínica Centro', address: 'Av. Juscelino Kubitschek, 200', phone: '(47) 99999-0003', manager: 'Dra. Márcia', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', tenant_id: '3', name: 'Loja Matriz', address: 'Rua das Flores, 300', phone: '(47) 99999-0004', manager: 'Roberto Santos', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

let stores = [...mockStores];

export const storeService = {
  async getAll(tenantId?: string) {
    if (tenantId && tenantId !== 'all') {
      return stores.filter(s => s.tenant_id === tenantId);
    }
    return stores;
  },

  async create(store: Omit<Store, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const newStore: Store = {
      ...store,
      id: Math.random().toString(36).substr(2, 9),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    stores.push(newStore);
    return newStore;
  },

  async update(id: string, updates: Partial<Store>) {
    stores = stores.map(s => s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s);
    return stores.find(s => s.id === id) as Store;
  },

  async delete(id: string) {
    stores = stores.filter(s => s.id !== id);
  }
};
