import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/hooks/useTenant';
import AdminDashboard from '@/modules/dashboard/AdminDashboard';
import { LojaDashboard } from '@/modules/dashboard/LojaDashboard';
import VendedorDashboard from '@/modules/dashboard/VendedorDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { isGlobal } = useTenant();

  // Admin and looking at global view or specifically at a tenant
  if (user?.role === 'admin') {
    if (isGlobal) {
      return <AdminDashboard />;
    }
    // If Admin selects a specific tenant, show the LojaDashboard view for that tenant
    return <LojaDashboard />;
  }

  // Shop Manager role
  if (user?.role === 'loja') {
    return <LojaDashboard />;
  }

  // Vendor role
  return <VendedorDashboard />;
}
