import { StateCreator } from 'zustand';
import { DemoState } from '../types/demo';
import { generateRandomLead } from '../data/leadGenerator';
import { Lead } from '../types/lead';
import { toast } from 'sonner';
import { AppStore } from './index';
import { mockLeads } from '../data/mockLeads';
import { mockMetrics } from '../data/mockMetrics';
import { mockConversations } from '../data/mockConversations';

export interface DemoSlice extends DemoState {
  togglePanel: () => void;
  toggleAutoInject: () => void;
  setAutoInjectInterval: (seconds: number) => void;
  setNextLeadConfig: (config: DemoState['nextLeadConfig']) => void;
  resetAllData: () => void;
  injectLead: () => void;
  injectLeadGlobal: () => void;
}

export const createDemoSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  DemoSlice
> = (set, get) => ({
  isActive: true,
  panelVisible: false,
  autoInjectEnabled: false,
  autoInjectInterval: 10,
  nextLeadConfig: {},
  injectedLeadsCount: 0,

  togglePanel: () =>
    set((state) => {
      state.panelVisible = !state.panelVisible;
    }),

  toggleAutoInject: () =>
    set((state) => {
      state.autoInjectEnabled = !state.autoInjectEnabled;
    }),

  setAutoInjectInterval: (seconds) =>
    set((state) => {
      state.autoInjectInterval = seconds;
    }),

  setNextLeadConfig: (config) =>
    set((state) => {
      state.nextLeadConfig = config;
    }),

  resetAllData: () =>
    set((state) => {
      // Reset this slice
      state.injectedLeadsCount = 0;
      state.autoInjectEnabled = false;
      
      // Reset other slices via their state
      // We can't directly call set on other slices here easily without combined store
      // But since they are all merged in AppStore, we can just mutate the relevant keys
      state.leads = mockLeads;
      state.filteredLeads = mockLeads;
      state.selectedLead = null;
      state.filters = { stage: 'all', origin: 'all', priority: 'all' };
      
      state.metrics = mockMetrics;
      state.conversations = mockConversations;
      state.activeConversation = mockConversations[0] || null;
      state.currentMessageIndex = mockConversations[0]?.messages.length - 1 || 0;
    }),

  injectLead: () => {
    // This is a local version, we prefer injectLeadGlobal
    get().injectLeadGlobal();
  },

  injectLeadGlobal: () => {
    const config = get().nextLeadConfig;
    const rawLead = generateRandomLead(config);
    
    // Convert rawLead to full Lead type
    const lead: Lead = {
      ...rawLead,
      phone: '(11) 9' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${rawLead.name.toLowerCase().replace(' ', '.')}@example.com`,
      stage: (config.stage as any) || 'novo_lead',
      priority: 'media',
      updatedAt: new Date(),
      createdAt: new Date(),
      tasks: [],
      interactions: [],
      // Ensure specific types
      origin: (rawLead.origin as any), 
    };

    // 1. Add lead
    get().addLead(lead);
    
    // 2. Increment metric
    get().incrementMetric('m1', 1); // m1 is Total Leads
    
    // 3. Start conversation
    get().startNewConversation(lead);
    
    // 4. Toast notification
    toast(`🔔 Novo lead: ${lead.name}`, {
      description: `Interessado em ${lead.vehicleInterest}`,
      action: {
        label: 'Ver Lead',
        onClick: () => get().selectLead(lead),
      },
    });
    
    // 5. Increment count
    set((state) => {
      state.injectedLeadsCount += 1;
    });
  },
});
