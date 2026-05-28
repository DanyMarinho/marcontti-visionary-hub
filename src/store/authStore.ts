import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Initial state, will be set on login
  login: (role) => {
    const mockUsers: Record<string, User> = {
      admin: { id: '1', name: 'Admin Marcontti', email: 'admin@marcontti.com', role: 'admin' },
      shop: { id: '2', name: 'Manager Loja Centro', email: 'loja@marcontti.com', role: 'shop', shopId: 'shop-1' },
      vendor: { id: '3', name: 'Carlos Vendedor', email: 'carlos@marcontti.com', role: 'vendor', shopId: 'shop-1' },
    };
    set({ user: mockUsers[role] });
  },
  logout: () => set({ user: null }),
}));
