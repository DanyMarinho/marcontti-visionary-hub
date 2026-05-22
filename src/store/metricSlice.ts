import { StateCreator } from 'zustand';
import { Metric, MonthlyData, RevenueDistribution, LeadsByOrigin } from '../types/metric';
import { mockMetrics, monthlyData, revenueDistribution, leadsByOrigin } from '../data/mockMetrics';
import { Lead } from '../types/lead';
import { Vehicle } from '../types/vehicle';
import { AppStore } from './index';

export interface MetricSlice {
  metrics: Metric[];
  monthlyData: MonthlyData[];
  revenueDistribution: RevenueDistribution[];
  leadsByOrigin: LeadsByOrigin[];
  selectedPeriod: '7d' | '30d' | '90d' | '12m';
  incrementMetric: (id: string, amount: number) => void;
  setPeriod: (period: '7d' | '30d' | '90d' | '12m') => void;
  recalculateFromLeads: (leads: Lead[]) => void;
  recalculateFromVehicles: (vehicles: Vehicle[]) => void;
}

export const createMetricSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  MetricSlice
> = (set) => ({
  metrics: mockMetrics,
  monthlyData: monthlyData,
  revenueDistribution: revenueDistribution,
  leadsByOrigin: leadsByOrigin,
  selectedPeriod: '30d',

  incrementMetric: (id, amount) =>
    set((state) => {
      const metric = state.metrics.find((m) => m.id === id);
      if (metric) {
        metric.previousValue = metric.value;
        metric.value += amount;
        // Simple variation update
        if (metric.previousValue > 0) {
          metric.variation = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
        }
        metric.trend = metric.value >= metric.previousValue ? 'up' : 'down';
      }
    }),

  setPeriod: (period) =>
    set((state) => {
      state.selectedPeriod = period;
    }),

  recalculateFromLeads: (leads) =>
    set((state) => {
      // Basic recalculation for the demo
      const totalLeads = leads.length;
      const qualifiedLeads = leads.filter(l => l.score > 70).length;
      const sales = leads.filter(l => l.stage === 'venda_fechada').length;
      const conversion = totalLeads > 0 ? (sales / totalLeads) * 100 : 0;

      const totalLeadsMetric = state.metrics.find(m => m.id === 'm1');
      if (totalLeadsMetric) {
        totalLeadsMetric.previousValue = totalLeadsMetric.value;
        totalLeadsMetric.value = totalLeads;
      }

      const qualifiedMetric = state.metrics.find(m => m.id === 'm2');
      if (qualifiedMetric) {
        qualifiedMetric.previousValue = qualifiedMetric.value;
        qualifiedMetric.value = qualifiedLeads;
      }

      const conversionMetric = state.metrics.find(m => m.id === 'm3');
      if (conversionMetric) {
        conversionMetric.previousValue = conversionMetric.value;
        conversionMetric.value = conversion;
      }

      const salesMetric = state.metrics.find(m => m.id === 'm4');
      if (salesMetric) {
        salesMetric.previousValue = salesMetric.value;
        salesMetric.value = sales;
      }

      // Update leads by origin distribution
      const origins: Record<string, number> = {};
      leads.forEach(l => {
        origins[l.origin] = (origins[l.origin] || 0) + 1;
      });

      state.leadsByOrigin = Object.entries(origins).map(([origin, count]) => ({
        origin,
        count,
        percentage: (count / totalLeads) * 100
      })).sort((a, b) => b.count - a.count);
    }),

  recalculateFromVehicles: (vehicles) =>
    set((state) => {
      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter(v => v.status === 'available').length;
      const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
      const totalInventoryValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
      
      const availabilityRate = totalVehicles > 0 ? (availableVehicles / totalVehicles) * 100 : 0;

      // Ensure stock metrics exist or update them
      let stockMetric = state.metrics.find(m => m.id === 'm_stock');
      if (!stockMetric) {
        stockMetric = {
          id: 'm_stock',
          label: 'Veículos em Estoque',
          value: totalVehicles,
          previousValue: totalVehicles,
          variation: 0,
          trend: 'up',
          icon: 'Bike',
          format: 'number'
        };
        state.metrics.push(stockMetric);
      } else {
        stockMetric.previousValue = stockMetric.value;
        stockMetric.value = totalVehicles;
      }

      let availabilityMetric = state.metrics.find(m => m.id === 'm_availability');
      if (!availabilityMetric) {
        availabilityMetric = {
          id: 'm_availability',
          label: 'Disponibilidade',
          value: availabilityRate,
          previousValue: availabilityRate,
          variation: 0,
          trend: 'up',
          icon: 'Target',
          format: 'percentage'
        };
        state.metrics.push(availabilityMetric);
      } else {
        availabilityMetric.previousValue = availabilityMetric.value;
        availabilityMetric.value = availabilityRate;
      }

      let inventoryValueMetric = state.metrics.find(m => m.id === 'm_inventory_value');
      if (!inventoryValueMetric) {
        inventoryValueMetric = {
          id: 'm_inventory_value',
          label: 'Valor Total Estoque',
          value: totalInventoryValue,
          previousValue: totalInventoryValue,
          variation: 0,
          trend: 'up',
          icon: 'ShoppingCart',
          format: 'currency'
        };
        state.metrics.push(inventoryValueMetric);
      } else {
        inventoryValueMetric.previousValue = inventoryValueMetric.value;
        inventoryValueMetric.value = totalInventoryValue;
      }
    }),
});
