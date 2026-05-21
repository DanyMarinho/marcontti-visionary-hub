import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { ChatInterface } from '@/components/whatsapp/ChatInterface';
import { QualificationPanel } from '@/components/whatsapp/QualificationPanel';
import { ConversationTabs } from '@/components/whatsapp/ConversationTabs';
import { QuickActions } from '@/components/whatsapp/QuickActions';
import { pageTransition } from '@/lib/animations';

const WhatsAppPage: React.FC = () => {
  const { 
    activeConversation, 
    activeScenario, 
    currentMessageIndex, 
    advanceMessage, 
    setTyping, 
    resetConversations 
  } = useAppStore();

  useEffect(() => {
    // Reset conversation when the page loads
    resetConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    // Only auto-play if there are more messages
    if (currentMessageIndex < activeConversation.messages.length - 1) {
      const nextMessage = activeConversation.messages[currentMessageIndex + 1];
      
      const timer = setTimeout(() => {
        // If next message is from IA, show typing indicator first
        if (nextMessage.sender === 'ia') {
          setTyping(true);
          
          setTimeout(() => {
            setTyping(false);
            advanceMessage();
          }, 1500); // Typing duration
        } else {
          // If next is from lead, just wait and show
          advanceMessage();
        }
      }, 2500); // Gap between messages

      return () => clearTimeout(timer);
    }
  }, [activeConversation, currentMessageIndex, activeScenario]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">WhatsApp IA Automotivo</h1>
          <p className="text-secondary text-sm">Simulação de atendimento inteligente em tempo real</p>
        </div>
      </div>

      <ConversationTabs />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7">
          <ChatInterface />
        </div>
        
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <QualificationPanel />
          <QuickActions />
        </div>

        {/* Mobile alternative layout for panels */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QualificationPanel />
          <QuickActions />
        </div>
      </div>
    </motion.div>
  );
};

export default WhatsAppPage;
