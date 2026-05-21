import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Clock, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { Switch } from '@/components/ui/switch'; // Assuming shadcn UI switch is available
import { cn } from '@/lib/utils';

interface Trigger {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
}

const triggers: Trigger[] = [
  { id: '1', name: 'Novo Lead', description: 'Formulário site/redes sociais', icon: UserPlus, active: true },
  { id: '2', name: 'Inatividade 7 dias', description: 'Lead sem contato há uma semana', icon: Clock, active: true },
  { id: '3', name: 'Resposta WhatsApp', description: 'Mensagem recebida do cliente', icon: MessageCircle, active: true },
  { id: '4', name: 'Visita Agendada', description: 'Evento criado no calendário', icon: Calendar, active: true },
  { id: '5', name: 'Venda Concluída', description: 'Status alterado no CRM', icon: CheckCircle, active: false },
];

export const TriggerCards: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Triggers Disponíveis</h3>
      <div className="space-y-3">
        {triggers.map((trigger) => (
          <GlassCard 
            key={trigger.id} 
            className={cn(
              "p-4 transition-all duration-500",
              trigger.active ? "border-blue-500/30" : "border-white/5 opacity-70"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  trigger.active ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-secondary"
                )}>
                  <trigger.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{trigger.name}</h4>
                  <p className="text-xs text-secondary">{trigger.description}</p>
                </div>
              </div>
              <Switch checked={trigger.active} onCheckedChange={() => {}} />
            </div>
            
            {trigger.active && (
              <motion.div 
                layoutId={`pulse-${trigger.id}`}
                className="absolute inset-0 rounded-xl bg-blue-500/5"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
