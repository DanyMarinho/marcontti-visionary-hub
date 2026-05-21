import React from 'react';
import { ChatMessage } from '@/types/conversation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Sparkles, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const isIA = message.sender === 'ia';
  const isLead = message.sender === 'lead';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-4",
        isLead ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex flex-col max-w-[80%] md:max-w-[70%]",
        isLead ? "items-start" : "items-end"
      )}>
        <div className="flex items-center gap-2 mb-1">
          {!isLead && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">IA</span>
            </div>
          )}
          <span className="text-[11px] text-secondary">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>

        <div
          className={cn(
            "px-4 py-3 text-sm relative",
            isLead 
              ? "bg-white/5 border border-white/10 text-white rounded-2xl rounded-tl-none"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-none shadow-lg shadow-blue-900/20" 
          )}
        >
          {message.content}
          
          {!isLead && (
            <div className="flex justify-end mt-1">
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-blue-300" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-white/40" />
              ) : (
                <Check className="w-3 h-3 text-white/40" />
              )}
            </div>
          )}
        </div>
        
        {isLast && !isLead && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-[10px] text-blue-400/70 italic"
          >
            Resposta gerada automaticamente
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
