export type Role = 'admin' | 'shop' | 'vendor';

export interface Tenant {
  id: string;
  name: string;
  niche: 'comercio' | 'mecanica' | 'clinica' | 'imobiliaria' | 'restaurante' | 'educacao' | 'servicos' | 'outro';
  logo?: string;
  color: string;
  ownerName: string;
  plan: 'basico' | 'pro' | 'premium';
  status: 'ativo' | 'inativo';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
  avatar?: string;
}

export interface Shop {
  id: string;
  tenantId: string;
  name: string;
  location: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  status: 'lead' | 'contact' | 'proposal' | 'closed' | 'post-sale';
  lastPurchase?: string;
  vendorId: string;
  shopId: string;
  tags: string[];
  score: number;
}

export interface Sale {
  id: string;
  tenantId: string;
  customerId: string;
  vendorId: string;
  shopId: string;
  amount: number;
  date: string;
  product: string;
}

export interface MetricData {
  label: string;
  value: number;
}
