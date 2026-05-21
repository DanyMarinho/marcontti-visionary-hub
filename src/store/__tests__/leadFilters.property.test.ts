import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice } from '../leadSlice';
import { Lead, PipelineStage, LeadOrigin, LeadPriority } from '../../types/lead';

const stages: PipelineStage[] = ['novo_lead', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'venda_fechada'];
const origins: LeadOrigin[] = ['WhatsApp', 'Instagram', 'Google Ads', 'Meta Ads', 'Indicação', 'Site'];
const priorities: LeadPriority[] = ['baixa', 'media', 'alta'];

const leadArb = fc.record({
  id: fc.uuid(),
  name: fc.string(),
  stage: fc.constantFrom(...stages),
  origin: fc.constantFrom(...origins),
  priority: fc.constantFrom(...priorities),
  score: fc.integer({ min: 0, max: 100 }),
});

describe('leadSlice Property Tests', () => {
  it('filters return only matching leads', () => {
    fc.assert(
      fc.property(
        fc.array(leadArb, { minLength: 0, maxLength: 50 }),
        fc.constantFrom(...stages, 'all' as const),
        (leads, filterStage) => {
          const store = createStore<any>()(immer((...a) => ({
            ...createLeadSlice(...a),
            leads: leads as Lead[],
            filteredLeads: leads as Lead[],
          })));

          store.getState().setFilter('stage', filterStage);
          const filtered = store.getState().filteredLeads;

          if (filterStage === 'all') {
            expect(filtered.length).toBe(leads.length);
          } else {
            filtered.forEach((l: Lead) => {
              expect(l.stage).toBe(filterStage);
            });
            
            // Ensure no valid lead is missing
            const missing = (leads as Lead[]).filter(l => l.stage === filterStage && !filtered.includes(l));
            expect(missing.length).toBe(0);
          }
        }
      )
    );
  });
});