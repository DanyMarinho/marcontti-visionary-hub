import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/GlassCard';
import { getIconComponent } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { FlowNodeType } from '@/types/flow';

const typeStyles: Record<FlowNodeType, string> = {
  trigger: 'border-blue-500/50 bg-blue-500/5',
  condition: 'border-yellow-500/50 bg-yellow-500/5',
  action: 'border-purple-500/50 bg-purple-500/5',
  delay: 'border-gray-500/50 bg-gray-500/5',
  notification: 'border-cyan-500/50 bg-cyan-500/5',
  integration: 'border-green-500/50 bg-green-500/5',
};

const CustomFlowNode = ({ data, type }: NodeProps) => {
  const Icon = getIconComponent(data.icon);
  const style = typeStyles[type as FlowNodeType] || typeStyles.action;

  return (
    <div className="group">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-blue-400 !border-none"
      />
      
      <GlassCard 
        className={cn(
          "w-[180px] p-3 border transition-all duration-300 group-hover:scale-105",
          style
        )}
        hover={false}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 text-white">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-bold text-white truncate uppercase tracking-wider">
              {data.label}
            </h4>
            <p className="text-[10px] text-secondary truncate">
              {data.description}
            </p>
          </div>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            data.status === 'active' ? "bg-green-400 animate-pulse" : "bg-gray-500"
          )} />
        </div>
      </GlassCard>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-blue-400 !border-none"
      />
    </div>
  );
};

export default memo(CustomFlowNode);
