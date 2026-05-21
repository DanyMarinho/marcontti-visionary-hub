import React from 'react';
import { useAppStore } from '@/store';
import { GlassCard } from '@/components/shared/GlassCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bike, CheckCircle2, Circle } from 'lucide-react';

export const QualificationPanel: React.FC = () => {
  const { activeConversation } = useAppStore();

  if (!activeConversation) return null;

  // Derive score from qualification for visual demo
  const getScore = () => {
    switch (activeConversation.qualification) {
      case 'quente': return 85;
      case 'morno': return 50;
      case 'frio': return 20;
      default: return 0;
    }
  };

  const score = getScore();

  const getBadgeConfig = () => {
    if (score >= 67) return { label: 'Quente', color: 'bg-rose-500 text-white', glow: 'shadow-rose-500/50' };
    if (score >= 34) return { label: 'Morno', color: 'bg-amber-500 text-white', glow: 'shadow-amber-500/50' };
    return { label: 'Frio', color: 'bg-blue-500 text-white', glow: 'shadow-blue-500/50' };
  };

  const badge = getBadgeConfig();

  const timeline = [
    { label: 'Lead Criado', status: 'completed' },
    { label: 'Primeiro Contato', status: 'completed' },
    { label: 'Qualificação IA', status: 'active' },
    { label: 'Visita Agendada', status: 'pending' },
    { label: 'Venda Concluída', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 text-center" hover>
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white/5">
            {activeConversation.leadName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-lg z-10",
            badge.color,
            badge.glow
          )}>
            {badge.label}
          </div>
        </div>
        
        <h3 className="text-white font-bold text-lg">{activeConversation.leadName}</h3>
        <div className="flex items-center justify-center gap-1.5 mt-1 text-secondary text-sm">
          <Bike className="w-4 h-4" />
          <span>{activeConversation.vehicleInterest}</span>
        </div>

        <div className="mt-6 text-left">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-secondary font-bold uppercase tracking-wider">Score de Qualificação</span>
            <span className="text-lg font-mono font-bold text-white">{score}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full", badge.color)}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Status da Jornada</h4>
        <div className="space-y-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {idx < timeline.length - 1 && (
                <div className={cn(
                  "absolute left-[9px] top-5 w-[2px] h-[calc(100%+16px)]",
                  item.status === 'completed' ? "bg-blue-500" : "bg-white/10"
                )} />
              )}
              <div className="z-10 bg-[#0a0a0f]">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                ) : item.status === 'active' ? (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Circle className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-white/20" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium pt-0.5",
                item.status === 'completed' ? "text-white" : 
                item.status === 'active' ? "text-blue-400" : "text-secondary"
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
