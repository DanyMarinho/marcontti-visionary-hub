import { LeadOrigin, PipelineStage } from './lead';

export interface DemoState {
  isActive: boolean;
  panelVisible: boolean;
  autoInjectEnabled: boolean;
  autoInjectInterval: number;
  nextLeadConfig: {
    name?: string;
    interest?: string;
    origin?: LeadOrigin;
    stage?: PipelineStage;
  };
  injectedLeadsCount: number;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'ready' | 'disconnected';
  description: string;
}

export interface Trigger {
  id: string;
  name: string;
  icon: string;
  description: string;
  active: boolean;
}
