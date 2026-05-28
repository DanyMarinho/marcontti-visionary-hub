import { User } from "../types";

const mockUsers: User[] = [
  { id: '1', tenant_id: '1', store_id: '1', full_name: 'Ricardo Oliveira', email: 'ricardo@marcontti.com', role: 'vendedor', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', tenant_id: '1', store_id: '1', full_name: 'Juliana Costa', email: 'juliana@marcontti.com', role: 'vendedor', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', tenant_id: '1', store_id: '2', full_name: 'Marcos Pereira', email: 'marcos@marcontti.com', role: 'loja', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', tenant_id: '2', store_id: '3', full_name: 'Fernanda Lima', email: 'fernanda@clinicavida.com', role: 'vendedor', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', tenant_id: '3', store_id: '4', full_name: 'Tiago Souza', email: 'tiago@casalar.com', role: 'vendedor', is_active: false, created_at: new Date().toISOString(), updated_at: new Date(Date.now() - 86400000 * 2).toISOString() }
];

let users = [...mockUsers];

export const userService = {
  async getAll(tenantId?: string) {
    if (tenantId && tenantId !== 'all') {
      return users.filter(u => u.tenant_id === tenantId);
    }
    return users;
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  async inviteVendor(email: string, fullName: string, tenantId: string, storeId: string) {
    console.log(`Inviting ${fullName} (${email}) to tenant ${tenantId}...`);
    return { success: true };
  },

  async update(id: string, updates: Partial<User>) {
    users = users.map(u => u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u);
    return users.find(u => u.id === id) as User;
  },

  async deactivateVendor(userId: string) {
    users = users.map(u => u.id === userId ? { ...u, is_active: false, updated_at: new Date().toISOString() } : u);
  }
};
