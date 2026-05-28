import { Client, Sale } from '../types';

export const mockCustomers: Client[] = [
  { 
    id: '1', 
    tenant_id: '1', 
    full_name: 'João Silva', 
    phone: '11999999999', 
    email: 'joao@email.com', 
    status: 'active', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '2', 
    tenant_id: '1', 
    full_name: 'Maria Santos', 
    phone: '11988888888', 
    email: 'maria@email.com', 
    status: 'active', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '3', 
    tenant_id: '2', 
    full_name: 'Pedro Oliveira', 
    name: 'Pedro Oliveira', 
    phone: '11977777777', 
    email: 'pedro@email.com', 
    status: 'lead_unidentified', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

export const mockSales: Sale[] = [
  { 
    id: '1', 
    tenant_id: '1', 
    client_id: '1', 
    seller_id: 'v1', 
    store_id: 's1', 
    amount: 1500, 
    date: '2024-03-20', 
    product: 'Revisão Completa' 
  },
  { 
    id: '2', 
    tenant_id: '1', 
    client_id: '2', 
    seller_id: 'v2', 
    store_id: 's1', 
    amount: 2800, 
    date: '2024-03-21', 
    product: 'Troca de Pneus' 
  },
];
