import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, UserPlus } from 'lucide-react';
import { Lead, LeadOrigin, PipelineStage, LeadPriority } from '@/types/lead';
import { useAppStore } from '@/store';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

const ORIGINS: LeadOrigin[] = ['Instagram', 'WhatsApp', 'Google Ads', 'Meta Ads', 'Indicação', 'Site'];
const STAGES: { value: PipelineStage; label: string }[] = [
  { value: 'novo_lead', label: 'Novo Lead' },
  { value: 'contato_realizado', label: 'Contato Realizado' },
  { value: 'visita_agendada', label: 'Visita Agendada' },
  { value: 'proposta_enviada', label: 'Proposta Enviada' },
  { value: 'venda_fechada', label: 'Venda Fechada' },
];
const PRIORITIES: { value: LeadPriority; label: string; color: string }[] = [
  { value: 'alta', label: 'Alta', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { value: 'media', label: 'Média', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { value: 'baixa', label: 'Baixa', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
];

const emptyLead = {
  name: '', phone: '', email: '', vehicleInterest: '', serviceInterest: '',
  origin: 'Instagram' as LeadOrigin, stage: 'novo_lead' as PipelineStage,
  priority: 'media' as LeadPriority, score: 50, notes: '',
};

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead }) => {
  const { addLead, updateLead, startNewConversation } = useAppStore();
  const [form, setForm] = useState(emptyLead);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(lead);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name, phone: lead.phone, email: lead.email || '',
        vehicleInterest: lead.vehicleInterest, serviceInterest: lead.serviceInterest || '',
        origin: lead.origin, stage: lead.stage, priority: lead.priority,
        score: lead.score, notes: lead.notes || '',
      });
    } else setForm(emptyLead);
  }, [lead, isOpen]);

  const set = (key: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (isEdit && lead) {
      updateLead(lead.id, { ...form, updatedAt: new Date() });
    } else {
      const newLead = {
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
        interactions: [],
      };
      addLead(newLead);
      // Auto-start AI conversation for new leads
      startNewConversation(newLead);
    }
    setSaving(false);
    onClose();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all";
  const labelClass = "block text-xs text-slate-400 mb-1.5 font-medium";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-card p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                {isEdit ? 'Editar Lead' : 'Novo Lead'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Nome completo *</label>
                <input required className={inputClass} placeholder="João Silva" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefone *</label>
                  <input required className={inputClass} placeholder="(47) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input type="email" className={inputClass} placeholder="email@exemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Interesse em moto</label>
                  <input className={inputClass} placeholder="Honda PCX 160..." value={form.vehicleInterest} onChange={e => set('vehicleInterest', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Interesse em serviço</label>
                  <input className={inputClass} placeholder="Vitrificação..." value={form.serviceInterest} onChange={e => set('serviceInterest', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Origem *</label>
                  <select required className={inputClass} value={form.origin} onChange={e => set('origin', e.target.value as LeadOrigin)}>
                    {ORIGINS.map(o => <option key={o} value={o} className="bg-[#0a0a0f]">{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estágio</label>
                  <select className={inputClass} value={form.stage} onChange={e => set('stage', e.target.value as PipelineStage)}>
                    {STAGES.map(s => <option key={s.value} value={s.value} className="bg-[#0a0a0f]">{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Prioridade</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button key={p.value} type="button" onClick={() => set('priority', p.value)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.priority === p.value ? p.color : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Score de qualificação: {form.score}</label>
                <input type="range" min="0" max="100" className="w-full accent-blue-500" value={form.score} onChange={e => set('score', Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Notas</label>
                <textarea rows={3} className={inputClass + ' resize-none'} placeholder="Observações sobre o lead..." value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Salvando...' : isEdit ? 'Salvar' : 'Cadastrar Lead'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadFormModal;
