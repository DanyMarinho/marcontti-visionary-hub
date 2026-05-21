import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AutomationFlow } from '@/types/flow';
import CustomFlowNode from './CustomFlowNode';
import { AnimatedEdge } from './AnimatedEdge';

interface FlowDiagramProps {
  flow: AutomationFlow;
  onNodeClick: (node: any) => void;
}

const nodeTypes = {
  trigger: CustomFlowNode,
  condition: CustomFlowNode,
  action: CustomFlowNode,
  delay: CustomFlowNode,
  notification: CustomFlowNode,
  integration: CustomFlowNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ flow, onNodeClick }) => {
  const initialNodes: Node[] = useMemo(() => 
    flow.nodes.map(node => ({
      ...node,
      type: node.type,
      data: node.data
    })), [flow]);

  const initialEdges: Edge[] = useMemo(() => 
    flow.edges.map(edge => ({
      ...edge,
      type: 'animated'
    })), [flow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when flow prop changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [flow, setNodes, setEdges, initialNodes, initialEdges]);

  const onNodeClickInternal = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick(node);
  }, [onNodeClick]);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative touch-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClickInternal}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        // Customizing the theme via className
        className="bg-transparent"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="rgba(255,255,255,0.05)" 
        />
        <Controls 
          className="!bg-black/60 !border-white/10 !fill-white" 
          showInteractive={false} 
        />
      </ReactFlow>
    </div>
  );
};
