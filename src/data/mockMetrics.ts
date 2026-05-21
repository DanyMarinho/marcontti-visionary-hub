import { Metric, MonthlyData, RevenueDistribution, LeadsByOrigin } from '../types/metric';

export const mockMetrics: Metric[] = [
  { id: 'm1', label: 'Total Leads', value: 127, previousValue: 104, format: 'number', variation: 22, variationType: 'percentage', icon: 'users', trend: 'up' },
  { id: 'm2', label: 'Qualificados', value: 48, previousValue: 40, format: 'number', variation: 18, variationType: 'percentage', icon: 'check-circle', trend: 'up' },
  { id: 'm3', label: 'Conversão', value: 23.4, previousValue: 19.3, format: 'percentage', variation: 4.1, variationType: 'pp', icon: 'percent', trend: 'up' },
  { id: 'm4', label: 'Vendas', value: 18, previousValue: 15, format: 'number', variation: 15, variationType: 'percentage', icon: 'shopping-bag', trend: 'up' },
];

export const monthlyData: MonthlyData[] = Array.from({ length: 12 }).map((_, i) => ({
  month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
  leads: 65 + i * 5,
  sales: 8 + i,
  revenue: 280000 + i * 20000,
}));

export const revenueDistribution: RevenueDistribution[] = [
  { category: 'Motos', value: 280000, percentage: 55, color: '#3b82f6' },
  { category: 'Estética', value: 127500, percentage: 25, color: '#8b5cf6' },
  { category: 'Consignação', value: 61200, percentage: 12, color: '#06b6d4' },
  { category: 'Personalização', value: 40800, percentage: 8, color: '#ec4899' },
];

export const leadsByOrigin: LeadsByOrigin[] = [
  { origin: 'Instagram', count: 35, percentage: 35 },
  { origin: 'WhatsApp', count: 28, percentage: 28 },
  { origin: 'Google Ads', count: 20, percentage: 20 },
  { origin: 'Meta Ads', count: 12, percentage: 12 },
  { origin: 'Indicação', count: 5, percentage: 5 },
];
