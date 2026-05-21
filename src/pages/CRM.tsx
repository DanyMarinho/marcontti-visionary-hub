import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { LeadDetailDrawer } from '@/components/crm/LeadDetailDrawer';
import { pageTransition } from '@/lib/animations';

const CRM = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">CRM Automotivo</h1>
        <div className="bg-white/5 rounded-lg p-1 flex">
          <button 
            className={`px-4 py-2 rounded ${view === 'kanban' ? 'bg-blue-600' : 'text-slate-400'}`}
            onClick={() => setView('kanban')}
          >
            Kanban
          </button>
          <button 
            className={`px-4 py-2 rounded ${view === 'table' ? 'bg-blue-600' : 'text-slate-400'}`}
            onClick={() => setView('table')}
          >
            Tabela
          </button>
        </div>
      </div>

      <KanbanBoard />
      <LeadDetailDrawer />
    </motion.div>
  );
};

export default CRM;
