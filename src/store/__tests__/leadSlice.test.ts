import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice, LeadSlice } from '../leadSlice';
import { mockLeads } from '../../data/mockLeads';
import { Lead } from '../../types/lead';

// We need a way to test the slice in isolation or with a dummy store
const createTestStore = () => {
  return createStore<any>()(
    immer((...a) => ({
      ...createLeadSlice(...a),
    }))
  );
};

describe('leadSlice', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  it('adds a lead to the array', () => {
    const newLead: Lead = {
      id: 'test-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123',
      vehicleInterest: 'Test Car',
      origin: 'WhatsApp',
      stage: 'novo_lead',
      priority: 'media',
      score: 50,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
      interactions: [],
    };

    store.getState().addLead(newLead);
    expect(store.getState().leads[0].id).toBe('test-1');
    expect(store.getState().leads.length).toBe(mockLeads.length + 1);
  });

  it('updates stage correctly when moving lead', () => {
    const leadId = mockLeads[0].id;
    store.getState().moveLead(leadId, 'visita_agendada');
    
    const lead = store.getState().leads.find((l: Lead) => l.id === leadId);
    expect(lead?.stage).toBe('visita_agendada');
  });

  it('filters leads correctly', () => {
    // Set filter to only show 'venda_fechada'
    store.getState().setFilter('stage', 'venda_fechada');
    
    const filtered = store.getState().filteredLeads;
    const allExpected = mockLeads.filter(l => l.stage === 'venda_fechada');
    
    expect(filtered.length).toBe(allExpected.length);
    filtered.forEach((l: Lead) => {
      expect(l.stage).toBe('venda_fechada');
    });
  });

  it('defines selectedLead', () => {
    const lead = mockLeads[0];
    store.getState().selectLead(lead);
    expect(store.getState().selectedLead?.id).toBe(lead.id);
    
    store.getState().selectLead(null);
    expect(store.getState().selectedLead).toBeNull();
  });
});