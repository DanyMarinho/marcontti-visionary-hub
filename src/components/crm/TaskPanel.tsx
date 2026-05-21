import React from 'react';
import { Phone, MapPin, FileText, Clock, Mail } from 'lucide-react';
import { useAppStore } from '@/store';
import { GlassCard } from '@/components/shared/GlassCard';
import { TaskType } from '@/types/lead';

const taskIcons: Record<TaskType, any> = {
  ligacao: Phone,
  visita: MapPin,
  proposta: FileText,
  follow_up: Clock,
  email: Mail,
};

export const TaskPanel = () => {
  const leads = useAppStore((s) => s.leads);
  // Get all tasks from all leads, flat and sorted
  const tasks = leads.flatMap(l => l.tasks.map(t => ({ ...t, leadName: l.name })))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Tarefas Pendentes</h3>
      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <GlassCard key={task.id} className="p-4 hover:bg-white/10 transition-colors cursor-pointer" glow="blue">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{task.leadName}</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
