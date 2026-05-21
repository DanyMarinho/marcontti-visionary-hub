import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { PipelineStage } from '@/types/lead';

const stages: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'novo_lead', label: 'Novo Lead', color: 'bg-blue-500' },
  { id: 'contato_realizado', label: 'Contato Realizado', color: 'bg-cyan-500' },
  { id: 'visita_agendada', label: 'Visita Agendada', color: 'bg-yellow-500' },
  { id: 'proposta_enviada', label: 'Proposta Enviada', color: 'bg-purple-500' },
  { id: 'venda_fechada', label: 'Venda Fechada', color: 'bg-green-500' },
];

export const KanbanBoard = () => {
  const getLeadsByStage = useAppStore((s) => s.getLeadsByStage);
  const moveLead = useAppStore((s) => s.moveLead);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px] snap-x snap-mandatory scrollbar-none">
      {stages.map((stage) => (
        <div key={stage.id} className="w-[85vw] md:w-80 shrink-0 flex flex-col snap-center">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${stage.color}`} />
              {stage.label}
            </h3>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">
              {getLeadsByStage(stage.id).length}
            </span>
          </div>
          <div 
            className="flex-1 bg-white/5 rounded-xl p-2 border border-white/5"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const leadId = e.dataTransfer.getData('leadId');
              moveLead(leadId, stage.id);
            }}
          >
            {getLeadsByStage(stage.id).map((lead) => (
              <motion.div
                key={lead.id}
                draggable
                onDragStart={(e: any) => e.dataTransfer.setData('leadId', lead.id)}
                className="mb-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-grab border-l-4"
                style={{ borderLeftColor: stage.color.replace('bg-', '') === 'blue-500' ? '#3b82f6' : stage.color.replace('bg-', '').replace('-500', '500') }}
                onClick={() => useAppStore.getState().selectLead(lead)}
              >
                <div className="font-bold text-white">{lead.name}</div>
                <div className="text-sm text-slate-400">{lead.vehicleInterest}</div>
                <div className="text-sm font-bold text-blue-400 mt-2">
                  R$ {lead.score.toLocaleString('pt-BR')} {/* Dummy score display */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
