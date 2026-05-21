import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createDemoSlice } from '../demoSlice';
import { createLeadSlice } from '../leadSlice';
import { createMetricSlice } from '../metricSlice';
import { createChatSlice } from '../chatSlice';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const createTestStore = () => {
  return createStore<any>()(
    immer((...a) => ({
      ...createLeadSlice(...a),
      ...createMetricSlice(...a),
      ...createChatSlice(...a),
      ...createDemoSlice(...a),
    }))
  );
};

describe('demoSlice', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  it('alternates panelVisible', () => {
    expect(store.getState().panelVisible).toBe(false);
    store.getState().togglePanel();
    expect(store.getState().panelVisible).toBe(true);
    store.getState().togglePanel();
    expect(store.getState().panelVisible).toBe(false);
  });

  it('injects lead global and synchronizes other slices', () => {
    const initialLeadsCount = store.getState().leads.length;
    const initialMetricValue = store.getState().metrics.find((m: any) => m.id === 'm1').value;
    const initialConversationsCount = store.getState().conversations.length;

    store.getState().injectLeadGlobal();

    expect(store.getState().leads.length).toBe(initialLeadsCount + 1);
    expect(store.getState().metrics.find((m: any) => m.id === 'm1').value).toBe(initialMetricValue + 1);
    expect(store.getState().conversations.length).toBe(initialConversationsCount + 1);
    expect(store.getState().injectedLeadsCount).toBe(1);
  });

  it('restores initial state with resetAllData', () => {
    // Inject some data first
    store.getState().injectLeadGlobal();
    store.getState().injectLeadGlobal();
    
    expect(store.getState().injectedLeadsCount).toBe(2);
    
    store.getState().resetAllData();
    
    expect(store.getState().injectedLeadsCount).toBe(0);
    expect(store.getState().leads.length).toBeGreaterThan(0); // Should be mockLeads
  });
});