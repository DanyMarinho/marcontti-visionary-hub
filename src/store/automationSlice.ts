import { StateCreator } from 'zustand';
import { AutomationFlow } from '../types/flow';
import { mockFlows } from '../data/mockFlows';

export interface AutomationSlice {
  flows: AutomationFlow[];
  activeFlowId: string;
  selectedNodeId: string | null;
  
  setActiveFlow: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  toggleFlowStatus: (id: string) => void;
}

export const createAutomationSlice: StateCreator<
  AutomationSlice,
  [['zustand/immer', never]],
  [],
  AutomationSlice
> = (set) => ({
  flows: mockFlows,
  activeFlowId: mockFlows[0].id,
  selectedNodeId: null,

  setActiveFlow: (id) => set((state) => {
    state.activeFlowId = id;
  }),

  setSelectedNode: (id) => set((state) => {
    state.selectedNodeId = id;
  }),

  toggleFlowStatus: (id) => set((state) => {
    const flow = state.flows.find(f => f.id === id);
    if (flow) {
      flow.active = !flow.active;
    }
  }),
});
