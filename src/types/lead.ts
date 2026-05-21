export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleInterest: string;
  serviceInterest?: string;
  origin: LeadOrigin;
  stage: PipelineStage;
  priority: LeadPriority;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  tasks: Task[];
  interactions: Interaction[];
}

export type LeadOrigin = 'Instagram' | 'WhatsApp' | 'Google Ads' | 'Meta Ads' | 'Indicação' | 'Site';
export type PipelineStage = 'novo_lead' | 'contato_realizado' | 'visita_agendada' | 'proposta_enviada' | 'venda_fechada';
export type LeadPriority = 'alta' | 'media' | 'baixa';

export interface Task {
  id: string;
  leadId: string;
  description: string;
  type: TaskType;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export type TaskType = 'ligacao' | 'visita' | 'proposta' | 'follow_up' | 'email';

export interface Interaction {
  id: string;
  leadId: string;
  channel: 'whatsapp' | 'phone' | 'email' | 'in_person';
  message: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
}
