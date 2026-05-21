import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { LeadTable } from '@/components/crm/LeadTable';
import { TaskPanel } from '@/components/crm/TaskPanel';
import { CalendarView } from '@/components/crm/CalendarView';
import { LeadDetailDrawer } from '@/components/crm/LeadDetailDrawer';
import { AdImportModal } from '@/components/shared/AdImportModal';
import { pageTransition } from '@/lib/animations';

const CRM = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [importOpen, setImportOpen] = useState(false);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 md:p-6 space-y-8 max-w-[100vw] overflow-x-hidden"
    >
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">CRM Automotivo</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie seus leads e funil de vendas em tempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Import Button */}
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
          >
            <Upload className="w-4 h-4" />
            Importar Anúncios
          </button>
          <div className="bg-white/5 rounded-lg p-1 flex">
            <button 
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${view === 'kanban' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setView('kanban')}
            >
              Kanban
            </button>
            <button 
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${view === 'table' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setView('table')}
            >
              Tabela
            </button>
          </div>
        </div>
      </div>

      <AdImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

      {view === 'kanban' ? (
        <KanbanBoard />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LeadTable />
          </div>
          <div className="space-y-8">
            <TaskPanel />
            <CalendarView />
          </div>
        </div>
      )}
      
      <LeadDetailDrawer />
    </motion.div>
  );
};

export default CRM;
