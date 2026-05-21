import React from 'react';
import { motion } from 'framer-motion';

export const AmbientLights: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"
      animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <motion.div 
      className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]"
      animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
  </div>
);
export default AmbientLights;