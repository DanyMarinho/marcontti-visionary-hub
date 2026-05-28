import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
}

const mockUsers: Record<string, User> = {
  admin: { id: '1', name: 'Admin Infinda', email: 'admin@infindadigital.com', role: 'admin' },
  shop: { id: '2', name: 'Gerente Loja', email: 'loja@infindadigital.com', role: 'shop', shopId: 'shop-1' },
  vendor: { id: '3', name: 'Vendedor MEC', email: 'vendedor@infindadigital.com', role: 'vendor', shopId: 'shop-1' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers.admin, // Start as Admin directly
  login: (role) => set({ user: mockUsers[role] }),
  logout: () => set({ user: null }),
}));
