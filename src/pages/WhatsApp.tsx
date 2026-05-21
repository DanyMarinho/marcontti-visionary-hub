import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { ChatInterface } from '@/components/whatsapp/ChatInterface';
import { QualificationPanel } from '@/components/whatsapp/QualificationPanel';
import { ConversationSidebar } from '@/components/whatsapp/ConversationSidebar';
import { QuickActions } from '@/components/whatsapp/QuickActions';
import { pageTransition } from '@/lib/animations';

const WhatsAppPage: React.FC = () => {
  const { 
    activeConversation, 
    activeScenario, 
    currentMessageIndex, 
    advanceMessage, 
    setTyping 
  } = useAppStore();

  useEffect(() => {
    if (!activeConversation) return;

    // Only auto-play if there are more messages AND it's a mock conversation scenario
    if (currentMessageIndex < activeConversation.messages.length - 1) {
      const nextMessage = activeConversation.messages[currentMessageIndex + 1];
      
      const timer = setTimeout(() => {
        if (nextMessage.sender === 'ia') {
          setTyping(true);
          
          setTimeout(() => {
            setTyping(false);
            advanceMessage();
          }, 1500);
        } else {
          advanceMessage();
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [activeConversation?.id, currentMessageIndex, activeScenario]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">WhatsApp IA Business</h1>
        <p className="text-secondary text-sm mt-1">Gestão centralizada e automação de atendimentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Sidebar */}
        <div className="lg:col-span-3 h-full overflow-hidden rounded-2xl border border-white/10">
          <ConversationSidebar />
        </div>

        {/* Main Chat */}
        <div className="lg:col-span-6 h-full">
          <ChatInterface />
        </div>
        
        {/* Detail Panel */}
        <div className="lg:col-span-3 space-y-6 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          <QualificationPanel />
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-secondary px-1">Ações do CRM</h4>
            <QuickActions />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WhatsAppPage;