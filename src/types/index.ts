export type Role = 'admin' | 'shop' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shopId?: string;
  avatar?: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
}

export interface Customer {
  id: string;
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
