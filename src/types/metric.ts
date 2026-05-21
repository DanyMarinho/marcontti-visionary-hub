export interface Metric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'number' | 'currency' | 'percentage';
  variation: number;
  variationType: 'percentage' | 'pp';
  icon: string;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyData {
  month: string;
  leads: number;
  sales: number;
  revenue: number;
}

export interface RevenueDistribution {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export interface LeadsByOrigin {
  origin: string;
  count: number;
  percentage: number;
}
