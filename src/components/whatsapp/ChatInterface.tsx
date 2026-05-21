import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, ShieldCheck } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { activeConversation, currentMessageIndex, isTyping } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation, currentMessageIndex, isTyping]);

  if (!activeConversation) return null;

  const visibleMessages = activeConversation.messages.slice(0, currentMessageIndex + 1);

  return (
    <div className="flex flex-col h-[600px] bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#3b82f6_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#8b5cf6_0%,transparent_50%)]" />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {activeConversation.leadName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight">{activeConversation.leadName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] text-secondary font-medium uppercase">IA Protegida</span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth scrollbar-thin scrollbar-thumb-white/10"
      >
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg, idx) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLast={idx === visibleMessages.length - 1} 
            />
          ))}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      {/* Input Placeholder */}
      <div className="p-4 bg-white/5 border-t border-white/10 z-10">
        <div className="flex gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-secondary text-sm flex items-center">
            Aguardando resposta da IA...
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white cursor-not-allowed">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
