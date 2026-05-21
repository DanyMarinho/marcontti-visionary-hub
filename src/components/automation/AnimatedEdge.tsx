import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

export const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 2, stroke: 'rgba(255,255,255,0.1)' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <circle r="3" fill="#3b82f6" className="shadow-[0_0_8px_#3b82f6]">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </>
  );
};
