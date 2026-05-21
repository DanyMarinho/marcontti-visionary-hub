import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createLeadSlice, LeadSlice } from './leadSlice';
import { createMetricSlice, MetricSlice } from './metricSlice';
import { createChatSlice, ChatSlice } from './chatSlice';
import { createDemoSlice, DemoSlice } from './demoSlice';
import { createAutomationSlice, AutomationSlice } from './automationSlice';
import { createVehicleSlice, VehicleSlice } from './vehicleSlice';

export type AppStore = LeadSlice & MetricSlice & ChatSlice & DemoSlice & AutomationSlice & VehicleSlice;

export const useAppStore = create<AppStore>()(
  immer((...a) => ({
    ...createLeadSlice(...a),
    ...createMetricSlice(...a),
    ...createChatSlice(...a),
    ...createDemoSlice(...a),
    ...createAutomationSlice(...a),
    ...createVehicleSlice(...a),
  }))
);

export default useAppStore;
