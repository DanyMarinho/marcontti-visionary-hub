import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { useAppStore } from '../index';
import { Lead, PipelineStage, LeadOrigin, LeadPriority } from '../../types/lead';

const stages: PipelineStage[] = ['novo_lead', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'venda_fechada'];
const origins: LeadOrigin[] = ['WhatsApp', 'Instagram', 'Google Ads', 'Meta Ads', 'Indicação', 'Site'];
const priorities: LeadPriority[] = ['baixa', 'media', 'alta'];

const leadArb = fc.record({
  id: fc.uuid(),
  name: fc.string(),
  phone: fc.string(),
  vehicleInterest: fc.string(),
  stage: fc.constantFrom(...stages),
  origin: fc.constantFrom(...origins),
  priority: fc.constantFrom(...priorities),
  score: fc.integer({ min: 0, max: 100 }),
  createdAt: fc.date(),
  updatedAt: fc.date(),
  tasks: fc.constant([] as any[]),
  interactions: fc.constant([] as any[]),
});

describe('leadFilters Property Tests', () => {
  it('filters return only matching leads and don\'t omit valid ones', () => {
    fc.assert(
      fc.property(
        fc.array(leadArb, { minLength: 0, maxLength: 50 }),
        fc.constantFrom(...stages, 'all' as const),
        fc.constantFrom(...origins, 'all' as const),
        fc.constantFrom(...priorities, 'all' as const),
        (leads, filterStage, filterOrigin, filterPriority) => {
          const store = useAppStore;
          
          // Setup state
          store.setState((state) => {
            state.leads = leads as unknown as Lead[];
            state.filteredLeads = leads as unknown as Lead[];
            state.filters = { stage: 'all', origin: 'all', priority: 'all' };
          });

          // Apply filters
          store.getState().setFilter('stage', filterStage);
          store.getState().setFilter('origin', filterOrigin);
          store.getState().setFilter('priority', filterPriority);

          const filtered = store.getState().filteredLeads;

          // 1. All returned leads must satisfy active filters
          filtered.forEach((l: Lead) => {
            if (filterStage !== 'all') expect(l.stage).toBe(filterStage);
            if (filterOrigin !== 'all') expect(l.origin).toBe(filterOrigin);
            if (filterPriority !== 'all') expect(l.priority).toBe(filterPriority);
          });

          // 2. No lead that satisfies the filters should be omitted
          const expectedCount = (leads as unknown as Lead[]).filter(l => {
            const stageMatch = filterStage === 'all' || l.stage === filterStage;
            const originMatch = filterOrigin === 'all' || l.origin === filterOrigin;
            const priorityMatch = filterPriority === 'all' || l.priority === filterPriority;
            return stageMatch && originMatch && priorityMatch;
          }).length;

          expect(filtered.length).toBe(expectedCount);
          
          // Reset store for next iteration
          store.getState().resetAllData();
        }
      )
    );
  });
});

