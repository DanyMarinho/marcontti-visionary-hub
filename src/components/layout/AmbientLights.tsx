import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const AmbientLights: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]"
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]"
        animate={{ 
          x: [0, -100, 0], 
          y: [0, -50, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      
      {!isMobile && (
        <motion.div 
          className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default AmbientLights;