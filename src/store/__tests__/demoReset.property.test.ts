import * as fc from 'fast-check';
import { describe, it, expect, vi } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice } from '../leadSlice';
import { createMetricSlice } from '../metricSlice';
import { createChatSlice } from '../chatSlice';
import { createDemoSlice } from '../demoSlice';
import { mockLeads } from '../../data/mockLeads';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

describe('demoReset Property Tests', () => {
  it('reset restores initial state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (injections) => {
          const store = createStore<any>()(immer((...a) => ({
            ...createLeadSlice(...a),
            ...createMetricSlice(...a),
            ...createChatSlice(...a),
            ...createDemoSlice(...a),
          })));

          for (let i = 0; i < injections; i++) {
            store.getState().injectLeadGlobal();
          }

          expect(store.getState().leads.length).toBeGreaterThan(mockLeads.length);

          store.getState().resetAllData();

          expect(store.getState().injectedLeadsCount).toBe(0);
          expect(store.getState().leads.length).toBe(mockLeads.length);
        }
      )
    );
  });
});