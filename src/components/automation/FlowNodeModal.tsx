import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Settings, AlertCircle, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { FlowNodeData } from '@/types/flow';
import { getIconComponent } from '@/lib/utils'; // Assuming I can create this or use a mapper

interface FlowNodeModalProps {
  node: FlowNodeData | null;
  onClose: () => void;
}

export const FlowNodeModal: React.FC<FlowNodeModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const Icon = getIconComponent(node.data.icon);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg"
        >
          <GlassCard className="overflow-hidden border-white/10" hover={false}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{node.data.label}</h3>
                    <p className="text-secondary text-sm">{node.data.description}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              <div className="space-y-6">
                {node.data.trigger && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">Trigger</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                      {node.data.trigger}
                    </div>
                  </div>
                )}

                {node.data.conditions && node.data.conditions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">Condições</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.data.conditions.map((cond, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {node.data.action && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">Ação Executada</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                      {node.data.action}
                    </div>
                  </div>
                )}

                {node.data.nextStep && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wider">Próximo Passo</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                      {node.data.nextStep}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button 
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
