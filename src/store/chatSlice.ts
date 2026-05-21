import { StateCreator } from 'zustand';
import { Conversation, ConversationScenario } from '../types/conversation';
import { mockConversations } from '../data/mockConversations';
import { Lead } from '../types/lead';
import { AppStore } from './index';

export interface ChatSlice {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeScenario: ConversationScenario;
  isTyping: boolean;
  currentMessageIndex: number;
  setActiveScenario: (scenario: ConversationScenario) => void;
  startNewConversation: (lead: Lead) => void;
  advanceMessage: () => void;
  setTyping: (isTyping: boolean) => void;
  resetConversations: () => void;
}

export const createChatSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  ChatSlice
> = (set, get) => ({
  conversations: mockConversations,
  activeConversation: mockConversations[0] || null,
  activeScenario: 'qualificacao_lead',
  isTyping: false,
  currentMessageIndex: 0,

  setActiveScenario: (scenario) =>
    set((state) => {
      state.activeScenario = scenario;
      // In a real app, we might want to filter or change the active conversation based on scenario
    }),

  startNewConversation: (lead) =>
    set((state) => {
      const newConversation: Conversation = {
        id: `c-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        vehicleInterest: lead.vehicleInterest,
        qualification: lead.score > 70 ? 'quente' : lead.score > 40 ? 'morno' : 'frio',
        scenario: state.activeScenario,
        messages: [
          {
            id: `m-${Date.now()}`,
            content: `Olá, tenho interesse no veículo ${lead.vehicleInterest}. Pode me ajudar?`,
            sender: 'lead',
            timestamp: new Date(),
            type: 'text',
            status: 'read'
          }
        ]
      };
      
      state.conversations.unshift(newConversation);
      state.activeConversation = newConversation;
      state.currentMessageIndex = 0;
    }),

  advanceMessage: () =>
    set((state) => {
      state.currentMessageIndex += 1;
    }),

  setTyping: (isTyping) =>
    set((state) => {
      state.isTyping = isTyping;
    }),

  resetConversations: () =>
    set((state) => {
      state.conversations = mockConversations;
      state.activeConversation = mockConversations[0] || null;
      state.currentMessageIndex = 0;
    }),
});
