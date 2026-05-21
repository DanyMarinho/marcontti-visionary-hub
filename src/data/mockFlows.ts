import { AutomationFlow } from '../types/flow';

export const mockFlows: AutomationFlow[] = [
  { 
    id: 'f1', 
    name: 'Captura de Lead', 
    description: 'Fluxo automático para novos leads vindos de campanhas', 
    active: true,
    nodes: [
      { 
        id: 'n1', 
        type: 'trigger', 
        position: { x: 50, y: 150 }, 
        data: { 
          label: 'Meta Ads / Google Ads', 
          description: 'Novo cadastro via formulário', 
          icon: 'target', 
          status: 'active',
          trigger: 'Lead via API',
          action: 'Iniciar Automação'
        } 
      },
      { 
        id: 'n2', 
        type: 'integration', 
        position: { x: 300, y: 150 }, 
        data: { 
          label: 'Webhook Connector', 
          description: 'Normalização de dados', 
          icon: 'link', 
          status: 'active',
          action: 'Processar Payload',
          nextStep: 'Qualificação IA'
        } 
      },
      { 
        id: 'n3', 
        type: 'action', 
        position: { x: 550, y: 150 }, 
        data: { 
          label: 'Qualificação IA', 
          description: 'Análise de perfil via LLM', 
          icon: 'bot', 
          status: 'active',
          conditions: ['Lead Premium', 'Telefone Válido'],
          action: 'Classificar Lead'
        } 
      },
      { 
        id: 'n4', 
        type: 'notification', 
        position: { x: 800, y: 150 }, 
        data: { 
          label: 'CRM Pipeline', 
          description: 'Envio para Novo Lead', 
          icon: 'layout', 
          status: 'active',
          action: 'Criar Card no CRM'
        } 
      }
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e2-3', source: 'n2', target: 'n3', animated: true },
      { id: 'e3-4', source: 'n3', target: 'n4', animated: true }
    ]
  },
  { 
    id: 'f2', 
    name: 'Qualificação Automática', 
    description: 'Interação inicial via WhatsApp para filtrar leads', 
    active: true,
    nodes: [
      { id: 'n1', type: 'trigger', position: { x: 100, y: 50 }, data: { label: 'Novo Lead CRM', description: 'Lead entra na coluna Novo', icon: 'user-plus', status: 'active' } },
      { id: 'n2', type: 'delay', position: { x: 100, y: 150 }, data: { label: 'Aguardar 5 min', description: 'Tempo para primeira mensagem', icon: 'clock', status: 'active' } },
      { id: 'n3', type: 'action', position: { x: 100, y: 250 }, data: { label: 'Msg Boas-vindas', description: 'WhatsApp automático', icon: 'message-square', status: 'active' } }
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e2-3', source: 'n2', target: 'n3', animated: true }
    ]
  },
  { 
    id: 'f3', 
    name: 'Follow-up Pós-Venda', 
    description: 'Acompanhamento após venda concluída', 
    active: false,
    nodes: [
      { id: 'n1', type: 'trigger', position: { x: 100, y: 50 }, data: { label: 'Venda Concluída', description: 'Status fechado no CRM', icon: 'check-circle', status: 'inactive' } }
    ],
    edges: []
  },
  { 
    id: 'f4', 
    name: 'Recuperação de Inativo', 
    description: 'Engajar leads sem contato há 7 dias', 
    active: true,
    nodes: [
      { id: 'n1', type: 'trigger', position: { x: 100, y: 50 }, data: { label: '7 Dias Inativo', description: 'Sem movimentação no CRM', icon: 'clock', status: 'active' } }
    ],
    edges: []
  }
];
