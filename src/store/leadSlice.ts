import { StateCreator } from 'zustand';
import { Lead, PipelineStage, LeadOrigin, LeadPriority } from '../types/lead';
import { mockLeads } from '../data/mockLeads';
import { AppStore } from './index';

export interface LeadSlice {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLead: Lead | null;
  filters: {
    stage: PipelineStage | 'all';
    origin: LeadOrigin | 'all';
    priority: LeadPriority | 'all';
  };
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLead: (id: string, newStage: PipelineStage) => void;
  selectLead: (lead: Lead | null) => void;
  setFilter: (key: 'stage' | 'origin' | 'priority', value: any) => void;
  getLeadsByStage: (stage: PipelineStage) => Lead[];
  getLeadCount: () => number;
}

export const createLeadSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  LeadSlice
> = (set, get) => ({
  leads: mockLeads,
  filteredLeads: mockLeads,
  selectedLead: null,
  filters: {
    stage: 'all',
    origin: 'all',
    priority: 'all',
  },

  addLead: (lead) =>
    set((state) => {
      state.leads.unshift(lead);
      // Recalculate filtered leads
      state.filteredLeads = applyFilters(state.leads, state.filters);
    }),

  updateLead: (id, updates) =>
    set((state) => {
      const index = state.leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        state.leads[index] = { 
          ...state.leads[index], 
          ...updates, 
          updatedAt: new Date() 
        };
        state.filteredLeads = applyFilters(state.leads, state.filters);
        
        if (state.selectedLead?.id === id) {
          state.selectedLead = state.leads[index];
        }
      }
    }),

  moveLead: (id, newStage) =>
    set((state) => {
      const index = state.leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        state.leads[index].stage = newStage;
        state.leads[index].updatedAt = new Date();
        state.filteredLeads = applyFilters(state.leads, state.filters);
        
        if (state.selectedLead?.id === id) {
          state.selectedLead = state.leads[index];
        }
      }
    }),

  selectLead: (lead) =>
    set((state) => {
      state.selectedLead = lead;
    }),

  setFilter: (key, value) =>
    set((state) => {
      state.filters[key] = value;
      state.filteredLeads = applyFilters(state.leads, state.filters);
    }),

  getLeadsByStage: (stage) => {
    return get().leads.filter((l) => l.stage === stage);
  },

  getLeadCount: () => {
    return get().leads.length;
  },
});

function applyFilters(leads: Lead[], filters: LeadSlice['filters']) {
  return leads.filter((lead) => {
    const stageMatch = filters.stage === 'all' || lead.stage === filters.stage;
    const originMatch = filters.origin === 'all' || lead.origin === filters.origin;
    const priorityMatch = filters.priority === 'all' || lead.priority === filters.priority;
    return stageMatch && originMatch && priorityMatch;
  });
}
