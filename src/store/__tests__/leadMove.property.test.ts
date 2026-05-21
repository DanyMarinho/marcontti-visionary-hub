import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice } from '../leadSlice';
import { Lead, PipelineStage } from '../../types/lead';

const stages: PipelineStage[] = ['novo_lead', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'venda_fechada'];

describe('leadMove Property Tests', () => {
  it('moving lead updates its stage', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          stage: fc.constantFrom(...stages),
        }),
        fc.constantFrom(...stages),
        (leadData, newStage) => {
          const lead = { ...leadData, updatedAt: new Date() } as Lead;
          const store = createStore<any>()(immer((...a) => ({
            ...createLeadSlice(...a),
            leads: [lead],
          })));

          store.getState().moveLead(lead.id, newStage);
          
          const updatedLead = store.getState().leads[0];
          expect(updatedLead.stage).toBe(newStage);
        }
      )
    );
  });
});