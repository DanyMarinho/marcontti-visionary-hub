import * as fc from 'fast-check';
import { describe, it, expect, vi } from 'vitest';
import { useAppStore } from '../index';
import { mockLeads } from '../../data/mockLeads';
import { mockMetrics } from '../../data/mockMetrics';
import { mockConversations } from '../../data/mockConversations';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

describe('demoReset Property Tests', () => {
  it('resetAllData restores everything to initial state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (injections) => {
          const store = useAppStore;
          store.getState().resetAllData();

          // Inject random leads
          for (let i = 0; i < injections; i++) {
            store.getState().injectLeadGlobal();
          }

          expect(store.getState().leads.length).toBe(mockLeads.length + injections);

          // Reset
          store.getState().resetAllData();

          // 1. Leads reset
          expect(store.getState().leads.length).toBe(mockLeads.length);
          expect(store.getState().injectedLeadsCount).toBe(0);

          // 2. Metrics reset
          store.getState().metrics.forEach((m, idx) => {
            expect(m.value).toBe(mockMetrics[idx].value);
          });

          // 3. Conversations reset
          expect(store.getState().conversations.length).toBe(mockConversations.length);
          expect(store.getState().activeConversation?.id).toBe(mockConversations[0].id);
        }
      )
    );
  });
});
