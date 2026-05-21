import { Conversation } from '../types/conversation';

export const mockConversations: Conversation[] = [
  { 
    id: 'c1', leadId: 'l1', leadName: 'João Silva', vehicleInterest: 'Honda PCX 160 DLX', qualification: 'quente', scenario: 'qualificacao_lead',
    messages: [
      { id: 'm1', content: 'Olá, gostaria de saber se a PCX 2024 ainda está disponível?', sender: 'lead', timestamp: new Date(), type: 'text' },
      { id: 'm2', content: 'Olá João! Sim, temos a PCX 160 DLX 2024 disponível em estoque na cor Preto Perolizado.', sender: 'ia', timestamp: new Date(), type: 'text' }
    ]
  },
  { 
    id: 'c2', leadId: 'l2', leadName: 'Ricardo Martins', vehicleInterest: 'Vitrificação CB 300F', qualification: 'morno', scenario: 'agendamento_visita',
    messages: [
      { id: 'm3', content: 'Quanto custa a vitrificação?', sender: 'lead', timestamp: new Date(), type: 'text' },
      { id: 'm4', content: 'Para a CB 300F, nosso processo de vitrificação inclui limpeza técnica e proteção de 3 anos.', sender: 'ia', timestamp: new Date(), type: 'text' }
    ]
  },
  { 
    id: 'c3', leadId: 'l3', leadName: 'Felipe Costa', vehicleInterest: 'CB 500F', qualification: 'quente', scenario: 'envio_informacoes',
    messages: [
      { id: 'm5', content: 'Tem alguma naked acima de 300cc?', sender: 'lead', timestamp: new Date(), type: 'text' },
      { id: 'm6', content: 'Com certeza! Temos a Honda CB 500F 2023 disponível, uma naked incrível.', sender: 'ia', timestamp: new Date(), type: 'text' }
    ]
  }
];
