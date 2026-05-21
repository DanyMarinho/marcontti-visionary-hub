import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { useAppStore } from '../index';
import { Lead, PipelineStage } from '../../types/lead';
import { mockLeads } from '../../data/mockLeads';

const stages: PipelineStage[] = ['novo_lead', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'venda_fechada'];

describe('leadMove Property Tests', () => {
  it('moving lead updates its stage and maintains total count', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockLeads.map(l => l.id)),
        fc.constantFrom(...stages),
        (leadId, newStage) => {
          const store = useAppStore;
          
          // Reset store to initial state
          store.getState().resetAllData();
          
          const initialCount = store.getState().leads.length;
          
          store.getState().moveLead(leadId, newStage);
          
          const leads = store.getState().leads;
          const updatedLead = leads.find(l => l.id === leadId);
          
          expect(updatedLead?.stage).toBe(newStage);
          expect(leads.length).toBe(initialCount);
        }
      )
    );
  });
});
