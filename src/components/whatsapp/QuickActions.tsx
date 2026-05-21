import React, { useState } from 'react';
import { GlassCard } from '@/components/shared/GlassCard';
import { Calendar, FileImage, UserPlus, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const actions = [
  { id: 'visit', label: 'Agendar Visita', icon: Calendar, color: 'text-blue-400' },
  { id: 'catalog', label: 'Enviar Catálogo', icon: FileImage, color: 'text-purple-400' },
  { id: 'transfer', label: 'Transferir Humano', icon: UserPlus, color: 'text-emerald-400' },
  { id: 'followup', label: 'Marcar Follow-up', icon: Clock, color: 'text-amber-400' },
];

export const QuickActions: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleAction = (id: string, label: string) => {
    setActiveId(id);
    toast.success(`${label} executado com sucesso!`);
    
    setTimeout(() => {
      setActiveId(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleAction(action.id, action.label)}
          className="group relative"
        >
          <GlassCard 
            className="p-4 flex flex-col items-center justify-center gap-2 h-24 text-center transition-all duration-300"
            hover
            glow={activeId === action.id ? 'blue' : undefined}
          >
            <AnimatePresence mode="wait">
              {activeId === action.id ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-6 h-6 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={cn("group-hover:scale-110 transition-transform duration-300", action.color)}
                >
                  <action.icon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary group-hover:text-white transition-colors">
              {action.label}
            </span>
          </GlassCard>
        </button>
      ))}
    </div>
  );
};
