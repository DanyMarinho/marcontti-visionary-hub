import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, ShieldCheck, Send, Paperclip, Mic, Smile } from 'lucide-react';
import { toast } from 'sonner';

export const ChatInterface: React.FC = () => {
  const { activeConversation, currentMessageIndex, isTyping, sendMessage } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation, currentMessageIndex, isTyping, activeConversation?.messages.length]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeConversation) return;
    
    sendMessage(inputValue, 'ia');
    setInputValue('');
    toast.success('Mensagem enviada');
    
    // Simulate auto-focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeConversation) return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-[#0a0a0f] rounded-2xl border border-white/10 items-center justify-center p-8 text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
        <Send className="w-10 h-10 text-white/10" />
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">Selecione uma conversa</h3>
        <p className="text-secondary text-sm">Inicie um novo atendimento ou continue um existente</p>
      </div>
    </div>
  );

  const visibleMessages = activeConversation.messages.slice(0, currentMessageIndex + 1);

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
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
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-secondary font-medium uppercase tracking-wider">IA Ativa</span>
          </div>
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

      {/* Input Section */}
      <div className="p-4 bg-white/5 border-t border-white/10 z-10">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <div className="flex items-center gap-1">
            <button className="p-2 text-secondary hover:text-white transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-secondary hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm py-1 placeholder:text-secondary"
          />
          
          <div className="flex items-center gap-1">
            {inputValue.trim() ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            ) : (
              <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary hover:text-white transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};