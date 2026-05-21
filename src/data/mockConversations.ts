import { Conversation } from '../types/conversation';

export const mockConversations: Conversation[] = [
  { 
    id: 'c1', 
    leadId: 'l1', 
    leadName: 'João Silva', 
    vehicleInterest: 'Honda PCX 160 DLX', 
    qualification: 'quente', 
    scenario: 'qualificacao_lead',
    messages: [
      { id: 'm1-1', content: 'Olá, gostaria de saber se a PCX 2024 ainda está disponível?', sender: 'lead', timestamp: new Date(Date.now() - 3600000), type: 'text', status: 'read' },
      { id: 'm1-2', content: 'Olá João! Sim, temos a PCX 160 DLX 2024 disponível em estoque na cor Preto Perolizado.', sender: 'ia', timestamp: new Date(Date.now() - 3500000), type: 'text', status: 'read' },
      { id: 'm1-3', content: 'Legal! Qual o valor dela à vista?', sender: 'lead', timestamp: new Date(Date.now() - 3400000), type: 'text', status: 'read' },
      { id: 'm1-4', content: 'O valor à vista está R$ 20.900,00. Gostaria de saber sobre opções de financiamento?', sender: 'ia', timestamp: new Date(Date.now() - 3300000), type: 'text', status: 'read' },
      { id: 'm1-5', content: 'Sim, por favor. O que precisa para simular?', sender: 'lead', timestamp: new Date(Date.now() - 3200000), type: 'text', status: 'read' },
      { id: 'm1-6', content: 'Apenas seu CPF e data de nascimento. Se preferir, posso te enviar uma simulação aproximada com 30% de entrada.', sender: 'ia', timestamp: new Date(Date.now() - 3100000), type: 'text', status: 'read' },
    ]
  },
  { 
    id: 'c2', 
    leadId: 'l2', 
    leadName: 'Ricardo Martins', 
    vehicleInterest: 'Vitrificação CB 300F', 
    qualification: 'morno', 
    scenario: 'agendamento_visita',
    messages: [
      { id: 'm2-1', content: 'Quanto custa a vitrificação para minha moto?', sender: 'lead', timestamp: new Date(Date.now() - 3600000), type: 'text', status: 'read' },
      { id: 'm2-2', content: 'Para a CB 300F, nosso processo de vitrificação inclui limpeza técnica e proteção de 3 anos. O investimento é de R$ 850,00.', sender: 'ia', timestamp: new Date(Date.now() - 3500000), type: 'text', status: 'read' },
      { id: 'm2-3', content: 'Entendi. Vocês têm horário para esta semana?', sender: 'lead', timestamp: new Date(Date.now() - 3400000), type: 'text', status: 'read' },
      { id: 'm2-4', content: 'Temos disponibilidade para quinta-feira às 14h ou sexta às 09h. Qual fica melhor para você?', sender: 'ia', timestamp: new Date(Date.now() - 3300000), type: 'text', status: 'read' },
      { id: 'm2-5', content: 'Pode ser na sexta de manhã.', sender: 'lead', timestamp: new Date(Date.now() - 3200000), type: 'text', status: 'read' },
      { id: 'm2-6', content: 'Perfeito, Ricardo! Agendado para sexta às 09h. Vou te enviar a localização da garagem agora.', sender: 'ia', timestamp: new Date(Date.now() - 3100000), type: 'text', status: 'read' },
    ]
  },
  { 
    id: 'c3', 
    leadId: 'l3', 
    leadName: 'Felipe Costa', 
    vehicleInterest: 'CB 500F', 
    qualification: 'quente', 
    scenario: 'envio_informacoes',
    messages: [
      { id: 'm3-1', content: 'Tem alguma naked acima de 300cc disponível?', sender: 'lead', timestamp: new Date(Date.now() - 3600000), type: 'text', status: 'read' },
      { id: 'm3-2', content: 'Com certeza! Temos a Honda CB 500F 2023 disponível, uma naked incrível com apenas 5.000km.', sender: 'ia', timestamp: new Date(Date.now() - 3500000), type: 'text', status: 'read' },
      { id: 'm3-3', content: 'Pode me enviar a ficha técnica e mais fotos?', sender: 'lead', timestamp: new Date(Date.now() - 3400000), type: 'text', status: 'read' },
      { id: 'm3-4', content: 'Claro! Estou gerando o catálogo completo para você. Ela possui 50,4 cv, freios ABS e painel blackout.', sender: 'ia', timestamp: new Date(Date.now() - 3300000), type: 'text', status: 'read' },
      { id: 'm3-5', content: 'Interessante. Ela já vem com protetor de motor?', sender: 'lead', timestamp: new Date(Date.now() - 3200000), type: 'text', status: 'read' },
      { id: 'm3-6', content: 'Sim, este exemplar já está equipado com protetor de motor Givi e eliminador de rabeta (temos a original também).', sender: 'ia', timestamp: new Date(Date.now() - 3100000), type: 'text', status: 'read' },
    ]
  }
];