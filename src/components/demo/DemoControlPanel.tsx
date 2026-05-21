import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientButton } from '@/components/shared/GradientButton';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Settings, RefreshCw, Zap, Users } from 'lucide-react';
import { PipelineStage, LeadOrigin } from '@/types/lead';

export const DemoControlPanel: React.FC = () => {
  const { 
    panelVisible, 
    togglePanel, 
    autoInjectEnabled, 
    toggleAutoInject, 
    autoInjectInterval, 
    setAutoInjectInterval,
    nextLeadConfig,
    setNextLeadConfig,
    injectLeadGlobal,
    resetAllData,
    injectedLeadsCount
  } = useAppStore();

  const handleConfigChange = (key: string, value: any) => {
    setNextLeadConfig({ ...nextLeadConfig, [key]: value });
  };

  return (
    <AnimatePresence>
      {panelVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={togglePanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[320px] z-50 p-4"
          >
            <GlassCard className="h-full flex flex-col p-6 overflow-y-auto border-white/10" hover={false}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Painel Demo</h2>
                </div>
                <button 
                  onClick={togglePanel}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Configuração do Lead
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-secondary ml-1">Nome do próximo lead</label>
                    <Input 
                      placeholder="Ex: João Silva" 
                      className="bg-white/5 border-white/10 text-white"
                      value={nextLeadConfig.name || ''}
                      onChange={(e) => handleConfigChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-secondary ml-1">Veículo de interesse</label>
                    <Input 
                      placeholder="Ex: MT-07" 
                      className="bg-white/5 border-white/10 text-white"
                      value={nextLeadConfig.interest || ''}
                      onChange={(e) => handleConfigChange('interest', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-secondary ml-1">Estágio do pipeline</label>
                    <Select 
                      value={nextLeadConfig.stage || 'novo_lead'} 
                      onValueChange={(v) => handleConfigChange('stage', v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f111a] border-white/10 text-white">
                        <SelectItem value="novo_lead">Novo Lead</SelectItem>
                        <SelectItem value="contato_realizado">Contato Realizado</SelectItem>
                        <SelectItem value="visita_agendada">Visita Agendada</SelectItem>
                        <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
                        <SelectItem value="venda_concluida">Venda Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-secondary ml-1">Origem</label>
                    <Select 
                      value={nextLeadConfig.origin || 'Instagram Ads'} 
                      onValueChange={(v) => handleConfigChange('origin', v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f111a] border-white/10 text-white">
                        <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                        <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                        <SelectItem value="WhatsApp Direct">WhatsApp Direct</SelectItem>
                        <SelectItem value="Site">Site</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Injeção Automática</span>
                      <span className="text-[10px] text-secondary">Gerar leads em intervalo fixo</span>
                    </div>
                    <Switch 
                      checked={autoInjectEnabled} 
                      onCheckedChange={toggleAutoInject} 
                    />
                  </div>

                  {autoInjectEnabled && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-xs text-secondary ml-1">Intervalo (segundos)</label>
                      <Input 
                        type="number"
                        value={autoInjectInterval}
                        onChange={(e) => setAutoInjectInterval(Number(e.target.value))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                <GradientButton 
                  onClick={injectLeadGlobal}
                  className="w-full"
                >
                  Injetar Lead Agora
                </GradientButton>
                
                <button 
                  onClick={resetAllData}
                  className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Resetar Todos os Dados
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-widest pt-2">
                  <Users className="w-3 h-3" /> Leads Injetados: {injectedLeadsCount}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
