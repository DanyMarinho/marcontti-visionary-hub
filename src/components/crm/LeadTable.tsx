import React from 'react';
import { Instagram, MessageSquare, Search, Share2, Users, Globe } from 'lucide-react';
import { useAppStore } from '@/store';
import { LeadOrigin, LeadPriority } from '@/types/lead';
import { GlassCard } from '@/components/shared/GlassCard';

const originIcons: Record<LeadOrigin, any> = {
  'Instagram': Instagram,
  'WhatsApp': MessageSquare,
  'Google Ads': Search,
  'Meta Ads': Share2,
  'Indicação': Users,
  'Site': Globe
};

const priorityColors: Record<LeadPriority, string> = {
  'alta': 'bg-red-500/20 text-red-400 border-red-500/50',
  'media': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'baixa': 'bg-green-500/20 text-green-400 border-green-500/50'
};

export const LeadTable = () => {
  const filteredLeads = useAppStore((s) => s.filteredLeads);
  const selectLead = useAppStore((s) => s.selectLead);
  const filters = useAppStore((s) => s.filters);
  const setFilter = useAppStore((s) => s.setFilter);

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex flex-wrap gap-4">
        <select 
          className="bg-white/5 border border-white/10 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.origin}
          onChange={(e) => setFilter('origin', e.target.value)}
        >
          <option value="all">Todas Origens</option>
          <option value="Instagram">Instagram</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="Indicação">Indicação</option>
          <option value="Site">Site</option>
        </select>

        <select 
          className="bg-white/5 border border-white/10 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
        >
          <option value="all">Todas Prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <select 
          className="bg-white/5 border border-white/10 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.stage}
          onChange={(e) => setFilter('stage', e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="novo_lead">Novo Lead</option>
          <option value="contato_realizado">Contato Realizado</option>
          <option value="visita_agendada">Visita Agendada</option>
          <option value="proposta_enviada">Proposta Enviada</option>
          <option value="venda_fechada">Venda Fechada</option>
        </select>
      </GlassCard>


      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Veículo</th>
              <th className="px-6 py-4">Origem</th>
              <th className="px-6 py-4">Prioridade</th>
              <th className="px-6 py-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead) => {
              const Icon = originIcons[lead.origin];
              return (
                <tr 
                  key={lead.id} 
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => selectLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{lead.name}</div>
                    <div className="text-slate-500 text-xs">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-white">{lead.vehicleInterest}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Icon size={16} className="text-blue-400" />
                      {lead.origin}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${priorityColors[lead.priority]}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
