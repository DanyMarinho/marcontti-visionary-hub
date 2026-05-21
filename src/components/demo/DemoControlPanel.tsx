import React from 'react';
import { useAppStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, PlusCircle, RotateCcw, X } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { GradientButton } from '../shared/GradientButton';

export const DemoControlPanel: React.FC = () => {
  const { panelVisible, togglePanel, injectLeadGlobal, resetAllData, injectedLeadsCount } = useAppStore();

  return (
    <>
      {/* Mini Toggle Button */}
      <motion.button
        className="fixed bottom-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-50 backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePanel}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {panelVisible && (
          <div className="fixed inset-0 z-[100] flex items-end justify-start p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <GlassCard className="p-6 border-white/10" glow="purple">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-lg">Modo Demo</h3>
                    <p className="text-white/40 text-xs">Atalhos: [D] Painel, [L] Novo Lead</p>
                  </div>
                  <button onClick={togglePanel} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/60 text-sm">Leads Injetados</span>
                    <span className="text-purple-400 font-mono font-bold">{injectedLeadsCount}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <GradientButton 
                      onClick={() => injectLeadGlobal()}
                      className="w-full text-xs py-2"
                      variant="purple"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-2" />
                      Injetar Lead
                    </GradientButton>
                    <button
                      onClick={resetAllData}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs flex items-center justify-center transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-2" />
                      Resetar
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoControlPanel;