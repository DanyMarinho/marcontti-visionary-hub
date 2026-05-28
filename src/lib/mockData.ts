import { Tenant, Customer, Sale } from '../types';

export const mockCustomers: Customer[] = [
  // Tenant 1 (Marcontti - Mecânica)
  { id: 'c1', tenantId: 'tenant-1', name: 'José Oliveira', email: 'jose@email.com', phone: '(11) 9999-8888', status: 'closed', vendorId: '3', shopId: 's1', tags: ['vip'], score: 95 },
  { id: 'c2', tenantId: 'tenant-1', name: 'Amanda Lima', email: 'amanda@email.com', phone: '(11) 9999-7777', status: 'proposal', vendorId: '3', shopId: 's1', tags: ['revisão'], score: 80 },
  
  // Tenant 2 (Clínica Vida)
  { id: 'c3', tenantId: 'tenant-2', name: 'Roberto Carlos', email: 'roberto@email.com', phone: '(11) 9888-7777', status: 'contact', vendorId: 'v2', shopId: 's2', tags: ['checkup'], score: 70 },
  { id: 'c4', tenantId: 'tenant-2', name: 'Lucia Ferraz', email: 'lucia@email.com', phone: '(11) 9777-6666', status: 'closed', vendorId: 'v2', shopId: 's2', tags: ['exame'], score: 90 },

  // Tenant 3 (Casa & Lar)
  { id: 'c5', tenantId: 'tenant-3', name: 'Marcos Braz', email: 'marcos@email.com', phone: '(11) 9666-5555', status: 'lead', vendorId: 'v3', shopId: 's3', tags: ['móveis'], score: 50 },

  // Tenant 4 (EduPro)
  { id: 'c6', tenantId: 'tenant-4', name: 'Felipe Neto', email: 'felipe@email.com', phone: '(11) 9555-4444', status: 'closed', vendorId: 'v4', shopId: 's4', tags: ['curso-excel'], score: 100 },
];

export const mockSales: Sale[] = [
  { id: 's1', tenantId: 'tenant-1', customerId: 'c1', vendorId: '3', shopId: 's1', amount: 1500, date: '2024-05-25', product: 'Revisão Completa' },
  { id: 's2', tenantId: 'tenant-2', customerId: 'c4', vendorId: 'v2', shopId: 's2', amount: 450, date: '2024-05-24', product: 'Consulta + Exames' },
  { id: 's3', tenantId: 'tenant-4', customerId: 'c6', vendorId: 'v4', shopId: 's4', amount: 800, date: '2024-05-23', product: 'Pacote Office' },
  { id: 's4', tenantId: 'tenant-1', customerId: 'c1', vendorId: '3', shopId: 's1', amount: 2200, date: '2024-04-20', product: 'Troca de Suspensão' },
  { id: 's5', tenantId: 'tenant-3', customerId: 'c5', vendorId: 'v3', shopId: 's3', amount: 3000, date: '2024-05-10', product: 'Sofá de Canto' },
];
