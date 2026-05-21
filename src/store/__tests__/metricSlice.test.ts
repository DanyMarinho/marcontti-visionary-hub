import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMetricSlice } from '../metricSlice';
import { mockMetrics } from '../../data/mockMetrics';

const createTestStore = () => {
  return createStore<any>()(
    immer((...a) => ({
      ...createMetricSlice(...a),
    }))
  );
};

describe('metricSlice', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  it('increments metric value', () => {
    const metricId = 'm1'; // Total Leads
    const initialValue = mockMetrics.find(m => m.id === metricId)?.value || 0;
    
    store.getState().incrementMetric(metricId, 5);
    
    const metric = store.getState().metrics.find((m: any) => m.id === metricId);
    expect(metric.value).toBe(initialValue + 5);
    expect(metric.previousValue).toBe(initialValue);
  });

  it('updates selected period', () => {
    store.getState().setPeriod('90d');
    expect(store.getState().selectedPeriod).toBe('90d');
  });
});