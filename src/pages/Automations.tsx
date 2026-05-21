import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { pageTransition } from '@/lib/animations';
import { FlowTabs } from '@/components/automation/FlowTabs';
import { FlowDiagram } from '@/components/automation/FlowDiagram';
import { TriggerCards } from '@/components/automation/TriggerCards';
import { IntegrationGrid } from '@/components/automation/IntegrationGrid';
import { FlowNodeModal } from '@/components/automation/FlowNodeModal';
import { FlowNodeData } from '@/types/flow';

const Automations: React.FC = () => {
  const { flows, activeFlowId } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<FlowNodeData | null>(null);

  const activeFlow = flows.find(f => f.id === activeFlowId) || flows[0];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fluxos de Automação</h1>
          <p className="text-secondary mt-1">Gerencie a jornada do lead de forma inteligente</p>
        </div>
      </div>

      <FlowTabs />

      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <FlowDiagram 
            flow={activeFlow} 
            onNodeClick={(node) => setSelectedNode(node as unknown as FlowNodeData)} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TriggerCards />
          <IntegrationGrid />
        </div>
      </div>

      <FlowNodeModal 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </motion.div>
  );
};

export default Automations;
