import React from 'react';
import { MessageCircle, Instagram, Facebook, FileSpreadsheet, Code, ShieldCheck, Target, Search } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'ready' | 'disconnected';
  icon: React.ElementType;
  description: string;
}

const integrations: Integration[] = [
  { id: '1', name: 'WhatsApp', status: 'connected', icon: MessageCircle, description: 'API Oficial Business' },
  { id: '2', name: 'Instagram', status: 'connected', icon: Instagram, description: 'Direct Messages & Ads' },
  { id: '3', name: 'Facebook', status: 'ready', icon: Facebook, description: 'Lead Ads & Messenger' },
  { id: '4', name: 'Google Sheets', status: 'disconnected', icon: FileSpreadsheet, description: 'Sincronização de planilhas' },
  { id: '5', name: 'Webhook', status: 'connected', icon: Code, description: 'Recebimento de dados externos' },
  { id: '6', name: 'Meta Ads', status: 'ready', icon: Target, description: 'Gestor de anúncios' },
  { id: '7', name: 'Google Ads', status: 'ready', icon: Search, description: 'Google Search & Display' },
];

const statusConfig = {
  connected: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'Conectado' },
  ready: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'Pronto para conectar' },
  disconnected: { color: 'text-secondary', bg: 'bg-white/5', border: 'border-white/10', text: 'Desconectado' },
};

export const IntegrationGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Integrações</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map((item) => {
          const config = statusConfig[item.status];
          return (
            <GlassCard 
              key={item.id} 
              className={cn(
                "p-4 transition-all duration-300 hover:border-white/20",
                item.status === 'connected' && "shadow-[0_0_20px_rgba(34,197,94,0.05)]"
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white/5 text-white">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase", config.bg, config.border, config.color)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.status === 'connected' ? "bg-green-400 animate-pulse" : "bg-current")} />
                    {config.text}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-secondary mt-1 line-clamp-1">{item.description}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
