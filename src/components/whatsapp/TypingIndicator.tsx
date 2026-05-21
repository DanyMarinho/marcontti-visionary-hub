import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end w-full mb-4"
    >
      <div className="bg-gradient-to-br from-blue-600/50 to-indigo-700/50 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-2xl rounded-tr-none flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
