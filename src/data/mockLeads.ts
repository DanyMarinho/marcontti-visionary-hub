import { Lead } from '../types/lead';

export const mockLeads: Lead[] = [
  { id: 'l1', name: 'João Silva', phone: '(11) 99999-0001', vehicleInterest: 'Honda PCX 160 DLX', origin: 'Instagram', stage: 'visita_agendada', priority: 'alta', score: 85, createdAt: new Date(), updatedAt: new Date(), tasks: [{ id: 't1', leadId: 'l1', description: 'Realizar visita na garagem', type: 'visita', dueDate: new Date(), completed: false, createdAt: new Date() }], interactions: [] },
  { id: 'l2', name: 'Ricardo Martins', phone: '(11) 99999-0002', vehicleInterest: 'Vitrificação Cerâmica', origin: 'WhatsApp', stage: 'novo_lead', priority: 'media', score: 45, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l3', name: 'Felipe Costa', phone: '(11) 99999-0003', vehicleInterest: 'Yamaha MT-03', origin: 'Indicação', stage: 'proposta_enviada', priority: 'alta', score: 78, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l4', name: 'Ana Rodrigues', phone: '(11) 99999-0004', vehicleInterest: 'Detailing Completo', origin: 'Site', stage: 'contato_realizado', priority: 'media', score: 60, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l5', name: 'Carlos Eduardo', phone: '(11) 99999-0005', vehicleInterest: 'Honda CB 500F', origin: 'Instagram', stage: 'venda_fechada', priority: 'alta', score: 95, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l6', name: 'Marcos Oliveira', phone: '(11) 99999-0006', vehicleInterest: 'Honda XRE 300 Sahara', origin: 'WhatsApp', stage: 'novo_lead', priority: 'baixa', score: 30, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l7', name: 'Fernanda Lima', phone: '(11) 99999-0007', vehicleInterest: 'Polimento Técnico', origin: 'Google Ads', stage: 'novo_lead', priority: 'media', score: 55, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
  { id: 'l8', name: 'Pedro Henrique', phone: '(11) 99999-0008', vehicleInterest: 'Yamaha NMAX 160', origin: 'Indicação', stage: 'visita_agendada', priority: 'alta', score: 82, createdAt: new Date(), updatedAt: new Date(), tasks: [], interactions: [] },
];
