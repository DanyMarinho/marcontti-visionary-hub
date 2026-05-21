import { AutomationFlow } from '../types/flow';

export const mockFlows: AutomationFlow[] = [
  { 
    id: 'f1', name: 'Captura de Lead', description: 'Fluxo padrão de entrada', active: true,
    nodes: [
      { id: 'n1', type: 'trigger', position: { x: 50, y: 50 }, data: { label: 'Novo Lead', description: 'Formulário site/insta', icon: 'mail', status: 'active' } }
    ],
    edges: []
  }
];
