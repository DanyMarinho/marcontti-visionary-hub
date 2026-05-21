import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { useAppStore } from '../../../store';
import { Lead, PipelineStage } from '../../../types/lead';

const stages: PipelineStage[] = ['novo_lead', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'venda_fechada'];

describe('Kanban KanbanBoard Property Tests', () => {
  it('leads appear in the correct column by stage', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            stage: fc.constantFrom(...stages),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (leadData) => {
          const store = useAppStore;
          const leads = leadData as unknown as Lead[];
          
          store.setState((state) => {
            state.leads = leads;
          });

          let totalCount = 0;
          stages.forEach((stage) => {
            const stageLeads = store.getState().getLeadsByStage(stage);
            
            // 1. All leads in this stage column must actually have this stage
            stageLeads.forEach(l => {
              expect(l.stage).toBe(stage);
            });
            
            // 2. Count should match initial data for this stage
            const expectedCount = leads.filter(l => l.stage === stage).length;
            expect(stageLeads.length).toBe(expectedCount);
            
            totalCount += stageLeads.length;
          });

          // 3. Sum of all columns equals total leads
          expect(totalCount).toBe(leads.length);
          
          store.getState().resetAllData();
        }
      )
    );
  });
});
