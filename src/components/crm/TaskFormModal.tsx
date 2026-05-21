import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, CalendarPlus } from 'lucide-react';
import { Task, TaskType } from '@/types/lead';
import { useAppStore } from '@/store';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
}

const TASK_TYPES: { value: TaskType; label: string; emoji: string }[] = [
  { value: 'ligacao', label: 'Ligação', emoji: '📞' },
  { value: 'visita', label: 'Visita', emoji: '🏍️' },
  { value: 'proposta', label: 'Proposta', emoji: '📄' },
  { value: 'follow_up', label: 'Follow-up', emoji: '🔔' },
  { value: 'email', label: 'E-mail', emoji: '✉️' },
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, leadId }) => {
  const { leads, updateLead } = useAppStore();
  const [form, setForm] = useState({
    description: '',
    type: 'ligacao' as TaskType,
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    selectedLeadId: leadId || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.selectedLeadId) return;
    setSaving(true);

    const lead = leads.find(l => l.id === form.selectedLeadId);
    if (!lead) { setSaving(false); return; }

    const newTask: Task = {
      id: crypto.randomUUID(),
      leadId: form.selectedLeadId,
      description: form.description,
      type: form.type,
      dueDate: new Date(form.dueDate),
      completed: false,
      createdAt: new Date(),
    };

    updateLead(form.selectedLeadId, {
      tasks: [...(lead.tasks || []), newTask],
    });

    setSaving(false);
    onClose();
    setForm({ description: '', type: 'ligacao', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), selectedLeadId: leadId || '' });
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
            className="relative w-full max-w-md glass-card p-6 z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-blue-400" />
                Nova Tarefa
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!leadId && (
                <div>
                  <label className={labelClass}>Lead *</label>
                  <select required className={inputClass} value={form.selectedLeadId} onChange={e => set('selectedLeadId', e.target.value)}>
                    <option value="" className="bg-[#0a0a0f]">Selecionar lead...</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id} className="bg-[#0a0a0f]">{l.name} — {l.vehicleInterest}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Tipo de tarefa</label>
                <div className="grid grid-cols-5 gap-2">
                  {TASK_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => set('type', t.value)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        form.type === t.value ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                      }`}>
                      <span className="text-base">{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Descrição *</label>
                <input required className={inputClass} placeholder="Ligar para confirmar visita..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Data e hora *</label>
                <input required type="datetime-local" className={inputClass} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  Cancelar
                </button>
                <button type="submit" disabled={saving || !form.selectedLeadId}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Criar Tarefa
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
