import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { X, Phone, Mail, MapPin, Clock, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeadDetailDrawer = () => {
  const selectedLead = useAppStore((s) => s.selectedLead);
  const selectLead = useAppStore((s) => s.selectLead);
  const startNewConversation = useAppStore((s) => s.startNewConversation);
  const navigate = useNavigate();

  if (!selectedLead) return null;

  const handleStartChat = () => {
    startNewConversation(selectedLead);
    selectLead(null);
    navigate('/whatsapp');
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => selectLead(null)}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0f] border-l border-white/10 z-50 p-6 overflow-y-auto"
      >
        <button onClick={() => selectLead(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{selectedLead.name}</h2>
          <button 
            onClick={handleStartChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-all"
          >
            <MessageSquare size={14} />
            Conversar
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Telefone</p>
            <p className="text-white font-medium">{selectedLead.phone}</p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Veículo de Interesse</p>
            <p className="text-white font-medium">{selectedLead.vehicleInterest}</p>
          </div>
          
          <div className="h-px bg-white/10" />

          <h3 className="text-lg font-bold text-white">Histórico</h3>
          <div className="space-y-4">
            {selectedLead.interactions.map((int) => (
              <div key={int.id} className="flex gap-3 text-sm">
                <div className="mt-1 text-blue-400">
                  {int.channel === 'whatsapp' ? <Phone size={16} /> : <FileText size={16} />}
                </div>
                <div>
                  <p className="text-white">{int.message}</p>
                  <p className="text-slate-500 text-xs">{new Date(int.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
