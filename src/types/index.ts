export type Role = 'admin' | 'loja' | 'vendedor';

export type Niche = 'comercio_local' | 'mecanica' | 'clinica' | 'imobiliaria' | 'restaurante' | 'educacao' | 'servicos' | 'outro';

export interface Tenant {
  id: string;
  name: string;
  niche: Niche;
  cnpj?: string;
  contact_email: string;
  logo_url?: string;
  timezone: string;
  is_active: boolean;
  color: string;
  owner_name?: string;
  plan: 'basico' | 'pro' | 'premium';
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  tenant_id: string;
  name: string;
  address?: string;
  phone?: string;
  manager?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  store_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Aliases for compatibility
export type Customer = Client;

export interface Client {
  id: string;
  tenant_id: string;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  status: 'active' | 'lead_unidentified' | 'deleted';
  last_interaction?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  tenant_id: string;
  stage_key: 'prospeccao' | 'qualificacao' | 'apresentacao' | 'proposta' | 'negociacao' | 'fechamento' | 'pos_venda';
  label: string;
  position: number;
}

export interface PipelineCard {
  id: string;
  tenant_id: string;
  store_id: string;
  seller_id: string;
  client_id: string;
  title: string;
  stage_key: string;
  estimated_value: number;
  final_value?: number;
  expected_close_date?: string;
  closed_at?: string;
  notes?: string;
  is_archived: boolean;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppInstance {
  id: string;
  tenant_id: string;
  instance_name: string;
  evolution_url: string;
  api_key: string;
  phone_number?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  tenant_id: string;
  client_id: string;
  direction: 'sent' | 'received';
  content: string;
  processed_by_ai: boolean;
  external_id?: string;
  timestamp: string;
}

export interface AgentIAConfig {
  id: string;
  tenant_id: string;
  is_active: boolean;
  webhook_url?: string;
  schedule: Record<string, { enabled: boolean; start?: string; end?: string }>;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  tenant_id: string;
  store_id?: string;
  seller_id?: string;
  target_value: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface Sale {
  id: string;
  tenant_id: string;
  client_id: string;
  seller_id: string;
  store_id: string;
  amount: number;
  date: string;
  product: string;
}

