import * as fc from 'fast-check';
import { describe, it, expect, vi } from 'vitest';
import { useAppStore } from '../index';
import { LeadOrigin } from '../../types/lead';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const origins: LeadOrigin[] = ['WhatsApp', 'Instagram', 'Google Ads', 'Meta Ads', 'Indicação', 'Site'];

describe('demoSync Property Tests', () => {
  it('lead injection synchronizes across stores (CRM, Metrics, Chat)', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          interest: fc.string({ minLength: 1 }),
          origin: fc.constantFrom(...origins),
        }),
        (config) => {
          const store = useAppStore;
          store.getState().resetAllData();

          const initialLeads = store.getState().leads.length;
          const initialMetric = store.getState().metrics.find((m: any) => m.id === 'm1')?.value || 0;
          const initialConversations = store.getState().conversations.length;
          const initialInjectedCount = store.getState().injectedLeadsCount;

          store.getState().setNextLeadConfig(config as any);
          store.getState().injectLeadGlobal();

          const leads = store.getState().leads;
          const newLead = leads[0];

          // 1. Lead exists in array
          expect(leads.length).toBe(initialLeads + 1);
          expect(newLead.name).toBe(config.name);
          expect(newLead.vehicleInterest).toBe(config.interest);

          // 2. Metric incremented
          const updatedMetric = store.getState().metrics.find((m: any) => m.id === 'm1')?.value || 0;
          expect(updatedMetric).toBe(initialMetric + 1);

          // 3. New conversation created
          expect(store.getState().conversations.length).toBe(initialConversations + 1);
          expect(store.getState().activeConversation?.leadId).toBe(newLead.id);

          // 4. injectedLeadsCount incremented
          expect(store.getState().injectedLeadsCount).toBe(initialInjectedCount + 1);
        }
      )
    );
  });
});
