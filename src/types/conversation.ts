export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadAvatar?: string;
  scenario: ConversationScenario;
  messages: ChatMessage[];
  qualification: QualificationLevel;
  vehicleInterest: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'lead' | 'ia';
  timestamp: Date;
  type: 'text' | 'image' | 'catalog';
  status?: 'sent' | 'delivered' | 'read';
}

export type ConversationScenario = 'qualificacao_lead' | 'agendamento_visita' | 'envio_informacoes';
export type QualificationLevel = 'frio' | 'morno' | 'quente';
