export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
}

export interface FlowNodeData {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    icon: string;
    status: 'active' | 'inactive';
    trigger?: string;
    conditions?: string[];
    action?: string;
    nextStep?: string;
  };
}

export interface FlowEdgeData {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label?: string;
}

export type FlowNodeType = 'trigger' | 'condition' | 'action' | 'delay' | 'notification' | 'integration';
