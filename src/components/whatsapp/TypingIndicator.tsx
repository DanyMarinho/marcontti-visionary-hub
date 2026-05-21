import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start w-full mb-4"
    >
      <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-[40px]">
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
