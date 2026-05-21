import * as fc from 'fast-check';
import { describe, it, expect, vi } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice } from '../leadSlice';
import { createMetricSlice } from '../metricSlice';
import { createChatSlice } from '../chatSlice';
import { createDemoSlice } from '../demoSlice';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

describe('demoSync Property Tests', () => {
  it('lead injection synchronizes across stores', () => {
    fc.assert(
      fc.property(
        fc.record({
          stage: fc.constantFrom('novo_lead', 'contato_realizado'),
        }),
        (config) => {
          const store = createStore<any>()(immer((...a) => ({
            ...createLeadSlice(...a),
            ...createMetricSlice(...a),
            ...createChatSlice(...a),
            ...createDemoSlice(...a),
          })));

          const initialLeads = store.getState().leads.length;
          const initialMetric = store.getState().metrics.find((m: any) => m.id === 'm1').value;

          store.getState().setNextLeadConfig(config);
          store.getState().injectLeadGlobal();

          expect(store.getState().leads.length).toBe(initialLeads + 1);
          expect(store.getState().metrics.find((m: any) => m.id === 'm1').value).toBe(initialMetric + 1);
          expect(store.getState().conversations.length).toBeGreaterThan(0);
        }
      )
    );
  });
});