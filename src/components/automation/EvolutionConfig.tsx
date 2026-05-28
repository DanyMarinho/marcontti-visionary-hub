import React, { useState } from 'react';
import { GlassCard } from '@/components/shared/GlassCard';
import { Zap, Shield, Key, Globe, Save, Loader2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

export const EvolutionConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    apiUrl: 'https://api.evolution-api.com',
    apiKey: '',
    instanceName: 'crm-automotivo',
  });

  const handleSave = () => {
    if (!config.apiKey) {
      toast.error('A chave da API é obrigatória');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Configurações da Evolution API salvas com sucesso!');
    }, 1500);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Configuração Evolution API</h3>
          <p className="text-slate-400 text-sm">Integre sua instância de WhatsApp via Evolution API</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4" /> URL da API
          </label>
          <input
            type="text"
            value={config.apiUrl}
            onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="https://sua-instancia.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Key className="w-4 h-4" /> Global API Key
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="Sua Global API Key"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Nome da Instância
          </label>
          <input
            type="text"
            value={config.instanceName}
            onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Configurações
          </button>
          <button
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all flex items-center gap-2"
            onClick={() => toast.info('Gerando QR Code...')}
          >
            <Link2 className="w-4 h-4" />
            Conectar Instância
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <p className="text-xs text-blue-400 leading-relaxed">
          <strong>Dica:</strong> Após configurar a Evolution API, certifique-se de configurar o Webhook para apontar para o nosso endpoint de recepção de mensagens para que a IA possa responder automaticamente.
        </p>
      </div>
    </GlassCard>
  );
};
