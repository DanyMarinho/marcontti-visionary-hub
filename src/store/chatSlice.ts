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
  setActiveConversation: (conversationId: string) => void;
  startNewConversation: (lead: Lead) => void;
  sendMessage: (content: string, sender: 'ia' | 'lead') => void;
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
  currentMessageIndex: mockConversations[0]?.messages.length - 1 || 0,

  setActiveScenario: (scenario) =>
    set((state) => {
      state.activeScenario = scenario;
    }),

  setActiveConversation: (conversationId) =>
    set((state) => {
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        state.activeConversation = conv;
        state.currentMessageIndex = conv.messages.length - 1;
      }
    }),

  startNewConversation: (lead) =>
    set((state) => {
      const existingConv = state.conversations.find(c => c.leadId === lead.id);
      if (existingConv) {
        state.activeConversation = existingConv;
        state.currentMessageIndex = existingConv.messages.length - 1;
        return;
      }

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

  sendMessage: (content, sender) =>
    set((state) => {
      if (!state.activeConversation) return;

      const newMessage = {
        id: `m-${Date.now()}`,
        content,
        sender,
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };

      // Update in active conversation
      state.activeConversation.messages.push(newMessage as any);
      state.currentMessageIndex = state.activeConversation.messages.length - 1;

      // Also update in the conversations list
      const convIndex = state.conversations.findIndex(c => c.id === state.activeConversation?.id);
      if (convIndex !== -1) {
        state.conversations[convIndex].messages.push(newMessage as any);
      }
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
      state.currentMessageIndex = mockConversations[0]?.messages.length - 1 || 0;
    }),
});